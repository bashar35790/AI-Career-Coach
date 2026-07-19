'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { generateRoadmap } from '@/lib/api-utils';

interface Phase {
  title: string;
  duration: string;
  tasks: string[];
}

export default function RoadmapPage() {
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [timeline, setTimeline] = useState('6 months');
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setPhases([]);

    if (!currentSkills.trim() || !targetRole.trim()) {
      setError('Current skills and target role are required');
      return;
    }

    setLoading(true);
    try {
      const data = await generateRoadmap({ currentSkills, targetRole, timeline });
      setPhases(data.roadmap.phases);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">AI Career Roadmap Generator</h1>
        <p className="text-text-muted mb-8">Get a personalized step-by-step career roadmap based on your skills and goals.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white rounded-2xl border border-border p-6">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Current Skills</label>
            <textarea
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              placeholder="e.g. JavaScript, HTML, CSS, basic React"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="12 months">1 Year</option>
                <option value="24 months">2 Years</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating Roadmap...' : 'Generate Roadmap'}
          </button>
        </form>

        {phases.length > 0 && (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20" />
            <div className="space-y-8">
              {phases.map((phase, i) => (
                <div key={i} className="relative pl-14">
                  <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-primary border-2 border-white shadow" />
                  <div className="bg-white rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{phase.title}</h3>
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {phase.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-text-muted">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
