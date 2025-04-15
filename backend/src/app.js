// src/app.js
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

import './middlewares/passport.js'; 

const app = express();

app.use(express.json());
app.use(cors());

// Use express-session to handle user sessions
app.use(session({
  secret: 'your_secret_key',
  resave: false,              // Don't save session if it's not modified
  saveUninitialized: true     // Save an uninitialized session (not modified)
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', adminRoutes); // Final route: /admin/pending-users etc.

// Routes for Google OAuth
app.use('/auth', authRoutes);

// Initial test route to confirm setup clearly
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

export default app;