
import { Router } from 'express';
import { getAllStudents, getStudentById, createStudent, updateStudent } from '../controllers/student.controller';

const router = Router();

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);

export default router;