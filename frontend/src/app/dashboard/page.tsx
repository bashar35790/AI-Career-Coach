'use client';

import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useProfile } from '@/lib/api-utils';
import { useItems } from '@/lib/api-utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, FilePen, Briefcase, MessageSquare, Map, Zap, ArrowRight } from 'lucide-react';

const chartData = [
  { month: 'Jan', activity: 4 },
  { month: 'Feb', activity: 7 },
  { month: 'Mar', activity: 5 },
  { month: 'Apr', activity: 9 },
  { month: 'May', activity: 12 },
  { month: 'Jun', activity: 8 },
];

const aiTools = [
  { href: '/ai/resume', icon: FileText, label: 'Resume Improver', desc: 'AI-powered resume analysis and improvement' },
  { href: '/ai/cover-letter', icon: FilePen, label: 'Cover Letter', desc: 'Generate tailored cover letters' },
  { href: '/ai/interview', icon: Briefcase, label: 'Interview Prep', desc: 'Practice with AI-generated questions' },
  { href: '/ai/chat', icon: MessageSquare, label: 'AI Chat', desc: 'Get career advice from AI assistant' },
  { href: '/ai/roadmap', icon: Map, label: 'Roadmap', desc: 'Create a personalized career roadmap' },
];

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: itemsData } = useItems({ page: 1 });

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome{profile ? `, ${profile.user?.name || 'Back'}` : ''}
            </h1>
            <p className="text-text-muted mt-1">Here&apos;s an overview of your activity.</p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-surface-muted transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 rounded-2xl border border-border p-6">
            <p className="text-sm text-text-muted">Skills Added</p>
            <p className="text-3xl font-bold mt-1">{profileLoading ? '...' : profile?.skills?.length ?? 0}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl border border-border p-6">
            <p className="text-sm text-text-muted">Total Items</p>
            <p className="text-3xl font-bold mt-1">{itemsData?.pagination?.total ?? 0}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl border border-border p-6">
            <p className="text-sm text-text-muted">Resume</p>
            <p className="text-3xl font-bold mt-1">{profile?.resume ? 'Uploaded' : '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Trend</h2>
            <div className="h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="activity" stroke="#4F46E5" strokeWidth={2} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            {profileLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-zinc-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : profile?.skills?.length === 0 ? (
              <p className="text-sm text-text-muted">No skills added yet.</p>
            ) : (
              <div className="space-y-2">
                {profile?.skills?.slice(0, 6).map((skill) => (
                  <div key={skill._id} className="flex items-center justify-between py-1.5">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                      {skill.level}
                    </span>
                  </div>
                ))}
                {(profile?.skills?.length ?? 0) > 6 && (
                  <Link href="/profile" className="block text-sm text-primary hover:underline mt-2">
                    View all {profile?.skills?.length} skills
                  </Link>
                )}
              </div>
            )}
            <Link
              href="/profile"
              className="mt-4 block w-full text-center py-2 text-sm font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors"
            >
              Manage Skills
            </Link>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Tools
            </span>
            <h2 className="text-lg font-semibold">AI-Powered Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.25)]"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-500">
                  <tool.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors">
                  {tool.label}
                </h3>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{tool.desc}</p>
                <ArrowRight className="w-4 h-4 text-primary/0 group-hover:text-primary/60 absolute bottom-5 right-5 transition-all duration-500 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
