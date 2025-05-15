// src/routes/roomRoutes.js
import express from 'express';
import { getRoomBasicInfo } from '../controllers/roomController.js';

const router = express.Router();

// Route to fetch only basic info of the room
router.get('/:id/basic', getRoomBasicInfo);

export default router;
