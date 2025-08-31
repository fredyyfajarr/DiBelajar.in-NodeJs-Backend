import express from 'express';
import { validate } from '../middlewares/validate.js';
import { loadMaterial } from '../middlewares/materialMiddleware.js';
import {
  protect,
  authorize,
  authorizeEnrolled,
} from '../middlewares/authMiddleware.js';
import {
  getMaterialsByCourseId,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from '../controllers/MaterialController.js';
import {
  createSubmission,
  getSubmissionsByMaterialId,
} from '../controllers/AssignmentSubmissionController.js';
import {
  createTestResult,
  getTestResultsByMaterialId,
} from '../controllers/TestResultController.js';
import {
  createForumPost,
  getPostsByMaterialId,
} from '../controllers/ForumPostController.js';

import {
  createMaterialSchema,
  updateMaterialSchema,
} from '../validation/material.validation.js';
import { createSubmissionSchema } from '../validation/assignmentSubmission.validation.js';
import { createTestResultSchema } from '../validation/testResult.validation.js';
import { createForumPostSchema } from '../validation/forumPost.validation.js';

const router = express.Router({ mergeParams: true });

// GET semua materi di sebuah kursus dan POST materi baru
router
  .route('/')
  .get(protect, authorizeEnrolled, getMaterialsByCourseId)
  .post(
    protect,
    authorize('admin', 'instructor'),
    validate(createMaterialSchema),
    createMaterial
  );

// GET, PUT, dan DELETE satu materi di dalam sebuah kursus
router
  .route('/:materialIdOrSlug')
  .get(protect, authorizeEnrolled, loadMaterial, getMaterialById)
  .put(
    protect,
    authorize('admin', 'instructor'),
    loadMaterial,
    validate(updateMaterialSchema),
    updateMaterial
  )
  .delete(
    protect,
    authorize('admin', 'instructor'),
    loadMaterial,
    deleteMaterial
  );

// Rute untuk AssignmentSubmission
// POST /api/courses/:courseId/materials/:materialId/assignments/submit
// GET /api/courses/:courseId/materials/:materialId/assignments
router
  .route('/:materialIdOrSlug/assignments')
  .get(
    protect,
    authorizeEnrolled,
    authorize('admin', 'instructor'),
    loadMaterial,
    getSubmissionsByMaterialId
  )
  .post(
    protect,
    authorize('student'),
    validate(createSubmissionSchema),
    loadMaterial,
    createSubmission
  );

// Rute untuk TestResult
// POST /api/courses/:courseId/materials/:materialId/tests/submit
// GET /api/courses/:courseId/materials/:materialId/tests
router
  .route('/:materialIdOrSlug/tests')
  .get(
    protect,
    authorize('admin', 'instructor'),
    loadMaterial,
    getTestResultsByMaterialId
  )
  .post(
    protect,
    authorize('student'),
    loadMaterial,
    validate(createTestResultSchema),
    createTestResult
  );

// Rute untuk ForumPost
// POST /api/courses/:courseId/materials/:materialId/forum/posts
// GET /api/courses/:courseId/materials/:materialId/forum/posts
router
  .route('/:materialIdOrSlug/forum/posts')
  .get(protect, loadMaterial, getPostsByMaterialId)
  .post(
    protect,
    authorize('admin', 'instructor', 'student'),
    loadMaterial,
    validate(createForumPostSchema),
    createForumPost
  );

export default router;
