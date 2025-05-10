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
  getStats,
  getMyEvents
} from '../controllers/eventController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();
// Public
router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);

router.post(
  '/events/test',
  authMiddleware,
  authorizeRole(['Organizer']),
  (req, res) => {
    console.log(" REACHED THE CONTROLLER");
    res.json({ message: "Access granted. Role is Organizer." });
  }
);

// Organizer Routes                                                 Accepts one image file named "image"
router.post('/events', authMiddleware, authorizeRole(['Organizer']), upload.single('image'), createEvent);
router.get('/my-events', authMiddleware, authorizeRole(['Organizer']), getMyEvents);
router.put('/events/:id', authMiddleware, authorizeRole(['Organizer']), editEvent);
router.delete('/events/:id', authMiddleware, authorizeRole(['Organizer']), deleteEvent);
router.get('/events/:id/stats', authMiddleware, authorizeRole(['Organizer']), getStats);
router.get('/events/:id/rsvps', authMiddleware, authorizeRole(['Organizer']), getRsvps);

// RSVP Routes (Student & Visitor)
router.post('/events/:id/rsvp', authMiddleware, authorizeRole(['Student', 'Visitor']), rsvpEvent);
router.delete('/events/:id/rsvp', authMiddleware, authorizeRole(['Student', 'Visitor']), cancelRsvp);

export default router;
