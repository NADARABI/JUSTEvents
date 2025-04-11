// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const JWT_SECRET = process.env.JWT_SECRET || 'justevents-secret';

// Utility function to send standardized responses
const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ success: status < 400, message, data });
};

// Register a new user (Form or SSO)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Input validation
    if (!name || !email || !password || !role) {
      return sendResponse(res, 400, 'All fields are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(res, 400, 'Invalid email format');
    }

    // Allowlist role validation
    const allowedRoles = ['Student', 'Organizer', 'Campus Admin', 'Visitor'];
    if (!allowedRoles.includes(role)) {
      return sendResponse(res, 400, 'Invalid role selection');
    }

    // Check if the email is already registered
    const existing = await User.findByEmail(email);
    if (existing) {
      return sendResponse(res, 400, 'Email already in use');
    }

    // Hash the password and generate a verification code
    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Create the new user in the database
    const userId = await User.create({
      name,
      email,
      password_hash: hashed,
      role: 'Pending',
      requested_role: role,
      is_verified: false,
      verification_code: verificationCode,
      provider: 'Local',
    });

    // Send the verification email
    await sendEmail(email, `Your verification code: ${verificationCode}`).catch((err) => {
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

    // Validate inputs
    if (!email || !code) {
      return sendResponse(res, 400, 'Email and code are required');
    }

    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, 404, 'User not found');
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

    // Validate inputs
    if (!email || !password) {
      return sendResponse(res, 400, 'Email and password are required');
    }

    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, 404, 'User not found');
    if (!user.is_verified) return sendResponse(res, 401, 'Please verify your email first');

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return sendResponse(res, 401, 'Incorrect password');

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendResponse(res, 200, 'Login successful', { token, role: user.role, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    sendResponse(res, 500, 'Login failed');
  }
};

//  resend verfication code
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) return sendResponse(res, 400, 'Email is required');

    const user = await User.findByEmail(email);
    if (!user) return sendResponse(res, 404, 'User not found');
    if (user.is_verified) return sendResponse(res, 400, 'Email already verified');

    // Generate new code and update
    const newCode = crypto.randomInt(100000, 999999).toString();
    await User.updateVerificationCode(email, newCode);

    // Send new code via email
    await sendEmail(email, `Your new verification code: ${newCode}`);

    sendResponse(res, 200, 'New verification code sent to your email');
  } catch (err) {
    console.error('Resend verification error:', err);
    sendResponse(res, 500, 'Failed to resend verification code');
  }
};
