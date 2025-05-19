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
import savedEventRoutes from './routes/savedEventRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import campusMapRoutes from './routes/campusMapRoutes.js';
import adminMapRoutes from './routes/adminMapRoutes.js';

import './middlewares/passport.js';

const app = express();

// Core Middleware
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
));

// Session (for Passport SSO)
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
// app.use(passport.session());

// PUBLIC Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
console.log('/auth routes are active');
app.use('/api/campus-map', campusMapRoutes);

// Protected API Routes
app.use('/api', eventRoutes);
app.use('/approve', approvalRoutes);
app.use('/admin', adminRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api', feedbackRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/api', savedEventRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/admin/map', adminMapRoutes);


// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

export default app;
