# ANTIGRAVITY.mobile.md — Moment React Native 앱 전용

> 이 파일은 AGENTS.md보다 항상 우선한다.
> Antigravity 세션 시작 시 AGENTS.md + 이 파일 + Moment_PRD_v2.7.md 를 함께 첨부한다.

---

## 0. 기술 스택 기준

**코어**

- **React Native** (0.7x+) + **Expo SDK** + **Expo Router v3** (File-based Routing)
- **TypeScript** (No Any — strict 모드 필수)

**상태 관리**

- **TanStack Query v5** — 서버 상태 전담 (Supabase 데이터 페치·캐싱)
- **Zustand v4** — 클라이언트 상태 전담 (테마·모달·온보딩·게스트 로컬)
- **MMKV** — 로컬 저장소 전담. `AsyncStorage` 직접 사용 **금지**. Zustand persist 스토리지로 연결.

**백엔드**

- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions)

**스타일링 · UI**

- **React Native StyleSheet** — 순정 스타일링 방식 (프리미엄 디자인 제어)
- **expo-image** — 이미지 렌더링 전담. React Native 기본 `Image` 컴포넌트 사용 **금지**
- **react-native-reanimated v3** — 애니메이션
- **@gorhom/bottom-sheet** — BottomSheet 전담 (R-008 저널 작성 등)

**수익화 · 광고**

- **RevenueCat SDK** — 구독·IAP 전담. Apple/Google 결제 API 직접 구현 **금지**
- **Google AdMob** (`react-native-google-mobile-ads`) — 배너·네이티브·리워드

**기타 핵심 라이브러리**

- **react-native-view-shot** — 공유 카드 PNG 렌더링. `html2canvas` 사용 **금지** (RN 동작 불가)
- **expo-media-library** — 갤러리 저장 권한·저장
- **카카오 SDK** (`@react-native-seoul/kakao-login`) — 공유. 오류·미설치 시 OS Share Sheet 폴백 **필수**
- **Expo Notifications** — Remote Push 클라이언트 (FCM/APNs)
- **dayjs** + utc + timezone 플러그인 — 날짜 처리 전담. `new Date()` 직접 사용 **금지**
- **react-i18next** — UI 텍스트 다국어. 명언 콘텐츠에는 **미적용**
- **Sentry** (`sentry-expo`) — 크래시·에러 리포팅
- **EAS Build + EAS Update** — 클라우드 빌드 + OTA 배포

---

## 1. 클린 아키텍처 4레이어

### 레이어 구조

```
types/      ← TypeScript 타입 정의. 외부 의존성 없음.
services/   ← Supabase API 호출 순수 함수. React 의존성 없음.
hooks/      ← TanStack Query 훅 + Mutation. services/ 호출.
app/        ← Expo Router 화면 파일. hooks/ 만 호출.
```

### 🚫 핵심 금지 규칙

```typescript
// ❌ app/ 디렉토리 파일에서 Supabase 직접 import 절대 금지
import { supabase } from '@/lib/supabase';  // app/quote/today.tsx 에서 금지

// ✅ 반드시 services/ 또는 hooks/ 를 통해서만 접근
import { useQuotesByCategory } from '@/hooks/queries/useQuotes';
import { quotesService } from '@/services/quotes.service';  // hooks/ 에서만 호출
```

### 폴더 구조

