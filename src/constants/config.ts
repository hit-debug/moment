/**
 * Moment — 앱 설정 상수
 * PRD v2.6 제한값·기본값 통합
 */

export const MAX_HIDDEN_QUOTES = 20;
export const BOOKMARKS_BASE_LIMIT = 30;
export const BOOKMARKS_EXPAND_PER_AD = 20;
export const BOOKMARKS_MAX_LIMIT = 70;
export const RECENT_QUOTES_EXCLUDE_COUNT = 30;
export const QUOTES_FETCH_LIMIT = 10;
export const QUOTE_MAX_LENGTH = 150;
export const JOURNAL_MAX_LENGTH_KO = 100;
export const JOURNAL_MAX_LENGTH_EN = 200;
export const SHARE_COMMENT_MAX_LENGTH = 40;
export const DEFAULT_PUSH_START_TIME = '07:00';
export const DEFAULT_PUSH_END_TIME = '22:00';
export const DEFAULT_PUSH_COUNT = 4;
export const MAX_PUSH_COUNT = 10;
export const WIDGET_CACHE_DAYS = 7;
export const OFFLINE_CACHE_DAYS = 3;
export const BASE_THEME_COUNT = 30;
export const SPLASH_TIMEOUT_MS = 2000;
export const AD_INLINE_INTERVAL = 7;

export const CACHE_STALE_TIMES = {
  quotes: 60 * 60 * 1000,
  journals: 5 * 60 * 1000,
  savedQuotes: 30 * 1000,
  quoteStats: 10 * 60 * 1000,
} as const;
