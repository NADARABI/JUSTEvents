import db from '../utils/db.js';

class Event {
  // Check for event conflict
  static async checkConflict(date, time, venue_id, excludeId = null) {
    let query = `SELECT id FROM events WHERE date = ? AND time = ? AND venue_id = ?`;
    const params = [date, time, venue_id];

    if (excludeId) {
      query += ` AND id != ?`; // Exclude self when editing
      params.push(excludeId);
    }

    const [rows] = await db.execute(query, params);
    return rows.length > 0;
  }

  // Create new event
  static async create({ title, description, date, time, organizer_id, venue_id, image_url }) {
    if (image_url === undefined) image_url = null;
    const [result] = await db.execute(
      `INSERT INTO events (title, description, date, time, organizer_id, venue_id, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [title, description, date, time, organizer_id, venue_id, image_url]
    );
    return result.insertId;
  }
  

  // Get event by ID
  static async findById(id) {
    const [rows] = await db.execute(`SELECT * FROM events WHERE id = ?`, [id]);
    return rows[0];
  }

  // Get all events (with optional filters)
  static async findAll({ status = null, search = null, date = null, upcoming = false, category = null, sort = null } = {}) {
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

    if (date) {
      query += ` AND date = ?`;
      params.push(date);
    }
  
    if (upcoming) {
      query += ` AND date >= CURDATE()`;
    }
  
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (sort === 'latest') {
      query += ` ORDER BY date DESC, time DESC`;
    } else if (sort === 'popular') {
      query = `
        SELECT e.*, COUNT(r.id) AS rsvp_count
        FROM events e
        LEFT JOIN event_rsvps r ON e.id = r.event_id
        WHERE 1=1
        ${status ? ' AND e.status = ?' : ''}
        ${search ? ' AND (e.title LIKE ? OR e.description LIKE ?)' : ''}
        ${date ? ' AND e.date = ?' : ''}
        ${upcoming ? ' AND e.date >= CURDATE()' : ''}
        ${category ? ' AND e.category = ?' : ''}
        GROUP BY e.id
        ORDER BY rsvp_count DESC
      `;
    } else if (sort === 'rating') {
      query = `
        SELECT e.*, AVG(f.rating) AS avg_rating
        FROM events e
        LEFT JOIN feedback f ON e.id = f.event_id
        WHERE 1=1
        ${status ? ' AND e.status = ?' : ''}
        ${search ? ' AND (e.title LIKE ? OR e.description LIKE ?)' : ''}
        ${date ? ' AND e.date = ?' : ''}
        ${upcoming ? ' AND e.date >= CURDATE()' : ''}
        ${category ? ' AND e.category = ?' : ''}
        GROUP BY e.id
        ORDER BY avg_rating DESC
      `;
    } else {
      query += ` ORDER BY date ASC, time ASC`; // default
    }
    

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Get events by organizer
  static async findByOrganizer(organizer_id) {
    const [rows] = await db.execute(
      `SELECT * FROM events WHERE organizer_id = ?`,
      [organizer_id]
    );
    return rows;
  }

  // Update event by ID with fields
  static async update(id, fields) {
    const keys = Object.keys(fields).filter(key => fields[key] !== undefined && fields[key] !== null);
    if (keys.length === 0) {
      return 0; // Nothing to update
    }

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map(key => fields[key]);
    values.push(id); // for WHERE clause

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

  // Update event approval status
  static async updateStatus(id, status) {
    const [result] = await db.execute(
      `UPDATE events SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows;
  }

  static async getExpiryStats() {
    const [rows] = await db.query(`
      SELECT
        SUM(CASE WHEN date >= CURDATE() THEN 1 ELSE 0 END) AS upcoming_events,
        SUM(CASE WHEN date < CURDATE() THEN 1 ELSE 0 END) AS past_events
      FROM events
    `);
    return rows[0];
  }

  static async autoCloseExpiredEvents() {
    const [result] = await db.execute(`
      UPDATE events
      SET status = 'Expired'
      WHERE date < CURDATE() AND status = 'Approved'
    `);
    return result.affectedRows;
  }

  static async getEventsByDateRange(startDate, endDate) {
    const [rows] = await db.execute(`
      SELECT id, title, date, time, category, status
      FROM events
      WHERE date BETWEEN ? AND ?
        AND status = 'Approved'
      ORDER BY date ASC, time ASC
    `, [startDate, endDate]);
    return rows;
<<<<<<< HEAD
=======
  }
  
  static async checkConflict(date, time, venue_id, excludeId = null) {
    let query = `SELECT * FROM events WHERE date = ? AND time = ? AND venue_id = ?`;
    let params = [date, time, venue_id];
  
    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }
  
    const [rows] = await db.execute(query, params);
    return rows.length > 0;
}

  static async deleteRSVPs(eventId) {
    await db.execute(`DELETE FROM event_rsvps WHERE event_id = ?`, [eventId]);
>>>>>>> ba4fbdeaa8db97ec82290e169484a0669d32f781
  }
}

export default Event;