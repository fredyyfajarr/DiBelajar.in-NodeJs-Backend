import express from 'express';
import { advancedResults } from '../middlewares/advancedResults.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { findAllEnrollments } from '../controllers/EnrollmentController.js';
import Enrollment from '../models/Enrollment.js';

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    authorize('admin', 'instructor'),
    advancedResults(Enrollment),
    findAllEnrollments
  );

export default router;
