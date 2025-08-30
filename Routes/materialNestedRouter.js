import express from 'express';
import { validate } from '../Middleware/validate.js';
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
  .get(getMaterialsByCourseId)
  .post(validate(createMaterialSchema), createMaterial);

// GET, PUT, dan DELETE satu materi di dalam sebuah kursus
router
  .route('/:idOrSlug')
  .get(getMaterialById)
  .put(validate(updateMaterialSchema), updateMaterial)
  .delete(deleteMaterial);

// Rute untuk AssignmentSubmission
// POST /api/courses/:courseId/materials/:materialId/assignments/submit
// GET /api/courses/:courseId/materials/:materialId/assignments
router
  .route('/:materialIdOrSlug/assignments')
  .get(getSubmissionsByMaterialId)
  .post(validate(createSubmissionSchema), createSubmission);

// Rute untuk TestResult
// POST /api/courses/:courseId/materials/:materialId/tests/submit
// GET /api/courses/:courseId/materials/:materialId/tests
router
  .route('/:materialIdOrSlug/tests')
  .get(getTestResultsByMaterialId)
  .post(validate(createTestResultSchema), createTestResult);

// Rute untuk ForumPost
// POST /api/courses/:courseId/materials/:materialId/forum/posts
// GET /api/courses/:courseId/materials/:materialId/forum/posts
router
  .route('/:materialIdOrSlug/forum/posts')
  .get(getPostsByMaterialId)
  .post(validate(createForumPostSchema), createForumPost);

export default router;
