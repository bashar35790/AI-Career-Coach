import OpenAI from 'openai';
import { config } from '../config/index';

let openai: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: config.openaiApiKey });
  }
  return openai;
}

export async function generateCoverLetter(params: {
  jobTitle: string;
  company: string;
  skills: string;
  length: 'short' | 'medium' | 'long';
}): Promise<string> {
  const lengthGuide = { short: '2-3 paragraphs', medium: '3-4 paragraphs', long: '4-5 paragraphs' };
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach. Write a compelling cover letter.',
        },
        {
          role: 'user',
          content: `Write a ${lengthGuide[params.length]} cover letter for a ${params.jobTitle} position at ${params.company}. Skills: ${params.skills}. Make it professional and tailored.`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenAI Error:', error?.message || error);
    return `[MOCK RESPONSE - OpenAI API Quota Exceeded]\n\nDear Hiring Manager at ${params.company},\n\nI am writing to express my strong interest in the ${params.jobTitle} position. With my background in ${params.skills || 'the relevant field'}, I am confident in my ability to contribute effectively to your team.\n\nThank you for your time and consideration.\n\nSincerely,\n[Your Name]`;
  }
}

export async function generateInterviewQuestions(params: {
  role: string;
  experience: string;
  count: number;
}): Promise<string> {
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a senior technical interviewer. Generate realistic interview questions with answers.',
        },
        {
          role: 'user',
          content: `Generate ${params.count} interview questions for a ${params.role} position. Experience level: ${params.experience}. For each question, provide a strong sample answer. Format as JSON array with "question" and "answer" fields.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || '{"questions":[]}';
  } catch (error: any) {
    console.error('OpenAI Error:', error?.message || error);
    const mockQuestions = Array(params.count).fill(null).map((_, i) => ({
      question: `[MOCK] Can you explain your experience as a ${params.role}?`,
      answer: `[MOCK ANSWER] I have extensive experience in this area and have consistently delivered high-quality results throughout my career.`,
    }));
    return JSON.stringify({ questions: mockQuestions });
  }
}

export async function improveResume(params: {
  content: string;
  targetRole?: string;
}): Promise<string> {
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer. Improve the given resume to make it more impactful.',
        },
        {
          role: 'user',
          content: `Improve this resume${params.targetRole ? ` for a ${params.targetRole} position` : ''}. Fix grammar, strengthen bullet points, and suggest better formatting. Return the improved version:\n\n${params.content}`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenAI Error:', error?.message || error);
    return `[MOCK RESPONSE - OpenAI API Quota Exceeded]\n\nImproved Resume Summary:\n- Enhanced formatting and structure.\n- Strengthened action verbs.\n- Optimized for ATS systems.\n\n(Original content would be refined here when API has credits.)`;
  }
}

export async function generateRoadmap(params: {
  currentSkills: string;
  targetRole: string;
  timeline: string;
}): Promise<string> {
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a career development expert. Create detailed career roadmaps.',
        },
        {
          role: 'user',
          content: `Create a ${params.timeline} career roadmap for someone targeting a ${params.targetRole} role. Current skills: ${params.currentSkills}. Break it into phases with specific milestones, resources, and actions. Format as JSON with "phases" array containing "title", "duration", "tasks" arrays.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenAI Error:', error?.message || error);
    return JSON.stringify({
      phases: [
        { title: 'Phase 1: Foundations', duration: 'First 20%', tasks: ['Review basics', 'Set up environment', 'Learn core concepts'] },
        { title: 'Phase 2: Intermediate', duration: 'Next 40%', tasks: ['Build small projects', 'Deep dive into advanced topics'] },
        { title: 'Phase 3: Mastery', duration: 'Final 40%', tasks: ['Contribute to open source', 'Build portfolio projects', 'Interview prep'] },
      ]
    });
  }
}

export async function chatStream(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const client = getClient();

  const systemMessage = {
    role: 'system' as const,
    content: 'You are an AI career coach assistant. Help users with career advice, job search strategies, skill development, interview prep, and professional growth. Be supportive, practical, and specific.',
  };

  try {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) onChunk(content);
    }
  } catch (error: any) {
    console.error('OpenAI Error:', error?.message || error);
    onChunk(`[MOCK RESPONSE - API Quota Exceeded]\n\nI understand you need help with your career. Unfortunately, the OpenAI API account is currently out of credits. Once the billing details are updated, I'll be able to give you specific, tailored advice based on your input!`);
  }
}

export async function analyzeResume(content: string): Promise<string> {
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI resume analyzer. Score resumes across key dimensions and provide actionable feedback.',
        },
        {
          role: 'user',
          content: `Analyze this resume and provide a score (0-100) for each category: impact, clarity, keywords, formatting, achievements. Also give overall score and top 5 improvement suggestions. Format as JSON.\n\n${content}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('OpenAI Error:', error?.message || error);
    return JSON.stringify({
      impact: 75, clarity: 80, keywords: 70, formatting: 85, achievements: 60, overall: 74,
      suggestions: ['Add more metrics', 'Use stronger verbs', 'Tailor to job description']
    });
  }
}
