import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/CategoryController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories) // Publik, agar semua bisa lihat
  .post(protect, authorize('admin', 'instructor'), createCategory); // Admin & Instruktur bisa buat

router.route('/:id').delete(protect, authorize('admin'), deleteCategory); // Hanya admin yang bisa hapus

export default router;
