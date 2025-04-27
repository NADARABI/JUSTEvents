// src/routes/adminRoutes.js
import express from 'express';
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from '../controllers/adminController.js';

import authMiddleware from '../middlewares/authMiddleware.js'; 
import { authorizeRole } from '../middlewares/roleMiddleware.js'; 

const router = express.Router();

// Middleware: only System Admins can access these routes
router.use(authMiddleware);
router.use(authorizeRole(['System Admin'])); 

// GET /admin/pending-users → List all pending accounts
router.get('/pending-users', getPendingUsers);

// PATCH /admin/approve/:id → Promote user to requested_role
router.patch('/approve/:id', approveUser);

// PATCH /admin/reject/:id → Demote user to Visitor
router.patch('/reject/:id', rejectUser);

export default router;
