'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { generateInterviewQuestions } from '@/lib/api-utils';

interface QAPair {
  question: string;
  answer: string;
}

export default function InterviewQuestionsPage() {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('mid-level');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setQuestions([]);
    setExpanded(null);

    if (!role.trim()) {
      setError('Please enter a target role');
      return;
    }

    setLoading(true);
    try {
      const data = await generateInterviewQuestions({ role, experience, count });
      setQuestions(data.questions);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AI Interview Question Generator</h1>
        <p className="text-text-muted mb-8">Generate realistic interview questions with sample answers.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white rounded-2xl border border-border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Product Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Number of Questions</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </form>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{questions.length} Questions</h2>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
            {questions.map((qa, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-surface-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium text-text break-words">{qa.question}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ml-4 ${expanded === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expanded === i && (
                  <div className="px-6 pb-4 pt-0">
                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-medium text-secondary mb-1">Sample Answer</p>
                      <p className="text-sm text-text-muted leading-relaxed">{qa.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
