import express from 'express';
import { findAllEnrollments } from '../Controllers/EnrollmentController.js';

const router = express.Router();

router.route('/').get(findAllEnrollments);

export default router;
