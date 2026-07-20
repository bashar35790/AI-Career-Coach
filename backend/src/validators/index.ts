import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  googleId: z.string().min(1, 'Google ID is required'),
  avatar: z.string().optional(),
});

export const createItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  shortDesc: z.string().min(10, 'Short description must be at least 10 characters').max(200),
  fullDesc: z.string().min(20, 'Full description must be at least 20 characters'),
  price: z.number().min(0, 'Price must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatar: z.string().optional(),
});

export const addSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  category: z.string().min(1, 'Category is required'),
});

export const uploadResumeSchema = z.object({
  content: z.string().min(10, 'Resume content must be at least 10 characters'),
});

export const coverLetterSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  skills: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
});

export const interviewQuestionsSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  experience: z.string().optional(),
  count: z.number().min(1).max(20).optional(),
});

export const improveResumeSchema = z.object({
  content: z.string().min(10, 'Resume content must be at least 10 characters'),
  targetRole: z.string().optional(),
});

export const roadmapSchema = z.object({
  currentSkills: z.string().min(1, 'Current skills are required'),
  targetRole: z.string().min(1, 'Target role is required'),
  timeline: z.string().optional(),
});

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
});

export const analyzeResumeSchema = z.object({
  content: z.string().min(10, 'Resume content must be at least 10 characters'),
});
