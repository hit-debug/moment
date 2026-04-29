/**
 * Moment — 테마 상태 스토어 (Zustand)
 */

import { create } from 'zustand';

interface ThemeState {
  selectedThemeIndex: number;
  selectedFont: 'pretendard' | 'cormorant';
  colorScheme: 'system' | 'light' | 'dark';
  setThemeIndex: (index: number) => void;
  setFont: (font: 'pretendard' | 'cormorant') => void;
  setColorScheme: (scheme: 'system' | 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  selectedThemeIndex: 0,
  selectedFont: 'pretendard',
  colorScheme: 'system',
  setThemeIndex: (index) => set({ selectedThemeIndex: index }),
  setFont: (font) => set({ selectedFont: font }),
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
}));
