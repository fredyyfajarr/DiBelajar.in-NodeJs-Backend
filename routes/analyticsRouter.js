import express from 'express';
import { getCourseAnalytics } from '../controllers/StatsController.js';
// Middleware yang dibutuhkan
import { protect } from '../middlewares/authMiddleware.js';
import { loadCourse } from '../middlewares/courseMiddleware.js';
import { authorizeCourseOwner } from '../middlewares/ownershipMiddleware.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, loadCourse, authorizeCourseOwner, getCourseAnalytics);

export default router;
