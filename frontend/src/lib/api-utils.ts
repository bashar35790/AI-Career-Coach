import api from './api';
import type { ApiResponse, AuthResponse, AuthUser, Item, Pagination } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export async function loginUser(email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
  return res.data.data!;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });
  return res.data.data!;
}

export async function demoLogin() {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/demo');
  return res.data.data!;
}

export async function googleAuth(credential: { email: string; name: string; googleId: string; avatar?: string }) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/google', credential);
  return res.data.data!;
}

export async function getMe() {
  const res = await api.get<ApiResponse<AuthUser>>('/auth/me');
  return res.data.data!;
}

export async function fetchItems(params?: { category?: string; sort?: string; page?: number }) {
  let res;
  try {
    res = await api.get('/items', { params });
  } catch {
    throw new Error(`Network Error - cannot reach backend at ${api.defaults.baseURL}/items`);
  }
  const body = res.data;
  if (!body?.success || !body?.data) {
    throw new Error(body?.error || 'Unexpected response format from server');
  }
  return body.data as { items: Item[]; pagination: Pagination };
}

export async function fetchItem(id: string) {
  const res = await api.get(`/items/${id}`);
  if (!res.data?.success || !res.data?.data) {
    throw new Error(res.data?.error || 'Failed to fetch item');
  }
  return res.data.data as Item;
}

export async function createItem(data: { title: string; shortDesc: string; fullDesc: string; price: number; category: string; image?: string }) {
  const res = await api.post<ApiResponse<Item>>('/items', data);
  return res.data.data!;
}

export async function deleteItem(id: string) {
  const res = await api.delete<ApiResponse<{ message: string }>>(`/items/${id}`);
  return res.data.data!;
}

export async function getProfile() {
  const res = await api.get<ApiResponse<AuthUser>>('/users/profile');
  return res.data.data!;
}

export async function updateProfile(data: Partial<{ name: string; avatar: string }>) {
  const res = await api.put<ApiResponse<AuthUser>>('/users/profile', data);
  return res.data.data!;
}

export function useItems(params?: { category?: string; sort?: string; page?: number }) {
  return useQuery({
    queryKey: ['items', params?.page ?? 1, params?.category ?? '', params?.sort ?? ''],
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

// ── AI Feature API functions ──

export async function generateCoverLetter(data: { jobTitle: string; company: string; skills?: string; length?: string }) {
  const res = await api.post<ApiResponse<{ content: string }>>('/ai/cover-letter', data);
  return res.data.data!;
}

export async function generateInterviewQuestions(data: { role: string; experience?: string; count?: number }) {
  const res = await api.post<ApiResponse<{ questions: { question: string; answer: string }[] }>>('/ai/interview-questions', data);
  return res.data.data!;
}

export async function improveResume(data: { content: string; targetRole?: string }) {
  const res = await api.post<ApiResponse<{ improved: string }>>('/ai/improve-resume', data);
  return res.data.data!;
}

export async function generateRoadmap(data: { currentSkills: string; targetRole: string; timeline?: string }) {
  const res = await api.post<ApiResponse<{ roadmap: { phases: { title: string; duration: string; tasks: string[] }[] } }>>('/ai/roadmap', data);
  return res.data.data!;
}

export async function fetchConversations() {
  const res = await api.get<ApiResponse<{ _id: string; title: string; createdAt: string }[]>>('/ai/conversations');
  return res.data.data!;
}

export async function fetchConversation(id: string) {
  const res = await api.get<ApiResponse<{ _id: string; title: string; messages: { role: string; content: string; timestamp: string }[] }>>(`/ai/conversations/${id}`);
  return res.data.data!;
}
