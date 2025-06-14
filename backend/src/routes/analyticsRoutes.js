import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

import {
  getTotalEvents,
  getTotalRSVPs,
  getRSVPsForEvent,
  getTopEvents,
  getRsvpTrend,
  getCategoryStats,
  getExpiryStats,
  getTopEngagedUsers,
  getEventOfTheWeek,
  autoCloseExpired,
  getEventsInRange,
  getTotalBookings,
  getMostUsedRooms,
  getBookingTrends,
  getBookingsByBuilding,
  getBookingCancelRate,
  getSummaryPublic,
  getPopularEventsPublic
} from '../controllers/analyticsController.js';

const router = express.Router();

// Public read-only routes for landing page
router.get('/popular-events-public', getPopularEventsPublic);
router.get('/summary-public', getSummaryPublic);

// Events analytics (System Admin + Organizer)
router.use(authMiddleware);
router.get('/total-events', authorizeRole(['System Admin', 'Organizer']), getTotalEvents);
router.get('/total-rsvps', authorizeRole(['System Admin', 'Organizer']), getTotalRSVPs);
router.get('/event/:id/rsvps', authorizeRole(['System Admin', 'Organizer']), getRSVPsForEvent);
router.get('/popular-events', authorizeRole(['System Admin', 'Organizer']), getTopEvents);
router.get('/rsvp-trend', authorizeRole(['System Admin', 'Organizer']), getRsvpTrend);
router.get('/category-stats', authorizeRole(['System Admin', 'Organizer']), getCategoryStats);
router.get('/events/expiry-status', authorizeRole(['System Admin', 'Organizer']), getExpiryStats);
router.get('/users/most-engaged', authorizeRole(['System Admin', 'Organizer']), getTopEngagedUsers);
router.get('/events/event-of-the-week', authorizeRole(['System Admin', 'Organizer']), getEventOfTheWeek);
router.patch('/events/auto-close-expired', authorizeRole(['System Admin', 'Organizer']), autoCloseExpired);
router.get(
  '/events/calendar',
  authorizeRole(['Organizer', 'Campus Admin']),
  getEventsInRange
);

// Room Booking Analytics (System Admin + Campus Admin)
router.get('/bookings/total', authorizeRole(['System Admin', 'Campus Admin']), getTotalBookings);
router.get('/bookings/most-used', authorizeRole(['System Admin', 'Campus Admin']), getMostUsedRooms);
router.get('/bookings/trends', authorizeRole(['System Admin', 'Campus Admin']), getBookingTrends);
router.get('/bookings/by-building', authorizeRole(['System Admin', 'Campus Admin']), getBookingsByBuilding);
router.get('/bookings/cancel-rate', authorizeRole(['System Admin', 'Campus Admin']), getBookingCancelRate);

export default router;
