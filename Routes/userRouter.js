import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../Controllers/UserController.js';

import {
  findEnrollmentByUserId,
  createEnrollment,
  removeEnrollment,
} from '../Controllers/EnrollmentController.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

router
  .route('/:userId/enrollments')
  .get(findEnrollmentByUserId)
  .post(createEnrollment);
router.route('/:userId/enrollments/:courseId').delete(removeEnrollment);

export default router;
