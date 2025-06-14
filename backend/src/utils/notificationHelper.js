// src/utils/notificationHelper.js
import Notification from "../models/Notification.js";
import db from "./db.js"; 

export const createNotification = async (user_id, message, type = 'info') => {
  try {
    if (!user_id || !message) {
      console.warn('Skipping notification: missing user_id or message', { user_id, message });
      return;
    }
    await Notification.create(user_id, message, type);
  } catch (err) {
    console.error('Notification.create error:', err.message);
    throw new Error('Failed to create notification');
  }
};

// NEW: Get all System Admins (for global alerts)
export const getSystemAdminIds = async () => {
  const [admins] = await db.execute(`SELECT id FROM users WHERE role = 'System Admin'`);
  return admins.map(a => a.id);
};
