import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteOldNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all notifications for the logged-in user
router.get('/', getUserNotifications);

// Mark a specific notification as read
router.patch('/:id/read', markNotificationAsRead);

// Bulk Mark Notifications as Read
router.patch('/mark-all-read', markAllNotificationsAsRead);

// Delete Notifications Older Than 30 Days
router.delete('/cleanup-old', deleteOldNotifications);

export default router;
