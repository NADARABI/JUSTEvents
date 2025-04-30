import Notification from '../models/Notification.js';
import { sendResponse } from '../utils/sendResponse.js';

// Get all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.getByUser(userId);
    sendResponse(res, 200, 'Notifications fetched successfully', notifications);
  } catch (err) {
    console.error('getUserNotifications error:', err.message);
    sendResponse(res, 500, 'Failed to fetch notifications');
  }
};

// Mark a notification as read 
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const updated = await Notification.markAsRead(id, user_id);
    if (!updated) {
      return sendResponse(res, 404, 'Notification not found or already read');
    }

    sendResponse(res, 200, 'Notification marked as read');
  } catch (err) {
    console.error('markNotificationAsRead error:', err.message);
    sendResponse(res, 500, 'Failed to mark notification as read');
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    const updatedCount = await Notification.markAllAsRead(user_id);

    if (updatedCount === 0) {
      return sendResponse(res, 200, 'No unread notifications found');
    }

    return sendResponse(res, 200, `${updatedCount} notifications marked as read`);
  } catch (err) {
    console.error('markAllNotificationsAsRead error:', err.message);
    sendResponse(res, 500, 'Failed to mark all notifications as read');
  }
};

export const deleteOldNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'System Admin') {
      return sendResponse(res, 403, 'Access denied: Admins only');
    }

    const deletedCount = await Notification.deleteOld(30);
    sendResponse(res, 200, `${deletedCount} old notifications deleted`);
  } catch (err) {
    console.error('deleteOldNotifications error:', err.message);
    sendResponse(res, 500, 'Failed to delete old notifications');
  }
};
