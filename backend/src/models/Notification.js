import db from '../utils/db.js';

class Notification {
  static async create(user_id, message, type = 'info') {
    const [result] = await db.execute(
      `INSERT INTO notifications (user_id, message, type, is_read) VALUES (?, ?, ?, 0)`,
      [user_id, message, type]
    );
    return result.insertId;
  }  
  
  static async getByUser(user_id, onlyUnread = false) {
    const query = onlyUnread
      ? `SELECT * FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC`
      : `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
  
    const [rows] = await db.execute(query, [user_id]);
    return rows;
  }
  

  static async markAsRead(id, user_id) {
    const [result] = await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ? AND is_read = 0`,
      [id, user_id]
    );
    return result.affectedRows;
  }

  static async markAllAsRead(user_id) {
    const [result] = await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`,
      [user_id]
    );
    return result.affectedRows;
  }

  static async deleteOld(days = 30) {
    const [result] = await db.execute(
      `DELETE FROM notifications WHERE created_at < NOW() - INTERVAL ? DAY`,
      [days]
    );
    return result.affectedRows;
  }
  
  
}

export default Notification;
