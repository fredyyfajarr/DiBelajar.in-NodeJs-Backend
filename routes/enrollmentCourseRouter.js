import express from 'express';
import {
  findEnrollmentByCourseId,
  getStudentProgressInCourse,
} from '../controllers/EnrollmentController.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(findEnrollmentByCourseId);
router.route('/:userId').get(getStudentProgressInCourse);

export default router;
