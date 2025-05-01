import express from 'express';
import {
  getPendingEvents,
  reviewEvent
} from '../controllers/approvalController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes below require System Admin access
router.use(authMiddleware);
router.use(authorizeRole(['System Admin']));

// GET /approve/events → List all pending event approvals
router.get('/events', getPendingEvents);

// POST /approve/event/:event_id → Approve or reject a specific event
router.post('/event/:event_id', reviewEvent);

export default router;
