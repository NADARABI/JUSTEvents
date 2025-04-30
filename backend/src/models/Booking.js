// src/models/Booking.js
import db from '../utils/db.js';

const Booking = {
  /**
   * Create a new room booking request
   */
  async create({ user_id, room_id, purpose, start_time, end_time }) {
    try {
      const [result] = await db.execute(
        `INSERT INTO room_bookings (user_id, room_id, purpose, start_time, end_time)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, room_id, purpose, start_time, end_time]
      );
      return result.insertId;
    } catch (error) {
      console.error('Booking.create error:', error.message);
      throw new Error('Failed to create booking');
    }
  },

  /**
   * Get all bookings for a specific user
   */
  async getByUser(user_id) {
    try {
      const [rows] = await db.execute(
        `SELECT b.*, r.name AS room_name, r.building
         FROM room_bookings b
         JOIN rooms r ON b.room_id = r.id
         WHERE b.user_id = ?
         ORDER BY b.start_time DESC`,
        [user_id]
      );
      return rows;
    } catch (error) {
      console.error('Booking.getByUser error:', error.message);
      throw new Error('Failed to fetch user bookings');
    }
  },

  /**
   * Check if there's a conflicting approved booking
   */
  async findConflictingBooking(room_id, start_time, end_time) {
    try {
      const [rows] = await db.execute(
        `SELECT id
         FROM room_bookings
         WHERE room_id = ?
         AND status = 'Approved'
         AND (
           (start_time < ? AND end_time > ?)
           OR (start_time < ? AND end_time > ?)
           OR (start_time >= ? AND end_time <= ?)
         )`,
        [room_id, end_time, start_time, end_time, start_time, start_time, end_time]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Booking.findConflictingBooking error:', error.message);
      throw new Error('Failed to check booking conflict');
    }
  },

  /**
   * Get all pending booking requests (for Campus Admin review)
   */
  async getPending() {
    try {
      const [rows] = await db.execute(
        `SELECT b.*, r.name AS room_name, r.building, u.name AS user_name
         FROM room_bookings b
         JOIN rooms r ON b.room_id = r.id
         JOIN users u ON b.user_id = u.id
         WHERE b.status = 'Pending'
         ORDER BY b.start_time ASC`
      );
      return rows;
    } catch (error) {
      console.error('Booking.getPending error:', error.message);
      throw new Error('Failed to fetch pending bookings');
    }
  },

  /**
   * Update booking status (Approve or Reject)
   */
  async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        `UPDATE room_bookings
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Booking.updateStatus error:', error.message);
      throw new Error('Failed to update booking status');
    }
  },

  /**
   * Delete a booking (User cancels if still pending)
   */
  async deleteById(id, user_id) {
    const [rows] = await db.execute(
      `SELECT id, user_id, status FROM room_bookings WHERE id = ?`,
      [id]
    );
  
    if (rows.length === 0) return 'not_found';
  
    const booking = rows[0];
  
    if (booking.user_id !== user_id) return 'not_owned';
    if (booking.status !== 'Pending') return 'already_processed';
  
    const [result] = await db.execute(
      `DELETE FROM room_bookings WHERE id = ?`,
      [id]
    );
  
    return result.affectedRows > 0 ? 'deleted' : 'error';
  },  
  
  async checkDuplicateBooking(user_id, room_id, start_time, end_time) {
    try {
      const [rows] = await db.execute(
        `SELECT id FROM room_bookings
         WHERE user_id = ? AND room_id = ?
         AND start_time = ? AND end_time = ?
         AND status = 'Pending'`,
        [user_id, room_id, start_time, end_time]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Booking.checkDuplicateBooking error:', error.message);
      throw new Error('Failed to check for duplicate booking');
    }
  }
  
};

export default Booking;