import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../Controllers/CourseController.js';
import materialNestedRouter from './materialNestedRouter.js'; // Impor router material
import enrollmentCourseRouter from './enrollmentCourseRouter.js'; // Impor router enrollment
import { validate } from '../Middleware/validate.js';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validation/course.validation.js';

const router = express.Router();

router
  .route('/')
  .get(getAllCourses)
  .post(validate(createCourseSchema), createCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(validate(updateCourseSchema), updateCourse)
  .delete(deleteCourse);

router.use('/:courseId/materials', materialNestedRouter);
router.use('/:courseId/enrollments', enrollmentCourseRouter);

export default router;
