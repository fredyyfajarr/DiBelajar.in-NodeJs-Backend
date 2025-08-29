// Routes/enrollmentCourseRouter.js
import express from 'express';
import { findEnrollmentByCourseId } from '../Controllers/EnrollmentController.js';

const router = express.Router({ mergeParams: true });

// Rute GET di bawah course
router.route('/').get(findEnrollmentByCourseId);

export default router;
