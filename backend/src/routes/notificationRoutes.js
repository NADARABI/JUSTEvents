import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getUserNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getUserNotifications);

export default router;
