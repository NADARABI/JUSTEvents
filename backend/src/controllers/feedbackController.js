import db from '../utils/db.js';
import Feedback from '../models/Feedback.js';
import { sendResponse } from '../utils/sendResponse.js';

export const addFeedback = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;
    const { comment, rating } = req.body;

    // Validate comment and rating existence
    if (!comment || rating === undefined)
      return sendResponse(res, 400, 'Comment and rating are required');

    // Validate rating range
    if (isNaN(rating) || rating < 1 || rating > 5)
      return sendResponse(res, 400, 'Rating must be a number between 1 and 5');

    // Validate comment length
    if (comment.length > 500)
      return sendResponse(res, 400, 'Comment must be 500 characters or less');

    // Check if event exists and is approved
    const [events] = await db.execute(
      `SELECT id, status FROM events WHERE id = ?`,
      [event_id]
    );

    if (events.length === 0)
      return sendResponse(res, 404, 'Event not found');

    const event = events[0];
    if (event.status !== 'Approved')
      return sendResponse(res, 403, 'Cannot submit feedback for unapproved events');

    // Check if user already submitted feedback
    const [existingFeedback] = await db.execute(
      `SELECT id FROM feedback WHERE event_id = ? AND user_id = ?`,
      [event_id, user_id]
    );

    if (existingFeedback.length > 0)
      return sendResponse(res, 409, 'You have already submitted feedback for this event');

    // Save feedback
    await Feedback.create({ event_id, user_id, comment, rating });
    sendResponse(res, 201, 'Feedback submitted successfully');

  } catch (err) {
    console.error('addFeedback error:', err.message);
    sendResponse(res, 500, 'Server error while submitting feedback');
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { id: event_id } = req.params;

    // Check if event exists
    const [events] = await db.execute(
      `SELECT id, status FROM events WHERE id = ?`,
      [event_id]
    );

    if (events.length === 0)
      return sendResponse(res, 404, 'Event not found');

    const event = events[0];

    // Check if event is approved
    if (event.status !== 'Approved')
      return sendResponse(res, 403, 'Feedback is not available for unapproved events');

    // Fetch feedbacks
    const feedbackList = await Feedback.getByEvent(event_id);

    sendResponse(res, 200, 'Feedback fetched successfully', feedbackList);
  } catch (err) {
    console.error('getFeedback error:', err.message);
    sendResponse(res, 500, 'Server error while fetching feedback');
  }
};

