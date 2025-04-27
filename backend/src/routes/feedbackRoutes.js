import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addFeedback, getFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.use(authMiddleware);

// POST /events/:id/feedback → submit feedback
router.post('/events/:id/feedback', addFeedback);

// GET /events/:id/feedback → view feedback for event
router.get('/events/:id/feedback', getFeedback);

export default router;
