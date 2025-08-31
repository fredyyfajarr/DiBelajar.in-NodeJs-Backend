import express from 'express';
import { protect, authorize } from '../Middleware/authMiddleware.js';
import { findEnrollmentByCourseId } from '../Controllers/EnrollmentController.js';

const router = express.Router({ mergeParams: true });

// Rute GET di bawah course
router
  .route('/')
  .get(protect, authorize('admin', 'instructor'), findEnrollmentByCourseId);

export default router;
