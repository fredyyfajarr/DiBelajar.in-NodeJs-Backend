import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import {
  getAllMaterials,
  getMaterialById,
} from '../controllers/MaterialController.js';
import Material from '../models/Material.js';

const router = express.Router();

// Rute untuk GET semua materi
router
  .route('/')
  .get(
    protect,
    authorize('admin', 'instructor'),
    advancedResults(Material),
    getAllMaterials
  );

// Rute untuk GET materi berdasarkan ID
router
  .route('/:idOrSlug')
  .get(protect, authorize('admin', 'instructor'), getMaterialById);

export default router;
