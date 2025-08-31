import express from 'express';
import { validate } from '../Middleware/validate.js';
import {
  protect,
  authorize,
  authorizeEnrolled,
} from '../Middleware/authMiddleware.js';
import {
  getMaterialsByCourseId,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from '../Controllers/MaterialController.js';
import {
  createSubmission,
  getSubmissionsByMaterialId,
} from '../Controllers/AssignmentSubmissionController.js';
import {
  createTestResult,
  getTestResultsByMaterialId,
} from '../Controllers/TestResultController.js';
import {
  createForumPost,
  getPostsByMaterialId,
} from '../Controllers/ForumPostController.js';

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
  .get(protect, authorizeEnrolled, getMaterialById)
  .put(
    protect,
    authorize('admin', 'instructor'),
    validate(updateMaterialSchema),
    updateMaterial
  )
  .delete(protect, authorize('admin', 'instructor'), deleteMaterial);

// Rute untuk AssignmentSubmission
// POST /api/courses/:courseId/materials/:materialId/assignments/submit
// GET /api/courses/:courseId/materials/:materialId/assignments
router
  .route('/:materialIdOrSlug/assignments')
  .get(
    protect,
    authorizeEnrolled,
    authorize('admin', 'instructor'),
    getSubmissionsByMaterialId
  )
  .post(
    protect,
    authorize('student'),
    validate(createSubmissionSchema),
    createSubmission
  );

// Rute untuk TestResult
// POST /api/courses/:courseId/materials/:materialId/tests/submit
// GET /api/courses/:courseId/materials/:materialId/tests
router
  .route('/:materialIdOrSlug/tests')
  .get(protect, authorize('admin', 'instructor'), getTestResultsByMaterialId)
  .post(
    protect,
    authorize('student'),
    validate(createTestResultSchema),
    createTestResult
  );

// Rute untuk ForumPost
// POST /api/courses/:courseId/materials/:materialId/forum/posts
// GET /api/courses/:courseId/materials/:materialId/forum/posts
router
  .route('/:materialIdOrSlug/forum/posts')
  .get(protect, getPostsByMaterialId)
  .post(
    protect,
    authorize('admin', 'instructor', 'student'),
    validate(createForumPostSchema),
    createForumPost
  );

export default router;
