import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/CategoryController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { createCategorySchema } from '../validation/category.validation.js';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(
    protect,
    authorize('admin', 'instructor'),
    validate(createCategorySchema),
    createCategory
  );

router.route('/:id').delete(protect, authorize('admin'), deleteCategory);

export default router;
