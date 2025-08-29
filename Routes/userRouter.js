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

import { validate } from '../Middleware/validate.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validation/user.validation.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(validate(createUserSchema), createUser);

router
  .route('/:id')
  .get(getUserById)
  .put(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

router
  .route('/:userId/enrollments')
  .get(findEnrollmentByUserId)
  .post(createEnrollment);
router.route('/:userId/enrollments/:courseId').delete(removeEnrollment);

export default router;
