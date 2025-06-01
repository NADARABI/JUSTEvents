// src/controllers/MapCoordinateController.js
import MapCoordinate from '../models/MapCoordinate.js';
import { sendResponse } from '../utils/sendResponse.js';

export const createCoordinate = async (req, res) => {
  try {
    const id = await MapCoordinate.create(req.body);
    sendResponse(res, 201, 'Map coordinate created successfully', { id });
  } catch (error) {
    console.error('createCoordinate:', error.message);

    // Custom error if duplicate
    if (error.message.includes('already has coordinates')) {
      return sendResponse(res, 400, error.message);
    }

    sendResponse(res, 500, 'Failed to create coordinate');
  }
};

export const updateCoordinate = async (req, res) => {
  try {
    const updated = await MapCoordinate.update(req.params.id, req.body);
    if (!updated) return sendResponse(res, 404, 'Coordinate not found');
    sendResponse(res, 200, 'Map coordinate updated successfully', updated);
  } catch (error) {
    console.error('updateCoordinate:', error.message);
    sendResponse(res, 500, 'Failed to update coordinate');
  }
};

export const deleteCoordinate = async (req, res) => {
  try {
    const existing = await MapCoordinate.findById(req.params.id);
    if (!existing) return sendResponse(res, 404, 'Coordinate not found');

    const success = await MapCoordinate.delete(req.params.id);
    if (!success) return sendResponse(res, 500, 'Failed to delete coordinate');

    sendResponse(res, 200, 'Map coordinate deleted successfully');
  } catch (error) {
    console.error('deleteCoordinate:', error.message);
    sendResponse(res, 500, 'Failed to delete coordinate');
  }
};
