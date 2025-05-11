// src/models/Building.js
import db from '../utils/db.js';

class Building {
  // Get all buildings
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM buildings');
    return rows;
  }

  // Get building by ID
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM buildings WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }

  // Create a new building
  static async create(data) {
    const { name, location, map_coordinates } = data;
    const [result] = await db.execute(
      `INSERT INTO buildings (name, location, map_coordinates) VALUES (?, ?, ?)`,
      [name, location, JSON.stringify(map_coordinates)]
    );
    return result.insertId;
  }

  // Update building
  static async update(id, data) {
    const { name, location, map_coordinates } = data;
    await db.execute(
      `UPDATE buildings SET name = ?, location = ?, map_coordinates = ? WHERE id = ?`,
      [name, location, JSON.stringify(map_coordinates), id]
    );
    return await Building.findById(id);
  }

  // Delete building
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM buildings WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Building;
