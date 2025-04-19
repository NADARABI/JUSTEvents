import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import './middlewares/passport.js';

const app = express();

// Core Middleware
app.use(express.json());
app.use(cors());

// Session (for Passport SSO)
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// PUBLIC Routes
app.use('/auth', authRoutes);

// Protected API Routes
app.use('/api', eventRoutes);
app.use('/approve', approvalRoutes);
app.use('/admin', adminRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api', feedbackRoutes);
app.use('/analytics', analyticsRoutes);

// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

export default app;
