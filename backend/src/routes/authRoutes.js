import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);

// Protected Routes (Example for Admin Only)
router.get('/admin', verifyToken, authorizeRole(['System Admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
