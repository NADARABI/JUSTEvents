import db from '../utils/db.js';

class SavedEvent {
  // Save an event for a user
  static async save(user_id, event_id) {
    try {
      await db.execute(
        `INSERT INTO saved_events (user_id, event_id) VALUES (?, ?)`,
        [user_id, event_id]
      );
      return true;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return false; // already saved
      console.error('Save error:', err.message);
      throw err;
    }
  }

  // Get all saved events for a user
  static async getSavedByUser(user_id) {
  const [rows] = await db.execute(
    `SELECT 
        e.id, 
        e.title, 
        e.date, 
        e.time, 
        e.category, 
        e.image_url,
        r.name AS venue_name,
        s.created_at AS saved_at
     FROM saved_events s
     JOIN events e ON e.id = s.event_id
     JOIN rooms r ON e.venue_id = r.id
     WHERE s.user_id = ?
     ORDER BY s.created_at DESC`,
    [user_id]
  );
  return rows;
}

  // Remove a saved event
  static async remove(user_id, event_id) {
    const [result] = await db.execute(
      `DELETE FROM saved_events WHERE user_id = ? AND event_id = ?`,
      [user_id, event_id]
    );
    return result.affectedRows;
  }
}

export default SavedEvent;
