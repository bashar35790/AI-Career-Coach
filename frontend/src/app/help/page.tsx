'use client';

import { useState } from 'react';

const helpTopics = [
  { q: 'How do I get started?', a: 'Create a free account, set up your profile with your skills, and start exploring our AI tools. Upload your resume for analysis, generate cover letters, practice interviews, or get a personalized career roadmap.' },
  { q: 'How does the AI resume analysis work?', a: 'Paste your resume content into the Resume Improver tool. Our AI analyzes it for impact, clarity, keywords, formatting, and achievements, then provides an improved version with suggestions.' },
  { q: 'Can I save my AI chat conversations?', a: 'Yes! All your chat conversations are automatically saved. You can access them from the sidebar in the AI Chat page to continue where you left off.' },
  { q: 'How do I manage my items?', a: 'Go to the Manage Items page from the navigation menu. You can view, add, and delete your resources from there.' },
  { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption. Your personal data and resume content are stored securely and never shared with third parties.' },
  { q: 'How do I update my profile?', a: 'Navigate to your Profile page where you can edit your name, avatar, manage your skills list, and upload your resume.' },
  { q: 'What AI models power the platform?', a: 'We use OpenAI GPT-4o for all AI features, including resume analysis, cover letter generation, interview questions, career advice, and roadmap creation.' },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
      <p className="text-text-muted mb-8">Frequently asked questions about AI Career Coach.</p>

      <div className="space-y-3">
        {helpTopics.map((topic, i) => (
          <div key={i} className="bg-zinc-900 rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-surface-muted transition-colors"
            >
              {topic.q}
              <svg className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-4 text-text-muted text-sm leading-relaxed">{topic.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
