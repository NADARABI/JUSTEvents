import Event from '../models/Event.js';
import EventRsvp from '../models/EventRsvp.js';
import Approval from '../models/Approval.js';

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ success: status < 400, message, data });
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue_id } = req.body;
    const organizer_id = req.user.id;
    const image_url = req.file?.filename || null;

    if (!title || !description || !date || !time || !venue_id) {
      return sendResponse(res, 400, 'All fields are required');
    }

    const eventId = await Event.create({ title, description, date, time, organizer_id, venue_id });
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
    if (existing.organizer_id !== req.user.id) return sendResponse(res, 403, 'Unauthorized');

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
    if (existing.organizer_id !== req.user.id) return sendResponse(res, 403, 'Unauthorized');

    await Event.delete(id);
    sendResponse(res, 200, 'Event deleted successfully');
  } catch (err) {
    console.error('deleteEvent:', err);
    sendResponse(res, 500, 'Server error while deleting event');
  }
};

// Get all events (with optional filters)
export const getAllEvents = async (req, res) => {
  try {
    const { status, search } = req.query;
    const events = await Event.findAll({ status, search });
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
