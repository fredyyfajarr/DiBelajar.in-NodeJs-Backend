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

// --- 2. TAMBAHKAN BLOK KODE DI BAWAH INI SEBELUM "export default router" ---
router.route('/:idOrSlug/certificate-data').get(
  protect, // Pastikan pengguna sudah login
  loadCourse, // Dapatkan data kursus dari URL
  getCertificateData // Panggil controller untuk mengambil data sertifikat
);

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

router.use('/:courseIdOrSlug/reviews', reviewRouter); // Baris ini yang paling penting

router.use('/:courseIdOrSlug/analytics', analyticsRouter);

export default router;
