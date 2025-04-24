import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

console.log("Microsoft callback route is loaded");

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

// Public Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/resend-code', resendVerificationCode);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password-submit', resetPassword);

// Google SSO
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'], session: false }) //  DISABLE SESSION
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }), //  DISABLE SESSION
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google SSO successful',
      token,
      role: req.user.role,
      name: req.user.name
    });
  }
);

// Microsoft SSO
router.get(
  '/microsoft',
  passport.authenticate('microsoft', { session: false }) //  DISABLE SESSION
);

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login', session: false }), //  DISABLE SESSION
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Microsoft SSO successful',
      token,
      role: req.user.role,
      name: req.user.name
    });
  }
);

// Example Protected Route
router.get(
  '/admin',
  authMiddleware,
  authorizeRole(['System Admin']),
  (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
  }
);

export default router;
