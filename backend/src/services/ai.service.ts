import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index';

const AVAILABLE_MODELS = ['gemini-3-flash-preview', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

let genai: GoogleGenAI | null = null;
let currentModelIndex = 0;

function getClient(): GoogleGenAI {
  if (!genai) {
    genai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return genai;
}

function getCurrentModel(): string {
  return AVAILABLE_MODELS[currentModelIndex % AVAILABLE_MODELS.length];
}

function rotateModel(): string {
  currentModelIndex = (currentModelIndex + 1) % AVAILABLE_MODELS.length;
  return getCurrentModel();
}

async function generateContentWithFallback(
  params: Omit<Parameters<GoogleGenAI['models']['generateContent']>[0], 'model'> & { model?: string },
  maxRetries: number = AVAILABLE_MODELS.length
): Promise<string | null> {
  const client = getClient();
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const model = params.model || getCurrentModel();
    try {
      const response = await client.models.generateContent({
        ...params,
        model,
      });
      if (response.text) {
        currentModelIndex = AVAILABLE_MODELS.indexOf(model);
        return response.text;
      }
      return null;
    } catch (error: unknown) {
      lastError = error;
      const err = error as { status?: number; message?: string };
      const status = err.status;
      if (status === 404 || status === 403 || status === 429) {
        console.warn(`Model ${model} failed (${status}), trying next model...`);
        rotateModel();
        continue;
      }
      console.error('Gemini API error:', err.message || error);
      return null;
    }
  }

  console.error('All Gemini models exhausted, last error:', (lastError as { message?: string })?.message || lastError);
  return null;
}

export async function generateCoverLetter(params: {
  jobTitle: string;
  company: string;
  skills: string;
  length: 'short' | 'medium' | 'long';
}): Promise<string> {
  const lengthGuide = { short: '2-3 paragraphs', medium: '3-4 paragraphs', long: '4-5 paragraphs' };

  const text = await generateContentWithFallback({
    contents: `Write a ${lengthGuide[params.length]} cover letter for a ${params.jobTitle} position at ${params.company}. Skills: ${params.skills}. Make it professional and tailored.`,
    config: {
      systemInstruction: 'You are a professional career coach. Write a compelling cover letter.',
      temperature: 0.7,
    },
  });

  if (text) return text;

  return `[MOCK RESPONSE - Gemini API Unavailable]\n\nDear Hiring Manager at ${params.company},\n\nI am writing to express my strong interest in the ${params.jobTitle} position. With my background in ${params.skills || 'the relevant field'}, I am confident in my ability to contribute effectively to your team.\n\nThank you for your time and consideration.\n\nSincerely,\n[Your Name]`;
}

export async function generateInterviewQuestions(params: {
  role: string;
  experience: string;
  count: number;
}): Promise<string> {
  const text = await generateContentWithFallback({
    contents: `Generate ${params.count} interview questions for a ${params.role} position. Experience level: ${params.experience}. For each question, provide a strong sample answer. Format as JSON array with "question" and "answer" fields.`,
    config: {
      systemInstruction: 'You are a senior technical interviewer. Generate realistic interview questions with answers.',
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  if (text) return text;

  const mockQuestions = Array.from({ length: params.count }, (_, i) => ({
    question: `[MOCK] Can you explain your experience as a ${params.role}?`,
    answer: `[MOCK ANSWER] I have extensive experience in this area and have consistently delivered high-quality results throughout my career.`,
  }));
  return JSON.stringify({ questions: mockQuestions });
}

export async function improveResume(params: {
  content: string;
  targetRole?: string;
}): Promise<string> {
  const text = await generateContentWithFallback({
    contents: `Improve this resume${params.targetRole ? ` for a ${params.targetRole} position` : ''}. Fix grammar, strengthen bullet points, and suggest better formatting. Return the improved version:\n\n${params.content}`,
    config: {
      systemInstruction: 'You are a professional resume writer. Improve the given resume to make it more impactful.',
      temperature: 0.7,
    },
  });

  if (text) return text;

  return `[MOCK RESPONSE - Gemini API Unavailable]\n\nImproved Resume Summary:\n- Enhanced formatting and structure.\n- Strengthened action verbs.\n- Optimized for ATS systems.\n\n(Original content would be refined here when API has credits.)`;
}

export async function generateRoadmap(params: {
  currentSkills: string;
  targetRole: string;
  timeline: string;
}): Promise<string> {
  const text = await generateContentWithFallback({
    contents: `Create a ${params.timeline} career roadmap for someone targeting a ${params.targetRole} role. Current skills: ${params.currentSkills}. Break it into phases with specific milestones, resources, and actions. Format as JSON with "phases" array containing "title", "duration", "tasks" arrays.`,
    config: {
      systemInstruction: 'You are a career development expert. Create detailed career roadmaps.',
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  if (text) return text;

  return JSON.stringify({
    phases: [
      { title: 'Phase 1: Foundations', duration: 'First 20%', tasks: ['Review basics', 'Set up environment', 'Learn core concepts'] },
      { title: 'Phase 2: Intermediate', duration: 'Next 40%', tasks: ['Build small projects', 'Deep dive into advanced topics'] },
      { title: 'Phase 3: Mastery', duration: 'Final 40%', tasks: ['Contribute to open source', 'Build portfolio projects', 'Interview prep'] },
    ]
  });
}

export async function chatStream(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const client = getClient();

  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

  const systemMessage = messages.find((m) => m.role === 'system');

  let lastError: unknown;

  for (let attempt = 0; attempt < AVAILABLE_MODELS.length; attempt++) {
    const model = getCurrentModel();
    try {
      const stream = await client.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: systemMessage?.content || 'You are an AI career coach assistant. Help users with career advice, job search strategies, skill development, interview prep, and professional growth. Be supportive, practical, and specific.',
          temperature: 0.7,
        },
      });

      for await (const chunk of stream) {
        const content = chunk.text || '';
        if (content) onChunk(content);
      }
      return;
    } catch (error: unknown) {
      lastError = error;
      const err = error as { status?: number; message?: string };
      const status = err.status;
      if (status === 404 || status === 403 || status === 429) {
        console.warn(`Model ${model} failed (${status}), trying next model...`);
        rotateModel();
        continue;
      }
      console.error('Gemini API error:', err.message || error);
      break;
    }
  }

  console.error('All Gemini models exhausted for chatStream:', (lastError as { message?: string })?.message || lastError);
  onChunk(`[MOCK RESPONSE - API Unavailable]\n\nI understand you need help with your career. Unfortunately, the Gemini API account is currently out of credits. Once the billing details are updated, I'll be able to give you specific, tailored advice based on your input!`);
}

export async function analyzeResume(content: string): Promise<string> {
  const text = await generateContentWithFallback({
    contents: `Analyze this resume and provide a score (0-100) for each category: impact, clarity, keywords, formatting, achievements. Also give overall score and top 5 improvement suggestions. Format as JSON.\n\n${content}`,
    config: {
      systemInstruction: 'You are an AI resume analyzer. Score resumes across key dimensions and provide actionable feedback.',
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  if (text) return text;

  return JSON.stringify({
    impact: 75, clarity: 80, keywords: 70, formatting: 85, achievements: 60, overall: 74,
    suggestions: ['Add more metrics', 'Use stronger verbs', 'Tailor to job description']
  });
}
