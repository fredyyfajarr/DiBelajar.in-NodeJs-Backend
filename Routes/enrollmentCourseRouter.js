import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { findEnrollmentByCourseId } from '../controllers/EnrollmentController.js';

const router = express.Router({ mergeParams: true });

// Rute GET di bawah course
router
  .route('/')
  .get(protect, authorize('admin', 'instructor'), findEnrollmentByCourseId);

export default router;
