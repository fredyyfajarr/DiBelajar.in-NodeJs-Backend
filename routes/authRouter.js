import express from 'express';
import { validate } from '../middlewares/validate.js';
import {
  login,
  register,
  logout,
  forgotPassword,
  me,
  resetPassword,
  refreshToken, // Impor fungsi baru
} from '../controllers/AuthController.js';
import {
  forgotPasswordSchema,
  registerUserSchema,
  resetPasswordSchema,
} from '../validation/user.validation.js';
import { protect } from '../middlewares/authMiddleware.js'; // Impor protect

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(validate(registerUserSchema), register);
router.route('/me').get(protect, me);

router.route('/logout').post(logout);

// Rute untuk mendapatkan access token baru
router.route('/refresh-token').post(refreshToken);

router
  .route('/forgot-password')
  .post(validate(forgotPasswordSchema), forgotPassword);
router
  .route('/reset-password/:token')
  .post(validate(resetPasswordSchema), resetPassword);

export default router;
