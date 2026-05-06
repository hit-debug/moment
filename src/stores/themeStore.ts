/**
 * Moment — 테마 상태 스토어 (Zustand)
 */

import { Platform } from 'react-native';
import { create } from 'zustand';

interface ThemeState {
  selectedThemeId: number;
  selectedThemeImage: string;
  selectedFontId: string;
  selectedFontFamily: string;
  colorMode: 'system' | 'light' | 'dark';
  setTheme: (id: number, image: string) => void;
  setFont: (id: string, family: string) => void;
  setColorMode: (mode: 'system' | 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  selectedThemeId: 1,
  selectedThemeImage: 'https://images.unsplash.com/photo-1497215848147-750f003714b6',
  selectedFontId: 'f1',
  // Platform.OS가 정의된 이후 평가되도록 함수형 초기값 사용
  selectedFontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  colorMode: 'dark',
  setTheme: (id, image) => set({ selectedThemeId: id, selectedThemeImage: image }),
  setFont: (id, family) => set({ selectedFontId: id, selectedFontFamily: family }),
  setColorMode: (mode) => set({ colorMode: mode }),
}));

export const useThemeColors = () => {
  const colorMode = useThemeStore((state) => state.colorMode);
  const isDark = colorMode === 'dark' || colorMode === 'system';
  
  return {
    isDark,
    bgDeep: isDark ? '#111111' : '#EEEDE8',
    bgPrimary: isDark ? '#18181B' : '#F4F3EF',
    bgSurface: isDark ? '#1F2937' : '#FFFFFF',
    textPrimary: isDark ? '#F4F3EF' : '#2C2B27',
    textSecondary: isDark ? 'rgba(244,243,239,0.8)' : '#706F6B',
    actionCta: '#E8491E',
    emotionLike: '#E8607A',
    divider: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };
};
