import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import { getRsvpTrend } from '../controllers/analyticsController.js';
import { getCategoryStats } from '../controllers/analyticsController.js';
import { getExpiryStats } from '../controllers/analyticsController.js';
import { getTopEngagedUsers } from '../controllers/analyticsController.js';
import { getEventOfTheWeek } from '../controllers/analyticsController.js';
import { autoCloseExpired } from '../controllers/analyticsController.js';
import { getEventsInRange } from '../controllers/analyticsController.js';

import {
  getTotalEvents,
  getTotalRSVPs,
  getRSVPsForEvent,
  getTopEvents
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRole(['System Admin', 'Organizer']));


router.get('/total-events', getTotalEvents);
router.get('/total-rsvps', getTotalRSVPs);
router.get('/event/:id/rsvps', getRSVPsForEvent);
router.get('/popular-events', getTopEvents);
router.get('/rsvp-trend', getRsvpTrend);
router.get('/category-stats', getCategoryStats);
router.get('/events/expiry-status', getExpiryStats);
router.get('/users/most-engaged', getTopEngagedUsers);
router.get('/events/event-of-the-week', getEventOfTheWeek);
router.patch('/events/auto-close-expired', autoCloseExpired);
router.get(
  '/events/calendar',
  authMiddleware,
  authorizeRole(['Organizer', 'Campus Admin']),
  getEventsInRange
);


export default router;
