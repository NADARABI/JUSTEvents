import db from '../utils/db.js';

class MapCoordinate {
  // Get all coordinates
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM map_coordinates');
    return rows;
  }

  // Get coordinates by Building ID
  static async findByBuildingId(building_id) {
    const [rows] = await db.execute('SELECT * FROM map_coordinates WHERE building_id = ?', [building_id]);
    return rows;
  }

  // Create new coordinates
  static async create(data) {
    const { building_id, x, y, level } = data;
    const [result] = await db.execute(
      `INSERT INTO map_coordinates (building_id, x, y, level) 
       VALUES (?, ?, ?, ?)`,
      [building_id, x, y, level]
    );
    return result.insertId;
  }

  // Update coordinates
  static async update(id, data) {
    const { building_id, x, y, level } = data;
    await db.execute(
      `UPDATE map_coordinates 
       SET building_id = ?, x = ?, y = ?, level = ? 
       WHERE id = ?`,
      [building_id, x, y, level, id]
    );
    return await MapCoordinate.findById(id);
  }

  // Delete coordinates
  static async delete(id) {
    const [result] = await db.execute('DELETE FROM map_coordinates WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default MapCoordinate;
