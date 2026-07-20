import { Router } from 'express';
import { register, login, googleAuth, demoLogin, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/index';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, validate(googleAuthSchema), googleAuth);
router.post('/demo', authLimiter, demoLogin);
router.get('/me', authenticate, getMe);

export default router;
