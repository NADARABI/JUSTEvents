// routes/buildingRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { 
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding
 } from '../controllers/buildingController.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getAllBuildings);
router.post('/', createBuilding);
router.put('/:id', updateBuilding);
router.delete('/:id', deleteBuilding);

export default router;
