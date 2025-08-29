// Routes/enrollmentUserRouter.js
import express from 'express';
import {
  findEnrollmentByUserId,
  createEnrollment,
  removeEnrollment,
} from '../Controllers/EnrollmentController.js';
import { validate } from '../Middleware/validate.js';
import { createEnrollmentSchema } from '../validation/enrollment.validation.js';

const router = express.Router({ mergeParams: true });

// Rute GET dan POST di bawah user
router
  .route('/')
  .get(findEnrollmentByUserId)
  .post(validate(createEnrollmentSchema), createEnrollment);

// Rute DELETE di bawah user
router.route('/:courseId').delete(removeEnrollment);

export default router;
