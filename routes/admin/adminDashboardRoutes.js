import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js'
import { getClassAttendance, getDashboardSummary, getUserDistribution } from '../../controllers/admin/adminDashboard.js';


const router = express.Router();

router.get('/summary', adminAuth, getDashboardSummary);
router.get('/class-attendance', adminAuth, getClassAttendance);
router.get('/user-distribution', adminAuth, getUserDistribution);

export default router;