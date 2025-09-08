import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/CategoryController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js'; // <-- 1. Impor middleware validate
import { createCategorySchema } from '../validation/category.validation.js'; // <-- 2. Impor skema

const router = express.Router();

router.route('/').get(getCategories).post(
  protect,
  authorize('admin', 'instructor'),
  validate(createCategorySchema), // <-- 3. Terapkan validasi di sini
  createCategory
);

router.route('/:id').delete(protect, authorize('admin'), deleteCategory);

export default router;
