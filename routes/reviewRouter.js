// dibelajar.in-nodejs-backend/routes/reviewRouter.js

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

// Opsi { mergeParams: true } penting agar bisa mengakses :courseIdOrSlug dari parent router
const router = express.Router({ mergeParams: true });

// Rute untuk mendapatkan semua ulasan (publik) dan menambah ulasan baru (terproteksi)
router.route('/').get(getReviews).post(protect, loadCourse, addReview);

// Rute baru untuk mengelola ulasan pengguna yang sedang login
// Pastikan rute ini berada di dalam file reviewRouter.js
router
  .route('/my')
  .get(protect, loadCourse, getMyReview) // Mendapatkan ulasan milik sendiri
  .put(protect, loadCourse, updateReview) // Memperbarui ulasan milik sendiri
  .delete(protect, loadCourse, deleteReview); // Menghapus ulasan milik sendiri

export default router;
