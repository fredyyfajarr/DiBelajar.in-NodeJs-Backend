import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { loadCourse } from '../middlewares/courseMiddleware.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/CourseController.js';
import { enrollInCourse } from '../Controllers/EnrollmentController.js';
import materialNestedRouter from './materialNestedRouter.js';
import enrollmentCourseRouter from './enrollmentCourseRouter.js';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validation/course.validation.js';
import Course from '../models/Course.js';

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Course), getAllCourses)
  .post(
    protect,
    authorize('admin', 'instructor'),
    validate(createCourseSchema),
    createCourse
  );

router
  .route('/:idOrSlug')
  .get(loadCourse, getCourseById)
  .put(
    protect,
    authorize('admin', 'instructor'),
    loadCourse,
    validate(updateCourseSchema),
    updateCourse
  )
  .delete(protect, authorize('admin', 'instructor'), loadCourse, deleteCourse);

router
  .route('/:idOrSlug/enrollments')
  .post(protect, loadCourse, enrollInCourse);

router.use(
  '/:courseIdOrSlug/materials',
  protect,
  loadCourse,
  materialNestedRouter
);
router.use(
  '/:courseIdOrSlug/enrollments',
  protect,
  loadCourse,
  enrollmentCourseRouter
);

export default router;
