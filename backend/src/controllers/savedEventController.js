import db from '../utils/db.js';
import { sendResponse } from '../utils/sendResponse.js';
import SavedEvent from '../models/SavedEvent.js';

export const saveEvent = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    // Check if event exists and is approved
    const [events] = await db.execute(
      `SELECT id, status FROM events WHERE id = ?`,
      [event_id]
    );

    if (events.length === 0) {
      return sendResponse(res, 404, 'Event not found');
    }

    const event = events[0];

    if (event.status !== 'Approved') {
      return sendResponse(res, 403, 'Cannot save unapproved event');
    }

    // Check if already saved
    const [existing] = await db.execute(
      `SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );

    if (existing.length > 0) {
      return sendResponse(res, 409, 'Event already saved');
    }

    // Save event
    await SavedEvent.save(user_id, event_id);

    sendResponse(res, 201, 'Event saved successfully');
  } catch (err) {
    console.error('saveEvent error:', err.message);
    sendResponse(res, 500, 'Server error while saving event');
  }
};

export const unsaveEvent = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    // Check if saved entry exists
    const [existing] = await db.execute(
      `SELECT id FROM saved_events WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );

    if (existing.length === 0) {
      return sendResponse(res, 404, 'This event is not saved');
    }

    // Delete saved event
    await SavedEvent.remove(user_id, event_id);

    sendResponse(res, 200, 'Event unsaved successfully');
  } catch (err) {
    console.error('unsaveEvent error:', err.message);
    sendResponse(res, 500, 'Server error while unsaving event');
  }
};

export const getSavedEvents = async (req, res) => {
  try {
    const user_id = req.user.id;

    const savedEvents = await SavedEvent.getSavedByUser(user_id);

    sendResponse(res, 200, 'Saved events fetched successfully', savedEvents);
  } catch (err) {
    console.error('getSavedEvents error:', err.message);
    sendResponse(res, 500, 'Server error while fetching saved events');
  }
};

export const getSavedEventsCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.execute(
      `SELECT COUNT(*) AS count FROM saved_events WHERE user_id = ?`,
      [userId]
    );

    const count = rows[0]?.count || 0;

    sendResponse(res, 200, 'Saved events count fetched successfully', { count });
  } catch (err) {
    console.error('getSavedEventsCount error:', err.message);
    sendResponse(res, 500, 'Server error while fetching saved events count');
  }
};