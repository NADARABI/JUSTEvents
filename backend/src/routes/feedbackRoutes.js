import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addFeedback, getFeedback } from '../controllers/feedbackController.js';
import { getRecentFeedbackPublic } from '../controllers/feedbackController.js';

const router = express.Router();

router.use(authMiddleware);

// POST /events/:id/feedback → submit feedback
router.post('/events/:id/feedback', addFeedback);

// GET /events/:id/feedback → view feedback for event
router.get('/events/:id/feedback', getFeedback);

// Public: Get 3 recent feedbacks for landing page
router.get('/recent-public', getRecentFeedbackPublic);

export default router;
