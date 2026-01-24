import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import { addStudent, deleteStudent, getClasses, getStudentById, getStudents, updateStudent } from '../../controllers/admin/adminStudents.js';

const router = express.Router();



router.get('/', adminAuth, getStudents);
router.get('/classes', adminAuth, getClasses);

router.post("/add-student", adminAuth, addStudent);

router.get('/:id', adminAuth, getStudentById);

router.put('/:id', adminAuth, updateStudent);

router.delete('/:id', adminAuth, deleteStudent);

export default router;