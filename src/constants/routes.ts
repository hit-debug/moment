/**
 * Moment — 라우터 경로 상수
 * ⚠️ 경로 문자열 하드코딩 절대 금지
 */

export const ROUTES = {
  SPLASH: '/' as const,
  ONBOARDING_START: '/onboarding/start' as const,
  ONBOARDING_SETUP: '/onboarding/setup' as const,
  AUTH_LOGIN: '/auth/login' as const,
  QUOTE_TODAY: '/(app)/quote/today' as const,
  QUOTE_CATEGORY: '/(app)/quote/category' as const,
  JOURNAL_LIST: '/(app)/journal/list' as const,
  JOURNAL_DETAIL: (id: string) => `/(app)/journal/detail/${id}` as const,
  MY: '/(app)/my/' as const,
  MY_BOOKMARKS: '/(app)/my/bookmarks' as const,
  MY_SUBSCRIPTION: '/(app)/my/subscription' as const,
  SETTINGS_THEME: '/(app)/my/settings/theme' as const,
  MODAL_LOGIN: '/(modals)/login-prompt' as const,
  MODAL_JOURNAL: '/(modals)/journal-write' as const,
  MODAL_SHARE: '/(modals)/quote-share' as const,
  MODAL_THEME: '/(modals)/quote-customize' as const,
  SETTINGS_LANGUAGE: '/settings/language' as const,
} as const;
