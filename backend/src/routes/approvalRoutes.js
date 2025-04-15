import express from 'express';
import {
  getPendingEvents,
  reviewEvent
} from '../controllers/approvalController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes below require Campus Admin access
router.use(authMiddleware);
router.use(authorizeRole(['Campus Admin']));

// GET /approve/events → List all pending event approvals
router.get('/approve/events', getPendingEvents);

// POST /approve/event/:event_id → Approve or reject a specific event
router.post('/approve/event/:event_id', reviewEvent);

export default router;
