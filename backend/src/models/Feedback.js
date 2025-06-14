import db from '../utils/db.js';

class Feedback {
  // Add new feedback
  static async create({ event_id, user_id, comment, rating }) {
    const [result] = await db.execute(
      `INSERT INTO feedback (event_id, user_id, comment, rating)
       VALUES (?, ?, ?, ?)`,
      [event_id, user_id, comment, rating]
    );
    return result.insertId;
  }

  // Get all feedback for a specific event
  static async getByEvent(event_id) {
    const [rows] = await db.execute(
      `SELECT 
      f.id, f.comment, f.rating, f.created_at, f.updated_at, f.is_edited,
      u.name AS user_name, f.user_id
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.event_id = ?
      ORDER BY f.created_at DESC`,
      [event_id]
    );
    return rows;
  }
}

export default Feedback;
