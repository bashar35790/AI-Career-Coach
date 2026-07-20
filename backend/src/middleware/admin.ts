import { Response, NextFunction } from 'express';
import { User } from '../models/index';
import { sendError } from '../utils/response';
import type { AuthRequest } from './auth';

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return sendError(res, 'Admin access required', 403);
    }
    next();
  } catch {
    return sendError(res, 'Failed to verify admin status', 500);
  }
}
