import db from '../utils/db.js';

class EventRsvp {
  // Add RSVP
  static async add(user_id, event_id) {
    const [existing] = await db.execute(
      `SELECT id FROM event_rsvps WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );
    if (existing.length > 0) return false;

    await db.execute(
      `INSERT INTO event_rsvps (user_id, event_id, status) VALUES (?, ?, 'Going')`,
      [user_id, event_id]
    );
    return true;
  }

  // Cancel RSVP
  static async remove(user_id, event_id) {
    const [result] = await db.execute(
      `DELETE FROM event_rsvps WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );
    return result.affectedRows;
  }

  // List all RSVPs for event
  static async getByEvent(event_id) {
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.email, r.status
       FROM event_rsvps r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ?`,
      [event_id]
    );
    return rows;
  }

  // Count stats
  static async getStats(event_id) {
    const [[total]] = await db.execute(
      `SELECT COUNT(*) AS total FROM event_rsvps WHERE event_id = ?`,
      [event_id]
    );
    const [[going]] = await db.execute(
      `SELECT COUNT(*) AS going FROM event_rsvps WHERE event_id = ? AND status = 'Going'`,
      [event_id]
    );

    return { total: total.total, going: going.going };
  }
}

export default EventRsvp;
