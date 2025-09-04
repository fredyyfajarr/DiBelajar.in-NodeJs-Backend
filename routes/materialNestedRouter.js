import express from 'express';
import { validate } from '../middlewares/validate.js';
import { loadMaterial } from '../middlewares/materialMiddleware.js';
import { uploadAssignment } from '../utils/multerConfig.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { authorizeCourseOwner } from '../middlewares/ownershipMiddleware.js';
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
import { updateUserProgress } from '../controllers/EnrollmentController.js'; // 1. Impor controller progress
import {
  createMaterialSchema,
  updateMaterialSchema,
} from '../validation/material.validation.js';
import { createTestResultSchema } from '../validation/testResult.validation.js';
import { createForumPostSchema } from '../validation/forumPost.validation.js';

const router = express.Router({ mergeParams: true });

// GET semua materi & POST materi baru
router
  .route('/')
  .get(getMaterialsByCourseId)
  .post(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    validate(createMaterialSchema),
    createMaterial
  );

// GET, PUT, DELETE satu materi
router
  .route('/:materialIdOrSlug')
  .get(loadMaterial, getMaterialById)
  .put(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    loadMaterial,
    validate(updateMaterialSchema),
    updateMaterial
  )
  .delete(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    loadMaterial,
    deleteMaterial
  );

// GET & POST submissions
router
  .route('/:materialIdOrSlug/assignments')
  .get(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    loadMaterial,
    getSubmissionsByMaterialId
  )
  .post(
    authorize('student'),
    uploadAssignment.single('submissionFile'),
    loadMaterial,
    createSubmission
  );

// GET & POST test results
router
  .route('/:materialIdOrSlug/tests')
  .get(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    loadMaterial,
    getTestResultsByMaterialId
  )
  .post(
    authorize('student'),
    loadMaterial,
    validate(createTestResultSchema),
    createTestResult
  );

// GET & POST Forum
router
  .route('/:materialIdOrSlug/forum/posts')
  .get(loadMaterial, getPostsByMaterialId)
  .post(loadMaterial, validate(createForumPostSchema), createForumPost);

// 2. TAMBAHKAN RUTE INI
// PUT untuk update progress
router.route('/:materialIdOrSlug/progress').put(
  authorize('student'), // Hanya student yang bisa update progress-nya sendiri
  loadMaterial, // Pastikan material dimuat
  updateUserProgress
);

export default router;
