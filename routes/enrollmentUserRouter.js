import express from 'express';
import {
  findEnrollmentByUserId,
  removeEnrollment,
} from '../controllers/EnrollmentController.js';
import { loadCourse } from '../middlewares/courseMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(findEnrollmentByUserId);

router.route('/:courseIdOrSlug').delete(loadCourse, removeEnrollment);

export default router;
