# ANTIGRAVITY.web.md — Moment 관리자 웹 전용 (Next.js)

> 이 파일은 AGENTS.md보다 항상 우선한다.
> Antigravity 세션 시작 시 AGENTS.md + 이 파일 + Moment_PRD_v2.7.md 를 함께 첨부한다.

---

## 0. 기술 스택 기준

**코어**

- **Next.js 15** (App Router), **TypeScript** (No Any — strict 모드)
- **Tailwind CSS**, **shadcn/ui**
- **TanStack Query v5**, **Supabase**, **PapaParse**

**Analytics 대시보드**

- **Recharts** — KPI 차트 (DAU·퍼널·리텐션 등). 서버 컴포넌트에서 직접 import **금지**.
- **@tanstack/react-table** — 명언·유저 데이터 테이블
- **PostHog** — 유저 행동 분석. Private Key는 서버 전용. 대시보드는 iframe 임베드로 시작.

**모니터링**

- **Sentry** — 관리자 웹 에러 모니터링 (RN 앱과 별도 프로젝트 등록)

**패키지 매니저**: **npm** (pnpm / yarn 사용 금지)

---

## 1. Next.js 전략 및 데이터 규칙

### 1.1 서버/클라이언트 컴포넌트 구분 원칙

**작업 시작 전 반드시 "이 컴포넌트가 서버인가, 클라이언트인가"를 먼저 판단하고 설명한다.**

```
서버 컴포넌트 (기본값):
  - 데이터 페치 (Supabase 직접 조회)
  - 레이아웃, 페이지 구조
  - SEO가 필요한 콘텐츠

클라이언트 컴포넌트 ('use client' 선언):
  - 인터랙션 (onClick, onChange, useState)
  - Recharts 차트 (브라우저 전용)
  - shadcn/ui 일부 컴포넌트 (Dialog, Dropdown 등)
  - PostHog iframe 임베드
```

### 1.2 데이터 페치 규칙

- 서버 사이드 fetch 가능한 경우 `services/`를 통해 서버에서 직접 호출 권장.
- 클라이언트 인터랙션이 필요한 경우만 TanStack Query 사용.
- **Query Key 관리**: `queryKeys.ts`에서 Factory 패턴으로 통합 관리. 하드코딩 금지.

```typescript
// src/constants/queryKeys.ts
export const queryKeys = {
  quotes: {
    all: () => ['quotes'] as const,
    list: (params: QuoteListParams) => ['quotes', 'list', params] as const,
  },
  analytics: {
    dau: (range: DateRange) => ['analytics', 'dau', range] as const,
    funnel: () => ['analytics', 'funnel'] as const,
  },
} as const;
```

### 1.3 CSV 파싱 (PapaParse)

PapaParse는 브라우저 전용 라이브러리다. 클라이언트 컴포넌트의 전담 서비스로만 구현한다.

```typescript
// ✅ 클라이언트 컴포넌트에서만
'use client';
import Papa from 'papaparse';

// ❌ 서버 컴포넌트에서 직접 호출 금지
```

---

## 2. 인증 및 보안 (필수)

### 2.1 미들웨어 보호

관리자 웹의 **모든 라우트**는 인증 없이 접근 불가해야 한다.

```typescript
// middleware.ts — 필수 구현
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // admin role 확인 — 서버에서만 수행 (클라이언트 if (isAdmin) 금지)
  const { data: profile } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### 2.2 환경변수 규칙

| 키 | prefix | 이유 |
|---|---|---|
| Supabase URL | `NEXT_PUBLIC_` | 클라이언트 노출 허용 |
| Supabase anon key | `NEXT_PUBLIC_` | 클라이언트 노출 허용 |
| Supabase Service Role Key | 없음 (서버 전용) | 절대 클라이언트 노출 금지 |
| PostHog Private Key | 없음 (서버 전용) | API Route에서만 참조 |
| RevenueCat Webhook Secret | 없음 (서버 전용) | API Route에서만 참조 |

### 2.3 권한 판단 위치

- 관리자 권한 확인은 **반드시 서버 또는 미들웨어**에서만 수행.
- 클라이언트에서 `if (isAdmin)` 으로 UI를 숨기는 방식은 **보안 처리로 인정하지 않음**.

---

## 3. Analytics 대시보드 구현 규칙 (PRD 8.2)

### 3.1 라우트 구조

```
app/
  admin/
    layout.tsx              ← 미들웨어 통과 후 공통 레이아웃
    page.tsx                ← 관리자 홈 → /admin/analytics 리다이렉트
    analytics/
      page.tsx              ← KPI 개요 탭 (서버 컴포넌트)
      content/page.tsx      ← 콘텐츠 성과 탭
      behavior/page.tsx     ← 유저 행동 (PostHog iframe)
      revenue/page.tsx      ← 수익 탭
    quotes/page.tsx         ← 명언 관리
    categories/page.tsx     ← 카테고리 관리
    themes/page.tsx         ← 시즌 테마팩 관리
