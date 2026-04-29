/**
 * Moment — TanStack Query Key Factory
 * ⚠️ 하드코딩 금지
 */

export const queryKeys = {
  quotes: {
    all: () => ['quotes'] as const,
    byCategory: (slug: string) => ['quotes', 'category', slug] as const,
    feed: (excludeIds: string[]) => ['quotes', 'feed', excludeIds] as const,
    detail: (id: string) => ['quotes', 'detail', id] as const,
  },
  journals: {
    all: (userId: string) => ['journals', userId] as const,
    detail: (id: string) => ['journals', 'detail', id] as const,
  },
  bookmarks: {
    all: (userId: string) => ['bookmarks', userId] as const,
  },
  quoteStats: {
    detail: (quoteId: string) => ['quote-stats', quoteId] as const,
  },
  categories: {
    all: () => ['categories'] as const,
  },
  profile: {
    me: () => ['profile', 'me'] as const,
  },
  subscription: {
    status: (userId: string) => ['subscription', userId] as const,
  },
} as const;
