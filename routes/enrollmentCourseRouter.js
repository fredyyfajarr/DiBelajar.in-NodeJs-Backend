import express from 'express';
import {
  findEnrollmentByCourseId,
  getStudentProgressInCourse,
} from '../controllers/EnrollmentController.js';
import { loadUser } from '../middlewares/userMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(findEnrollmentByCourseId);
router.route('/:userIdOrSlug').get(loadUser, getStudentProgressInCourse);

export default router;
