// src/routes/roomRoutes.js
import express from 'express';
import {
  getAllRooms,
  getRoomBasicInfo,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';

const router = express.Router();

// Routes for Campus Admin Room Management
router.get('/', getAllRooms);                  // Get all rooms with building names
router.get('/:id/basic', getRoomBasicInfo);    // Get basic info for a single room
router.post('/', createRoom);                  // Add a new room
router.put('/:id', updateRoom);                // Update an existing room
router.delete('/:id', deleteRoom);             // Delete a room

export default router;
