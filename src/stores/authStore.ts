/**
 * Moment — 인증 상태 스토어 (Zustand)
 */

import { create } from 'zustand';
import type { UserRole } from '@/types/common.types';

interface AuthState {
  role: UserRole;
  userId: string | null;
  setRole: (role: UserRole) => void;
  setUserId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'guest',
  userId: null,
  setRole: (role) => set({ role }),
  setUserId: (id) => set({ userId: id }),
  logout: () => set({ role: 'guest', userId: null }),
}));
