import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import {
  getAllMaterials,
  getMaterialById,
} from '../controllers/MaterialController.js';
import Material from '../models/Material.js';

const router = express.Router();

// Rute untuk GET semua materi
// router.get('/', protect, getAllMaterials);
router.route('/').get(protect, advancedResults(Material), getAllMaterials);

// Rute untuk GET materi berdasarkan ID
router.route('/:idOrSlug').get(protect, getMaterialById);

export default router;