```
app/                          ← 라우터 파일만 (비즈니스 로직 금지)
  _layout.tsx                 ← Root: Provider, Font, Theme, Sentry 초기화
  index.tsx                   ← 스플래시 (R-001)
  onboarding/
    start.tsx                 ← R-002
    setup.tsx                 ← R-004
    privacy-consent.tsx       ← R-023
  auth/login.tsx              ← R-005
  (app)/                      ← 메인 탭 그룹
    _layout.tsx
    quote/
      today.tsx               ← R-006
      category.tsx            ← R-007
    journal/
      list.tsx                ← R-009
      detail/[id].tsx         ← R-010
    my/
      index.tsx               ← R-011
      bookmarks.tsx           ← R-012
      hidden.tsx              ← R-013
      subscription.tsx        ← R-019
      settings/
        notification.tsx      ← R-014
        theme.tsx             ← R-015
        quote-pref.tsx        ← R-016
        account.tsx           ← R-017
        widget-guide.tsx      ← R-018
  (modals)/                   ← 모달 그룹
    _layout.tsx               ← presentation: 'modal'
    login-prompt.tsx          ← R-003
    journal-write.tsx         ← R-008
    quote-share.tsx           ← R-008b
    quote-customize.tsx       ← R-021
  settings/
    language.tsx              ← R-022
  widget/                     ← R-020 (Phase 2)

src/
  types/                      ← 타입 정의
    supabase.types.ts         ← CLI 자동 생성 (수동 편집 금지)
    quote.types.ts
    journal.types.ts
    auth.types.ts
  services/                   ← 순수 API 함수
    quotes.service.ts
    journals.service.ts
    bookmarks.service.ts
    auth.service.ts
    notifications.service.ts
  hooks/
    queries/                  ← TanStack Query 읽기 훅
      useQuotes.ts
      useJournals.ts
      useBookmarks.ts
    mutations/                ← TanStack Mutation 쓰기 훅
      useBookmarkMutation.ts
      useJournalMutation.ts
      useReactionMutation.ts
    useAuth.ts
    useTheme.ts
    useRequireAuth.ts         ← 권한 체크 공통 훅
  stores/
    authStore.ts              ← 게스트/무료/구독 상태
    themeStore.ts             ← 테마·다크모드 (MMKV persist)
    uiStore.ts                ← 모달·토스트·로딩
  lib/
    supabase.ts               ← Supabase 클라이언트 (MMKV 연결)
    revenuecat.ts             ← RevenueCat 초기화
    sentry.ts                 ← Sentry 초기화
    analytics.ts              ← PostHog 이벤트 래퍼
  components/
    ui/                       ← 원자 컴포넌트 (Button, Input, Card...)
    quote/                    ← 명언 도메인 컴포넌트
    journal/                  ← 저널 도메인 컴포넌트
    shared/                   ← ErrorBoundary, EmptyState, Skeleton
  constants/
    routes.ts                 ← R-001~R-023 경로 상수 (하드코딩 금지)
    queryKeys.ts              ← TanStack Query 키 Factory
    config.ts                 ← MAX_HIDDEN(20), MAX_BOOKMARKS(30) 등
  utils/
    date.ts                   ← dayjs UTC/로컬 변환 래퍼
    storage.ts                ← MMKV 래퍼
tokens/
  colors.ts                   ← 라이트/다크 디자인 토큰
  typography.ts
  spacing.ts
  motion.ts
locales/
  ko/translation.json         ← UI 텍스트 (명언 콘텐츠 제외)
__tests__/
  services/                   ← 유닛 테스트 (Jest + msw)
    quotes.service.test.ts
    journals.service.test.ts
    auth.service.test.ts
  mocks/
    handlers.ts               ← msw 핸들러
    server.ts                 ← msw 서버 설정
```

### Query Key Factory

`src/constants/queryKeys.ts`에서 통합 관리. 화면·훅에서 직접 문자열 배열 사용 금지.

```typescript
export const queryKeys = {
  quotes: {
    all: () => ['quotes'] as const,
    byCategory: (slug: string) => ['quotes', 'category', slug] as const,
    feed: (excludeIds: string[]) => ['quotes', 'feed', excludeIds] as const,
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
} as const;
```

### TanStack Query 캐시 정책 (PRD 9.2 기준)

| 데이터 | staleTime | 비고 |
|--------|-----------|------|
| quotes API | 1시간 | foreground 진입 시 background refetch |
| journals | 5분 | mutation 후 즉시 invalidate |
| saved_quotes | 30초 | 저장·삭제 후 즉시 invalidate |
| quote_stats | 10분 | 좋아요·공유 후 즉시 invalidate |
| user_subscription | RevenueCat 이벤트 리스너 직접 갱신 | TanStack Query 불필요 |

