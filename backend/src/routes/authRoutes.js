import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
console.log(" Microsoft callback route is loaded");

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

// Google SSO 
router.get('/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: req.user });
  }
);

// Microsoft SSO
router.get('/microsoft',
  passport.authenticate('microsoft')
);
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: req.user });
  }
);


// Protected Route Example 
router.get('/admin',
  authMiddleware,
  authorizeRole(['System Admin']),
  (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
  }
);

export default router;
