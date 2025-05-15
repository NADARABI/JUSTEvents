// src/controllers/roomController.js
import db from '../utils/db.js';

export const getRoomBasicInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT name, building FROM rooms WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error("Failed to fetch room info:", error.message);
    res.status(500).json({ message: 'Failed to fetch room information' });
  }
};
