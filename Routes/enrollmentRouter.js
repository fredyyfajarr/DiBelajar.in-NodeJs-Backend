import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { findAllEnrollments } from '../controllers/EnrollmentController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin', 'instructor'), findAllEnrollments);

export default router;
