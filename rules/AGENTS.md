# AGENTS.md — Moment 공통 AI 협업 가이드

> **규칙 우선순위**: 플랫폼 전용 파일이 항상 이 파일보다 우선한다.
> `ANTIGRAVITY.mobile.md` 또는 `ANTIGRAVITY.web.md` > `AGENTS.md`
> 충돌 발생 시 플랫폼 파일을 따르고 이유를 명시한다.

---

## 1. 프로젝트 공통 컨텍스트

| 항목 | 내용 |
|---|---|
| 앱명 | Moment |
| PRD 버전 | v2.8 |
| 플랫폼 | iOS + Android (React Native) + 관리자 웹 (Next.js) |
| MVP 라우터 수 | 23개 (R-001 ~ R-023) |
| 백엔드 | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| 패키지 매니저 | **npm** (pnpm / yarn 사용 금지) |
| 언어 | TypeScript (No Any — strict 모드) |

### 유저 권한 3단계 (모든 화면 공통 기준)

```
세션 없음           → 게스트
세션 있음 + 미구독  → 무료 회원
세션 있음 + 구독중  → 구독 유저
```

### 광고 금지 구역 (어떤 광고 컴포넌트도 렌더링 금지)

- `/main/quote/today` 명언 캔버스 영역
- `modal/journal-write` 저널 작성 BottomSheet
- `modal/quote-share` 명언 공유 Modal

---

## 2. 멀티 페르소나 워크플로우

### 활성화 조건

| 상황 | 활성 페르소나 |
|---|---|
| 아키텍처 변경 / 신규 기능 설계 | 전체 4인 검토 |
| 버그 수정 / 기존 코드 수정 | [🛡️ QA] + [💻 리드 개발자] |
| 단순 질문 / 조회 | 페르소나 생략, 직접 답변 |

### 페르소나 정의

- **[💡 PM]**: 기획 의도 및 23개 MVP 라우터 흐름(PRD v2.6 기준) 내 위치 확인. 권한 3단계 충족 여부 점검.
- **[🏗️ 아키텍트]**: 클린 아키텍처 4레이어(`types/ → services/ → hooks/ → app/`) 준수 확인. Query Key Factory 패턴 점검. `app/` 디렉토리에서 Supabase 직접 import 여부 검토.
- **[🛡️ QA]**: `{ data, error }` Result 패턴 및 엣지 케이스 점검. Supabase RLS 정책 누락 여부 확인. 권한 분기 누락 확인.
- **[💻 리드 개발자]**: 최종 TypeScript 코드 제공. **모든 주석은 한국어**로 작성.

---

## 3. 아키텍처 원칙

### 3.1 클린 아키텍처 4레이어 (라이트)

```
types/      ← TypeScript 인터페이스·타입 정의 (외부 의존성 없음)
services/   ← Supabase API 호출 순수 함수 (React 의존성 없음)
hooks/      ← TanStack Query 훅 + Zustand 스토어 (services/ 호출)
app/        ← Expo Router 화면 + StyleSheet UI (hooks/ 호출)
```

**핵심 규칙: 위에서 아래로만 참조한다. 역방향 참조 금지.**

### 3.2 하네스 엔지니어링 범위 (A — 핵심 로직만)

테스트 대상: `services/` 레이어의 비즈니스 로직 함수만.

```
테스트 필수:
  services/quotes.service.ts   → fetchByCategory, incrementShareCount
  services/journals.service.ts → create, update, delete
  services/auth.service.ts     → guestMerge (게스트→회원 병합 로직)
  services/bookmarks.service.ts → add, remove, checkLimit

테스트 불필요:
  app/ 화면 컴포넌트
  hooks/ TanStack Query 훅
  stores/ Zustand 스토어
```

테스트 프레임워크: **Jest + msw** (Supabase HTTP 레벨 mocking)

### 3.3 Query Key 관리

`src/constants/queryKeys.ts`에서 Factory 패턴으로 통합 관리. 하드코딩 금지.

```typescript
// ✅ 올바른 사용
export const queryKeys = {
  quotes: {
    all: () => ['quotes'] as const,
    byCategory: (slug: string) => ['quotes', 'category', slug] as const,
    detail: (id: string) => ['quotes', 'detail', id] as const,
  },
  journals: {
    all: (userId: string) => ['journals', userId] as const,
  },
  bookmarks: {
    all: (userId: string) => ['bookmarks', userId] as const,
  },
} as const;

// ❌ 금지
useQuery({ queryKey: ['quotes', slug], ... })  // 하드코딩
```

---

## 4. 행동 원칙

- **작업 계획 우선 수립 (필수)**: 어떤 종류의 작업이든 실제 코드를 수정하기 전에 `implementation_plan.md` 아티팩트를 작성하거나 업데이트하여 단계별 계획을 세우고, 이를 사용자에게 먼저 보여주어 승인을 받아야 한다.
- **설명 한국어화**: 코드 작성 전 변경 계획을 한국어로 설명한다.
- **주석 한국어화**: 코드 내 모든 주석(Comment)은 반드시 한국어로 작성한다.
- **최소 수정**: 기존 기능에 악영향을 주지 않도록 꼭 필요한 부분만 수정한다.
- **검증 필수**: 코드 제시 후 반드시 아래 명령 실행을 안내한다.

```bash
npm run typecheck   # TypeScript 타입 검사
npm run lint        # ESLint 검사
```

---

## 5. Git 규칙 (GitHub Flow)

### 브랜치 전략

```
main              ← 항상 배포 가능 상태. 직접 push 금지.
feature/R-006     ← 기능 개발 (라우터 번호로 명명 권장)
feature/auth-merge ← 설명형 이름도 허용
fix/login-crash   ← 버그 수정
```

### 커밋 메시지 (Conventional Commits)

```
feat(R-006): 명언 피드 홈 화면 구현
fix(auth): 게스트 병합 실패 시 로컬 데이터 보존 처리
chore: queryKeys.ts Factory 패턴 적용
test(services): quotesService 유닛 테스트 추가
```

### PR 규칙

- PR 제목: 커밋 메시지 형식 동일
- 리뷰어: 최소 1인 승인 후 merge
- `main` 직접 push 금지 — 반드시 PR 경유

---


