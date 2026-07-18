import { Router } from 'express';
import { register, login, googleAuth, demoLogin, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/demo', demoLogin);
router.get('/me', authenticate, getMe);

export default router;
