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
