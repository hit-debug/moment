/**
 * Moment 디자인 시스템 — 타이포그래피 토큰
 * Design System Guide v3.0 §3 기반
 */

export const typography = {
  typeDisplay: {
    fontFamily: 'serif', // Cormorant Garamond 폴백
    fontSize: 48,
    fontWeight: '300',
    lineHeight: 48 * 1.2,
  },
  typeH1: {
    fontFamily: 'System', // Pretendard 폴백
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28 * 1.25,
  },
  typeH2: {
    fontFamily: 'System', // Pretendard 폴백
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20 * 1.3,
  },
  typeBody: {
    fontFamily: 'System', // Pretendard 폴백
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16 * 1.7,
  },
  typeBodySm: {
    fontFamily: 'System', // Pretendard 폴백
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14 * 1.6,
  },
  typeLabel: {
    fontFamily: 'System', // Inter 폴백
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 13 * 1.4,
  },
  typeCaption: {
    fontFamily: 'System', // Inter 폴백
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 11 * 1.5,
  },
} as const;
