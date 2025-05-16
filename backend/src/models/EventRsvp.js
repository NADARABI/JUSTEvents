import db from '../utils/db.js';

class EventRsvp {
  // Add or re-RSVP
  static async add(user_id, event_id) {
    const [existing] = await db.execute(
      `SELECT id, status FROM event_rsvps WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );

    // Already RSVPed as 'Going'
    if (existing.length > 0) {
      if (existing[0].status === 'Going') return false;

      // Previously 'Not Going' → update to 'Going'
      await db.execute(
        `UPDATE event_rsvps SET status = 'Going' WHERE user_id = ? AND event_id = ?`,
        [user_id, event_id]
      );
      return true;
    }

    // First time RSVP
    await db.execute(
      `INSERT INTO event_rsvps (user_id, event_id, status)
       VALUES (?, ?, 'Going')`,
      [user_id, event_id]
    );
    return true;
  }

  // Cancel RSVP → mark as 'Not Going'
  static async remove(user_id, event_id) {
    const [existing] = await db.execute(
      `SELECT id FROM event_rsvps WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );

    if (existing.length === 0) return false;

    await db.execute(
      `UPDATE event_rsvps SET status = 'Not Going' WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );
    return true;
  }

  // List all RSVPs (for organizer)
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

  // Stats → total RSVP attempts + actual Going count
  static async getStats(event_id) {
    const [[total]] = await db.execute(
      `SELECT COUNT(*) AS total FROM event_rsvps WHERE event_id = ?`,
      [event_id]
    );

    const [[going]] = await db.execute(
      `SELECT COUNT(*) AS going FROM event_rsvps WHERE event_id = ? AND status = 'Going'`,
      [event_id]
    );

    return {
      total: total?.total || 0,
      going: going?.going || 0
    };
  }
}

export default EventRsvp;
