import express from 'express';
import {
  getAllBuildings,
  getRoomsByBuilding,
  getMapMarkers,
  getEventLocation
} from '../controllers/CampusMapController.js';

const router = express.Router();

// Get all buildings
router.get('/buildings', getAllBuildings);

// Get all rooms by building
router.get('/buildings/:id/rooms', getRoomsByBuilding);

// Get all map markers for Google Maps
router.get('/markers', getMapMarkers);

// Get event location for mapping
router.get('/events/:id/location', getEventLocation);

export default router;
