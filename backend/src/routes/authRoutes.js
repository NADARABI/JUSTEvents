import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import upload from '../middlewares/uploadMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword,
  requestRole
} from '../controllers/authController.js';

console.log("Microsoft callback route is loaded");

const router = express.Router();

// Helper to sign JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

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
  passport.authenticate('google', { scope: ['email', 'profile'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = signToken(req.user);
    res.json({ message: 'Google SSO successful', token, role: req.user.role, name: req.user.name });
  }
);

// Microsoft SSO
router.get(
  '/microsoft',
  passport.authenticate('microsoft', { session: false })
);

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = signToken(req.user);
    res.json({ message: 'Microsoft SSO successful', token, role: req.user.role, name: req.user.name });
  }
);

// Example Protected Route (Admin Only)
router.get(
  '/admin',
  authMiddleware,
  authorizeRole(['System Admin']),
  (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
  }
);

// Request Role (For Pending users)
router.post(
  '/request-role',
  authMiddleware,
  authorizeRole(['Pending']),
  upload.single('attachment'),
  requestRole
);

export default router;
