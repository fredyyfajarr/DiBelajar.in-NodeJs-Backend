import express from 'express';
import { getDashboardStats } from '../controllers/StatsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Endpoint ini hanya bisa diakses oleh admin yang sudah login
router.route('/').get(protect, authorize('admin'), getDashboardStats);

export default router;
