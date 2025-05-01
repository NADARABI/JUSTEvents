// src/routes/bookingRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getPendingBookings,
  reviewBooking,
  getBookingStats
} from '../controllers/bookingController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User: Book room, view bookings, cancel
router.post('/bookings', authorizeRole(['Student', 'Organizer', 'Visitor']), createBooking);
router.get('/bookings/me', authorizeRole(['Student', 'Organizer', 'Visitor']), getMyBookings);
router.delete('/bookings/:id', authorizeRole(['Student', 'Organizer', 'Visitor']), cancelBooking);

// Admin: Review pending bookings
router.get('/bookings/pending', authorizeRole(['Campus Admin']), getPendingBookings);
router.patch('/bookings/:id', authorizeRole(['Campus Admin']), reviewBooking);

router.get(
  '/bookings/stats',
  authorizeRole(['Campus Admin']),
  getBookingStats
);

export default router;
