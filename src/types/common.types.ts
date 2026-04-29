/**
 * Moment — 공통 타입 정의
 */

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
}

export interface ServiceError {
  code: string;
  message: string;
}

export type UserRole = 'guest' | 'free' | 'subscribed';
export type AuthProvider = 'google' | 'apple';
