import express from 'express';
import { protect, authorize } from '../Middleware/authMiddleware.js';
import { findAllEnrollments } from '../Controllers/EnrollmentController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin', 'instructor'), findAllEnrollments);

export default router;
