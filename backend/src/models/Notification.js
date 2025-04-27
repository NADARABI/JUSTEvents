import db from '../utils/db.js';

class Notification {
  static async create(user_id, message) {
    await db.execute(
      `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
      [user_id, message]
    );
  }

  static async getByUser(user_id) {
    const [rows] = await db.execute(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  }

  static async markAsRead(id) {
    const [result] = await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }
}

export default Notification;
