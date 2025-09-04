// src/routes/courseRouter.js

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
import { enrollInCourse } from '../controllers/EnrollmentController.js';
import materialNestedRouter from './materialNestedRouter.js';
import enrollmentCourseRouter from './enrollmentCourseRouter.js';
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
    advancedResults(Course, 'instructorId', ['title', 'description']),
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
  .get(loadCourse, getCourseAndMaterialsById)
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

// --- PERUBAHAN UTAMA DI BLOK INI ---
router.use(
  '/:courseIdOrSlug/materials',
  protect, // Pastikan user sudah login
  loadCourse, // Muat data kursus
  authorizeEnrolled, // Pastikan user adalah partisipan sah (terdaftar, atau admin/pemilik)
  materialNestedRouter // Lanjutkan ke rute-rute spesifik materi
);
// --- AKHIR PERUBAHAN ---

router.use(
  '/:courseIdOrSlug/enrollments',
  protect,
  authorize('admin', 'instructor'),
  loadCourse,
  authorizeCourseOwner,
  enrollmentCourseRouter
);

export default router;
