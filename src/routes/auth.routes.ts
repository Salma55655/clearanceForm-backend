
import { Router } from 'express';
import { login, recoverPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/recover', recoverPassword);

export default router;