import db from '../utils/db.js';

class Approval {
  // Create a new approval record (default to pending)
  static async create(entity_type, entity_id) {
    await db.execute(
      `INSERT INTO approvals (admin_id, entity_type, entity_id, status)
       VALUES (?, ?, ?, 'Pending')`,
      [null, entity_type, entity_id]
    );
  }
  

  // Update approval status (approve or reject)
  static async updateStatus({ entity_type, entity_id, admin_id, status, reason }) {
    reason = reason ?? null;
    const [result] = await db.execute(
      `UPDATE approvals
       SET status = ?, decision_reason = ?, reviewed_at = NOW(), admin_id = ?
       WHERE entity_type = ? AND entity_id = ?`,
      [status, reason, admin_id, entity_type, entity_id]
    );
    return result.affectedRows;
  }

  // Get approval record for a specific entity
  static async getByEntity(entity_type, entity_id) {
    const [rows] = await db.execute(
      `SELECT * FROM approvals WHERE entity_type = ? AND entity_id = ?`,
      [entity_type, entity_id]
    );
    return rows[0];
  }

  // Get all pending approvals for a given entity type (default: 'Event')
  // Get all pending approvals for a given entity type (default: 'Event')
static async getPending(entity_type = 'Event') {
  const normalizedType = entity_type.toLowerCase();

  if (normalizedType === 'event') {
    const [rows] = await db.execute(`
      SELECT 
        a.id AS approval_id,
        a.status,
        a.entity_id AS event_id,
        e.title,
        e.date,
        u.name AS organizer_name
      FROM approvals AS a
      JOIN events AS e ON a.entity_id = e.id
      JOIN users AS u ON e.organizer_id = u.id
      WHERE LOWER(a.entity_type) = 'event' AND LOWER(a.status) = 'pending'
    `);
    return rows;
  } else {
    const [rows] = await db.execute(
      `SELECT * FROM approvals WHERE LOWER(entity_type) = ? AND LOWER(status) = 'pending'`,
      [normalizedType]
    );
    return rows;
  }
}

}
export default Approval;
