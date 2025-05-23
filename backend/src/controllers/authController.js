// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import RefreshToken from '../models/RefreshToken.js';
import { sendResponse } from '../utils/sendResponse.js';
import db from '../utils/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'justevents-secret';

const validRoles = ['Organizer', 'Campus Admin', 'Visitor'];


// Register a new user (Form)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return sendResponse(res, 400, 'All fields are required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return sendResponse(res, 400, 'Invalid email format');

    const allowedRoles = ['Student', 'Organizer', 'Campus Admin', 'Visitor'];
    if (!allowedRoles.includes(role))
      return sendResponse(res, 400, 'Invalid role selection');

    const existing = await User.findByEmail(email);
    if (existing) return sendResponse(res, 400, 'Email already in use');

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    await User.create({
      name,
      email,
      password_hash: hashed,
      role: 'Pending',
      requested_role: ['Campus Admin', 'Organizer', 'Visitor'].includes(role) ? role : null,
      is_verified: false,
      verification_code: verificationCode,
      provider: 'Local',
    });

    await sendEmail(email, 'JUSTEvents Verification', `Your verification code is: ${verificationCode}`).catch((err) => {
      console.error('Error sending email:', err);
      return sendResponse(res, 500, 'Failed to send verification email');
    });

    sendResponse(res, 201, 'Registration successful. Please verify your email.');
  } catch (err) {
    console.error('Registration error:', err);
    sendResponse(res, 500, 'Server error during registration');
  }
};

// Verify user's email
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return sendResponse(res, 400, 'Email and code are required');

    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, 404, 'User not found');
    if (user.is_verified) return sendResponse(res, 400, 'Email already verified');
    if (user.verification_code !== code) return sendResponse(res, 400, 'Invalid verification code');

    await User.verifyEmail(email);
    sendResponse(res, 200, 'Email verified successfully');
  } catch (err) {
    console.error('Email verification error:', err);
    sendResponse(res, 500, 'Verification failed');
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendResponse(res, 400, 'Email and password are required');

    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, 404, 'User not found');
    if (!user.is_verified) return sendResponse(res, 401, 'Please verify your email first');
   
    console.log("Signing with secret:", JWT_SECRET);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return sendResponse(res, 401, 'Incorrect password');

    await User.updateLastLogin(user.id);

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '12s' } // 15 minutes
    );
    
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' } // 7 days
    );
    
    await RefreshToken.save(user.id, refreshToken);

    sendResponse(res, 200, 'Login successful', { accessToken, refreshToken, id: user.id, role: user.role, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    sendResponse(res, 500, 'Login failed');
  }
};

// Resend verification code
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, 'Email is required');

    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, 404, 'User not found');
    if (user.is_verified) return sendResponse(res, 400, 'Email already verified');

    const newCode = crypto.randomInt(100000, 999999).toString();
    await User.updateVerificationCode(email, newCode);

    await sendEmail(email, 'JUSTEvents Verification', `Your new verification code: ${newCode}`);
    sendResponse(res, 200, 'New verification code sent to your email');
  } catch (err) {
    console.error('Resend verification error:', err);
    sendResponse(res, 500, 'Failed to resend verification code');
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return sendResponse(res, 400, 'Email is required');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    const tokenStored = await User.storeResetToken(email, resetToken, resetTokenExpiry);
    if (!tokenStored) return sendResponse(res, 500, 'Failed to store reset token');

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const message = `Click here to reset your password: ${resetLink}`;

    await sendEmail(email, "JUSTEvents Password Reset", `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Reset Requested</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `);
    
    sendResponse(res, 200, 'Password reset link sent to your email');
  } catch (err) {
    console.error('Error in password reset request:', err);
    sendResponse(res, 500, 'Server error');
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword)
      return sendResponse(res, 400, 'Token and new password are required');

    const user = await User.findByResetToken(token);
    if (!user) return sendResponse(res, 400, 'Invalid or expired token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const passwordUpdated = await User.setResetPassword(user.email, hashedPassword);
    if (!passwordUpdated) return sendResponse(res, 500, 'Failed to update password');

    await User.clearResetToken(user.email);
    sendResponse(res, 200, 'Password reset successfully');
  } catch (err) {
    console.error('Error in password reset submission:', err);
    sendResponse(res, 500, 'Server error');
  }
};

// Request role after registration (for Pending users)
export const requestRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requested_role } = req.body;
    const attachment = req.file?.filename || null;

    if (!requested_role || !validRoles.includes(requested_role)) {
      return sendResponse(res, 400, 'Please select a valid role (Organizer, Campus Admin, or Visitor).');
    }

    const updated = await User.storeRoleRequest(userId, requested_role, attachment);

    if (!updated) {
      return sendResponse(res, 404, 'User not found or unable to process your request.');
    }

    sendResponse(res, 200, `Your role request for '${requested_role}' has been submitted successfully.`);
  } catch (error) {
    console.error('Error in requestRole:', error.message);
    sendResponse(res, 500, 'An error occurred while submitting your role request. Please try again later.');
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendResponse(res, 400, 'Refresh token is required');
    }

    const stored = await RefreshToken.findByToken(token);
    if (!stored) {
      return sendResponse(res, 403, 'Invalid refresh token');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verify error:', err.message);
        return sendResponse(res, 403, 'Refresh token expired or invalid');
      }

      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      sendResponse(res, 200, 'New access token generated successfully', { accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error in refreshToken:', error.message);
    sendResponse(res, 500, 'Server error during token refresh');
  }
};