---

## 2. Moment 앱 비즈니스 규칙

### 2.1 권한 접근 제어

화면 진입 전 반드시 권한 확인. `useRequireAuth` 훅 사용.

```typescript
// ✅ 올바른 패턴
const withAuth = useRequireAuth();
const handleBookmark = withAuth((quoteId: string) => {
  bookmarkMutation.mutate({ quoteId });
});

// ❌ 금지: 화면에서 직접 권한 분기
if (!user) router.push(ROUTES.MODAL_LOGIN);  // 훅으로 처리해야 함
```

### 2.2 날짜·시간 처리

```typescript
// ✅ UTC 저장
const utcNow = dayjs().utc().toISOString();

// ✅ 로컬 표시
const localDate = dayjs.utc(journal.created_at).local().format('YYYY.MM.DD');

// ❌ 금지
new Date().toISOString()        // 로컬 타임존 섞임
new Date().toLocaleDateString() // 포맷 불일치
```

### 2.3 게스트 반응 처리 (PRD 4.6 + 7.10-B 기준)

```
게스트 좋아요:
  MMKV 로컬 저장 + RPC increment_quote_stat(quoteId, deviceId, 'like') 호출
  → quote_stats_guest_reactions insert + like_count +1

게스트 좋아요 취소:
  MMKV 로컬 취소 + RPC decrement_quote_stat(quoteId, deviceId, 'like') 호출
  → quote_stats_guest_reactions 행 삭제 + like_count -1 (행 없으면 무시)

히든함:
  MMKV 로컬 전용. 서버 동기화 없음. 최대 20개 FIFO.

로그인 후 병합:
  PRD 4.3 병합 규칙 5단계 순서대로 구현.
  병합 완료 후 quote_stats_guest_reactions에서 deviceId 행 삭제 (중복 집계 방지).
```

### 2.4 명언 피드 순환 (PRD 4.6 스포티파이 셔플 방식)

```
recent_quote_ids: MMKV에 최대 30개 FIFO 배열 관리
hidden_quotes:    MMKV에 최대 20개 관리

API 호출 시:
  exclude_ids = [...recent_quote_ids, ...hidden_quote_ids]
  GET /quotes?locale=ko&exclude_ids=[...]&limit=10
```

### 2.5 라우터 경로 상수

`src/constants/routes.ts`에 R-001~R-023 전체 정의. 문자열 하드코딩 절대 금지.

```typescript
export const ROUTES = {
  SPLASH:             '/' as const,
  ONBOARDING_START:   '/onboarding/start' as const,
  ONBOARDING_SETUP:   '/onboarding/setup' as const,
  AUTH_LOGIN:         '/auth/login' as const,
  QUOTE_TODAY:        '/(app)/quote/today' as const,
  QUOTE_CATEGORY:     '/(app)/quote/category' as const,
  JOURNAL_LIST:       '/(app)/journal/list' as const,
  JOURNAL_DETAIL:     (id: string) => `/(app)/journal/detail/${id}` as const,
  MY:                 '/(app)/my/' as const,
  MY_BOOKMARKS:       '/(app)/my/bookmarks' as const,
  MY_SUBSCRIPTION:    '/(app)/my/subscription' as const,
  SETTINGS_THEME:     '/(app)/my/settings/theme' as const,
  MODAL_LOGIN:        '/(modals)/login-prompt' as const,
  MODAL_JOURNAL:      '/(modals)/journal-write' as const,
  MODAL_SHARE:        '/(modals)/quote-share' as const,
  MODAL_THEME:        '/(modals)/quote-customize' as const,
  SETTINGS_LANGUAGE:  '/settings/language' as const,
} as const;
```

### 2.6 저널 글자 수 제한

