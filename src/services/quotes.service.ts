/**
 * Moment — 명언 서비스 (2레이어)
 * Supabase API 호출 순수 함수
 */

import type { Quote, Category } from '@/types/quote.types';
import type { ServiceResult } from '@/types/common.types';

export async function fetchFeed(
  excludeIds: string[] = [],
  limit: number = 10
): Promise<ServiceResult<Quote[]>> {
  // TODO: Supabase 연동
  return { data: [], error: null };
}

export async function fetchByCategory(
  slug: string
): Promise<ServiceResult<Quote[]>> {
  // TODO: Supabase 연동
  return { data: [], error: null };
}

export async function fetchCategories(): Promise<ServiceResult<Category[]>> {
  // TODO: Supabase 연동
  return { data: [], error: null };
}

export const quotesService = { fetchFeed, fetchByCategory, fetchCategories };
