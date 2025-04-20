import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  saveEvent,
  getSavedEvents,
  unsaveEvent
} from '../controllers/savedEventController.js';

const router = express.Router();

// Require login
router.use(authMiddleware);

// Save an event
router.post('/events/:id/save', saveEvent);

// Unsave an event
router.delete('/events/:id/save', unsaveEvent);

// Get all saved events for user
router.get('/saved-events', getSavedEvents);

export default router;
