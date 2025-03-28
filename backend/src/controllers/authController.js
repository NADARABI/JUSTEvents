// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const JWT_SECRET = process.env.JWT_SECRET || 'justevents-secret';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();

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

    await sendEmail(email, `Your verification code: ${verificationCode}`);

    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findByEmail(email);
    if (!user || user.verification_code !== code)
      return res.status(400).json({ message: 'Invalid code' });

    await User.verifyEmail(email);
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.is_verified)
      return res.status(401).json({ message: 'Please verify your email first' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
