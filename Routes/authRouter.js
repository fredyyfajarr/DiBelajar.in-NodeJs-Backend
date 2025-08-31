import express from 'express';

import { validate } from '../Middleware/validate.js';
import { login, register, logout } from '../Controllers/AuthController.js';
import { registerUserSchema } from '../validation/user.validation.js';

const router = express.Router();

router.route('/login').post(login);

router.route('/register').post(validate(registerUserSchema), register);

router.route('/logout').post(logout);

export default router;
