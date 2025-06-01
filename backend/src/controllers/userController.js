// src/controllers/userController.js
import db from '../utils/db.js';

export const getUserBasicInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT name, role FROM users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error("Failed to fetch user info:", error.message);
    res.status(500).json({ message: 'Failed to fetch user information' });
  }
};
