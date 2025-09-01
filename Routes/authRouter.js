import express from 'express';

import { validate } from '../middlewares/validate.js';
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/AuthController.js';
import { registerUserSchema } from '../validation/user.validation.js';

const router = express.Router();

router.route('/login').post(login);

router.route('/register').post(validate(registerUserSchema), register);

router.route('/logout').post(logout);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password/:token').post(resetPassword);

export default router;
