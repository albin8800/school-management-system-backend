import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import { getClasses, getStudents } from '../../controllers/admin/adminStudents.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', getStudents);
router.get('/classes', getClasses);

export default router;