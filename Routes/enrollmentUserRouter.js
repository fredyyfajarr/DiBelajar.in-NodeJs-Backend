// Routes/enrollmentUserRouter.js
import express from 'express';
import { validate } from '../Middleware/validate.js';
import { authorize, protect } from '../Middleware/authMiddleware.js';
import {
  findEnrollmentByUserId,
  createEnrollment,
  removeEnrollment,
} from '../Controllers/EnrollmentController.js';
import { createEnrollmentSchema } from '../validation/enrollment.validation.js';

const router = express.Router({ mergeParams: true });

// Rute GET dan POST di bawah user
router
  .route('/')
  .get(protect, findEnrollmentByUserId)
  .post(
    protect,
    authorize('admin', 'instructor'),
    validate(createEnrollmentSchema),
    createEnrollment
  );

// Rute DELETE di bawah user
router
  .route('/:courseIdOrSlug')
  .delete(protect, authorize('admin', 'instructor'), removeEnrollment);

export default router;
