import { Router } from 'express';
import { getProfile, updateProfile, addSkill, uploadResume } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/skills', authenticate, addSkill);
router.post('/resume', authenticate, uploadResume);

export default router;