```typescript
// PRD v2.6 확정: 한글 100자 / 영문 200자 (글자 수 기준, 바이트 아님)
const MAX_JOURNAL_LENGTH_KO = 100;
const MAX_JOURNAL_LENGTH_EN = 200;

// 감지 방법: 한글 포함 여부로 판단
const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
const maxLength = isKorean ? MAX_JOURNAL_LENGTH_KO : MAX_JOURNAL_LENGTH_EN;
```

### 2.7 공유 카드 이미지 생성

```typescript
// ✅ react-native-view-shot 사용
// ❌ html2canvas 금지 (RN에서 DOM 없음)

// 모든 공유 이미지에 워터마크 오버레이 레이어 포함 필수 (PRD 1.4 ④)
// 갤러리 저장 전 expo-media-library 권한 선행 요청
```

---

## 3. 보안 규칙

- **Supabase RLS**: 접근하는 모든 테이블에 RLS 정책이 적용되어 있는지 확인한다.
- **환경변수**: `EXPO_PUBLIC_*` 값은 번들에 포함되어 누구나 볼 수 있다. Service Role Key는 절대 앱에 포함 금지.
- **이미지 캐싱**: `expo-image` 사용. `blurHash` + 디스크 캐시 적용 기본.
- **이미지 렌더링**: 원격 이미지는 width/height 또는 `flex: 1` + `resizeMode` 지정 필수 (레이아웃 깨짐 방지).

---

## 4. 하네스 엔지니어링 (테스트 규칙)

### 테스트 대상 (services/ 레이어만)

```typescript
// __tests__/services/quotes.service.test.ts 예시
import { quotesService } from '@/services/quotes.service';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('quotesService.fetchByCategory', () => {
  it('카테고리 슬러그로 명언 목록을 반환한다', async () => {
    // msw 핸들러로 Supabase HTTP 응답 mocking
    server.use(
      http.get('*/quotes*', () =>
        HttpResponse.json({ data: [{ id: '1', text: '테스트 명언' }], error: null })
      )
    );
    const result = await quotesService.fetchByCategory('wisdom');
    expect(result).toHaveLength(1);
  });

  it('Supabase 에러 시 Error를 throw한다', async () => {
    server.use(
      http.get('*/quotes*', () =>
        HttpResponse.json({ data: null, error: { message: 'DB error' } })
      )
    );
    await expect(quotesService.fetchByCategory('invalid')).rejects.toThrow();
  });
});
```

### 테스트 제외 대상

- `app/` 화면 컴포넌트 — 눈으로 직접 확인
- `hooks/` TanStack Query 훅
- `stores/` Zustand 스토어

---

## 5. 네이티브 연동 및 금지 사항

**보고 필수**: 네이티브(SwiftUI, Kotlin) 코드 수정 시 아래 항목을 먼저 보고한다.
1. **빌드 필요 여부** — JS 번들만으로 가능한지, 네이티브 재빌드 필요한지
2. **플랫폼별 영향도** — iOS 전용 / Android 전용 / 공통 여부
3. **Expo Go 호환 여부** — bare workflow 전용 모듈이면 명시

**절대 금지 사항**

```
❌ app/ 디렉토리에서 supabase 직접 import
❌ AsyncStorage 직접 사용 → MMKV 사용
❌ html2canvas → react-native-view-shot 사용
❌ new Date() 날짜 처리 → dayjs 사용
❌ 경로 문자열 하드코딩 → ROUTES 상수 사용
❌ React Native 기본 Image → expo-image 사용
❌ window, document, localStorage, <div>, <span> 등 웹 전용 API
❌ 카카오 SDK 오류 시 앱 크래시 → OS Share Sheet 폴백 필수
❌ 광고 금지 구역(홈 캔버스·journal-write·quote-share)에 AdMob 렌더링
❌ UI 텍스트 한글 하드코딩 → t() 함수 사용 (명언 본체 DB 값 제외)
```

**주석**: 모든 비즈니스 로직 주석은 반드시 **한국어**로 작성한다.
