import Event from '../models/Event.js';
import EventRsvp from '../models/EventRsvp.js';
import Approval from '../models/Approval.js';
import { sendResponse } from '../utils/sendResponse.js';
import { createNotification } from '../utils/notificationHelper.js';
import db from '../utils/db.js';

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue_id } = req.body;
    const organizer_id = req.user.id;
    const image_url = req.file?.filename || null;

    if (!title || !description || !date || !time || !venue_id) {
      return sendResponse(res, 400, 'All fields are required');
    }

    // Validate venue_id
    const [venues] = await db.execute(`SELECT id FROM rooms WHERE id = ?`, [venue_id]);
    if (venues.length === 0) {
      return sendResponse(res, 404, 'Invalid venue ID');
    }

    // Validate date format: YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return sendResponse(res, 400, 'Invalid date format. Use YYYY-MM-DD');
    }

    const conflict = await Event.checkConflict(date, time, venue_id);
    if (conflict) {
      return sendResponse(res, 409, 'Venue already booked at this date and time');
    }
    const eventId = await Event.create({ title, description, date, time, organizer_id, venue_id, image_url });
    await Approval.create('Event', eventId);

    sendResponse(res, 201, 'Event created and pending approval', { eventId });
  } catch (err) {
    console.error('createEvent:', err);
    sendResponse(res, 500, 'Server error while creating event');
  }
};

// Edit event
export const editEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Manually extract fields from FormData
    const updates = {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.date && { date: req.body.date }),
      ...(req.body.time && { time: req.body.time }),
      ...(req.body.venue_id && { venue_id: req.body.venue_id }),
      ...(req.file?.filename && { image_url: req.file.filename }),
    };

    const existing = await Event.findById(id);
    if (!existing) return sendResponse(res, 404, 'Event not found');
    if (existing.organizer_id !== req.user.id)
      return sendResponse(res, 403, 'Unauthorized');

    const dateToCheck = updates.date || existing.date;
    const timeToCheck = updates.time || existing.time;
    const venueToCheck = updates.venue_id || existing.venue_id;
    const conflict = await Event.checkConflict(dateToCheck, timeToCheck, venueToCheck, id);
    if (conflict) {
      return sendResponse(res, 409, 'Venue already booked at this date and time');
    }

    
    console.log("Update payload:", updates);

    await Event.update(id, updates);
    sendResponse(res, 200, 'Event updated successfully');

    const rsvps = await EventRsvp.getByEvent(id);
    const rsvpUserIds = rsvps.map((r) => r.user_id);

    for (const userId of rsvpUserIds) {
      if (userId !== req.user.id) {
        await createNotification(
          userId,
          `The event "${existing.title}" you RSVPed to has been updated.`,
          'info'
        );
      }
    }
  } catch (err) {
    console.error('editEvent:', err);
    sendResponse(res, 500, 'Server error while editing event');
  }
};


// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Event.findById(id);
    if (!existing) return sendResponse(res, 404, 'Event not found');
    if (existing.organizer_id !== req.user.id) return sendResponse(res, 403, 'Unauthorized');

    // Fetch all RSVP'd users
    const rsvps = await EventRsvp.getByEvent(id);
    const rsvpUserIds = rsvps.map(r => r.user_id);

    await Event.delete(id);

    // Notify all RSVP'd users
    for (const userId of rsvpUserIds) {
      await createNotification(
        userId,
        `The event "${existing.title}" you RSVPed to has been canceled.`,
        'error'
      );
    }
    sendResponse(res, 200, 'Event deleted successfully');
  } catch (err) {
    console.error('deleteEvent:', err);
    sendResponse(res, 500, 'Server error while deleting event');
  }
};

// Get all events (with optional filters)
export const getAllEvents = async (req, res) => {
  try {
    const { status, search, date, upcoming, category, sort } = req.query;
    const events = await Event.findAll({ status, search, date, upcoming, category, sort });
    sendResponse(res, 200, 'Events fetched successfully', events);
  } catch (err) {
    console.error('getAllEvents:', err);
    sendResponse(res, 500, 'Failed to fetch events');
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return sendResponse(res, 404, 'Event not found');
    sendResponse(res, 200, 'Event fetched successfully', event);
  } catch (err) {
    console.error('getEventById:', err);
    sendResponse(res, 500, 'Failed to fetch event');
  }
};

// RSVP to an event
export const rsvpEvent = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;
    
    // Check event status first
    const event = await Event.findById(event_id);
    if (!event || event.status !== 'Approved') {
      return sendResponse(res, 403, 'You cannot RSVP to unapproved events');
    }

    // Add RSVP
    const success = await EventRsvp.add(user_id, event_id);
    if (!success) return sendResponse(res, 409, 'Already RSVPed');

    // Notify organizer
    if (event?.organizer_id && event.organizer_id !== user_id) {
      await createNotification(
        event.organizer_id,
        `A user has RSVP'd to your event "${event.title}".`,
        'info'
      );
    }

    // Notify student
    await createNotification(
      user_id,
      `You successfully RSVPed to "${event.title}".`,
      'success'
    );

    sendResponse(res, 201, 'RSVP successful');
  } catch (err) {
    console.error('rsvpEvent error:', err.message);
    sendResponse(res, 500, 'RSVP failed');
  }
};

// Cancel RSVP
export const cancelRsvp = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    const removed = await EventRsvp.remove(user_id, event_id);
    if (!removed) return sendResponse(res, 404, 'You have not RSVPed to this event');

    const event = await Event.findById(event_id);
    if (event) {
      await createNotification(
        user_id,
        `You canceled your RSVP for "${event.title}".`,
        'warning'
      );
    }
    if (event?.organizer_id && event.organizer_id !== user_id) {
      await createNotification(
        event.organizer_id,
        `A user canceled their RSVP for "${event.title}".`,
        'warning'
      );
    }    
    
    sendResponse(res, 200, 'RSVP cancelled successfully');
  } catch (err) {
    console.error('cancelRsvp:', err);
    sendResponse(res, 500, 'Failed to cancel RSVP');
  }
};

// Get RSVPs list for an event
export const getRsvps = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const rsvps = await EventRsvp.getByEvent(event_id);
    sendResponse(res, 200, 'RSVP list fetched successfully', rsvps);
  } catch (err) {
    console.error('getRsvps:', err);
    sendResponse(res, 500, 'Failed to fetch RSVPs');
  }
};

// Get Event Statistics
export const getStats = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const stats = await EventRsvp.getStats(event_id);
    sendResponse(res, 200, 'Event statistics retrieved successfully', stats);
  } catch (err) {
    console.error('getStats:', err);
    sendResponse(res, 500, 'Failed to fetch stats');
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    // Fetch events created by this organizer
    const [events] = await db.execute(
      `SELECT * FROM events WHERE organizer_id = ? ORDER BY date DESC`, 
      [organizer_id]
    );

    sendResponse(res, 200, 'Events fetched successfully', events);
  } catch (err) {
    console.error('getMyEvents:', err.message);
    sendResponse(res, 500, 'Server error while fetching events');
  }
};

export const checkMyRsvp = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `SELECT id FROM event_rsvps WHERE event_id = ? AND user_id = ?`,
      [event_id, user_id]
    );

    const hasRSVPed = rows.length > 0;
    sendResponse(res, 200, 'RSVP status checked', { hasRSVPed });
  } catch (err) {
    console.error('checkMyRsvp error:', err.message);
    sendResponse(res, 500, 'Failed to check RSVP status');
  }
};
