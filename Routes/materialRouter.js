import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import {
  getAllMaterials,
  getMaterialById,
} from '../Controllers/MaterialController.js';

const router = express.Router();

// Rute untuk GET semua materi
router.get('/', protect, getAllMaterials);

// Rute untuk GET materi berdasarkan ID
router.get('/:idOrSlug', protect, getMaterialById);

export default router;
