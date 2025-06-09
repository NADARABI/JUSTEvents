import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  addFeedback,
  getFeedback,
  editFeedback,
  deleteFeedback,
  getRecentFeedbackPublic
} from '../controllers/feedbackController.js';

const router = express.Router();

// Public: Get 3 recent feedbacks for landing page
router.get('/recent-public', getRecentFeedbackPublic);

// View feedback for a specific event (public)
router.get('/events/:id/feedback', getFeedback);

// Authenticated routes below
router.use(authMiddleware);

// Submit new feedback
router.post('/events/:id/feedback', addFeedback);

// Edit existing feedback
router.put('/feedback/:id', editFeedback);

// Delete feedback
router.delete('/feedback/:id', deleteFeedback);

export default router;
