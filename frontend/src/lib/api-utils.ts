import api from './api';
import type { ApiResponse, AuthResponse, AuthUser, Item, Pagination, UserProfile, Skill } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

async function extractData<T>(res: { data: ApiResponse<T> }): Promise<T> {
  const body = res.data;
  if (!body?.success || !body?.data) {
    throw new Error(body?.error || 'Unexpected response format from server');
  }
  return body.data;
}

export async function loginUser(email: string, password: string) {
  return extractData<AuthResponse>(await api.post('/auth/login', { email, password }));
}

export async function registerUser(name: string, email: string, password: string) {
  return extractData<AuthResponse>(await api.post('/auth/register', { name, email, password }));
}

export async function demoLogin() {
  return extractData<AuthResponse>(await api.post('/auth/demo'));
}

export async function googleAuth(credential: { email: string; name: string; googleId: string; avatar?: string }) {
  return extractData<AuthResponse>(await api.post('/auth/google', credential));
}

export async function getMe() {
  return extractData<AuthUser>(await api.get('/auth/me'));
}

export async function fetchItems(params?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }) {
  return extractData<{ items: Item[]; pagination: Pagination }>(await api.get('/items', { params }));
}

export async function fetchItem(id: string) {
  return extractData<Item>(await api.get(`/items/${id}`));
}

export async function createItem(data: { title: string; shortDesc: string; fullDesc: string; price: number; category: string; image?: string }) {
  return extractData<Item>(await api.post('/items', data));
}

export async function deleteItem(id: string) {
  return extractData<{ message: string }>(await api.delete(`/items/${id}`));
}

export async function getProfile() {
  return extractData<UserProfile>(await api.get('/users/profile'));
}

export async function updateProfile(data: Partial<{ name: string; avatar: string }>) {
  return extractData<AuthUser>(await api.put('/users/profile', data));
}

export async function addSkillApi(data: { name: string; level: string; category: string }) {
  return extractData<Skill>(await api.post('/users/skills', data));
}

export async function uploadResumeApi(content: string) {
  return extractData<{ content: string }>(await api.post('/users/resume', { content }));
}

export async function generateCoverLetter(data: { jobTitle: string; company: string; skills?: string; length?: string }) {
  return extractData<{ content: string }>(await api.post('/ai/cover-letter', data));
}

export async function generateInterviewQuestions(data: { role: string; experience?: string; count?: number }) {
  return extractData<{ questions: { question: string; answer: string }[] }>(await api.post('/ai/interview-questions', data));
}

export async function improveResume(data: { content: string; targetRole?: string }) {
  return extractData<{ improved: string }>(await api.post('/ai/improve-resume', data));
}

export async function generateRoadmap(data: { currentSkills: string; targetRole: string; timeline?: string }) {
  return extractData<{ roadmap: { phases: { title: string; duration: string; tasks: string[] }[] } }>(await api.post('/ai/roadmap', data));
}

export async function fetchConversations() {
  const data = await extractData<{ conversations: { _id: string; title: string; createdAt: string }[]; pagination: Pagination } | { _id: string; title: string; createdAt: string }[]>(await api.get('/ai/conversations'));
  return Array.isArray(data) ? data : data.conversations;
}

export async function fetchConversation(id: string) {
  return extractData<{ _id: string; title: string; messages: { role: string; content: string; timestamp: string }[] }>(await api.get(`/ai/conversations/${id}`));
}

// ── React Query Hooks ──

export function useItems(params?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['items', params?.page ?? 1, params?.limit ?? 12, params?.search ?? '', params?.category ?? '', params?.sort ?? ''],
    queryFn: () => fetchItems(params),
    staleTime: 30000,
    retry: 1,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchItem(id),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; avatar?: string }) => updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useAddSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addSkillApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useUploadResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadResumeApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}
