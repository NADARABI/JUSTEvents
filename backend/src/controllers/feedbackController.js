import Feedback from '../models/Feedback.js';

export const addFeedback = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({ success: false, message: 'Comment and rating are required' });
    }

    await Feedback.create({ event_id, user_id, comment, rating });
    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('addFeedback error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const feedbackList = await Feedback.getByEvent(event_id);
    res.status(200).json({ success: true, data: feedbackList });
  } catch (err) {
    console.error('getFeedback error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};
