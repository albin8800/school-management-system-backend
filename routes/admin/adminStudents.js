import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import { addStudent, getClasses, getStudentById, getStudents } from '../../controllers/admin/adminStudents.js';

const router = express.Router();



router.get('/', adminAuth, getStudents);
router.get('/classes', adminAuth, getClasses);

router.post("/add-student", adminAuth, addStudent);

router.get('/students/:id', adminAuth, getStudentById);

export default router;