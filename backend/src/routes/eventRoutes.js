import express from 'express';
import {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  rsvpEvent,
  cancelRsvp,
  getRsvps,
  getStats
} from '../controllers/eventController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Public Access
router.get('/events', getAllEvents); // browse events
router.get('/events/:id', getEventById);

// Organizer Only
router.post('/events', authMiddleware, requireRole('Organizer'), createEvent);
router.put('/events/:id', authMiddleware, requireRole('Organizer'), editEvent);
router.delete('/events/:id', authMiddleware, requireRole('Organizer'), deleteEvent);
router.get('/events/:id/stats', authMiddleware, requireRole('Organizer'), getStats);
router.get('/events/:id/rsvps', authMiddleware, requireRole('Organizer'), getRsvps);

// Students & Visitors (RSVP)
router.post('/events/:id/rsvp', authMiddleware, requireRole(['Student', 'Visitor']), rsvpEvent);
router.delete('/events/:id/rsvp', authMiddleware, requireRole(['Student', 'Visitor']), cancelRsvp);

export default router;
