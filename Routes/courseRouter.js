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

import { validate } from '../Middleware/validate.js';
import {
  createCourseSchema,
  updateCourseSchema,
} from '../validation/course.validation.js';
import {
  createMaterialSchema,
  updateMaterialSchema,
} from '../validation/material.validation.js';

const router = express.Router();

// Rute untuk operasi pada entitas Course secara mandiri
router
  .route('/')
  .get(getAllCourses)
  .post(validate(createCourseSchema), createCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(validate(updateCourseSchema), updateCourse)
  .delete(deleteCourse);

// Rute bersarang untuk operasi pada entitas Material
router
  .route('/:courseId/materials')
  .get(getMaterialsByCourseId)
  .post(validate(createMaterialSchema), createMaterial);
router
  .route('/:courseId/materials/:id')
  .get(getMaterialById)
  .put(validate(updateMaterialSchema), updateMaterial)
  .delete(deleteMaterial);

// Rute bersarang untuk operasi pada entitas Enrollment
router
  .route('/:courseId/enrollments')
  .get(findEnrollmentByCourseId)
  .post(createEnrollment);
router.route('/:courseId/enrollments/:userId').delete(removeEnrollment);

export default router;
