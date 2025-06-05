// src/routes/mapRoutes.js
import express from 'express';
import authMiddleware, { optionalAuth } from '../middlewares/authMiddleware.js';
import {
  getAllBuildings,
  getRoomsByBuilding,
  getEventLocation,
  getNavigationPath
} from '../controllers/CampusMapController.js';

const router = express.Router();

// GET /buildings → All buildings with coordinates
router.get('/buildings', getAllBuildings);

// GET /buildings/:id/rooms → Rooms by building, optional auth for filtering
router.get('/buildings/:id/rooms', optionalAuth, getRoomsByBuilding);

// GET /events/:id/location → Event location (room + building)
router.get('/events/:id/location', getEventLocation);

// GET /navigate?origin=lat,lng OR startId&type=room|building&endId=ID
router.get('/navigate', getNavigationPath);

export default router;
