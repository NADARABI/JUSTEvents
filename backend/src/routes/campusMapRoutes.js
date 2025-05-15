import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';
import {
  getAllBuildings,
  getRoomsByBuilding,
  getMapMarkers,
  getEventLocation,
  getNavigationPath
} from '../controllers/CampusMapController.js';

const router = express.Router();

// Get all buildings
router.get('/buildings', getAllBuildings);

// Get all rooms by building
router.get('/buildings/:id/rooms', optionalAuth, getRoomsByBuilding);

// Get all map markers for Google Maps
router.get('/markers', getMapMarkers);

// Get event location for mapping
router.get('/events/:id/location', getEventLocation);

// Get real-time navigation path
router.get('/navigate', getNavigationPath);

export default router;
