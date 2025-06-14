import db from '../utils/db.js';
import User from '../models/User.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getOrganizerSummary = async (req, res) => {
  const { id } = req.params;

  // Enforce organizer access to only their own data
  if (req.user.id != id || req.user.role !== 'Organizer') {
    return sendResponse(res, 403, 'Access denied');
  }

  try {
    // Check if the user exists and is an organizer
    const organizer = await User.findById(id);
    if (!organizer || organizer.role !== 'Organizer') {
      return sendResponse(res, 404, 'Organizer not found');
    }

    const [[{ total_events }]] = await db.execute(
      `SELECT COUNT(*) AS total_events FROM events WHERE organizer_id = ?`,
      [id]
    );

    const [[{ total_rsvps }]] = await db.execute(
      `SELECT COUNT(*) AS total_rsvps 
       FROM event_rsvps r
       JOIN events e ON r.event_id = e.id
       WHERE e.organizer_id = ?`,
      [id]
    );

    const [[{ avg_rating }]] = await db.execute(
      `SELECT AVG(f.rating) AS avg_rating
       FROM feedback f
       JOIN events e ON f.event_id = e.id
       WHERE e.organizer_id = ?`,
      [id]
    );

    return sendResponse(res, 200, 'Dashboard summary fetched', {
      total_events,
      total_rsvps,
      avg_rating: avg_rating !== null ? Number(parseFloat(avg_rating).toFixed(2)) : 0,
    });
  } catch (err) {
    console.error('Organizer summary error:', err.message);
    return sendResponse(res, 500, 'Failed to load summary');
  }
};
