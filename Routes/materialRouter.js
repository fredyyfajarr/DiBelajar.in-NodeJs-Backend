import express from 'express';
import { getAllMaterials } from '../Controllers/MaterialController.js';

const router = express.Router();

router.route('/').get(getAllMaterials);

export default router;
