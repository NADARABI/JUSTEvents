// src/controllers/BuildingController.js
import Building from '../models/Building.js';
import { sendResponse } from '../utils/sendResponse.js';

export const createBuilding = async (req, res) => {
  try {
    const id = await Building.create(req.body);
    sendResponse(res, 201, 'Building created successfully', { id });
  } catch (error) {
    console.error('createBuilding:', error.message);
    sendResponse(res, 500, 'Failed to create building');
  }
};

export const updateBuilding = async (req, res) => {
  try {
    const updated = await Building.update(req.params.id, req.body);
    if (!updated) return sendResponse(res, 404, 'Building not found');
    sendResponse(res, 200, 'Building updated successfully', updated);
  } catch (error) {
    console.error('updateBuilding:', error.message);
    sendResponse(res, 500, 'Failed to update building');
  }
};

export const deleteBuilding = async (req, res) => {
  try {
    const existing = await Building.findById(req.params.id);
    if (!existing) return sendResponse(res, 404, 'Building not found');

    const success = await Building.delete(req.params.id);
    if (!success) return sendResponse(res, 500, 'Failed to delete building');

    sendResponse(res, 200, 'Building deleted successfully');
  } catch (error) {
    console.error('deleteBuilding:', error.message);
    sendResponse(res, 500, 'Failed to delete building');
  }
};
