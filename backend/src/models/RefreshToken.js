import db from '../utils/db.js';

class RefreshToken {
  static async save(userId, token) {
    const [result] = await db.execute(
      `INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)`,
      [userId, token]
    );
    return result.insertId;
  }

  static async findByToken(token) {
    const [rows] = await db.execute(
      `SELECT * FROM refresh_tokens WHERE token = ?`,
      [token]
    );
    return rows[0];
  }

  static async delete(token) {
    const [result] = await db.execute(
      `DELETE FROM refresh_tokens WHERE token = ?`,
      [token]
    );
    return result.affectedRows > 0;
  }
}

export default RefreshToken;
