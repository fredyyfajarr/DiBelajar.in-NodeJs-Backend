import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { loadCourse } from '../middlewares/courseMiddleware.js';
import {
  getReviews,
  addReview,
  getMyReview,
  updateReview,
  deleteReview,
} from '../controllers/ReviewController.js';
import { validate } from '../middlewares/validate.js'; // <-- 1. Impor
import { reviewSchema } from '../validation/review.validation.js'; // <-- 2. Impor

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(loadCourse, getReviews)
  .post(protect, loadCourse, validate(reviewSchema), addReview); // <-- 3. Terapkan di sini

router
  .route('/my')
  .get(protect, loadCourse, getMyReview)
  .put(protect, loadCourse, validate(reviewSchema), updateReview) // <-- 4. Terapkan di sini juga
  .delete(protect, loadCourse, deleteReview);

export default router;
