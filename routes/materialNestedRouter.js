// src/routes/materialNestedRouter.js

import express from 'express';
import { validate } from '../middlewares/validate.js';
import { loadMaterial } from '../middlewares/materialMiddleware.js';
import { uploadAssignment } from '../utils/multerConfig.js';
import {
  protect,
  authorize,
  authorizeEnrolled,
} from '../middlewares/authMiddleware.js';
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
import {
  createMaterialSchema,
  updateMaterialSchema,
} from '../validation/material.validation.js';
import { createSubmissionSchema } from '../validation/assignmentSubmission.validation.js';
import { createTestResultSchema } from '../validation/testResult.validation.js';
import { createForumPostSchema } from '../validation/forumPost.validation.js';

const router = express.Router({ mergeParams: true });

// GET semua materi (Partisipan sah boleh lihat)
router
  .route('/')
  .get(getMaterialsByCourseId)
  // POST materi baru (Hanya admin/pemilik)
  .post(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    validate(createMaterialSchema),
    createMaterial
  );

// GET satu materi (Partisipan sah boleh lihat)
router
  .route('/:materialIdOrSlug')
  .get(loadMaterial, getMaterialById)
  // PUT & DELETE (Hanya admin/pemilik)
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

// GET submissions (Hanya admin/pemilik)
router
  .route('/:materialIdOrSlug/assignments')
  .get(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    loadMaterial,
    getSubmissionsByMaterialId
  )
  // POST submission (Hanya student)
  .post(
    authorize('student'),
    uploadAssignment.single('submissionFile'),
    loadMaterial,
    createSubmission
  );

// GET test results (Hanya admin/pemilik)
router
  .route('/:materialIdOrSlug/tests')
  .get(
    authorize('admin', 'instructor'),
    authorizeCourseOwner,
    loadMaterial,
    getTestResultsByMaterialId
  )
  // POST test result (Hanya student)
  .post(
    authorize('student'),
    loadMaterial,
    validate(createTestResultSchema),
    createTestResult
  );

// GET & POST Forum (Semua partisipan sah boleh)
router
  .route('/:materialIdOrSlug/forum/posts')
  .get(loadMaterial, getPostsByMaterialId)
  .post(loadMaterial, validate(createForumPostSchema), createForumPost);

export default router;
