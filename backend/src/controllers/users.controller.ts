import { Response } from 'express';
import { User, Skill, Resume } from '../models/index';
import { sendSuccess, sendError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return sendError(res, 'User not found', 404);

    const skills = await Skill.find({ userId: req.userId });
    const resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });

    return sendSuccess(res, { user, skills, resume });
  } catch (error) {
    return sendError(res, 'Failed to get profile', 500);
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { name, avatar }, { new: true });
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (error) {
    return sendError(res, 'Failed to update profile', 500);
  }
}

export async function addSkill(req: AuthRequest, res: Response) {
  try {
    const { name, level, category } = req.body;
    if (!name || !level || !category) {
      return sendError(res, 'Name, level, and category are required');
    }
    const skill = await Skill.create({ userId: req.userId, name, level, category });
    return sendSuccess(res, skill, 201);
  } catch (error) {
    return sendError(res, 'Failed to add skill', 500);
  }
}

export async function uploadResume(req: AuthRequest, res: Response) {
  try {
    const { content } = req.body;
    if (!content) return sendError(res, 'Content is required');
    const resume = await Resume.create({ userId: req.userId, content });
    return sendSuccess(res, resume, 201);
  } catch (error) {
    return sendError(res, 'Failed to upload resume', 500);
  }
}