```

### 3.2 Recharts 사용 규칙

```typescript
// ✅ 반드시 'use client' 선언 (Recharts는 브라우저 전용)
'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ 반드시 ResponsiveContainer로 감싸기 (고정 width/height 금지)
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={dauData}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="dau" stroke="#E8491E" />
  </LineChart>
</ResponsiveContainer>

// ✅ 로딩 중 Skeleton 필수 (차트 로드 전 빈 영역 노출 금지)
// ✅ 빈 데이터: Empty State 표시 (빈 차트 렌더링 금지)
// ✅ 색상: 디자인 토큰 사용 (color-action-cta = #E8491E 메인)

// ❌ 서버 컴포넌트에서 Recharts 직접 import 금지
```

### 3.3 PostHog 연동 방식

MVP: **iframe 임베드** 방식으로 시작 (빠른 구현).

```typescript
// app/admin/analytics/behavior/page.tsx
'use client';
export default function BehaviorPage() {
  return (
    <iframe
      src={`https://app.posthog.com/embedded/dashboard/${process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_ID}`}
      className="w-full h-[80vh] border-0 rounded-xl"
      title="유저 행동 분석 대시보드"
    />
  );
}
```

커스텀 UI가 필요해지면 PostHog API Route 방식으로 전환:

```typescript
// app/api/analytics/posthog/route.ts (서버 전용)
import { PostHog } from 'posthog-node';
const client = new PostHog(process.env.POSTHOG_PRIVATE_KEY!);
// process.env.NEXT_PUBLIC_ 사용 금지
```

### 3.4 RevenueCat Webhook 처리

```typescript
// app/api/webhooks/revenuecat/route.ts
import { createHmac } from 'crypto';

export async function POST(req: Request) {
  // 1. 서명 검증 (반드시 구현 — 생략 금지)
  const signature = req.headers.get('x-revenuecat-signature');
  const body = await req.text();
  const expected = createHmac('sha256', process.env.REVENUECAT_WEBHOOK_SECRET!)
    .update(body).digest('hex');

  if (signature !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. 구독 이벤트 Supabase 저장
  const event = JSON.parse(body);
  const supabase = createClient(/* service role */);
  await supabase.from('subscription_events').insert({
    event_type: event.event.type,
    user_id: event.event.app_user_id,
    plan: event.event.product_id,
    occurred_at: new Date(event.event.event_timestamp_ms).toISOString(),
  });

  return new Response('OK');
}
```

---

## 4. UI/UX 원칙

- **shadcn/ui 우선**: 새 컴포넌트 만들기 전 shadcn/ui에 있는지 먼저 확인.
- **Data Tables**: 모든 테이블 구현 시 **로딩 스켈레톤 + 페이지네이션 필수**.
- **날짜 범위**: DateRangePicker 기본값 최근 30일.
- **차트 로딩**: Skeleton 높이를 실제 차트 높이와 동일하게 (레이아웃 시프트 방지).

---

## 5. 금지 사항

```
❌ "use client" 남발 — 인터랙션 필요한 말단 컴포넌트에서만 사용
❌ 서버 컴포넌트에서 Recharts, PapaParse 등 브라우저 전용 라이브러리 직접 import
❌ 클라이언트 컴포넌트에서 Supabase Service Role Key 참조
❌ 클라이언트 컴포넌트에서 PostHog Private Key 참조
❌ RevenueCat Webhook 서명 검증 생략
❌ Analytics 데이터 클라이언트에서 직접 집계 (서버/Supabase 뷰에서 집계 후 반환)
❌ 클라이언트에서 if (isAdmin) 으로만 권한 처리
```

**주석**: 모든 비즈니스 로직 주석은 반드시 **한국어**로 작성한다.
