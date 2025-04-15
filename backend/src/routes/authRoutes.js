import express from 'express';
import passport from 'passport';

import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-code', resendVerificationCode);

// Google SSO Routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

// Microsoft SSO Routes
router.get('/microsoft', passport.authenticate('microsoft'));
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

// Protected Routes (come after public)
router.use(authMiddleware);
router.use(authorizeRole(['System Admin']));

// Protected Admin Route
router.get('/admin', authMiddleware, authorizeRole(['System Admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

// Password Reset Routes
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password-submit', resetPassword);

export default router;
