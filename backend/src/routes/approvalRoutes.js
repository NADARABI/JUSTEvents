import express from 'express';
import {
  getPendingEvents,
  reviewEvent
} from '../controllers/approvalController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// All routes require: Campus Admin
router.use(authMiddleware);
router.use(requireRole('Campus Admin'));

// GET all pending event approvals
router.get('/approve/events', getPendingEvents);

// POST approval or rejection for a specific event
router.post('/approve/event/:event_id', reviewEvent);

export default router;
