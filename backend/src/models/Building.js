// src/models/Building.js
import db from '../utils/db.js';

class Building {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM buildings');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM buildings WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }

  static async create(data) {
    const { name, location, map_coordinates } = data;
    const [result] = await db.execute(
      `INSERT INTO buildings (name, location, map_coordinates) VALUES (?, ?, ?)`,
      [name, location, JSON.stringify(map_coordinates)]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const exists = await Building.findById(id);
    if (!exists) return null;

    const { name = null, location = null, map_coordinates = null } = data;
    const fields = [];
    const values = [];

    if (name !== null) {
      fields.push('name = ?');
      values.push(name);
    }
    if (location !== null) {
      fields.push('location = ?');
      values.push(location);
    }
    if (map_coordinates !== null) {
      fields.push('map_coordinates = ?');
      values.push(JSON.stringify(map_coordinates));
    }

    if (fields.length === 0) return exists; // nothing to update

    values.push(id);
    await db.execute(`UPDATE buildings SET ${fields.join(', ')} WHERE id = ?`, values);
    return await Building.findById(id);
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM buildings WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Building;
