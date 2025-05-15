// src/routes/userRoutes.js
import express from 'express';
import { getUserBasicInfo } from '../controllers/userController.js';

const router = express.Router();

// Route to fetch only basic info of the user
router.get('/:id/basic', getUserBasicInfo);

export default router;
