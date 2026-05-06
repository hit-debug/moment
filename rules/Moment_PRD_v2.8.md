# Moment PRD v2.8
**명언 & 한 줄 편지 앱**

| 항목 | 내용 |
|------|------|
| 문서 버전 | v2.8 |
| 이전 버전 | v2.6 |
| 플랫폼 | iOS / Android (React Native) |
| 상태 | **Design System v3.0 반영 및 UI 고도화 완료** |
| 핵심 기술 | React Native · Supabase · RevenueCat · AdMob · TanStack Query · Next.js · PostHog · Sentry |
| 업데이트 내역 | ① Design System v3.0 시맨틱 토큰 기반 라이트 모드 지원 / ② 시스템 테마 자동 전환(R-015) 신설 / ③ Moment Look 모달(R-021) 3열 그리드 및 높이 95% 확장 / ④ 공유 모달(R-008b) 크기 94% 확장 및 미리보기 확대 / ⑤ 저널(R-009) 월별 필터 탭 적용 및 실시간 상태 동기화 / ⑥ 보관함 삭제 취소(Undo) UX 도입 |

---

## 목차

1. [개요](#1-개요-overview)
2. [성공 지표](#2-성공-지표-key-metrics)
3. [라우터 전체 구조](#3-라우터-전체-구조-route-map)
4. [상세 기능 요구사항](#4-상세-기능-요구사항-functional-requirements)
5. [수익화](#5-수익화-monetization)
6. [예외 처리 및 엣지 케이스](#6-예외-처리-및-엣지-케이스-edge-cases)
7. [데이터 스키마](#7-데이터-스키마-data-schema)
8. [관리자 CMS](#8-관리자-cms-nextjs-app-router)
9. [개발 구현 지침](#9-개발-구현-지침-implementation-guidelines)
10. [다국어 및 글로벌 개인정보법 대응](#10-다국어-및-글로벌-개인정보법-대응)

---

## 1. 개요 (Overview)

### 1.1 제품 목적

매일 큐레이션된 명언을 제공하고, 사용자가 이를 개인 저널로 기록하거나 지인에게 한 줄 편지 형태의 이미지 카드로 공유할 수 있는 모바일 앱이다. 공유된 카드에는 앱 워터마크가 포함되어 자연스러운 신규 유저 유입을 유도한다.

---

### 1.2 타겟 유저

| 유형 | 설명 |
|------|------|
| Self-Grower | 매일 명언으로 하루를 주도적으로 시작하고 싶은 사람 |
| Warm-Messenger | 지인에게 마음을 전하고 싶지만 적절한 문구를 찾지 못했던 사람 |
| Community-Seeker | 좋은 가치를 공유하며 주변과 함께 성장하길 원하는 사람 |

---

### 1.3 핵심 기능 3축

| 축 | 구현 방식 |
|----|----------|
| 영감 (Inspiration) | 풀스크린 명언 캔버스. 감성적 배경 이미지 + 고가독성 타이포그래피 |
| 기록 (Archive) | 개인 저널 작성 + 구독 유저 보관함. 퍼스널 아카이빙 |
| 공유 (Share) | 명언 + 한 줄 코멘트를 이미지 카드로 생성하여 외부 전송. 카드에 앱 워터마크 포함 |

---

### 1.4 MVP 설계 원칙

**① 노-로그인 게스트 모드 우선**
앱 설치 직후 회원가입 없이 즉시 명언을 노출한다. 강제 회원가입 화면을 앱 진입 시점에 배치하지 않는다.

**② 소프트게이트 — 가치 경험 후 가입 유도**
저장, 저널, 코멘트 공유 등 개인화 기능에 접근할 때 `modal/login-prompt` 팝업을 노출한다. 팝업에는 가입 시 제공되는 혜택을 명확히 표시한다.

**③ 감성적 UI/UX 최우선**
편지 작성 및 공유 화면은 기능 복잡도를 최소화하고 시각적 완성도(타이포그래피, 여백, 배경 이미지)를 최우선으로 한다.

**④ 워터마크 기반 바이럴 루프**
사용자가 외부로 공유하는 모든 이미지 카드에 앱 로고 또는 워터마크를 삽입한다. 별도 초대 링크·추천인 코드는 사용하지 않는다.

---

### 1.5 유저 권한 체계

> **권한 흐름:** 미가입 → 게스트 / 가입(소셜 로그인) → 무료 회원 / 구독 결제 → 구독 유저

| 권한 | 정의 | 접근 가능 기능 | 제한 기능 |
|------|------|--------------|----------|
| 게스트 | 비로그인 상태 | 명언 열람, 좋아요/싫어요, 명언만 공유 | 저널 작성, 저장(보관함), 알림, 테마 변경 |
| 무료 회원 | 소셜 로그인 완료, 미구독 | 게스트 기능 전체 + 저널 작성·전체 열람, 편지 공유, 알림, 테마 기본 선택 | 보관함, 다중 카테고리, 내보내기 |
| 구독 유저 | 인앱 구독 활성 상태 | 전체 기능 | — (보관함 30개 기본, 최대 70개) |

---

### 1.6 기술 스택

| 영역 | 내용 |
|------|------|
| 메인 앱 프레임워크 | React Native (TypeScript) |
| 개발 환경 | Expo SDK |
| 네이티브 브리지 | SwiftUI + WidgetKit (iOS) / Kotlin + Jetpack Glance (Android) |
| 서버 상태 관리 | TanStack Query (React Query) — Supabase 데이터 페치 & 캐싱 |
| 관리자 페이지 | Next.js (App Router) + Tailwind CSS + shadcn/ui |
| 백엔드 / DB | Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions) |
| 푸시 알림 | Supabase Edge Function (스케줄러) → FCM (Android) / APNs (iOS). Remote Push 방식 채택 |
| 결제 | RevenueCat SDK — Apple/Google 결제 API 직접 구현 금지 |
| 광고 | Google AdMob (배너·네이티브·리워드 영상) |
| 이미지 생성 | react-native-view-shot 라이브러리 (공유 카드 렌더링) |
| 카카오 공유 | 카카오 SDK — 실패 시 OS Share Sheet 자동 폴백 |
| CSV 파싱 | PapaParse (관리자 CMS 명언 일괄 업로드) |
| 다국어 (UI 쉘) | react-i18next — **앱 UI 텍스트**(설정·마이페이지·온보딩·알림 문구 등)에만 적용. 기기 언어 자동 감지, R-022 수동 전환 지원 |
| 명언 콘텐츠 다국어 | 언어별 독립 DB 테이블로 서빙. react-i18next 미사용. 유저 `locale`에 맞는 quotes 테이블에서 API 호출 |
| 개인정보 | GDPR(EU) · CCPA(미국 캘리포니아) · APPI(일본) 지역 감지 기반 동의 처리. iOS ATT 권한 요청 (온보딩 포함) |
| 관리자웹 스타일링 | Tailwind CSS + shadcn/ui |
| 앱 스타일링 | StyleSheet (React Native) + Design System v3.0 시맨틱 토큰 |
| 라우팅 | Expo Router (File-based Routing, 딥링크 자동 지원) |
| 상태 관리(UI) | Zustand (테마, 모달, 온보딩 등 로컬 UI 상태 관리) |
| 빌드 및 업데이트 | EAS Build (클라우드 빌드) + EAS Update (OTA 실시간 업데이트) |
| 에러 모니터링 | Sentry — RN 앱 + Next.js 관리자 웹 양쪽 적용. 크래시·에러 실시간 리포팅 |
| 유저 행동 분석 | PostHog — 세션 레코딩·퍼널·히트맵·코호트. RN 앱 SDK + 관리자 대시보드 연동 |
| 관리자 차트 | Recharts — 관리자 Analytics 대시보드 KPI 시각화 |
| 관리자 테이블 | @tanstack/react-table — 관리자 명언·유저 데이터 테이블 |
| 언어 | TypeScript (전 레이어) |

> ⚠️ **WatchKit은 MVP·Phase 2 범위에서 제외.** Phase 3(확장) 단계에서 검토.

---

### 1.7 위젯 개발 범위 및 순서

> ⚠️ **위젯 구현(R-020)은 MVP 구현 마지막 단계에 개발합니다.** 메인 앱 기능이 모두 안정화된 후 네이티브 브리지 작업을 진행합니다.

| 단계 | 범위 |
|------|------|
| Phase 1 (MVP 코어) | R-001 ~ R-019, R-021 ~ R-023 구현 |
| Phase 2 (위젯) | R-020: iOS WidgetKit (Swift) + Android Jetpack Glance (Kotlin) 별도 개발 |
| Phase 3 (확장) | 워치 위젯 (WatchKit / Galaxy Watch), 시즌 테마팩 확장, 저널 장문 에디터 검토 |

---

## 2. 성공 지표 (Key Metrics)

### 2.1 활성화 및 전환 지표

| 지표 | 정의 | 목표 |
|------|------|------|
| Aha-Moment 도달률 | 게스트 상태에서 좋아요 또는 싫어요를 1회 이상 완료한 유저 비율 | 70% 이상 |
| 소프트게이트 전환율 | modal/login-prompt 노출 후 실제 회원가입으로 이어진 비율 | 50% 이상 |

**트래킹 요구사항**
- 게스트 좋아요/싫어요 이벤트를 별도 코호트로 수집한다.
- 소프트게이트 노출 횟수와 가입 완료 횟수를 각각 독립 이벤트로 기록한다.

---

### 2.2 감성적 인게이지먼트 지표

| 지표 | 정의 | 측정 목적 |
|------|------|----------|
| 코멘트 작성 공유율 | 공유 액션 중 코멘트를 직접 작성하여 공유까지 완료한 비율 | 편지 UI 감성 유도 효과 검증 |
| 개인 저널 작성률 | 저널 아이콘 진입 후 저널을 실제 작성 완료한 유저 비율 | 앱의 기록 도구 기능 검증 |

**트래킹 요구사항**
- 공유 액션을 '명언만 공유'와 '코멘트 포함 공유'로 구분하여 각각 이벤트를 기록한다.
- 저널 아이콘 탭 이벤트와 저널 저장 완료 이벤트를 분리 수집한다.

---

### 2.3 바이럴 및 획득 지표

| 지표 | 정의 | 트래킹 |
|------|------|-------|
| Share Rate | 전체 DAU 중 하루 1회 이상 공유 액션을 수행한 유저 비율 | 공유 채널(카카오·인스타·OS), 유저 권한(게스트·무료·구독) 함께 기록 |

---

### 2.4 리텐션 지표

| 지표 | 정의 | 비고 |
|------|------|------|
| D-1 재방문율 | 가입 다음 날 앱을 재방문한 유저 비율 | 가입/비가입 코호트 분리 |
| D-7 재방문율 | 가입 7일 후 앱을 재방문한 유저 비율 | 가입/비가입 코호트 분리 |
| 위젯 설치율 | 전체 설치 유저 중 홈화면 위젯을 활성화한 유저 비율 | D-7 리텐션 선행 지표 |

---

## 3. 라우터 전체 구조 (Route Map)

| ID | Path | 화면명 | 최소 권한 | 스택 |
|----|------|--------|----------|------|
| R-001 | /splash | 스플래시 | 전체 | Root |
| R-002 | /onboarding/start | 온보딩 설문·권한 (3-step) | 전체 | Onboarding |
| R-003 | modal/login-prompt | 로그인 팝업 (소프트게이트) | 게스트 | Modal |
| R-004 | /onboarding/setup | 초기 설정 (푸시·위젯 가이드) | 전체 | Onboarding |
| R-023 | /onboarding/privacy-consent | 개인정보 동의 (R-002 Step3 통합) | 전체 | Onboarding |
| R-005 | /auth/login | 로그인 (토큰 만료 재인증) | 무료+ | Auth |
| R-006 | /main/quote/today | 명언 피드 홈 (기본탭) | 전체 | Quote |
| R-007 | /main/quote/category | 카테고리 필터 | 전체 | Quote |
| R-008 | modal/journal-write | 저널 작성 BottomSheet | 무료+ | Modal |
| R-008b | modal/quote-share | 명언 SNS 공유 Modal | 전체(명언만 게스트 가능) | Modal |
| R-021 | modal/quote-customize | 테마 설정 Modal (홈 롱프레스) | 무료+ | Modal |
| R-009 | /main/journal/list | 저널 목록 (Journal 탭) | 무료+ | Journal |
| R-010 | /main/journal/detail | 저널 상세 (열람·수정·삭제) | 무료+ | Journal |
| R-011 | /main/my/index | 마이페이지 허브 | 전체 | My |
| R-012 | /main/my/bookmarks | 보관함 | 구독 | My |
| R-013 | /main/my/hidden | 히든함 | 전체 | My |
| R-014 | /main/my/settings/notification | 알림 설정 | 전체 | My |
| R-015 | /main/my/settings/theme | 테마 설정 (마이페이지) | 무료+ | My |
| R-016 | /main/my/settings/quote-pref | 명언 선호 재설정 | 전체 | My |
| R-017 | /main/my/settings/account | 계정 관리 | 무료+ | My |
| R-018 | /main/my/settings/widget-guide | 위젯 설정 가이드 | 전체 | My |
| R-019 | /main/my/subscription | 구독 관리·결제 | 전체 | My |
| R-020 | widget/ios + widget/android | 네이티브 위젯 모듈 **(Phase 2)** | 전체 | Widget |
| R-022 | /settings/language | 언어 변경 | 전체 | Global |

> 하단 내비게이션 탭 구성(Quote / Journal / My)과 Journal 탭의 독립 배치 여부는 UI/UX 설계 단계에서 최종 확정합니다.

---

## 4. 상세 기능 요구사항 (Functional Requirements)

### 4.1 R-001 — /splash 스플래시

세션 및 온보딩 완료 여부를 확인하여 다음 화면으로 자동 분기한다.

| 조건 | 분기 대상 |
|------|----------|
| onboarding_done = false | /onboarding/start |
| onboarding_done = true, 세션 없음 | /main/quote/today (게스트) |
| onboarding_done = true, 세션 있음 | /main/quote/today (로그인) |
| 토큰 만료 | /auth/login |

> ℹ️ 분기 조건 변경 시 R-001만 수정한다. 다른 화면은 분기 로직을 포함하지 않는다.
> 분기 판별은 최대 2초 이내 완료. 초과 시 게스트 모드로 폴백.

---

### 4.2 R-002 — /onboarding/start 온보딩 설문·권한 (3-step)

카테고리 수집, 추적 권한, 개인정보 동의를 3단계 멀티스텝으로 처리한다.

| 단계 | 내용 | 저장 |
|------|------|------|
| Step 1 | 명언 카테고리 선택 | user.pref.category[] → LocalStorage |
| Step 2 | ATT 팝업 (iOS 전용) | trackingStatus 저장 (iOS 14+ 필수) |
| Step 3 | /onboarding/privacy-consent 통합 | 개인정보·광고 동의. 지역별 법령 자동 감지 → GDPR(EU) / CCPA(미국 CA) / APPI(일본) / 기본(그 외) 화면으로 분기 |

> ⚠️ 카테고리 선택지 UI는 D-07 이후 확정 가능. 선택지 변경 시 R-002, R-007, R-016 동시 수정 필요.

---

### 4.3 R-003 — modal/login-prompt 소프트게이트 로그인 팝업

게스트가 개인화 기능을 시도할 때 노출되는 회원 전환 유도 Modal이다.

**트리거 조건**

| 트리거 | 발생 화면 |
|--------|----------|
| 저장(보관함) 시도 | 홈 화면 저장 아이콘 탭 |
| 저널 작성 시도 | 홈 화면 저널 아이콘 탭 |
| 테마 변경 시도 | 홈 롱프레스 또는 마이페이지 테마 설정 진입 |
| 토큰 만료 후 재진입 | R-005에서 처리. R-003은 호출하지 않음 |

**UI 구성**
- Google 로그인 버튼, Apple 로그인 버튼, '나중에 (닫기)' 버튼 3종 배치.
- 로그인 완료 시 게스트 로컬 데이터(좋아요·싫어요·히든함)를 서버로 동기화 후 원래 화면으로 복귀.
- '나중에' 탭 시 팝업 닫고 현재 화면 유지. 저장·저널 액션은 중단.
- 저장 데이터: `user.id`, `user.provider` → Supabase Auth

**로그인 실패 예외 처리** *(v2.5 추가)*

| 실패 유형 | 처리 방식 |
|----------|----------|
| 네트워크 오류 | "로그인 되지 않았어요. 재시도 해주세요." 팝업 노출 후 닫기 버튼 제공 |
| 계정 정지 / 소셜 계정 오류 | 동일 팝업 노출. 오류 코드는 로컬 로그에만 기록, 유저에게 노출 금지 |
| 연속 3회 실패 | 팝업 유지 + "문제가 계속되면 다른 방법으로 로그인해 보세요." 보조 문구 추가 |
| 취소 (유저가 소셜 로그인 팝업 직접 닫음) | 팝업 닫힘. 오류 메시지 없음. 현재 화면 유지 |

> 실패 시 게스트 상태 유지. 로컬 데이터 손실 없음.

**게스트 → 회원 전환 시 데이터 병합 규칙** *(v2.5 추가)*

로그인 완료 즉시 아래 순서로 로컬 데이터를 서버에 병합한다.

| 데이터 | 병합 규칙 |
|--------|----------|
| 좋아요 (quote_reactions) | 서버에 동일 (user_id + quote_id + 'like') 조합이 이미 존재하면 로컬 무시. 없으면 insert |
| 싫어요 (quote_reactions) | 서버에 동일 (user_id + quote_id + 'dislike') 조합이 이미 존재하면 로컬 무시. 없으면 insert |
| reaction_type 충돌 시 | 로컬 like, 서버 dislike → 서버 유지 |
| 히든함 (hidden_quotes) | 로컬 전용 유지. 서버 동기화 없음 |

**병합 처리 순서**
1. 로그인 완료 → Supabase Auth 세션 확보
2. AsyncStorage에서 로컬 좋아요·싫어요 목록 읽기
3. 서버 기존 데이터와 비교 → 중복 제외 후 bulk insert
4. 병합 완료 후 AsyncStorage 로컬 반응 데이터 삭제
5. 원래 화면으로 복귀

> 병합 실패(네트워크 오류) 시 로컬 데이터 보존. 다음 앱 실행 시 재시도.

---

### 4.4 R-004 — /onboarding/setup 초기 설정

온보딩 마지막 단계. 푸시 알림 설정과 위젯 가이드를 제공하여 리텐션 훅을 확보한다.

| 기능 | 저장 |
|------|------|
| 푸시 알림 시간대 설정 | user.notify.time (기본 07:00~22:00) |
| 알림 횟수 설정 | user.notify.freq (기본 4회, 최대 10회) |
| 위젯 추가 안내 | R-018 화면 연결 또는 인라인 가이드 노출 |

> 닉네임 입력 없음 (MVP). 닉네임 추가 결정 시 입력 필드 신설.

---

### 4.5 R-005 — /auth/login 로그인 (토큰 만료 재인증)

토큰 만료 시 자동 분기되는 재인증 화면이다. R-003 소프트게이트와 인증 로직을 공유한다.

**로그인 실패 예외 처리** *(v2.5 추가)*

| 실패 유형 | 처리 방식 |
|----------|----------|
| 네트워크 오류 | "로그인 되지 않았어요. 재시도 해주세요." 팝업 노출 후 닫기 버튼 제공 |
| 계정 정지 / 소셜 계정 오류 | 동일 팝업 노출. 오류 코드는 로컬 로그에만 기록, 유저에게 노출 금지 |
| 연속 3회 실패 | "문제가 계속되면 다른 방법으로 로그인해 보세요." 보조 문구 추가 |
| 취소 (유저가 소셜 로그인 팝업 직접 닫음) | 팝업 닫힘. 오류 메시지 없음. 게스트 모드로 진입 |

> R-005 인증 로직 변경 시 R-003에도 동일 반영 필수.

---

### 4.6 R-006 — /main/quote/today 명언 피드 홈

앱의 핵심 화면. 풀스크린 명언 캔버스와 5종 액션 아이콘으로 구성된다.

**화면 구성**
- 명언 캔버스가 화면 전체를 차지한다. 배경은 딤(Dim) 처리된 고화질 이미지로, 기본 제공 테마 30종 중 유저가 선택한 테마가 적용된다.
- 텍스트 가독성을 최우선으로 한 타이포그래피 적용. `word-break: keep-all` 필수.
- 좌우 스와이프 → 이전/다음 명언 전환.
- 하단 스와이프 업(↑) → `modal/journal-write` BottomSheet 오픈.
- 롱프레스 → `modal/quote-customize` 테마 설정 Modal 오픈 (무료 이상. 게스트 → `modal/login-prompt`).
- 광고 없음 — 홈 화면 명언 캔버스 영역은 광고 금지 구역.

**하단 액션 아이콘 5종**

| 아이콘 | 동작 | 권한 | 비고 |
|--------|------|------|------|
| 좋아요 | 긍정 반응 저장. 탭 시 애니메이션 피드백 | 게스트 포함 전체 | 게스트: 로컬 저장 + quote_stats.like_count +1 → 가입 시 서버 동기화 |
| 싫어요 | 부정 반응. 해당 명언 히든 처리 | 게스트 포함 전체 | 로컬 hidden_quotes에 추가 (최대 20개) + quote_stats.dislike_count +1 |
| 저장 | 보관함에 저장. 하트 채워짐 애니메이션 + 토스트. 재탭 시 저장 해제 | 구독 유저 전용 | 비구독 탭 → 구독 유도 팝업 |
| 공유 | 공유 방식 선택 시트: ① 명언만 공유 → `modal/quote-share` ② 편지와 함께 → `modal/journal-write` | 명언만: 게스트 가능 / 편지: 무료 이상 | 게스트는 코멘트 없이 명언만 공유 가능 |
| 저널 | 툴팁: "이 명언을 나만의 기록으로 남겨보세요". `modal/journal-write`로 이동 | 무료 이상 | 게스트 탭 → `modal/login-prompt` |

**명언 피드 순환 규칙 — 스포티파이 셔플 방식** *(v2.5 추가)*

| 항목 | 규칙 |
|------|------|
| 기본 방식 | 전체 활성 명언(is_active = true) 중 랜덤 노출 |
| 중복 방지 | 직전 30개 노출 명언은 다음 랜덤 풀에서 제외 |
| 히든함 제외 | hidden_quotes에 등록된 명언은 피드에 노출하지 않음 |
| 전체 소진 시 | 히든함 제외 명언을 모두 본 경우, 최근 30개 제외 규칙만 유지하며 순환 재시작 |
| 카테고리 필터 적용 시 | 선택한 카테고리 내에서 동일 규칙 적용 |

**최근 30개 추적 방식**
- 로컬 AsyncStorage에 `recent_quote_ids: string[]` 배열로 저장
- 새 명언 노출 시 배열 앞에 추가, 31번째 항목부터 자동 제거 (FIFO)
- 앱 재설치 시 초기화됨 (의도적 허용)

**API 호출 방식**
```
GET /quotes?locale=ko&exclude_ids=[최근30개+히든함IDs]&limit=10
```
서버에서 exclude_ids를 받아 해당 명언 제외 후 랜덤 정렬하여 반환. TanStack Query staleTime: 1시간 유지.

**데이터**
- 읽기: quotes API (TanStack Query로 캐싱)
- 저장: quote_reactions(게스트 로컬/회원 서버), quote_stats(게스트+회원 전체 집계), saved_quotes(회원만), hidden(로컬), share_count

---

### 4.7 R-007 — /main/quote/category 카테고리 필터

명언을 주제별로 분류하여 탐색하고, 수신할 카테고리를 지정한다.

| 권한 | 동작 |
|------|------|
| 무료 유저 | 단일 카테고리만 선택 가능. 다중 선택 시도 시 구독 유도 팝업 |
| 구독 유저 | 다중 선택 가능. UI 내 가치 문구 노출: "나만의 성장 믹스를 만들어보세요" |

- 카드형 또는 리스트형 UI. 무한 스크롤, 한 번에 10개씩 로드.
- 인라인 네이티브 광고: 매 7번째 또는 10번째 슬롯에 AdMob Native Advanced 삽입. 로드 실패 시 명언 카드로 자동 대체.

> ⚠️ 카테고리 변경 시 R-002, R-007, R-016 동시 수정 필요.

---

### 4.8 R-008 — modal/journal-write 저널 작성 BottomSheet

명언에 개인 저널을 작성하고 저장하는 BottomSheet Modal. 저장 완료 후 공유 버튼 활성화.

| 항목 | 내용 |
|------|------|
| 진입 경로 | 홈 저널 아이콘 탭 / 홈 하단 스와이프 업 / 홈 공유 → '편지와 함께' |
| 텍스트 입력 | Placeholder: "이 글귀를 전하고 싶은 분에게 한 줄을 남겨보세요." 최대 **한글 100자 / 영문 200자** (바이트 기준 100Bytes 내외) |
| 라이트 모드 | Design System v3.0 토큰 기반 글자 수 카운터 및 비활성 버튼 가독성 확보 |
| 저장 | journals(quote_id, user_id, text, created_at) Supabase 저장. Zustand 스토어와 연동하여 실시간 목록 동기화 |
| 저장 후 공유 | 저장 완료 후 '공유하기' 버튼 활성화. 탭 시 modal/quote-share로 연결 (수정 가능) |
| 공유본 수정 | 수정 내용은 공유에만 적용, 저장 기록(journals)은 갱신 안 함 |

> ℹ️ 저널 장문 확장 필요 시 전체화면 에디터로 교체 검토 (Phase 3).

---

### 4.9 R-008b — modal/quote-share 명언 SNS 공유 Modal

명언 이미지 카드에 짧은 코멘트를 추가하여 외부 공유하는 Modal.

| 항목 | 내용 |
|------|------|
| 진입 경로 | 홈 공유 아이콘 → '명언만 공유' / R-008 저장 완료 후 '공유하기' |
| 레이아웃 | 모달 전체 높이를 **94%**로 확장하여 하단 채널 버튼과 미리보기가 겹치지 않게 배치 |
| 미리보기 캔버스 | 명언 + 코멘트를 실시간 렌더링한 카드 미리보기 (Full: 너비 52%, Square: 너비 80%로 확대) |
| 데이터 연동 | 명언 홈에서 스와이프 중인 특정 명언 데이터가 공유 화면에 즉시 반영 |
| 코멘트 입력 | 최대 40자. 공유에만 사용, DB 저장 안 함 |
| 이미지 저장 | react-native-view-shot로 PNG/JPG 렌더링 → 기기 갤러리 저장 (권한 요청 선행) |
| 카카오톡 공유 | 카카오 SDK 피드형 메시지. 미설치/오류 시 OS Share Sheet 자동 폴백 |
| 공유 카운트 | quote_share_logs 기록. 채널·권한 함께 트래킹 |
| 워터마크 | 앱 로고 또는 워터마크 필수 삽입 |

> ℹ️ 공유 채널 구분 이벤트: 카카오톡 / 인스타그램 스토리 / 인스타그램 피드 / OS Share Sheet

---

### 4.10 R-021 — modal/quote-customize 테마 설정 Modal

홈 화면 롱프레스로 진입하는 명언 카드 개인화 Modal. 마이페이지 R-015와 컴포넌트 공유.

| 항목 | 내용 |
|------|------|
| 기본 테마 | 30종 자유 선택. 홈 화면 명언 캔버스에 즉시 반영. 스크롤 최소화를 위해 모달 높이 **95%** 적용 |
| 폰트 | 기존 리스트 형태에서 **가로 3열 그리드**로 UI 개편. "본고딕", "나눔스퀘어라운드", "고운바탕", "고운돋움" 4종 최적화 제공 |
| 시즌 테마팩 | 관리자가 시즌별로 출시하는 한정 테마. 영상광고 시청 후 해당 시즌 기간 동안 사용 가능. 기간 만료 시 자동 비활성화 (만료일 포함 저장) |
| 게스트 접근 | 탭 시 modal/login-prompt 노출 (무료 이상부터 사용) |
| 저장 | user.theme. 위젯에도 동기화 |

> ⚠️ R-015(마이페이지 테마 설정)와 동일 컴포넌트 재사용. 한쪽 변경 시 양쪽 동시 반영.

---

### 4.11 R-009 — /main/journal/list 저널 목록

사용자가 작성한 개인 저널을 목록으로 열람하는 화면. **뷰 방식은 목록(리스트)으로 고정.**

**권한**
- 무료 회원 이상 접근 가능. 게스트 진입 시 `modal/login-prompt` 노출.
- 무료 회원과 구독 유저 모두 작성한 저널 전체 열람 가능.

**화면 구성**
- **탭 시스템**: [전체 / 오늘 / 이번 주 / 월 선택] 탭 필터 제공 (선택된 월 표시 지원).
- **라이트 모드 대응**: 비활성 탭에 부드러운 회색조(`colors.divider` 수준)를 적용하여 배경 인지 확보.
- 저널을 최신순으로 노출. 각 저널 카드: 연결된 명언 원문 + 작성 날짜 + 저널 내용 미리보기.
- 가독성을 위해 명언과 저널 내용이 단어 단위로 줄바꿈(`keep-all`) 되도록 처리.
- 삭제: 스와이프 또는 휴지통 아이콘. 실시간 상태(Zustand) 동기화 적용.
- Empty State: "아직 작성한 저널이 없어요. 지금 명언에 대한 첫 번째 기록을 남겨보세요." + 홈 이동 버튼.

**데이터**
- 서버 저장(Supabase, journals 테이블) + 로컬 캐싱 병행.

---

### 4.12 R-010 — /main/journal/detail 저널 상세

- 명언 카드 + 저널 전문 표시.
- 인라인 수정, 삭제, OS 공유시트 공유 지원.
- 수정 후 공유 옵션 제공.

---

### 4.13 R-011 — /main/my/index 마이페이지

보관함·히든함·알림설정·테마설정·명언선호·계정관리·구독관리·위젯가이드 메뉴를 제공하는 개인화 허브. 메뉴 추가 시 목록만 수정한다.

---

### 4.14 R-012 — /main/my/bookmarks 보관함 (구독 전용)

| 항목 | 내용 |
|------|------|
| 기본 한도 | 30개 |
| 확장 | 리워드 광고 시청 시 20개 추가, 최대 70개 |
| 한도 표시 | `[ 28 / 30 ] 저장 가능한 명언이 2개 남았습니다.` |
| 삭제 | 스와이프 또는 휴지통 아이콘. **삭제 시 취소(Undo) 토스트 제공 (3초 내 복원 가능)** |
| 내보내기 | .txt / .md 지원. ~~.ics (캘린더 연동)~~ → **Phase 3 예정** |
| Empty State | "아직 저장한 명언이 없어요. 바로 명언을 확인해 볼까요?" + 홈 이동 버튼 |
| 비구독 접근 | 접근 차단 + 구독 유도 팝업 노출 |
| 70개 도달 | "더 이상 확장할 수 없습니다" 안내 노출 |

---

### 4.15 R-013 — /main/my/hidden 히든함

| 항목 | 내용 |
|------|------|
| 최대 저장 | 20개 |
| 저장 방식 | 로컬 전용 (AsyncStorage.hiddenQuotes). 서버 동기화 없음 |
| 초과 시 | 가장 오래된 항목 자동 삭제 |
| 재설치 시 | 초기화됨 — UI에 "앱 재설치 시 숨긴 목록이 초기화됩니다" 안내 표시 |
| 히든 해제 | 복원 시 피드에 다시 노출 |
| Empty State | "숨긴 명언이 없어요." |

---

### 4.16 R-014 — /main/my/settings/notification 알림 설정

**푸시 알림 인프라 — Remote Push (앱 종료 상태에서도 수신)** *(v2.5 전면 교체)*

앱이 종료된 상태에서도 알림이 발송되어야 하므로 Local Push가 아닌 Remote Push(서버 → 기기) 방식을 채택한다.

| 항목 | 내용 |
|------|------|
| 발송 주체 | Supabase Edge Function (pg_cron 또는 Supabase Cron 스케줄러) |
| 발송 대상 | push_enabled = true인 유저의 FCM 토큰(Android) / APNs 토큰(iOS) |
| 발송 시각 | push_start_time ~ push_end_time 범위 내 push_count 횟수 균등 간격 |
| 알림 내용 | 해당 시각 배정된 명언 원문 일부 (최대 50자) + 앱명 |
| 토큰 저장 | profiles 테이블 fcm_token / apns_token 컬럼 |
| 권한 요청 | 온보딩 R-004에서 OS 알림 권한 요청. 거부 시 기기 설정 유도 모달 |
| 토큰 갱신 | 앱 실행 시마다 토큰 유효성 확인 후 변경된 경우 서버 업데이트 |
| 발송 실패 | 재시도 1회. 그 이후 실패는 로그만 기록 |
| 알림 비활성화 | push_enabled = false 전환 시 서버 스케줄에서 즉시 제외 |
| 접근 권한 | 게스트 포함 전체 사용 가능 |

**알림 설정 UI**

| 항목 | 내용 |
|------|------|
| 푸시 알림 토글 | OFF→ON 시 OS 알림 권한 요청. 거부 시 기기 설정 앱으로 이동 유도 모달 |
| 시작·종료 시간 | 타임 피커 휠. 기본 07:00 ~ 22:00 |
| 알림 횟수 | 기본 4회, 최대 10회 |

---

### 4.17 R-015 — /main/my/settings/system-theme 시스템 테마 설정 (마이페이지)

앱 전체의 다크/라이트 모드 자동 전환을 제어하는 화면. (v2.8 신설)

| 항목 | 내용 |
|------|------|
| 선택 옵션 | 시스템 설정 / 라이트 모드 / 다크 모드 3종 제공 |
| 미리보기 | 각 모드의 컬러 톤을 보여주는 미니 미리보기 썸네일 제공 |
| 가독성 하이라이트 | 선택된 항목의 라벨을 `colors.actionCta`(주황색)로 하이라이트하여 선택 상태 명확화 |
| 토큰 동기화 | 모든 하위 화면은 `useThemeColors` 토큰을 참조하여 실시간 컬러 전환 적용 |

---

### 4.18 R-016 — /main/my/settings/quote-pref 명언 선호 재설정

온보딩 R-002 카테고리 설문 결과를 수정한다. `user.pref.category[]` 업데이트 → 피드 즉시 반영. R-002와 컴포넌트 재사용.

---

### 4.19 R-017 — /main/my/settings/account 계정 관리

| 기능 | 내용 |
|------|------|
| 닉네임 변경 | user.nickname 업데이트 (무료 이상) |
| 연결 소셜 계정 | 구글·애플 연동 상태 표시 |
| 로그아웃 | Supabase Auth signOut |
| 회원 탈퇴 | 2단계 확인 후 즉시 처리. 아래 탈퇴 정책 참조 |
| 개인정보 동의 관리 | 동의 내역 확인·변경. 아래 섹션 참조 |

**회원 탈퇴 정책** *(v2.5 확정)*

| 항목 | 처리 방식 |
|------|----------|
| 탈퇴 처리 방식 | 탈퇴 확인 2단계 후 즉시 처리 |
| 데이터 삭제 | profiles, journals, saved_quotes, quote_reactions, user_consent, user_settings, user_subscription 전체 즉시 삭제 |
| 구독 이력 | Supabase에서는 삭제. RevenueCat 이력은 보존 → 재가입 후 Restore Purchase로 복원 가능 |
| 소셜 계정 연동 해제 | Supabase Auth 계정 삭제. Google·Apple 소셜 연동은 각 플랫폼에서 별도 해제 안내 |

**탈퇴 화면 필수 안내 문구**
"탈퇴 후 저널·보관함 등 모든 데이터는 복구되지 않습니다. 단, 구독 이력은 재가입 후 복원할 수 있습니다."

**재가입 시나리오** *(v2.5 확정)*

| 상황 | 처리 |
|------|------|
| 탈퇴 후 동일 소셜 계정으로 재가입 | 완전히 새 유저로 시작. 이전 데이터 복구 없음 |
| 재가입 후 구독 복원 요청 | R-019 Restore Purchase 버튼 → RevenueCat에서 구독 이력 확인 후 복원 |
| 재가입 후 구독 복원 성공 | 구독 혜택 즉시 활성화. 단, 저널·보관함 등 콘텐츠 데이터는 복구 불가 |

**개인정보 동의 관리 섹션**

| 메뉴 항목 | 내용 | 대상 지역 |
|----------|------|----------|
| 개인정보 동의 내역 확인 | 현재 동의 상태 및 동의 일시 열람 | 전체 |
| 마케팅 동의 변경 | 마케팅·광고 동의 ON/OFF | 전체 |
| 개인정보 판매 거부 | Do Not Sell 토글 | CA (CCPA) |
| 제3자 제공 동의 변경 | 제3자 제공 동의 ON/OFF | JP (APPI) |
| 내 데이터 내보내기 | 수집된 개인정보 JSON/CSV 다운로드 요청 | EU, CA, JP |
| 계정 및 데이터 삭제 | 탈퇴 + 전체 데이터 삭제 요청 (처리 기간 안내 포함) | 전체 |

> ⚠️ "내 데이터 내보내기"와 "계정 및 데이터 삭제"는 요청 접수 후 처리 기간(GDPR 최대 30일, CCPA 최대 45일, APPI 2주 내)을 화면에 명시한다.

---

### 4.20 R-018 — /main/my/settings/widget-guide 위젯 설정 가이드

위젯 실제 설정은 OS 네이티브 환경에서 수행. 본 화면은 설정 방법 안내 페이지.

- iOS/Android 홈화면·잠금화면·Apple Watch/Galaxy Watch 위젯 추가 방법을 스텝별로 안내 (스크린샷 또는 일러스트 포함).
- 앱 실행 시 7일치 명언을 로컬 캐싱하여 위젯이 오프라인에서도 자정 기준 자동 갱신됨을 안내.
- 완료 체크 여부 LocalStorage 저장.

---

### 4.21 R-019 — /main/my/subscription 구독 관리

| 항목 | 내용 |
|------|------|
| 플랜 | 월간 / 연간 (연간 15% 할인. 체험 기간 없음) |
| 결제 | RevenueCat SDK. App Store / Google Play IAP |
| 플랜 비교 | 토글 UI로 두 플랜 나란히 비교. 연간 할인율 강조 표시 |
| 구독 복원 | Restore Purchase 버튼 명시적 배치 (App Store 심사 필수 요건) |
| 딥링크 | 외부에서 직접 진입 지원 |

> ⚠️ 요금 확정 후 결제 화면 업데이트 필요.

---

### 4.22 R-022 — /settings/language 언어 변경

언어 목록에서 선택 시 앱 UI 전체 언어 즉시 변경. `user.locale` 저장. react-i18next locale 전환.

- **적용 범위:** 설정, 마이페이지, 온보딩, 알림 문구, 버튼·레이블·토스트 등 앱 쉘(UI 텍스트) 전체.
- **미적용 범위:** 명언 콘텐츠. 명언은 `user.locale`에 맞는 언어별 quotes 테이블에서 API가 별도 서빙하며, react-i18next 번역 키를 사용하지 않는다.
- MVP에서 i18n 구조 적용 완료. 추가 언어 지원 시 이 화면에 목록 항목만 추가.

---

### 4.23 R-023 — /onboarding/privacy-consent 개인정보 동의

R-002 Step3 내부에서 처리. **지역 감지 결과에 따라 아래 4가지 변형 화면 중 하나로 자동 분기**한다. 독립 라우터 직접 진입 불필요.

| 지역 감지 결과 | 노출 화면 변형 | 핵심 요구사항 |
|--------------|-------------|-------------|
| EU / EEA | GDPR 변형 | 목적별 필수·선택 동의 분리. 언제든 철회 가능 안내. DPA 연락처 표시 |
| 미국 캘리포니아 (CA) | CCPA 변형 | "개인정보 판매 거부(Do Not Sell)" 옵션 표시. 카테고리별 수집 항목 공개 |
| 일본 | APPI 변형 | 제3자 제공 항목 명시. 이용 목적 고지. 문의처(개인정보 관리자) 표시 |
| 그 외 (기본) | 기본 변형 | 개인정보 처리 동의 + 광고 안내 + 필수·선택 구분 |

**공통 저장 필드** (`user.consent` 객체, 타임스탬프 포함):

```
user.consent.region             // 감지된 지역 코드 ("EU" | "CA" | "JP" | "DEFAULT")
user.consent.privacy            // Boolean — 개인정보 처리 동의
user.consent.marketing          // Boolean — 마케팅·광고 동의 (선택)
user.consent.data_sale_opt_out  // Boolean — 개인정보 판매 거부 (CCPA 전용)
user.consent.third_party        // Boolean — 제3자 제공 동의 (APPI 전용)
user.consent.granted_at         // ISO 8601 DateTime
user.consent.version            // String — 동의한 약관 버전
```

> ⚠️ 지역 감지는 기기 로케일(`Intl.DateTimeFormat().resolvedOptions().timeZone`) 기준 1차 판별 후, IP 기반 보완 감지를 선택적으로 적용한다. 감지 실패 시 기본 변형으로 폴백.

---

## 5. 수익화 (Monetization)

### 5.1 인앱 구독

#### 플랜 구성

| 플랜 | 내용 |
|------|------|
| 월간 플랜 | 매월 자동 갱신. **금액 추후 결정 (TBD)** |
| 연간 플랜 | 월간 대비 15% 할인 강조 표시. **금액 추후 결정 (TBD)** |

> ⚠️ R-019 화면 개발 시 플레이스홀더 금액을 사용하고, 요금 확정 후 교체한다. EAS Update OTA로 배포 가능.

#### 구독 혜택

| 혜택 | 내용 |
|------|------|
| ① 광고 제거 | 배너·리워드 영상 광고 제거. 카테고리 인라인 네이티브 광고는 유지 |
| ② 보관함 | 기본 30개 저장. 리워드 광고 시청 시 +20개 확장 (최대 70개) |
| ③ 내보내기 | .txt / .md 내보내기. .ics(캘린더 연동)는 Phase 3 예정 |
| ④ 다중 카테고리 | 카테고리 동시 다중 선택 가능 |
| ⑤ 구독 복원 | 마이페이지 → R-019에 Restore Purchase 버튼 |

#### 구독 상태별 기능 접근 규칙

| 조건 | 처리 |
|------|------|
| 비구독 유저 보관함 진입 | 접근 차단 + 구독 유도 팝업 |
| 보관함 30개 초과 | 리워드 광고 시청 유도 팝업 (시청 완료 시 +20개) |
| 70개 도달 | 더 이상 확장 불가 안내 |
| 비구독 카테고리 다중 선택 시도 | 선택 차단 + 구독 유도 팝업 |
| 구독 전환 시 | 배너·리워드 광고 즉시 비활성화. 네이티브 광고는 유지 |

---

### 5.2 광고 수익 (Google AdMob)

> 🚫 **광고 금지 구역:** 홈 화면 명언 캔버스 영역 / 편지 작성 화면(modal/journal-write, modal/quote-share)

#### 광고 유형 및 배치

| 유형 | 배치 | 대상 |
|------|------|------|
| 하단 고정 배너 (Adaptive Banner) | 카테고리 탐색 / 마이페이지 최하단 | 게스트·무료 유저 |
| 카테고리 인라인 네이티브 광고 | 카테고리 탐색 내 매 7 또는 10번째 슬롯 | 게스트·무료·구독 전체 |
| 리워드 영상 광고 | 보관함 30개 초과 → 확장 목적 | 무료·구독 유저 |
| 작업 완료 배너 | 공유 완료 / 이미지 저장 완료 직후 피드백 화면 하단 | 게스트·무료 유저 |

**기술 요구사항**
- 광고 로드 실패 시 해당 슬롯을 명언 카드로 자동 대체. 빈 공간 노출 금지.
- 테스트 단계: 반드시 테스트 광고 ID 사용. 릴리즈 시 운영 ID로 교체.
- iOS ATT 권한 요청을 온보딩(R-002 Step2)에 포함.

---

## 6. 예외 처리 및 엣지 케이스 (Edge Cases)

### 6.1 오프라인 상태

- 앱 foreground 진입 시 3일치 명언 데이터를 로컬에 선제 캐싱.
- 캐시 없는 경우: "콘텐츠를 불러올 수 없습니다. 네트워크 연결 후 다시 시도해 주세요." 안내 화면 노출.
- 상단/하단 토스트: "인터넷 연결이 불안정합니다."

### 6.2 명언 텍스트 길이 초과

- 관리자 CMS에서 150자 초과 등록 차단.
- 150자 이내라도 텍스트 길이에 따라 폰트 크기·자간 동적 축소.
- `word-break: keep-all` 필수. 음절 단위 줄바꿈 금지.

### 6.3 공유 실패 폴백

- 카카오 SDK 오류 → OS Share Sheet 자동 폴백.
- Share Sheet도 실패 시: "공유에 실패했습니다. 이미지를 저장한 후 직접 공유해 주세요." 토스트 + 이미지 저장 버튼 강조.

### 6.4 위젯 데이터 동기화

- 앱 실행 시마다 오늘 기준 7일치 명언 데이터를 로컬에 선제 캐싱.
- 위젯은 기기 내부 시간 기준으로 자정이 지나면 다음 날 캐시를 자동 참조하여 갱신.
- 캐시 없을 경우: "앱을 열어 지금 명언을 확인하세요" 안내 문구 노출.

### 6.5 결제 오류 처리

| 상황 | 메시지 |
|------|--------|
| 결제 중 네트워크 단절 | "결제를 완료할 수 없습니다. 네트워크 연결을 확인한 후 다시 시도해 주세요." |
| 복원 영수증 없음 | "복원할 구매 내역이 없습니다." |
| 복원 네트워크 오류 | "네트워크 연결을 확인해 주세요." |

### 6.6 히든함 재설치 초기화

AsyncStorage 삭제로 히든함 초기화됨. R-013 화면에 "앱 재설치 시 숨긴 목록이 초기화됩니다" 안내 문구 표시 필요.

### 6.7 소셜 로그인 실패 *(v2.5 추가)*

- 로그인 실패 시 "로그인 되지 않았어요. 재시도 해주세요." 팝업 노출.
- 실패해도 게스트 상태 유지. 로컬 데이터 손실 없음.
- 연속 3회 실패 시 "문제가 계속되면 다른 방법으로 로그인해 보세요." 보조 문구 노출.

### 6.8 게스트 → 회원 전환 병합 실패 *(v2.5 추가)*

- 병합 중 네트워크 오류 발생 시 로컬 데이터 보존.
- 다음 앱 실행 시 자동 재시도.
- 재시도도 실패 시 로컬 데이터 유지, 유저에게 별도 안내 없음.

### 6.9 명언 피드 풀 고갈 *(v2.5 추가)*

- 히든함 제외 후 사용 가능한 명언이 최근 30개 미만일 경우, 최근 30개 제외 규칙을 완화하여 더 오래된 명언부터 순차 재노출.
- 히든함에 등록된 명언만 남은 극단적 경우: 히든함 비우기 유도 토스트 노출.

---

## 7. 데이터 스키마 (Data Schema)

> **저장 위치 기준**
> - Supabase: 서버 저장 (로그인 유저 데이터, 집계 데이터)
> - AsyncStorage: 로컬 전용 (게스트 포함, 재설치 시 초기화)

---

### 7.1 유저 프로필 — profiles (Supabase)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Supabase Auth user.id와 1:1 연결 |
| provider | TEXT | 소셜 로그인 제공자 ('google' \| 'apple') |
| nickname | TEXT | 닉네임 (MVP 미사용, 추후 추가) |
| pref_categories | TEXT[] | 선호 카테고리 ID 배열 |
| quote_locale | TEXT | 명언 콘텐츠 언어. 기본값 'ko' |
| language | TEXT | 앱 UI 언어. 기본값 'ko' |
| fcm_token | TEXT | Android 푸시 토큰 (Remote Push용) |
| apns_token | TEXT | iOS 푸시 토큰 (Remote Push용) |
| push_token_updated_at | TIMESTAMPTZ | 토큰 최종 갱신 시각 |
| widget_setup_done | BOOLEAN | 위젯 설정 완료 여부 |
| created_at | TIMESTAMPTZ | 가입 시각 |
| updated_at | TIMESTAMPTZ | 최종 수정 시각 |

> 회원가입 시 Supabase Auth 트리거로 자동 생성.

---

### 7.2 보관함 — saved_quotes (Supabase)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조 |
| quote_id | UUID | quotes_ko.id 참조 |
| saved_at | TIMESTAMPTZ | 저장 시각. 최신순 정렬 기준 |

저장 한도: 기본 30개. 리워드 광고 시청 시 20개 추가, 최대 70개. 한도 초과 시 저장 차단 + 안내 팝업.
UNIQUE(user_id, quote_id) 제약으로 중복 저장 방지.

---

### 7.3 저널 — journals (Supabase)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 저널 고유 ID |
| user_id | UUID | profiles.id 참조 |
| quote_id | UUID | quotes_ko.id 참조 |
| text | TEXT | 저널 내용 (최대 한글 100자 / 영문 200자) |
| created_at | TIMESTAMPTZ | 작성 시각 |

보관 기간: 3년. Supabase pg_cron으로 주기적 만료 데이터 삭제.
무료·구독 회원 모두 작성한 저널 전체 열람 가능.

---

### 7.4 앱 설정 — user_settings (Supabase)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조 (UNIQUE) |
| push_enabled | BOOLEAN | 푸시 알림 ON/OFF |
| push_start_time | TEXT (HH:mm) | 알림 시작 시간. 기본값 "07:00" |
| push_end_time | TEXT (HH:mm) | 알림 종료 시간. 기본값 "22:00" |
| push_count | INTEGER | 하루 알림 횟수. 기본값 4, 최대 10 |
| selected_theme_index | INTEGER | 선택한 테마 인덱스 (기본 테마 30종 기준) |
| selected_font | TEXT | 선택한 폰트. 기본값 'pretendard' |
| last_visited | DATE | 마지막 앱 접속 날짜 |
| updated_at | TIMESTAMPTZ | 최종 수정 시각 |

알림 스케줄 규칙: `push_enabled`가 true일 때 `push_start_time`~`push_end_time` 범위 내에서 `push_count` 횟수만큼 균등 간격으로 Remote Push 스케줄 등록. false 전환 시 등록된 모든 스케줄 서버에서 즉시 제외.

---

### 7.5 개인정보 동의 — user_consent (Supabase)

지역별 법령 대응을 위해 동의 데이터는 서버에 저장한다.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조 (비로그인 시 NULL) |
| device_id | TEXT | 비로그인 임시 저장용. 로그인 시 user_id로 병합 |
| region | TEXT | 감지된 지역 코드. "EU" \| "CA" \| "JP" \| "DEFAULT" |
| privacy | BOOLEAN | 개인정보 처리 동의 (필수) |
| marketing | BOOLEAN | 마케팅·광고 동의 (선택) |
| data_sale_opt_out | BOOLEAN | 개인정보 판매 거부. CCPA(CA) 전용. 기본값 false |
| third_party | BOOLEAN | 제3자 제공 동의. APPI(JP) 전용 |
| granted_at | TIMESTAMPTZ | 최초 동의 시각 |
| updated_at | TIMESTAMPTZ | 마지막 동의 변경 시각 |
| version | TEXT | 동의한 약관 버전 (예: "2025-01") |

---

### 7.6 히든함 — hidden_quotes (AsyncStorage)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | String | 명언 고유 ID |
| hidden_at | ISO 8601 DateTime | 숨김 처리 시각 |

최대 20개. 초과 시 `hidden_at` 기준 가장 오래된 항목 자동 삭제.
홈 및 피드 명언 로드 시 hidden_quotes에 포함된 ID 제외.

---

### 7.7 위젯 캐시 — widget_cache (AsyncStorage)

| 필드 | 타입 | 설명 |
|------|------|------|
| date (키) | String (YYYY-MM-DD) | 날짜별 키 |
| id | String | 명언 고유 ID |
| text | String | 명언 원문 |
| author | String | 저자 |
| background_index | Integer | 로컬 번들 테마 인덱스 (기본 테마 30종 기준) |

갱신 규칙: 앱 foreground 진입 시 오늘 기준 7일치 일괄 갱신. 오늘 날짜보다 과거인 키는 자동 삭제.

---

### 7.8 구독 상태 — user_subscription (Supabase, RevenueCat 동기화)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조 (UNIQUE) |
| is_subscribed | BOOLEAN | 구독 여부 |
| plan | TEXT | "monthly" 또는 "annual" |
| subscribed_at | TIMESTAMPTZ | 구독 시작 시각 |
| expires_at | TIMESTAMPTZ | 구독 만료 시각 |
| archive_base_limit | INTEGER | 기본 보관 한도. 고정값 30 |
| archive_expand_count | INTEGER | 리워드 광고로 확장한 횟수 |
| archive_limit | INTEGER | 실제 한도. `30 + (archive_expand_count × 20)`. 최대 70 |
| updated_at | TIMESTAMPTZ | RevenueCat 웹훅 최종 갱신 시각 |

---

### 7.9 명언 반응 — quote_reactions (Supabase) *(v2.5 추가)*

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조 |
| quote_id | UUID | quotes_ko.id 참조 |
| reaction_type | TEXT | 'like' \| 'dislike' |
| created_at | TIMESTAMPTZ | 반응 시각 |

UNIQUE(user_id, quote_id) 제약. 동일 명언에 좋아요·싫어요 중복 불가.
게스트 반응은 로컬에만 저장, 로그인 후 병합 (4.3 병합 규칙 참조).

---

### 7.10 명언 집계 통계 — quote_stats (Supabase) *(v2.5 추가)*

게스트 포함 전체 반응을 집계하는 카운터 테이블.

| 필드 | 타입 | 설명 |
|------|------|------|
| quote_id | UUID | quotes_ko.id 참조 (PK) |
| like_count | INTEGER | 게스트 + 회원 전체 좋아요 합산 |
| dislike_count | INTEGER | 게스트 + 회원 전체 싫어요 합산 |
| share_count | INTEGER | 전체 공유 횟수 |
| updated_at | TIMESTAMPTZ | 최종 집계 갱신 시각 |

**집계 규칙**

| 상황 | 처리 |
|------|------|
| 게스트 좋아요 | 앱 → Supabase RPC → like_count + 1 |
| 회원 좋아요 | quote_reactions insert + like_count + 1 |
| 게스트 좋아요 취소 | 로컬 취소 + Supabase RPC `decrement_quote_stat(quote_id, device_id, 'like')` 호출. `quote_stats_guest_reactions` 행 삭제 후 like_count - 1. 행이 없으면 감소 무시. |
| 회원 좋아요 취소 | quote_reactions 삭제 + like_count - 1 |

> 관리자 CMS에서 명언별 like_count / share_count로 인기 명언 순위 파악 가능.

---

### 7.11 공유 로그 — quote_share_logs (Supabase) *(v2.5 추가)*

성공 지표 추적용 이벤트 로그 테이블.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조. 게스트는 NULL |
| quote_id | UUID | quotes_ko.id 참조 |
| channel | TEXT | 'kakao' \| 'instagram_story' \| 'instagram_feed' \| 'os_sheet' |
| has_comment | BOOLEAN | 코멘트 포함 공유 여부 |
| user_role | TEXT | 'guest' \| 'free' \| 'subscribed' |
| created_at | TIMESTAMPTZ | 공유 시각 |

---

### 7.12 시즌 테마팩 — season_themes / theme_unlocks (Supabase) *(v2.5 추가)*

**season_themes**

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| name | TEXT | 시즌 테마 이름 |
| description | TEXT | 설명 |
| starts_at | TIMESTAMPTZ | 출시일 |
| ends_at | TIMESTAMPTZ | 만료일 |
| is_active | BOOLEAN | 관리자 활성화 여부 |
| created_at | TIMESTAMPTZ | 등록 시각 |

**theme_unlocks** — 유저별 시즌 테마 언락 이력

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| user_id | UUID | profiles.id 참조 |
| season_theme_id | UUID | season_themes.id 참조 |
| unlocked_at | TIMESTAMPTZ | 리워드 광고 시청 완료 시각 |
| expires_at | TIMESTAMPTZ | season_themes.ends_at과 동일 |

UNIQUE(user_id, season_theme_id) 제약. 동일 시즌 테마 중복 언락 방지.

---

### 7.13 명언 콘텐츠 — quotes_ko / categories (Supabase)

**categories**

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| slug | TEXT | URL용 식별자 (UNIQUE) |
| name_ko | TEXT | 한국어 카테고리명 |
| name_en | TEXT | 영어 카테고리명 |
| sort_order | INTEGER | 정렬 순서 |
| is_active | BOOLEAN | 활성화 여부 |

**quotes_ko** (언어별 독립 테이블. Phase 2에서 quotes_en 동일 구조 추가)

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 명언 고유 ID |
| category_id | UUID | categories.id 참조 |
| text | TEXT | 명언 원문 (최대 150자) |
| author | TEXT | 저자명 |
| author_role | TEXT | 저자 직업·소개 |
| is_active | BOOLEAN | 피드 노출 여부 |
| created_at | TIMESTAMPTZ | 등록 시각 |

---

### 7.14 최근 노출 명언 — recent_quote_ids (AsyncStorage) *(v2.5 추가)*

피드 순환 규칙의 "최근 30개 제외"를 위한 로컬 배열.

| 필드 | 타입 | 설명 |
|------|------|------|
| recent_quote_ids | string[] | 최근 노출된 명언 ID 배열. 최대 30개. FIFO |

갱신 규칙: 새 명언 노출 시 배열 앞에 추가, 31번째 항목부터 자동 제거. 앱 재설치 시 초기화.

---

## 8. 관리자 CMS (Next.js App Router)

명언 콘텐츠 관리, 시즌 테마 운영, 서비스 지표 모니터링을 위한 내부 관리 도구.

### 8.1 콘텐츠 관리 기능

| 기능 | 내용 |
|------|------|
| 명언 등록·수정·삭제 | 150자 초과 시 등록 차단. CMS 내 글자 수 실시간 카운터 표시 |
| CSV 일괄 업로드 | PapaParse로 CSV 파싱 → JSON 변환 → Supabase bulk insert |
| 카테고리 관리 | 카테고리 추가·수정·삭제. 변경 시 R-002, R-007, R-016 동시 업데이트 필요 |
| 시즌 테마팩 관리 | 시즌별 한정 테마 등록·출시일·만료일 설정·활성화 관리 |
| 광고 슬롯 제어 | 인라인 광고 삽입 간격(7번째/10번째) 관리자 설정 |

---

### 8.2 Analytics 대시보드 *(v2.6 신설)*

> **목적:** PRD 2장의 성공 지표를 실시간 모니터링하고 유저 행동을 분석하여 제품 개선 의사결정을 지원한다.  
> **기술:** Recharts (KPI 차트) + @tanstack/react-table (데이터 테이블) + PostHog (유저 행동 분석)

관리자 웹 `/admin/analytics` 경로에 4개 탭으로 구성한다. 접근 권한: `admin` role 필수.

#### 탭 1. KPI 개요

| 지표 | 시각화 | 데이터 소스 |
|------|--------|------------|
| DAU / MAU 트렌드 | Line Chart | Supabase `user_sessions` 뷰 |
| Aha-Moment 도달률 | 게이지 + 트렌드 | PostHog 이벤트 `aha_moment` |
| 소프트게이트 전환율 | Funnel Bar Chart | PostHog 이벤트 `softgate_shown` / `softgate_converted` |
| D-1 / D-7 재방문율 | Cohort Table | Supabase 코호트 쿼리 |
| 구독 전환율 | Line Chart | RevenueCat Webhook → Supabase |
| MRR | KPI Card + 월별 Bar Chart | RevenueCat Webhook → Supabase |

#### 탭 2. 콘텐츠 성과

| 지표 | 시각화 | 데이터 소스 |
|------|--------|------------|
| 명언별 공유 Top 20 | 정렬 가능 테이블 | Supabase `quote_stats.share_count` |
| 카테고리별 좋아요·공유·저널 작성률 | Grouped Bar Chart | Supabase `quote_stats` |
| 공유 채널 분포 | Pie Chart | PostHog 이벤트 `quote_shared` |

#### 탭 3. 유저 행동 (PostHog 임베드)

| 기능 | 설명 |
|------|------|
| 세션 레코딩 | 실제 유저 화면 녹화. 스와이프·탭·스크롤 행동 확인 |
| 유저 플로우 | R-001 → R-006 → R-008 → R-003 등 화면 전환 흐름 시각화 |
| 퍼널 분석 | 게스트 → 소프트게이트 → 가입 → 구독 각 단계 이탈률 |
| 히트맵 | 홈 화면 액션 도크 5종 탭 빈도 시각화 |

MVP에서는 PostHog 대시보드를 `<iframe>`으로 임베드하여 빠르게 구현한다. 커스텀 UI가 필요한 경우 PostHog API로 전환.

#### 탭 4. 수익

| 지표 | 시각화 | 데이터 소스 |
|------|--------|------------|
| 신규 구독 / 해지 일별 추이 | Area Chart | RevenueCat Webhook → Supabase |
| 월간·연간 플랜 비율 | Donut Chart | RevenueCat |
| 리워드 광고 시청 완료율 | KPI Card | PostHog 이벤트 `rewarded_ad_complete` |

#### PostHog 이벤트 명세 (PRD 2장 지표 1:1 대응)

| 이벤트명 | 발생 시점 | 필수 파라미터 |
|---------|---------|-------------|
| `aha_moment` | 게스트 최초 좋아요·싫어요 | `user_type: 'guest'` |
| `softgate_shown` | R-003 팝업 노출 | `trigger: 'bookmark' \| 'journal' \| 'theme'` |
| `softgate_converted` | 가입 완료 | `method: 'google' \| 'apple'` |
| `quote_liked` | 좋아요 탭 | `quote_id, category, user_type` |
| `quote_shared` | 공유 완료 | `quote_id, channel, has_comment, user_type` |
| `journal_created` | 저널 저장 완료 | `quote_id, char_count` |
| `subscription_started` | 구독 결제 완료 | `plan: 'monthly' \| 'annual'` |
| `rewarded_ad_complete` | 리워드 광고 시청 완료 | `context: 'bookmark_expand' \| 'theme_unlock'` |

#### RevenueCat Webhook 처리

- `POST /api/webhooks/revenuecat` API Route에서 서명 검증 후 Supabase `subscription_events` 테이블에 저장.
- Webhook Secret은 환경변수 서버 전용 (`NEXT_PUBLIC_` 사용 금지).

---

## 9. 개발 구현 지침 (Implementation Guidelines)

### 9.1 권한 접근 제어 원칙

- 모든 화면 컴포넌트는 라우터 진입 전에 권한 체크를 수행한다.
- 권한 부족 시 화면을 직접 렌더링하지 않고 `modal/login-prompt` 또는 구독 유도 팝업을 먼저 노출한다.
- 구독 상태는 `user_subscription` 전역 객체에서 참조하며, RevenueCat 상태와 항상 동기화를 유지한다.

**권한 판별 흐름**

```
세션 없음          → 게스트
세션 있음 + 미구독  → 무료 회원
세션 있음 + 구독중  → 구독 유저
```

---

### 9.2 라이트/다크 모드 디자인 시스템 적용 (v2.8 추가)

- 앱 전역의 컴포넌트는 반드시 `useThemeColors()` 훅을 사용하여 색상을 지정해야 한다.
- 하드코딩된 HEX 코드 사용은 명언 캔버스(배경이 항상 어두운 곳) 등 예외적인 경우에만 허용된다.
- 주요 텍스트는 `colors.textPrimary`, 보조 텍스트는 `colors.textSecondary`, 배경은 `colors.bgSurface` 등을 활용하여 시스템 설정(라이트/다크) 변경 시 즉각 반영되도록 한다.

---

### 9.2 TanStack Query 캐싱 전략

| 데이터 | 전략 |
|--------|------|
| quotes API | staleTime: 1시간. foreground 진입 시 background refetch |
| journals | staleTime: 5분. mutation 후 즉시 invalidate |
| saved_quotes | staleTime: 30초. 저장/삭제 후 즉시 invalidate |
| quote_stats | staleTime: 10분. 좋아요/공유 후 즉시 invalidate |
| user_subscription | RevenueCat 이벤트 리스너로 직접 갱신. Query 불필요 |

---

### 9.3 오프라인 캐시 규칙

- 앱 foreground 진입 시 3일치 명언 + 7일치 위젯 캐시를 병렬로 선제 다운로드한다.
- 캐시 키: `widget_cache:{YYYY-MM-DD}`. 오늘보다 과거인 키는 자동 삭제한다.

---

### 9.4 광고 구현 주의사항

- 광고 금지 구역(홈 캔버스, 편지 작성 Modal)에는 어떠한 광고 컴포넌트도 렌더링하지 않는다.
- 광고 로드 실패 시 빈 View를 렌더링하지 않는다. 명언 카드로 대체 또는 컴포넌트를 완전히 제거한다.
- 구독 전환 즉시 배너·리워드 광고 컴포넌트를 비활성화(unmount)한다. 네이티브 광고는 유지한다.
- 릴리즈 전 반드시 광고 ID를 테스트 ID → 운영 ID로 교체한다.

---

### 9.5 이미지 공유 카드 생성

- react-native-view-shot를 사용하여 공유 카드를 PNG/JPG로 렌더링한다.
- 모든 공유 이미지에 앱 워터마크를 반드시 포함한다 (캔버스 렌더링 전 오버레이 레이어 추가).
- 갤러리 저장 전 iOS `MediaLibrary` / Android `WRITE_EXTERNAL_STORAGE` 권한을 선행 요청한다.

---

### 9.6 컴포넌트 공유 규칙

| 대상 | 규칙 |
|------|------|
| R-015 ↔ R-021 | 테마 설정 컴포넌트 공유. 한쪽 변경 시 양쪽 동시 반영 |
| R-002 ↔ R-016 | 카테고리 선택 컴포넌트 공유. 카테고리 변경 시 R-007도 동시 수정 |
| R-003 ↔ R-005 | 인증 로직 공유. R-005 변경 시 R-003에도 동일 반영 |

---

### 9.7 Remote Push 구현 지침 *(v2.5 추가)*

- Supabase Edge Function으로 스케줄러를 구현한다. pg_cron 또는 Supabase Cron 사용.
- 발송 대상 쿼리: `user_settings.push_enabled = true` AND 현재 시각이 `push_start_time ~ push_end_time` 범위 내인 유저.
- FCM (Firebase Cloud Messaging) → Android 발송. APNs → iOS 발송.
- 토큰은 앱 실행 시마다 profiles 테이블에 업데이트. 토큰 만료 오류 수신 시 해당 row의 토큰 컬럼 NULL 처리.
- 발송 실패 시 재시도 1회. 그 이후 실패는 서버 로그만 기록.

---

### 9.8 게스트 좋아요 집계 구현 지침 *(v2.6 device_id 방식으로 전면 교체)*

**device_id 생성 및 관리**
- 앱 최초 실행 시 UUID를 생성하여 MMKV에 `device_id` 키로 저장.
- 앱 재설치 시 device_id 초기화됨 (허용).
- device_id는 절대 서버에 유저 식별자로 사용하지 않는다. 반응 집계 전용.

**좋아요/싫어요 추가**
- 게스트 좋아요 발생 시 Supabase RPC `increment_quote_stat(quote_id, device_id, 'like')` 호출.
- RPC 내부: `quote_stats_guest_reactions` insert (UNIQUE 충돌 시 무시) + `quote_stats.like_count` atomic +1.
- 네트워크 오류 시 로컬에만 저장. 카운트 누락 허용 오차 범위로 인정.

**좋아요/싫어요 취소**
- 게스트 취소 발생 시 Supabase RPC `decrement_quote_stat(quote_id, device_id, 'like')` 호출.
- RPC 내부: `quote_stats_guest_reactions` 행 존재 확인 → 삭제 + `quote_stats.like_count` atomic -1. 행이 없으면 감소 무시.

**회원 전환 후 병합**
- 로그인 완료 후 MMKV의 로컬 반응 데이터를 `quote_reactions`에 bulk insert.
- 병합 완료 후 `quote_stats_guest_reactions`에서 해당 device_id의 모든 행 삭제 (중복 집계 방지).
- 회원 좋아요/싫어요: `quote_reactions` insert + `quote_stats` RPC 동시 호출.

---

## 10. 다국어 및 글로벌 개인정보법 대응

### 10.1 다국어 아키텍처 — 두 레이어 분리 원칙

Moment의 다국어는 성격이 다른 두 레이어로 완전히 분리하여 관리한다.

| 레이어 | 대상 | 기술 | 관리 위치 |
|--------|------|------|----------|
| **UI 쉘 (앱 텍스트)** | 버튼, 레이블, 토스트, 설정 메뉴, 마이페이지, 온보딩, 알림 문구, 에러 메시지 | react-i18next | `/locales/{lang}/` 번역 파일 |
| **명언 콘텐츠** | 명언 원문, 저자명 | 언어별 독립 DB 테이블 (`quotes_ko`, `quotes_en`, `quotes_ja` …) | Supabase + 관리자 CMS |

**명언 콘텐츠 서빙 규칙**
- API 호출 시 `user.quote_locale` 값을 파라미터로 전달하여 해당 언어 테이블에서만 조회한다.
- react-i18next 번역 키를 명언 텍스트에 사용하지 않는다. 명언은 항상 DB에서 원문 그대로 내려온다.
- `quote_locale`은 `user.language`와 독립적으로 설정 가능하다. 예: UI는 영어, 명언은 한국어.
- 지원 언어가 없는 경우 기본 언어(`ko`)로 폴백.

**UI 쉘 번역 파일 구조 (예시)**

```
/locales/
  ko/translation.json   ← 한국어 (기본)
  en/translation.json   ← 영어
  ja/translation.json   ← 일본어
```

**언어 감지 우선순위**

```
1. user.language (저장된 설정)
2. 기기 로케일 (RN: getLocales()[0].languageCode)
3. 기본값: "ko"
```

---

### 10.2 지원 언어 로드맵

| 단계 | 언어 | UI 쉘 | 명언 DB |
|------|------|-------|--------|
| MVP | 한국어 (ko) | ✅ | ✅ |
| Phase 2 | 영어 (en) | ✅ | ✅ |
| Phase 3 | 일본어 (ja) | ✅ | ✅ |
| 추후 검토 | 중국어 간체 (zh-CN), 스페인어 (es) | 검토 | 검토 |

> ℹ️ 언어 추가 시 체크리스트: ① `/locales/{lang}/translation.json` 추가 → ② R-022 언어 목록에 항목 추가 → ③ Supabase에 `quotes_{lang}` 테이블 생성 → ④ 관리자 CMS에 해당 언어 탭 추가

---

### 10.3 글로벌 개인정보법 대응 — 법령별 요구사항

#### 10.3.1 GDPR (EU / EEA)

| 항목 | 요구사항 | 구현 방식 |
|------|---------|----------|
| 동의 | 목적별 필수/선택 명확히 구분. 번들 동의 금지 | R-023 GDPR 변형 화면 |
| 철회 | 언제든지 동의 철회 가능 | R-017 계정 관리 → "개인정보 동의 관리" |
| 열람·삭제 | 수집 데이터 열람 및 삭제 요청권 | R-017 계정 관리 → "내 데이터 내보내기 / 삭제 요청" |
| DPA | 개인정보 보호 담당자 연락처 공개 | 개인정보처리방침 문서 내 명시 |
| 미성년자 | 16세 미만 동의 불가 (일부 국가 13세) | 온보딩 연령 확인 UI (Phase 2 검토) |
| 데이터 이전 | 서버 소재지 고지 (Supabase 리전 명시) | 개인정보처리방침 문서 내 명시 |

#### 10.3.2 CCPA (미국 캘리포니아)

| 항목 | 요구사항 | 구현 방식 |
|------|---------|----------|
| 고지 | 수집 개인정보 카테고리 및 목적 공개 | R-023 CCPA 변형 화면 |
| 판매 거부 | "Do Not Sell or Share My Personal Information" 옵션 제공 | R-023 및 R-017 계정 관리 내 토글 |
| 열람·삭제·이동 | 수집 데이터 열람, 삭제, 다른 서비스 이전 요청권 | R-017 계정 관리 → "내 데이터 관리" |
| 차별 금지 | 권리 행사 유저에게 서비스 차별 금지 | 정책 문서 명시 |
| 연령 | 16세 미만 판매 사전 옵트인, 13세 미만 부모 동의 | 온보딩 연령 확인 UI (Phase 2 검토) |

> ℹ️ AdMob 광고를 운영하는 경우 **데이터 판매에 해당할 수 있으므로** CCPA `data_sale_opt_out` = true 선택 시 AdMob 제한적 광고(Restricted Data Processing) 모드를 활성화한다.

#### 10.3.3 APPI (일본 개인정보 보호법)

| 항목 | 요구사항 | 구현 방식 |
|------|---------|----------|
| 이용 목적 | 수집 전 이용 목적 명시 | R-023 APPI 변형 화면 |
| 제3자 제공 | 제3자 제공 항목·대상·목적 명시 및 동의 수집 | R-023 APPI 변형 화면 — `third_party` 동의 항목 |
| 관리자 고지 | 개인정보 관리자(사업자) 명칭·연락처 표시 | 개인정보처리방침 문서 및 R-023 화면 하단 |
| 열람·정정·삭제 | 본인 요청 시 열람·정정·이용정지·삭제 대응 | R-017 계정 관리 → "내 데이터 관리" |
| 외국 이전 | Supabase 서버 소재지(외국) 고지 및 동의 | R-023 APPI 변형 화면 |

---

### 10.4 지역 감지 및 동의 분기 로직

```
앱 최초 실행 시:
  1. 기기 로케일 → timezone 기반 1차 지역 판별
     - timezone이 Europe/* → "EU"
     - timezone이 America/Los_Angeles, America/Denver 등 CA 관할 → "CA"
     - timezone이 Asia/Tokyo → "JP"
     - 그 외 → "DEFAULT"

  2. (선택) IP Geolocation API 보완 감지
     - 1차 판별과 다를 경우 더 엄격한 쪽(더 많은 권리 보장) 적용

  3. 감지 실패 또는 불확실 시 → "DEFAULT" 폴백

  4. 결과를 user.consent.region에 저장 후 R-023 화면 분기
```

> ⚠️ 지역 감지는 법적 확정 판단이 아니라 UX 분기용이다. 실제 법적 의무 준수를 위해 출시 전 해당 지역 법률 전문가 검토를 권장한다.

---

### 10.5 개인정보처리방침 및 약관 관리

- 개인정보처리방침과 이용약관은 웹 URL로 운영하며, 앱 내에서는 WebView로 노출한다.
- 약관 버전이 변경된 경우 다음 앱 실행 시 재동의 요청을 노출한다 (`user.consent.version` 비교).
- 언어별로 별도 URL을 제공한다 (예: `/privacy/ko`, `/privacy/en`, `/privacy/ja`).

---

## 변경 이력

| 버전 | 날짜 | 주요 변경 내용 |
|------|------|-------------|
| v2.8 | 2026.05 | ① Design System v3.0 시맨틱 토큰 기반 라이트 모드 완전 대응 (1.6, 9.2) / ② 시스템 테마 자동 전환(R-015) 신설 (4.17) / ③ Moment Look 모달(R-021) 3열 그리드 개편 및 95% 확장 (4.10) / ④ 공유 모달(R-008b) 크기 94% 확장 및 미리보기 대폭 확대 (4.9) / ⑤ 저널(R-009) 월별 필터 탭 적용 및 실시간 상태 동기화 / ⑥ 보관함(R-012) 삭제 취소(Undo) UX 도입 |
| v2.6 | 2026.04 | ① EAS Build·EAS Update·Sentry·PostHog 기술 스택 정식 반영 (1.6) / ② WatchKit Phase 3 이동 (1.6, 1.7) / ③ 구독 요금 추후 결정 명시 (5.1) / ④ 보관함 내보내기 .ics MVP 제외 → Phase 3 (4.14, 5.1) / ⑤ 8장 Analytics 대시보드 신설 (8.2) / ⑥ 게스트 좋아요·싫어요 취소 서버 반영 device_id 방식 B (7.10-B, 9.8) / ⑦ 저널 최대 글자 수 한글 100자·영문 200자로 변경 (4.8, 7.3) |
| v2.5 | 2026.04 | ① 소셜 로그인 실패 예외 처리 추가 (R-003, R-005) / ② 게스트→회원 데이터 병합 규칙 확정 (R-003) / ③ 탈퇴·재가입 정책 확정 (R-017) / ④ 푸시 알림 Remote Push 방식 확정 (R-014) / ⑤ 명언 피드 스포티파이 셔플 순환 규칙 추가 (R-006) / ⑥ 게스트 좋아요 집계 quote_stats 테이블 추가 (7.10) / ⑦ quote_reactions, quote_share_logs, season_themes, theme_unlocks 스키마 추가 (7.9~7.12) / ⑧ profiles에 fcm_token, apns_token 추가 (7.1) |
| v2.4 | 2026.04 | 초기 버전 |

---

*Moment PRD v2.8 — End of Document*
