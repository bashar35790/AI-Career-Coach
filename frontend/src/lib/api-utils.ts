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
  const res = await api.get<ApiResponse<{ items: Item[]; pagination: Pagination }>>('/items', { params });
  return res.data.data!;
}

export async function fetchItem(id: string) {
  const res = await api.get<ApiResponse<Item>>(`/items/${id}`);
  return res.data.data!;
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
    queryKey: ['items', params],
    queryFn: () => fetchItems(params),
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
