// src/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import upload from '../middlewares/uploadMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';
import { refreshToken } from '../controllers/authController.js';
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword,
  requestRole
} from '../controllers/authController.js';
import User from '../models/User.js'; // Added to update last_login

const router = express.Router();

// Helper to sign JWT tokens
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
router.post('/refresh-token', refreshToken);

// Google SSO
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      console.log("Google Callback → Received User Object:", req.user);

      // Fallback if ID is missing, fetch by email
      let userData;
      if (req.user.id) {
        userData = await User.findById(req.user.id);
      } else if (req.user.email) {
        console.log("No ID found, fetching by email...");
        userData = await User.findByEmail(req.user.email);
      } else {
        console.error("No ID or email found for Google SSO.");
        return res.status(404).json({ message: "Google SSO failed: No ID or email." });
      }

      if (!userData) {
        console.error("User not found in the database after Google SSO.");
        return res.status(404).json({ message: "User not found in the database." });
      }

      console.log("Full User Data →", userData);

      // Redirect to the frontend with the necessary data
      const token = signToken(userData);
      const redirectUrl = `${process.env.CLIENT_URL}/sso/callback?token=${token}&role=${userData.role}&name=${userData.name}&id=${userData.id}`;
      console.log("Redirecting to:", redirectUrl);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in Google callback:', error.message);
      res.status(500).json({ message: 'Server error after Google SSO login' });
    }
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
  async (req, res) => {
    try {
      if (req.user?.id) {
        await User.updateLastLogin(req.user.id);
      } else {
        console.warn('Skipping last_login update: No user ID available.');
      }

      const token = signToken(req.user);
      const redirectUrl = `${process.env.CLIENT_URL}/sso/callback?token=${token}&role=${req.user.role}&name=${encodeURIComponent(req.user.name)}&id=${req.user.id}`;
      console.log("Redirecting to:", redirectUrl);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in Microsoft callback:', error.message);
      res.status(500).json({ message: 'Server error after Microsoft SSO login' });
    }
  }
);

// Request Role (For Pending Users)
router.post(
  '/request-role',
  authMiddleware,
  authorizeRole(['Pending']),
  upload.single('attachment'), // Optional attachment
  requestRole
);

export default router;
