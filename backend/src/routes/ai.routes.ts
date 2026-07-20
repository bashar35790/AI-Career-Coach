import { Router } from 'express';
import {
  coverLetter,
  interviewQuestions,
  resumeImprove,
  roadmap,
  chat,
  resumeAnalyze,
  getConversations,
  getConversation,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  coverLetterSchema,
  interviewQuestionsSchema,
  improveResumeSchema,
  roadmapSchema,
  chatSchema,
  analyzeResumeSchema,
} from '../validators/index';

const router = Router();

router.post('/cover-letter', authenticate, validate(coverLetterSchema), coverLetter);
router.post('/interview-questions', authenticate, validate(interviewQuestionsSchema), interviewQuestions);
router.post('/improve-resume', authenticate, validate(improveResumeSchema), resumeImprove);
router.post('/roadmap', authenticate, validate(roadmapSchema), roadmap);
router.post('/chat', authenticate, validate(chatSchema), chat);
router.post('/analyze-resume', authenticate, validate(analyzeResumeSchema), resumeAnalyze);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getConversation);

export default router;
