import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import { getOrganizerSummary } from '../controllers/dashboardController.js';

const router = express.Router();

// Require Organizer role
router.use(authMiddleware);
router.use(authorizeRole(['Organizer']));

// GET /dashboard/organizer/:id/summary
router.get('/organizer/:id/summary', getOrganizerSummary);

export default router;
