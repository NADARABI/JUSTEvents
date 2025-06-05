import express from 'express';
// import authMiddleware, { optionalAuth } from '../middlewares/authMiddleware.js';
import {
  getAllBuildings,
  getRoomsByBuilding,
  getEventLocation,
  getNavigationPath
} from '../controllers/CampusMapController.js';

const router = express.Router();

//  Public route: Get all buildings with coordinates
router.get('/buildings', getAllBuildings);

// Public route: Get rooms for a building (no role filtering now)
router.get('/buildings/:id/rooms', getRoomsByBuilding);

// Public route: Get event location (for event details map)
router.get('/events/:id/location', getEventLocation);

// Public route: Google Maps walking directions from point A → B
router.get('/navigate', getNavigationPath);

export default router;
