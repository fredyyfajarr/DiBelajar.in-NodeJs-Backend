import express from 'express';
import {
  getAllMaterials,
  getMaterialById,
} from '../Controllers/MaterialController.js';

const router = express.Router();

// Rute untuk GET semua materi
router.get('/', getAllMaterials);

// Rute untuk GET materi berdasarkan ID
router.get('/:idOrSlug', getMaterialById);

export default router;
