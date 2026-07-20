'use client';

import { createContext, useContext, useState, useEffect, useCallback, startTransition, type ReactNode } from 'react';
import api from '@/lib/api';
import type { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!stored) {
      startTransition(() => setLoading(false));
      return;
    }

    let cancelled = false;
    startTransition(() => setToken(stored));
    api.get('/auth/me')
      .then((res) => {
        if (!cancelled) startTransition(() => setUser(res.data.data));
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('token');
          startTransition(() => setToken(null));
        }
      })
      .finally(() => {
        if (!cancelled) startTransition(() => setLoading(false));
      });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem('token', newToken);
    startTransition(() => {
      setToken(newToken);
      setUser(newUser);
      setLoading(false);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    startTransition(() => {
      setToken(null);
      setUser(null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handler = () => logout();
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handler);
      }
    };
  }, [logout]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      startTransition(() => setUser(res.data.data));
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
