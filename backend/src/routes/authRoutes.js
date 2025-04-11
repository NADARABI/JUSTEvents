import express from 'express';
const router = express.Router();

import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
} from '../controllers/authController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-code', resendVerificationCode);

// Example of a protected route
router.get('/admin', verifyToken, authorizeRole(['System Admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
