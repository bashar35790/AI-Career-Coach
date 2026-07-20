import { Router } from 'express';
import { getProfile, updateProfile, addSkill, uploadResume } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema, addSkillSchema, uploadResumeSchema } from '../validators/index';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/skills', authenticate, validate(addSkillSchema), addSkill);
router.post('/resume', authenticate, validate(uploadResumeSchema), uploadResume);

export default router;
