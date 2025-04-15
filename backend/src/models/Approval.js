import db from '../utils/db.js';

class Approval {
  // Create new approval record
  static async create(entity_type, entity_id) {
    await db.execute(
      `INSERT INTO approvals (admin_id, entity_type, entity_id, status) VALUES (?, ?, ?, 'Pending')`,
      [null, entity_type, entity_id]
    );
  }

  // Approve or reject an entity (event or room booking)
  static async updateStatus({ entity_type, entity_id, admin_id, status, reason }) {
    const [result] = await db.execute(
      `UPDATE approvals 
       SET status = ?, decision_reason = ?, reviewed_at = NOW(), admin_id = ?
       WHERE entity_type = ? AND entity_id = ?`,
      [status, reason, admin_id, entity_type, entity_id]
    );
    return result.affectedRows;
  }

  // Get approval by entity type and ID
  static async getByEntity(entity_type, entity_id) {
    const [rows] = await db.execute(
      `SELECT * FROM approvals WHERE entity_type = ? AND entity_id = ?`,
      [entity_type, entity_id]
    );
    return rows[0];
  }

  // Optional: get all pending approvals (for admin dashboard)
  static async getPending(entity_type = 'Event') {
    const [rows] = await db.execute(
      `SELECT * FROM approvals WHERE entity_type = ? AND status = 'Pending'`,
      [entity_type]
    );
    return rows;
  }
}

export default Approval;
