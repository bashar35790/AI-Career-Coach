import { Response } from 'express';
import { generateCoverLetter, generateInterviewQuestions, improveResume, generateRoadmap, chatStream, analyzeResume } from '../services/ai.service';
import { CoverLetter, Conversation } from '../models/index';
import { sendSuccess, sendError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';

export async function coverLetter(req: AuthRequest, res: Response) {
  try {
    const { jobTitle, company, skills, length = 'medium' } = req.body;
    if (!jobTitle || !company) return sendError(res, 'Job title and company are required');

    const content = await generateCoverLetter({ jobTitle, company, skills: skills || '', length });

    if (req.userId) {
      await CoverLetter.create({ userId: req.userId, jobTitle, company, content });
    }

    return sendSuccess(res, { content });
  } catch (error) {
    return sendError(res, 'Failed to generate cover letter', 500);
  }
}

export async function interviewQuestions(req: AuthRequest, res: Response) {
  try {
    const { role, experience, count = 10 } = req.body;
    if (!role) return sendError(res, 'Role is required');

    const content = await generateInterviewQuestions({ role, experience: experience || 'mid-level', count: Math.min(count, 20) });
    return sendSuccess(res, { questions: JSON.parse(content) });
  } catch (error) {
    return sendError(res, 'Failed to generate questions', 500);
  }
}

export async function resumeImprove(req: AuthRequest, res: Response) {
  try {
    const { content, targetRole } = req.body;
    if (!content) return sendError(res, 'Resume content is required');

    const improved = await improveResume({ content, targetRole });
    return sendSuccess(res, { improved });
  } catch (error) {
    return sendError(res, 'Failed to improve resume', 500);
  }
}

export async function roadmap(req: AuthRequest, res: Response) {
  try {
    const { currentSkills, targetRole, timeline = '6 months' } = req.body;
    if (!currentSkills || !targetRole) return sendError(res, 'Current skills and target role are required');

    const content = await generateRoadmap({ currentSkills, targetRole, timeline });
    return sendSuccess(res, { roadmap: JSON.parse(content) });
  } catch (error) {
    return sendError(res, 'Failed to generate roadmap', 500);
  }
}

export async function chat(req: AuthRequest, res: Response) {
  try {
    const { message, conversationId } = req.body;
    if (!message) return sendError(res, 'Message is required');

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
  } catch (error) {
    if (!res.headersSent) {
      return sendError(res, 'Chat failed', 500);
    }
    res.write(`data: ${JSON.stringify({ error: 'Chat failed' })}\n\n`);
    res.end();
  }
}

export async function resumeAnalyze(req: AuthRequest, res: Response) {
  try {
    const { content } = req.body;
    if (!content) return sendError(res, 'Resume content is required');

    const analysis = await analyzeResume(content);
    return sendSuccess(res, { analysis: JSON.parse(analysis) });
  } catch (error) {
    return sendError(res, 'Failed to analyze resume', 500);
  }
}

export async function getConversations(req: AuthRequest, res: Response) {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .select('title createdAt')
      .sort({ updatedAt: -1 });
    return sendSuccess(res, conversations);
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
