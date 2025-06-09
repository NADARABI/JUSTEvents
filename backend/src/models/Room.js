// src/models/Room.js
import db from '../utils/db.js';

class Room {
  // Get all rooms
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT r.*, b.name AS building_name 
      FROM rooms r
      LEFT JOIN buildings b ON r.building_id = b.id
    `);
    return rows;
  }

  //  Get room by ID
  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT r.*, b.name AS building_name 
      FROM rooms r
      LEFT JOIN buildings b ON r.building_id = b.id
      WHERE r.id = ?
    `, [id]);
    return rows.length ? rows[0] : null;
  }

  // Create a new room
  static async create(data) {
    const { name, building_id, capacity, type, status, description, floor, map_coordinates } = data;
    const [result] = await db.execute(
      `INSERT INTO rooms (name, building_id, capacity, type, status, description, floor, map_coordinates)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, building_id, capacity, type, status, description, floor, JSON.stringify(map_coordinates)]
    );
    return result.insertId;
  }

  // Delete room
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM rooms WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

   // Update room
  static async update(id, data) {
    const fields = [];
    const values = [];
    for (const key in data) {
      if (key === 'map_coordinates') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(data[key]));
      } else {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return await Room.findById(id); // No updates sent
    values.push(id); // For WHERE clause
    await db.execute(`UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`, values);
    return await Room.findById(id);
  }
}

export default Room;
