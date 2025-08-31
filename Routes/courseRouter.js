import express from 'express';
import { protect, authorize } from '../Middleware/authMiddleware.js';
import { validate } from '../Middleware/validate.js';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../Controllers/CourseController.js';
import materialNestedRouter from './materialNestedRouter.js';
import enrollmentCourseRouter from './enrollmentCourseRouter.js';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validation/course.validation.js';

const router = express.Router();

router
  .route('/')
  .get(getAllCourses)
  .post(
    protect,
    authorize('admin', 'instructor'),
    validate(createCourseSchema),
    createCourse
  );
router
  .route('/:idOrSlug')
  .get(getCourseById)
  .put(
    protect,
    authorize('admin', 'instructor'),
    validate(updateCourseSchema),
    updateCourse
  )
  .delete(protect, authorize('admin', 'instructor'), deleteCourse);

router.use('/:courseIdOrSlug/materials', protect, materialNestedRouter);
router.use('/:courseIdOrSlug/enrollments', protect, enrollmentCourseRouter);

export default router;
