// src/utils/notificationHelper.js
import db from './db.js';

export const createNotification = async (user_id, message, type = 'info') => {
  try {
    await db.execute(
      `INSERT INTO notifications (user_id, message, type, is_read)
       VALUES (?, ?, ?, 0)`,
      [user_id, message, type]
    );
  } catch (err) {
    console.error('Notification.create error:', err.message);
    throw new Error('Failed to create notification');
  }
};