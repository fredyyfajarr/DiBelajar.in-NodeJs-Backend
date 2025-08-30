import express from 'express';
import { validate } from '../Middleware/validate.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../Controllers/UserController.js';
import { getSubmissionsByUserId } from '../Controllers/AssignmentSubmissionController.js';
import { getTestResultsByUserId } from '../Controllers/TestResultController.js';
import { getPostsByUserId } from '../Controllers/ForumPostController.js';

import enrollmenrUserRouter from './enrollmentUserRouter.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validation/user.validation.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(validate(createUserSchema), createUser);

router
  .route('/:idOrSlug')
  .get(getUserById)
  .put(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

router.use('/:userIdOrSlug/enrollments', enrollmenrUserRouter); // rute induk

router.route('/:userIdOrSlug/assignments').get(getSubmissionsByUserId);
router.route('/:userIdOrSlug/tests').get(getTestResultsByUserId);
router.route('/:userIdOrSlug/forum/posts').get(getPostsByUserId);

export default router;
