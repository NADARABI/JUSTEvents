// src/controllers/buildingController.js
import db from '../utils/db.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getAllBuildings = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM buildings');
    sendResponse(res, 200, 'Buildings fetched successfully', rows);
  } catch (err) {
    console.error('getAllBuildings error:', err.message);
    sendResponse(res, 500, 'Failed to fetch buildings');
  }
};

export const createBuilding = async (req, res) => {
  const { name } = req.body;
  if (!name) return sendResponse(res, 400, 'Building name is required');

  try {
    const [result] = await db.execute('INSERT INTO buildings (name) VALUES (?)', [name]);
    sendResponse(res, 201, 'Building created successfully', { id: result.insertId });
  } catch (err) {
    console.error('createBuilding error:', err.message);
    sendResponse(res, 500, 'Failed to create building');
  }
};

export const updateBuilding = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [result] = await db.execute('UPDATE buildings SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return sendResponse(res, 404, 'Building not found');
    }
    sendResponse(res, 200, 'Building updated successfully');
  } catch (err) {
    console.error('updateBuilding error:', err.message);
    sendResponse(res, 500, 'Failed to update building');
  }
};

export const deleteBuilding = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM buildings WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return sendResponse(res, 404, 'Building not found');
    }
    sendResponse(res, 200, 'Building deleted successfully');
  } catch (err) {
    console.error('deleteBuilding error:', err.message);
    sendResponse(res, 500, 'Failed to delete building');
  }
};
