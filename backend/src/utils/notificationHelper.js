// src/utils/notificationHelper.js
import Notification from "../models/Notification.js";

export const createNotification = async (user_id, message, type = 'info') => {
  try {
    if (!user_id || !message) {
      console.warn('Skipping notification: missing user_id or message', { user_id, message });
      return; // Avoid throwing for invalid calls
    }
    await Notification.create(user_id, message, type);
  } catch (err) {
    console.error('Notification.create error:', err.message);
    throw new Error('Failed to create notification');
  }
};