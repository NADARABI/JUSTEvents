import Event from '../models/Event.js';
import EventRsvp from '../models/EventRsvp.js';
import Approval from '../models/Approval.js';
import Notification from '../models/Notification.js';

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ success: status < 400, message, data });
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue_id } = req.body;
    const organizer_id = req.user.id;
    const image_url = req.file?.filename || null;

    if (!title || title.length < 3 || title.length > 100)
      return sendResponse(res, 400, 'Title must be between 3 and 100 characters');

    if (!description || description.length < 10 || description.length > 500)
      return sendResponse(res, 400, 'Description must be between 10 and 500 characters');

    if (!date || isNaN(Date.parse(date)) || new Date(date) < new Date())
      return sendResponse(res, 400, 'Invalid or past date not allowed');

    const eventTime = parseInt(time.split(':')[0], 10);
    if (isNaN(eventTime) || eventTime < 8 || eventTime > 15)
      return sendResponse(res, 400, 'Time must be between 08:00 and 15:00');

    if (!venue_id) return sendResponse(res, 400, 'Venue is required');

    // Check for conflicting event at same venue, date, time
    const conflict = await Event.checkConflict(date, time, venue_id);
    if (conflict)
      return sendResponse(res, 409, 'Venue already booked at this date and time');

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
    const updates = req.body;

    const existing = await Event.findById(id);
    if (!existing) return sendResponse(res, 404, 'Event not found');

    if (existing.organizer_id !== req.user.id)
      return sendResponse(res, 403, 'Unauthorized to edit this event');

    // Validate updated fields
    if (updates.title && (updates.title.length < 3 || updates.title.length > 100))
      return sendResponse(res, 400, 'Title must be between 3 and 100 characters');

    if (updates.description && (updates.description.length < 10 || updates.description.length > 500))
      return sendResponse(res, 400, 'Description must be between 10 and 500 characters');

    if (updates.date && (isNaN(Date.parse(updates.date)) || new Date(updates.date) < new Date()))
      return sendResponse(res, 400, 'Invalid or past date not allowed');

    if (updates.time) {
      const eventTime = parseInt(updates.time.split(':')[0], 10);
      if (isNaN(eventTime) || eventTime < 8 || eventTime > 15)
        return sendResponse(res, 400, 'Time must be between 08:00 and 15:00');
    }

    // Check for conflict only if time/date/venue are actually changing
    const changingVenueOrTime = 
      (updates.venue_id && updates.venue_id !== existing.venue_id) ||
      (updates.date && updates.date !== existing.date) ||
      (updates.time && updates.time !== existing.time);

    if (changingVenueOrTime) {
      const dateToCheck = updates.date || existing.date;
      const timeToCheck = updates.time || existing.time;
      const venueToCheck = updates.venue_id || existing.venue_id;

      const conflict = await Event.checkConflict(dateToCheck, timeToCheck, venueToCheck, id);
      if (conflict)
        return sendResponse(res, 409, 'Venue already booked at this date and time');
    }

    await Event.update(id, updates);
    sendResponse(res, 200, 'Event updated successfully');
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

    if (existing.organizer_id !== req.user.id)
      return sendResponse(res, 403, 'Unauthorized to delete this event');

    // delete related RSVPs
    await Event.deleteRSVPs(id);

    // delete the event 
    await Event.delete(id);

    sendResponse(res, 200, 'Event and related RSVPs deleted successfully');
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

    const success = await EventRsvp.add(user_id, event_id);
    if (!success) return sendResponse(res, 409, 'Already RSVPed');

    await Notification.create(user_id, `You successfully RSVPed to Event #${event_id}`);
    sendResponse(res, 201, 'RSVP successful');
  } catch (err) {
    console.error('rsvpEvent:', err);
    sendResponse(res, 500, 'RSVP failed');
  }
};

// Cancel RSVP
export const cancelRsvp = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    await EventRsvp.remove(user_id, event_id);
    sendResponse(res, 200, 'RSVP cancelled');
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
    sendResponse(res, 200, 'RSVP list fetched', rsvps);
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
    sendResponse(res, 200, 'Event stats fetched', stats);
  } catch (err) {
    console.error('getStats:', err);
    sendResponse(res, 500, 'Failed to fetch stats');
  }
};
