'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { generateCoverLetter } from '@/lib/api-utils';

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult('');

    if (!jobTitle.trim() || !company.trim()) {
      setError('Job title and company are required');
      return;
    }

    setLoading(true);
    try {
      const data = await generateCoverLetter({ jobTitle, company, skills, length });
      setResult(data.content);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AI Cover Letter Generator</h1>
        <p className="text-text-muted mb-8">Generate a tailored cover letter for any job in seconds.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white rounded-2xl border border-border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Relevant Skills (optional)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. React, TypeScript, Node.js"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="short">Short (2-3 paragraphs)</option>
              <option value="medium">Medium (3-4 paragraphs)</option>
              <option value="long">Long (4-5 paragraphs)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </form>

        {result && (
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Cover Letter</h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="whitespace-pre-wrap text-sm text-text leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
