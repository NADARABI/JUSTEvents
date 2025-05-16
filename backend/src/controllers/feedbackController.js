import db from '../utils/db.js';
import Feedback from '../models/Feedback.js';
import { sendResponse } from '../utils/sendResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

//  Submit feedback for an approved event
export const addFeedback = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;
    const { comment, rating } = req.body;

    //  Validate input
    if (!comment || rating === undefined)
      return sendResponse(res, 400, 'Comment and rating are required');
    if (isNaN(rating) || rating < 1 || rating > 5)
      return sendResponse(res, 400, 'Rating must be a number between 1 and 5');
    if (comment.length > 500)
      return sendResponse(res, 400, 'Comment must be 500 characters or less');

    // Verify event exists and is approved
    const [events] = await db.execute(
      `SELECT id, status, organizer_id, title FROM events WHERE id = ?`,
      [event_id]
    );
    if (events.length === 0)
      return sendResponse(res, 404, 'Event not found');

    const event = events[0];
    if (event.status !== 'Approved')
      return sendResponse(res, 403, 'Cannot submit feedback for unapproved events');

    // Check if feedback already exists
    const [existingFeedback] = await db.execute(
      `SELECT id FROM feedback WHERE event_id = ? AND user_id = ?`,
      [event_id, user_id]
    );
    if (existingFeedback.length > 0)
      return sendResponse(res, 409, 'You have already submitted feedback for this event');

    //  Save feedback
    await Feedback.create({ event_id, user_id, comment, rating });

    //  Notify organizer
    await createNotification(
      event.organizer_id,
      `New feedback received on your event "${event.title}".`,
      'info'
    );

    sendResponse(res, 201, 'Feedback submitted successfully');
  } catch (err) {
    console.error('addFeedback error:', err.message);
    sendResponse(res, 500, 'Server error while submitting feedback');
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id: feedback_id } = req.params;
    const user_id = req.user.id;

    const [existing] = await db.execute(
      `SELECT id FROM feedback WHERE id = ? AND user_id = ?`,
      [feedback_id, user_id]
    );

    if (existing.length === 0)
      return sendResponse(res, 404, 'Feedback not found or access denied');

    await db.execute(`DELETE FROM feedback WHERE id = ?`, [feedback_id]);

    sendResponse(res, 200, 'Feedback deleted successfully');
  } catch (err) {
    console.error('deleteFeedback error:', err.message);
    sendResponse(res, 500, 'Server error while deleting feedback');
  }
};

export const editFeedback = async (req, res) => {
  try {
    const { id: feedback_id } = req.params;
    const user_id = req.user.id;
    const { comment, rating } = req.body;

    if (!comment || rating === undefined)
      return sendResponse(res, 400, 'Comment and rating are required');
    if (isNaN(rating) || rating < 1 || rating > 5)
      return sendResponse(res, 400, 'Rating must be between 1 and 5');
    if (comment.length > 500)
      return sendResponse(res, 400, 'Comment must be 500 characters or less');

    // Ensure user owns this feedback
    const [existing] = await db.execute(
      `SELECT id FROM feedback WHERE id = ? AND user_id = ?`,
      [feedback_id, user_id]
    );
    if (existing.length === 0)
      return sendResponse(res, 404, 'Feedback not found or access denied');

    // Update feedback
    await db.execute(
      `UPDATE feedback SET comment = ?, rating = ?, updated_at = NOW() WHERE id = ?`,
      [comment, rating, feedback_id]
    );

    sendResponse(res, 200, 'Feedback updated successfully');
  } catch (err) {
    console.error('editFeedback error:', err.message);
    sendResponse(res, 500, 'Server error while updating feedback');
  }
};


// View feedback for a specific event
export const getFeedback = async (req, res) => {
  try {
    const { id: event_id } = req.params;

    //  Verify event exists
    const [events] = await db.execute(
      `SELECT id, status FROM events WHERE id = ?`,
      [event_id]
    );
    if (events.length === 0)
      return sendResponse(res, 404, 'Event not found');

    const event = events[0];
    if (event.status !== 'Approved')
      return sendResponse(res, 403, 'Feedback is not available for unapproved events');

    //  Get feedback list
    const feedbackList = await Feedback.getByEvent(event_id);
    sendResponse(res, 200, 'Feedback fetched successfully', feedbackList);
  } catch (err) {
    console.error('getFeedback error:', err.message);
    sendResponse(res, 500, 'Server error while fetching feedback');
  }
};

// Public feedback highlights for landing page
export const getRecentFeedbackPublic = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.comment, u.name AS user_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      JOIN events e ON f.event_id = e.id
      WHERE f.comment IS NOT NULL AND e.status = 'Approved'
      ORDER BY f.created_at DESC
      LIMIT 3
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent public feedback:', error);
    res.status(500).json({ message: 'Server error while loading feedback' });
  }
};