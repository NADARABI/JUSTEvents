import db from '../utils/db.js';

class Event {
  // Create new event
  static async create({ title, description, date, time, organizer_id, venue_id }) {
    const [result] = await db.execute(
      `INSERT INTO events (title, description, date, time, organizer_id, venue_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [title, description, date, time, organizer_id, venue_id]
    );
    return result.insertId;
  }

  // Get event by ID
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM events WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get all events (optionally filter by status, date, search)
  static async findAll({ status = null, search = null } = {}) {
    let query = `SELECT * FROM events WHERE 1=1`;
    const params = [];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (title LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY date ASC, time ASC`;

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Get events created by a specific organizer
  static async findByOrganizer(organizer_id) {
    const [rows] = await db.execute(
      `SELECT * FROM events WHERE organizer_id = ?`,
      [organizer_id]
    );
    return rows;
  }

  // Update event (title, description, etc.)
  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    values.push(id);

    const [result] = await db.execute(
      `UPDATE events SET ${setClause} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  }

  // Delete event by ID
  static async delete(id) {
    const [result] = await db.execute(`DELETE FROM events WHERE id = ?`, [id]);
    return result.affectedRows;
  }

  // Change event status manually (optional)
  static async updateStatus(id, status) {
    const [result] = await db.execute(
      `UPDATE events SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows;
  }
}

export default Event;
