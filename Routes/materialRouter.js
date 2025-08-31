import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getAllMaterials,
  getMaterialById,
} from '../controllers/MaterialController.js';

const router = express.Router();

// Rute untuk GET semua materi
router.get('/', protect, getAllMaterials);

// Rute untuk GET materi berdasarkan ID
router.get('/:idOrSlug', protect, getMaterialById);

export default router;
