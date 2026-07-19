'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { useProfile, useUpdateProfile, useAddSkill, useUploadResume } from '@/lib/api-utils';

const skillCategories = ['Frontend', 'Backend', 'DevOps', 'Data Science', 'AI/ML', 'Design', 'Business', 'Other'];
const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function ProfilePage() {
  const { data: profile, isLoading, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const addSkill = useAddSkill();
  const uploadResume = useUploadResume();

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editAvatar, setEditAvatar] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [skillCategory, setSkillCategory] = useState('Frontend');
  const [skillMsg, setSkillMsg] = useState('');

  const [resumeContent, setResumeContent] = useState('');
  const [resumeMsg, setResumeMsg] = useState('');

  async function handleUpdateProfile() {
    setProfileMsg('');
    try {
      await updateProfile.mutateAsync({ name: name || undefined, avatar: avatar || undefined });
      setProfileMsg('Profile updated');
      setEditName(false);
      setEditAvatar(false);
    } catch {
      setProfileMsg('Failed to update profile');
    }
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!skillName.trim()) return;
    setSkillMsg('');
    try {
      await addSkill.mutateAsync({ name: skillName, level: skillLevel, category: skillCategory });
      setSkillName('');
      setSkillMsg('Skill added');
    } catch {
      setSkillMsg('Failed to add skill');
    }
  }

  async function handleUploadResume(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeContent.trim()) return;
    setResumeMsg('');
    try {
      await uploadResume.mutateAsync(resumeContent);
      setResumeContent('');
      setResumeMsg('Resume uploaded');
      refetch();
    } catch {
      setResumeMsg('Failed to upload resume');
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
          <div className="h-8 bg-zinc-800 rounded w-1/3" />
          <div className="h-48 bg-zinc-800 rounded-2xl" />
          <div className="h-48 bg-zinc-800 rounded-2xl" />
        </div>
      </AuthGuard>
    );
  }

  const user = profile?.user;
  const skills = profile?.skills ?? [];
  const resume = profile?.resume;

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>

        <div className="bg-zinc-900 rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
          {profileMsg && (
            <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-sm rounded-lg">
              {profileMsg}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input value={user?.email ?? ''} disabled className="w-full px-3 py-2 border border-border rounded-lg bg-surface-muted text-text-muted" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Name</label>
              {editName ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <div className="flex gap-2">
                    <button onClick={handleUpdateProfile} disabled={updateProfile.isPending} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50">
                      Save
                    </button>
                    <button onClick={() => setEditName(false)} className="px-4 py-2 border border-border text-sm rounded-lg hover:bg-surface-muted">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{user?.name}</span>
                  <button onClick={() => { setName(user?.name ?? ''); setEditName(true); }} className="text-xs text-primary hover:underline">
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Avatar URL</label>
              {editAvatar ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://example.com/avatar.jpg" />
                  <div className="flex gap-2">
                    <button onClick={handleUpdateProfile} disabled={updateProfile.isPending} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50">
                      Save
                    </button>
                    <button onClick={() => setEditAvatar(false)} className="px-4 py-2 border border-border text-sm rounded-lg hover:bg-surface-muted">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{user?.avatar || 'Not set'}</span>
                  <button onClick={() => { setAvatar(user?.avatar ?? ''); setEditAvatar(true); }} className="text-xs text-primary hover:underline">
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          {skillMsg && (
            <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-sm rounded-lg">
              {skillMsg}
            </div>
          )}

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((s) => (
                <span key={s._id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-xs font-medium">
                  {s.name}
                  <span className="text-text-muted capitalize">({s.level})</span>
                </span>
              ))}
            </div>
          )}

          <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Skill name" className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
              {skillLevels.map((l) => <option key={l} value={l} className="capitalize">{l}</option>)}
            </select>
            <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
              {skillCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" disabled={addSkill.isPending || !skillName.trim()} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50">
              Add Skill
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Resume</h2>
          {resume && (
            <div className="mb-4 p-3 bg-surface-muted rounded-xl">
              <p className="text-sm text-text-muted">Resume uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
              {resume.aiScore != null && (
                <p className="text-sm mt-1">AI Score: <span className="font-semibold text-primary">{resume.aiScore}/100</span></p>
              )}
            </div>
          )}
          {resumeMsg && (
            <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-sm rounded-lg">
              {resumeMsg}
            </div>
          )}
          <form onSubmit={handleUploadResume} className="space-y-3">
            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              placeholder="Paste your resume content here..."
            />
            <button type="submit" disabled={uploadResume.isPending || !resumeContent.trim()} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50">
              Upload Resume
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
