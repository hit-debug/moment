/**
 * Moment 디자인 시스템 — 시맨틱 컬러 토큰
 * Design System Guide v3.0 §2 기반
 *
 * ⚠️ HEX 직접 하드코딩 금지 — 반드시 이 토큰으로만 색상 참조
 */

export const lightColors = {
  bgDeep: '#EEEDE8',
  bgPrimary: '#F4F3EF',
  bgSurface: '#FFFFFF',
  textPrimary: '#2C2B27',
  textSecondary: '#706F6B',
  actionCta: '#E8491E',
  emotionLike: '#E8607A',
  statusSuccess: '#C8DCC0',
  divider: 'rgba(0,0,0,0.05)',
} as const;

export const darkColors = {
  bgDeep: '#111111',
  bgPrimary: '#18181B',
  bgSurface: '#1F2937',
  textPrimary: '#F4F3EF',
  textSecondary: 'rgba(244,243,239,0.8)',
  actionCta: '#E8491E',
  emotionLike: '#E8607A',
  statusSuccess: 'rgba(200,220,192,0.2)',
  divider: 'rgba(255,255,255,0.05)',
} as const;

export const statusColors = {
  error: '#DC2626',
  warning: '#D97706',
  info: '#0284C7',
} as const;

export type ColorToken = keyof typeof lightColors;
