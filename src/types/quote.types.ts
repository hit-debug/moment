/**
 * Moment — 명언 관련 타입 정의
 */

export interface Category {
  id: string;
  slug: string;
  nameKo: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Quote {
  id: string;
  categoryId: string;
  text: string;
  author: string;
  authorRole: string;
  isActive: boolean;
  createdAt: string;
}

export interface QuoteStats {
  quoteId: string;
  likeCount: number;
  dislikeCount: number;
  shareCount: number;
  updatedAt: string;
}

export interface QuoteReaction {
  id: string;
  userId: string;
  quoteId: string;
  reactionType: 'like' | 'dislike';
  createdAt: string;
}

export interface QuoteFeedItem {
  quote: Quote;
  category: Category;
  stats: QuoteStats;
  userReaction: 'like' | 'dislike' | null;
  isSaved: boolean;
}
