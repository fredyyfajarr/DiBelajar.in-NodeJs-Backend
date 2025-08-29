import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../Controllers/CourseController.js';
import {
  getMaterialsByCourseId,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from '../Controllers/MaterialController.js';
import {
  findEnrollmentByCourseId,
  createEnrollment,
  removeEnrollment,
} from '../Controllers/EnrollmentController.js';

const router = express.Router();

// Rute untuk operasi pada entitas Course secara mandiri
router.route('/').get(getAllCourses).post(createCourse);
router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse);

// Rute bersarang untuk operasi pada entitas Material
router
  .route('/:courseId/materials')
  .get(getMaterialsByCourseId) // Mengambil semua materi dari courseId tertentu
  .post(createMaterial); // Membuat materi baru di courseId tertentu

router
  .route('/:courseId/materials/:id')
  .get(getMaterialById)
  .put(updateMaterial)
  .delete(deleteMaterial);

// Rute bersarang untuk operasi pada entitas Enrollment
router
  .route('/:courseId/enrollments')
  .get(findEnrollmentByCourseId)
  .post(createEnrollment);
router.route('/:courseId/enrollments/:userId').delete(removeEnrollment);

export default router;
