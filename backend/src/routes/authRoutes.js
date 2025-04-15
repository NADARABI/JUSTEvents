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
import { requestPasswordReset, resetPassword } from '../controllers/authController.js';
import passport from 'passport';

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-code', resendVerificationCode);

// Google SSO Routes
// Route to start the Google authentication process
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google OAuth callback route
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),  // If authentication fails, redirect to login page
  (req, res) => {
    res.redirect('/');  // On success, redirect to homepage
  }
);

// Example of a protected route
router.get('/admin', verifyToken, authorizeRole(['System Admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

// Request password reset (send reset link)
router.post('/reset-password-request', requestPasswordReset);

// Submit new password with reset token
router.post('/reset-password-submit', resetPassword);

export default router;
