import express from 'express';
import {
  protect,
  authorize,
  authorizeEnrolled,
} from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { loadCourse } from '../middlewares/courseMiddleware.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import { authorizeCourseOwner } from '../middlewares/ownershipMiddleware.js';
import { uploadThumbnail } from '../utils/multerConfig.js';
import {
  getAllCourses,
  getCourseAndMaterialsById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/CourseController.js';
import {
  enrollInCourse,
  getCertificateData,
} from '../controllers/EnrollmentController.js';
import materialNestedRouter from './materialNestedRouter.js';
import enrollmentCourseRouter from './enrollmentCourseRouter.js';
import reviewRouter from './reviewRouter.js';
import analyticsRouter from './analyticsRouter.js';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validation/course.validation.js';
import Course from '../models/Course.js';
import { populateUser } from '../middlewares/populateUser.js';

const router = express.Router();

router
  .route('/')
  .get(
    populateUser,
    advancedResults(
      Course,
      ['instructorId', 'category'],
      ['title', 'description']
    ),
    getAllCourses
  )
  .post(
    protect,
    authorize('admin', 'instructor'),
    uploadThumbnail.single('thumbnail'),
    validate(createCourseSchema),
    createCourse
  );

router
  .route('/:idOrSlug')
  .get(populateUser, loadCourse, getCourseAndMaterialsById)
  .put(
    protect,
    authorize('admin', 'instructor'),
    loadCourse,
    authorizeCourseOwner,
    uploadThumbnail.single('thumbnail'),
    validate(updateCourseSchema),
    updateCourse
  )
  .delete(
    protect,
    authorize('admin', 'instructor'),
    loadCourse,
    authorizeCourseOwner,
    deleteCourse
  );

router
  .route('/:idOrSlug/enrollments')
  .post(protect, loadCourse, enrollInCourse);

router
  .route('/:idOrSlug/certificate-data')
  .get(protect, loadCourse, getCertificateData);

router.use(
  '/:courseIdOrSlug/materials',
  protect,
  loadCourse,
  authorizeEnrolled,
  materialNestedRouter
);

router.use(
  '/:courseIdOrSlug/enrollments',
  protect,
  authorize('admin', 'instructor'),
  loadCourse,
  authorizeCourseOwner,
  enrollmentCourseRouter
);

router.use('/:courseIdOrSlug/reviews', reviewRouter);

router.use('/:courseIdOrSlug/analytics', analyticsRouter);

export default router;
