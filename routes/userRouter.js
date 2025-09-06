import express from 'express';
import { validate } from '../middlewares/validate.js';
import { loadUser } from '../middlewares/userMiddleware.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import {
  protect,
  authorize,
  authorizeSelfOrAdmin,
} from '../middlewares/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
} from '../controllers/UserController.js';
import { getSubmissionsByUserId } from '../controllers/AssignmentSubmissionController.js';
import { getTestResultsByUserId } from '../controllers/TestResultController.js';
import { getPostsByUserId } from '../controllers/ForumPostController.js';

import enrollmentUserRouter from './enrollmentUserRouter.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validation/user.validation.js';

import User from '../models/User.js';

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    authorize('admin'),
    advancedResults(User, null, ['name', 'email']),
    getAllUsers
  )
  .post(protect, authorize('admin'), validate(createUserSchema), createUser);

router.route('/:idOrSlug');

router.route('/:idOrSlug/profile').get(loadUser, getUserProfile);

router
  .route('/:idOrSlug')
  .get(protect, loadUser, authorizeSelfOrAdmin, getUserById)
  .put(
    protect,
    loadUser,
    authorizeSelfOrAdmin,
    validate(updateUserSchema),
    updateUser
  )
  .delete(protect, loadUser, authorizeSelfOrAdmin, deleteUser);

router.use(
  '/:userIdOrSlug/enrollments',
  protect,
  loadUser,
  authorizeSelfOrAdmin,
  enrollmentUserRouter
); // rute induk

router
  .route('/:userIdOrSlug/assignments')
  .get(protect, loadUser, authorizeSelfOrAdmin, getSubmissionsByUserId);
router
  .route('/:userIdOrSlug/tests')
  .get(protect, loadUser, authorizeSelfOrAdmin, getTestResultsByUserId);
router
  .route('/:userIdOrSlug/forum/posts')
  .get(protect, loadUser, authorizeSelfOrAdmin, getPostsByUserId);

export default router;
