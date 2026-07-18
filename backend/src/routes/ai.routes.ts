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

const router = Router();

router.post('/cover-letter', authenticate, coverLetter);
router.post('/interview-questions', authenticate, interviewQuestions);
router.post('/improve-resume', authenticate, resumeImprove);
router.post('/roadmap', authenticate, roadmap);
router.post('/chat', authenticate, chat);
router.post('/analyze-resume', authenticate, resumeAnalyze);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getConversation);

export default router;
