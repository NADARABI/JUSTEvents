import db from '../utils/db.js';

class MapCoordinate {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM map_coordinates');
    return rows;
  }

  static async findByBuildingId(building_id) {
    const [rows] = await db.execute(
      'SELECT * FROM map_coordinates WHERE building_id = ?',
      [building_id]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM map_coordinates WHERE id = ?',
      [id]
    );
    return rows.length ? rows[0] : null;
  }
  // Create new coordinates
  static async create(data) {
    const { building_id, x, y, level } = data;

    //  Check if this building already has a coordinate
    const [existing] = await db.execute(
      'SELECT id FROM map_coordinates WHERE building_id = ?',
      [building_id]
    );
    if (existing.length > 0) {
      throw new Error('This building already has coordinates assigned.');
    }

    const [result] = await db.execute(
      `INSERT INTO map_coordinates (building_id, x, y, level) 
      VALUES (?, ?, ?, ?)`,
      [building_id, x, y, level]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const exists = await MapCoordinate.findById(id);
    if (!exists) return null;

    const { building_id, x, y, level } = data;
    await db.execute(
      `UPDATE map_coordinates 
       SET building_id = ?, x = ?, y = ?, level = ? 
       WHERE id = ?`,
      [building_id, x, y, level, id]
    );
    return await MapCoordinate.findById(id);
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM map_coordinates WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default MapCoordinate;
