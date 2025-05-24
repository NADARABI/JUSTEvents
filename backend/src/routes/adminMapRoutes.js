// src/routes/adminMapRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/roleMiddleware.js';

import {
  createBuilding,
  updateBuilding,
  deleteBuilding
} from '../controllers/buildingController.js';

import {
  createCoordinate,
  updateCoordinate,
  deleteCoordinate
} from '../controllers/MapCoordinateController.js';

const router = express.Router();

// Allow System Admin + Campus Admin
router.use(authMiddleware);
router.use(authorizeRole(['System Admin', 'Campus Admin']));

// Building routes
router.post('/buildings', createBuilding);
router.put('/buildings/:id', updateBuilding);
router.delete('/buildings/:id', deleteBuilding);

// Coordinate routes
router.post('/map-coordinates', createCoordinate);
router.put('/map-coordinates/:id', updateCoordinate);
router.delete('/map-coordinates/:id', deleteCoordinate);

export default router;
