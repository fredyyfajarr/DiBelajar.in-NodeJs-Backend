import express from 'express';
import { validate } from '../middlewares/validate.js';
import {
  protect,
  authorize,
  authorizeSelfOraAdmin,
} from '../middlewares/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/UserController.js';
import { getSubmissionsByUserId } from '../controllers/AssignmentSubmissionController.js';
import { getTestResultsByUserId } from '../controllers/TestResultController.js';
import { getPostsByUserId } from '../controllers/ForumPostController.js';

import enrollmenrUserRouter from './enrollmentUserRouter.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validation/user.validation.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getAllUsers)
  .post(protect, authorize('admin'), validate(createUserSchema), createUser);

router.route('/:idOrSlug').delete(protect, authorize('admin'), deleteUser);

router
  .route('/:idOrSlug')
  .get(protect, authorizeSelfOraAdmin, getUserById)
  .put(protect, authorizeSelfOraAdmin, validate(updateUserSchema), updateUser);

router.use(
  '/:userIdOrSlug/enrollments',
  protect,
  authorizeSelfOraAdmin,
  enrollmenrUserRouter
); // rute induk

router
  .route('/:userIdOrSlug/assignments')
  .get(protect, authorizeSelfOraAdmin, getSubmissionsByUserId);
router
  .route('/:userIdOrSlug/tests')
  .get(protect, authorizeSelfOraAdmin, getTestResultsByUserId);
router
  .route('/:userIdOrSlug/forum/posts')
  .get(protect, authorizeSelfOraAdmin, getPostsByUserId);

export default router;
