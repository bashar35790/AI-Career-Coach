import { Response } from 'express';
import { generateCoverLetter, generateInterviewQuestions, improveResume, generateRoadmap, chatStream, analyzeResume } from '../services/ai.service';
import { CoverLetter, Conversation } from '../models/index';
import { sendSuccess, sendError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';

export async function coverLetter(req: AuthRequest, res: Response) {
  try {
    const { jobTitle, company, skills, length = 'medium' } = req.body;

    const content = await generateCoverLetter({ jobTitle, company, skills: skills || '', length });

    if (req.userId) {
      await CoverLetter.create({ userId: req.userId, jobTitle, company, content });
    }

    return sendSuccess(res, { content });
  } catch (error: any) {
    return sendError(res, error?.error?.message || error?.message || 'Failed to generate cover letter', 500);
  }
}

export async function interviewQuestions(req: AuthRequest, res: Response) {
  try {
    const { role, experience, count = 10 } = req.body;

    const content = await generateInterviewQuestions({ role, experience: experience || 'mid-level', count: Math.min(count, 20) });
    let questionsArr: { question: string; answer: string }[] = [];
    try {
      const parsed = JSON.parse(content);
      questionsArr = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    } catch {
      questionsArr = [{ question: 'Failed to parse questions', answer: content }];
    }
    return sendSuccess(res, { questions: questionsArr });
  } catch (error: any) {
    return sendError(res, error?.error?.message || error?.message || 'Failed to generate questions', 500);
  }
}

export async function resumeImprove(req: AuthRequest, res: Response) {
  try {
    const { content, targetRole } = req.body;

    const improved = await improveResume({ content, targetRole });
    return sendSuccess(res, { improved });
  } catch (error: any) {
    return sendError(res, error?.error?.message || error?.message || 'Failed to improve resume', 500);
  }
}

export async function roadmap(req: AuthRequest, res: Response) {
  try {
    const { currentSkills, targetRole, timeline = '6 months' } = req.body;

    const content = await generateRoadmap({ currentSkills, targetRole, timeline });
    let roadmapData: Record<string, unknown> = { phases: [] };
    try {
      const parsed = JSON.parse(content);
      roadmapData = parsed.roadmap || parsed;
    } catch {
      roadmapData = { phases: [{ title: 'Error', duration: 'N/A', tasks: ['Failed to parse roadmap'] }] };
    }
    return sendSuccess(res, { roadmap: roadmapData });
  } catch (error: any) {
    const message = error?.error?.message || error?.message || 'Failed to generate roadmap';
    return sendError(res, message, 500);
  }
}

export async function chat(req: AuthRequest, res: Response) {
  try {
    const { message, conversationId } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.userId,
        title: message.slice(0, 50),
        messages: [],
      });
    }

    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() });
    const messagesForAI = conversation.messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    let fullResponse = '';
    await chatStream(messagesForAI, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    conversation.messages.push({ role: 'assistant', content: fullResponse, timestamp: new Date() });
    await conversation.save();

    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.end();
  } catch (error: any) {
    const msg = error?.error?.message || error?.message || 'Chat failed';
    if (!res.headersSent) {
      return sendError(res, msg, 500);
    }
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
}

export async function resumeAnalyze(req: AuthRequest, res: Response) {
  try {
    const { content } = req.body;

    const analysis = await analyzeResume(content);
    let analysisData: Record<string, unknown> = {};
    try {
      analysisData = JSON.parse(analysis);
    } catch {
      analysisData = { error: 'Failed to parse analysis', raw: analysis };
    }
    return sendSuccess(res, { analysis: analysisData });
  } catch (error: any) {
    return sendError(res, error?.error?.message || error?.message || 'Failed to analyze resume', 500);
  }
}

export async function getConversations(req: AuthRequest, res: Response) {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [conversations, total] = await Promise.all([
      Conversation.find({ userId: req.userId })
        .select('title createdAt')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Conversation.countDocuments({ userId: req.userId }),
    ]);
    return sendSuccess(res, {
      conversations,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch conversations', 500);
  }
}

export async function getConversation(req: AuthRequest, res: Response) {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.userId });
    if (!conversation) return sendError(res, 'Conversation not found', 404);
    return sendSuccess(res, conversation);
  } catch (error) {
    return sendError(res, 'Failed to fetch conversation', 500);
  }
}
