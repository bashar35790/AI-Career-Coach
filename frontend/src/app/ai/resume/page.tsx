'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { improveResume } from '@/lib/api-utils';

export default function ResumeImproverPage() {
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult('');

    if (!content.trim()) {
      setError('Please paste your resume content');
      return;
    }

    setLoading(true);
    try {
      const data = await improveResume({ content, targetRole: targetRole || undefined });
      setResult(data.improved);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to improve resume');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AI Resume Improver</h1>
        <p className="text-text-muted mb-8">Paste your resume below and get AI-powered improvement suggestions.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-900 text-red-400 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Target Role (optional)</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Resume Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-mono text-sm"
              placeholder="Paste your resume text here..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Improving...' : 'Improve Resume'}
          </button>
        </form>

        {result && (
          <div className="bg-zinc-900 rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Improved Resume</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { setContent(result); setResult(''); }}
                  className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors"
                >
                  Use as Base
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-sm text-text leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
