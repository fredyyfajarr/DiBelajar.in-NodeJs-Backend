import express from 'express';
import { validate } from '../middlewares/validate.js';
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken, // Impor fungsi baru
} from '../controllers/AuthController.js';
import { registerUserSchema } from '../validation/user.validation.js';
import { protect } from '../middlewares/authMiddleware.js'; // Impor protect

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(validate(registerUserSchema), register);

// Rute logout sekarang memerlukan proteksi untuk memastikan hanya user terotentikasi yang bisa logout
router.route('/logout').post(protect, logout);

// Rute untuk mendapatkan access token baru
router.route('/refresh-token').post(refreshToken);

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);

export default router;
