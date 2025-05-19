// src/controllers/roomController.js
import db from '../utils/db.js';
import { sendResponse } from '../utils/sendResponse.js';

/**
 * Fetch all rooms with associated building names
 */
export const getAllRooms = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.id, r.name, r.capacity, r.type, r.status, b.name AS building_name
      FROM rooms r
      JOIN buildings b ON r.building_id = b.id
    `);
    sendResponse(res, 200, 'Rooms fetched successfully', rows);
  } catch (err) {
    console.error('getAllRooms error:', err.message);
    sendResponse(res, 500, 'Failed to fetch rooms');
  }
};

/**
 * Create a new room
 */
export const createRoom = async (req, res) => {
  const { name, building_id, capacity = 10, type = 'Study Room', status = 'Available' } = req.body;

  if (!name || !building_id || !capacity) {
    return sendResponse(res, 400, 'Name, capacity, and building ID are required');
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO rooms (name, capacity, type, status, building_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, capacity, type, status, building_id]
    );
    sendResponse(res, 201, 'Room created successfully', { id: result.insertId });
  } catch (err) {
    console.error('createRoom error:', err.message);
    sendResponse(res, 500, 'Failed to create room');
  }
};

/**
 * Get basic room + building info for a specific room
 */
export const getRoomBasicInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT r.name, b.name AS building
      FROM rooms r
      JOIN buildings b ON r.building_id = b.id
      WHERE r.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, 'Room not found');
    }

    sendResponse(res, 200, 'Room info fetched successfully', rows[0]);
  } catch (err) {
    console.error('getRoomBasicInfo error:', err.message);
    sendResponse(res, 500, 'Failed to fetch room info');
  }
};

/**
 * Update room by ID
 */
export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, capacity = 10, type = 'Study Room', status = 'Available', building_id } = req.body;

  if (!name || !capacity || !building_id) {
    return sendResponse(res, 400, 'Name, capacity, and building ID are required');
  }

  try {
    const [result] = await db.execute(
      `UPDATE rooms SET name = ?, capacity = ?, type = ?, status = ?, building_id = ? WHERE id = ?`,
      [name, capacity, type, status, building_id, id]
    );

    if (result.affectedRows === 0) {
      return sendResponse(res, 404, 'Room not found');
    }

    sendResponse(res, 200, 'Room updated successfully');
  } catch (err) {
    console.error('updateRoom error:', err.message);
    sendResponse(res, 500, 'Failed to update room');
  }
};

/**
 * Delete room by ID
 */
export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM rooms WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 404, 'Room not found');
    }

    sendResponse(res, 200, 'Room deleted successfully');
  } catch (err) {
    console.error('deleteRoom error:', err.message);
    sendResponse(res, 500, 'Failed to delete room');
  }
};
