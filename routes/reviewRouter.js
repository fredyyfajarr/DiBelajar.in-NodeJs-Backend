import express from 'express';
import { getReviews, addReview } from '../controllers/ReviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { loadCourse } from '../middlewares/courseMiddleware.js';

// Opsi { mergeParams: true } penting agar bisa mengakses :courseIdOrSlug dari parent router
const router = express.Router({ mergeParams: true });

router.route('/').get(getReviews).post(protect, loadCourse, addReview); // Hanya user yang login yang bisa post review

export default router;
