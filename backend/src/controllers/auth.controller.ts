import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';
import { config } from '../config/index';
import { sendSuccess, sendError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 'Email already registered', 409);
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    const token = generateToken(user._id.toString());
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } }, 201);
  } catch (error) {
    return sendError(res, 'Registration failed', 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id.toString());
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return sendError(res, 'Login failed', 500);
  }
}

export async function googleAuth(req: Request, res: Response) {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return sendError(res, 'Email and googleId are required');
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId, avatar });
    }

    const token = generateToken(user._id.toString());
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    return sendError(res, 'Google auth failed', 500);
  }
}

export async function demoLogin(req: Request, res: Response) {
  try {
    const demoEmail = 'demo@example.com';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const hashed = await bcrypt.hash('demo123456', 12);
      user = await User.create({ name: 'Demo User', email: demoEmail, password: hashed });
    }

    const token = generateToken(user._id.toString());
    return sendSuccess(res, { token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return sendError(res, 'Demo login failed', 500);
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (error) {
    return sendError(res, 'Failed to get user', 500);
  }
}
