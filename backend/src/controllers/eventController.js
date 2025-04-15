import Event from '../models/Event.js';
import db from '../utils/db.js';
import EventRsvp from '../models/EventRsvp.js';

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue_id } = req.body;
    const organizer_id = req.user.id;

    if (!title || !description || !date || !time || !venue_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const eventId = await Event.create({ title, description, date, time, organizer_id, venue_id });

    res.status(201).json({ message: 'Event created and pending approval', eventId });
  } catch (err) {
    console.error('createEvent:', err);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// Edit event
export const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await Event.findById(id);
    if (!existing) return res.status(404).json({ message: 'Event not found' });
    if (existing.organizer_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await Event.update(id, updates);
    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('editEvent:', err);
    res.status(500).json({ message: 'Server error while editing event' });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Event.findById(id);
    if (!existing) return res.status(404).json({ message: 'Event not found' });
    if (existing.organizer_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await Event.delete(id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Get all events (with optional filters)
export const getAllEvents = async (req, res) => {
  try {
    const { status, search } = req.query;
    const events = await Event.findAll({ status, search });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event' });
  }
};

// RSVP to an event
export const rsvpEvent = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    const success = await EventRsvp.add(user_id, event_id);
    if (!success) return res.status(409).json({ message: 'Already RSVPed' });

    res.status(201).json({ message: 'RSVP successful' });
  } catch (err) {
    res.status(500).json({ message: 'RSVP failed' });
  }
};

// Cancel RSVP
export const cancelRsvp = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    await EventRsvp.remove(user_id, event_id);

    res.json({ message: 'RSVP cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel RSVP' });
  }
};

// Get RSVPs list for an event (Organizer only)
export const getRsvps = async (req, res) => {
  try {
    const { id: event_id } = req.params;

    const rsvps = await EventRsvp.getByEvent(event_id);

    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch RSVPs' });
  }
};

// Get Event Statistics
export const getStats = async (req, res) => {
  try {
    const { id: event_id } = req.params;

    const stats = await EventRsvp.getStats(event_id);
    res.json(stats);

    res.json({
      total_rsvps: totalRsvps[0].total,
      going_count: going[0].going
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
