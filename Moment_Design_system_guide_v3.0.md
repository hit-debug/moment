# Moment — Design System Guide v3.0

매일의 영감과 평온을 기록하는 명언 · 확언 앱 **Moment**의 통합 디자인 가이드입니다.

> 바이브코딩 시 이 파일을 AI 컨텍스트에 첨부하여 디자인 일관성을 강제하세요.
> v3.0: WDS(원티드 디자인 시스템) 기반 스페이싱·모션·컴포넌트 스펙 통합 반영

버전: **Moment DSG v3.0 / 2026.04**

---

## 📋 목차

| # | 챕터 | 핵심 내용 |
|---|------|-----------|
| 1 | 브랜드 철학 & 비주얼 기조 | Foundation & Philosophy |
| 2 | 컬러 시스템 | Semantic Tokens + Status Colors |
| 3 | 타이포그래피 | 폰트 · 계층 · 행간 규칙 |
| 4 | 스페이싱 시스템 | 8pt 배수 토큰 |
| 5 | 이미지 & 레이아웃 | Full-Screen · Share Card · Grid |
| 6 | 컴포넌트 규격 | Button · Input · Card · Dock · Nav |
| 7 | 아이콘 시스템 | 크기 · 색상 · 접근성 |
| 8 | 모션 & 인터랙션 | Timing · Easing · Skeleton |
| 9 | 다크 / 라이트 테마 | 토큰 전환 원칙 |
| 10 | AI 바이브코딩 가이드 | 실전 프롬프트 & 체크리스트 |

---

## 1. 브랜드 철학 & 비주얼 기조

**핵심 감성:** 고요함, 따뜻함, 지성, 깊은 몰입

### 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **Clarity (명확성)** | 복잡한 장식을 배제하고 명언(텍스트)이 주인공이 되게 한다. |
| **Deference (존중)** | 이미지가 배경일 때도 가독성을 최우선으로 보호한다. |
| **Depth (깊이)** | 다크모드에서 3단계 계층 구조를 통해 시각적 위계를 만든다. |
| **Consistency (일관성)** | 모든 화면에서 동일한 시각적 언어와 토큰을 사용한다. *(WDS 추가)* |
| **Accessibility (접근성)** | WCAG AA 4.5:1 대비 기준 및 최소 터치 타겟 44pt 준수. *(WDS 추가)* |

---

## 2. 컬러 시스템 (Semantic Tokens)

Apple HIG 및 WCAG AA(4.5:1) 명도 대비 기준을 준수합니다.  
**HEX 직접 하드코딩 금지 — 반드시 토큰 이름으로만 참조하세요.**

### 2.1 Moment 브랜드 컬러

| Token Name | Role | Light Mode (HEX) | Dark Mode (HEX) |
|---|---|---|---|
| `color-bg-deep` | 가장 깊은 바닥 (Secondary BG) | `#EEEDE8` | `#111111` |
| `color-bg-primary` | 앱 기본 배경 (Primary BG) | `#F4F3EF` | `#18181B` |
| `color-bg-surface` | 카드, 모달, 버튼 표면 (Surface) | `#FFFFFF` | `#1F2937` |
| `color-text-primary` | 메인 타이틀, 본문 | `#2C2B27` | `#F4F3EF` |
| `color-text-secondary` | 부제목, 메타 정보, 플레이스홀더 | `#706F6B` | `rgba(244,243,239,0.8)` |
| `color-action-cta` | 핵심 버튼, 포커스 테두리 (Energy Orange) | `#E8491E` | `#E8491E` |
| `color-emotion-like` | 좋아요, 감성 태그 (Pop Pink) | `#E8607A` | `#E8607A` |
| `color-status-success` | 저장 완료, 긍정 피드백 (Vista) | `#C8DCC0` | `rgba(200,220,192,0.2)` |
| `color-divider` | 경계선 및 구분선 | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` |

### 2.2 시맨틱 상태 컬러 *(WDS 추가)*

앱 내 시스템 메시지, 유효성 피드백에 사용합니다. 장식 목적 사용 금지.

| Token Name | HEX | 사용처 |
|---|---|---|
| `color-status-error` | `#DC2626` | 인풋 오류, 삭제 확인 액션 |
| `color-status-warning` | `#D97706` | 주의 메시지, 기한 임박 |
| `color-status-info` | `#0284C7` | 도움말, 정보성 토스트 |

### 2.3 색상 사용 원칙

**✅ DO**
- 시맨틱 토큰 이름으로만 색상 적용
- Primary CTA(`color-action-cta`)는 화면당 버튼 1개에만 집중 사용
- 텍스트-배경 명도 대비 4.5:1 이상 유지

**❌ DON'T**
- HEX 값 직접 하드코딩
- 상태 컬러(Error/Success)를 장식 목적으로 사용
- 한 화면에 Primary 버튼 3개 이상 배치

---

## 3. 타이포그래피 (Typography)

### 3.1 폰트 패밀리

| 폰트명 | 사용 맥락 | 특징 | 라이선스 |
|---|---|---|---|
| **Cormorant Garamond** | 브랜드 로고, 명언 인용부호 | 세리프 감성, 300 weight 전용 | 무료 (OFL) |
| **Pretendard** | 한국어 + 영어 본문 · UI 전반 | 모던, 가독성 최상. Noto Sans KR 대체 권장. | 무료 (SIL OFL) |
| **Noto Sans KR** | Pretendard 미적용 환경 폴백 | 범용 호환성 확보 | 무료 (OFL) |
| **Inter** | 버튼 레이블, 탭, 캡션, 숫자 | 영문 UI 특화, 고정폭 수치 표현에 적합 | 무료 (OFL) |

> **Pretendard 전환 권장 이유 (WDS 근거):** 자간·획 처리가 Noto 대비 세련되고, iOS/Android 양쪽에서 렌더링 품질이 높습니다. Pretendard를 기본 한글 폰트로, Noto를 폴백으로 설정하세요.

### 3.2 타이포 스케일

| Token Name | Font Family | Size | Weight | Line-height | Usage |
|---|---|---|---|---|---|
| `type-display` | Cormorant Garamond | 48pt | 300 | 1.2 | 브랜드 로고, 명언 인용부호 |
| `type-h1` | Pretendard | 28pt | 700 | 1.25 | 온보딩 제목, 큰 헤드라인 |
| `type-h2` | Pretendard | 20pt | 600 | 1.3 | 카드 제목, 섹션 타이틀 |
| `type-body` | Pretendard | 16pt | 400 | 1.7 | 명언 본문, 저널 내용 |
| `type-body-sm` | Pretendard | 14pt | 400 | 1.6 | 보조 설명, 리스트 항목 |
| `type-label` | Inter | 13pt | 500 | 1.4 | 버튼 레이블, 탭 메뉴 |
| `type-caption` | Inter | 11pt | 400 | 1.5 | 저자 직업, 워터마크, 메타 |

### 3.3 타이포그래피 원칙 *(WDS 통합)*

- 한 화면에 폰트 스케일 **최대 3단계**만 사용 (type-h1 · type-body · type-caption)
- 본문 폰트 **최소 14pt** 이상 유지 (모바일 기준)
- 강조는 **색상 또는 볼드 중 하나만** 선택 — 동시 사용 금지
- 행간은 본문 기준 **1.6 이상** 유지
- 영문·숫자는 Inter, 한글·혼용은 Pretendard 사용

---

## 4. 스페이싱 시스템 (8pt Base) *(WDS 추가)*

모든 여백과 간격은 **4pt 또는 8pt의 배수**를 사용합니다.  
코드에서는 반드시 상수(토큰)로 정의하고 매직 넘버 직접 입력을 금지합니다.

| Token | 값 (dp/pt) | Moment 앱 주요 사용처 |
|---|---|---|
| `space-1` | 4 | 아이콘-텍스트 간격, 태그 내부 패딩 |
| `space-2` | 8 | 도크 버튼 gap, 배지 패딩, 인풋 세로 패딩 |
| `space-3` | 12 | 버튼 가로 패딩, 리스트 아이템 간격 |
| `space-4` | 16 | 카드 내부 패딩, 좌우 화면 여백 |
| `space-6` | 24 | 카드 간격, 폼 필드 간격 |
| `space-8` | 32 | 섹션 간격, 페이지 상단 여백 |
| `space-12` | 48 | 페이지 섹션 구분, 대형 여백 |

---

## 5. 이미지 & 레이아웃 시스템

### 5.1 플랫폼 그리드 *(WDS 추가)*

| 플랫폼 | 컬럼 수 | 사이드 여백 | Gutter |
|---|---|---|---|
| 모바일 (360–480dp) | 4 Column | 16dp | 8dp |
| 태블릿 (600dp+) | 8 Column | 24dp | 16dp |

### 5.2 Full-Screen Feed (몰입형)

- **Scrim:** 상단 `linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)`, 하단 `linear-gradient(to top, rgba(0,0,0,0.88), transparent)` 적용 필수
- **Text Shadow:** 텍스트 가독성을 위해 `drop-shadow(0 4px 12px rgba(0,0,0,0.5))` 적용
- **Center Alignment:** 모든 텍스트와 메타 정보(태그, 인용부호)는 수평 중앙 정렬
- **Progress Dots:** 상단 혹은 하단에 현재 카드 위치 인디케이터 표시

### 5.3 Square Share Card (공유형)

- **Ratio:** 1:1 정방형 고정
- **Contents:** 이미지 내부에 태그, 명언, 저자명, 저자 직업 포함
- **Watermark:** 우측 하단 Moment 로고 필수 노출 (Viral Loop)

---

## 6. 컴포넌트 규격 (UI Specs)

### 6.1 Border Radius

| 컴포넌트 | Radius | 비고 |
|---|---|---|
| Tag / Pill | 999px | 완전 라운드 |
| Button | 12px | `rounded-xl` |
| Card | 24px ~ 32px | `rounded-3xl` |
| Input | 12px | 버튼과 동일 |
| Modal / Bottom Sheet | 40px (상단만) | 상단 둥글기 |

### 6.2 버튼 계층 & 사이즈 *(WDS 추가)*

**계층 원칙:** Primary → Secondary → Ghost 순으로 중요도 낮아짐. 화면당 Primary 1개 원칙.

| 유형 | 스타일 | Moment 사용처 |
|---|---|---|
| **Primary** | 배경: `color-action-cta` / 텍스트: White | 온보딩 CTA, 주요 저장 |
| **Secondary** | 배경: White / 테두리: `color-divider` / 텍스트: `color-text-primary` | 취소, 보조 액션 |
| **Ghost** | 배경: 없음 / 텍스트: `color-action-cta` | 3번째 이하 액션, 텍스트 링크 |
| **Danger** | 배경: `color-status-error` / 텍스트: White | 계정 삭제, 되돌릴 수 없는 액션 |

**사이즈:**

| 크기 | 높이 | 폰트 | Moment 사용처 |
|---|---|---|---|
| S | 32px | 13pt | 태그 버튼, 카드 인라인 버튼 |
| M | 40px | 14pt | 기본 버튼 (권장) |
| L | 48px | 16pt | CTA, 온보딩, 폼 제출 |

### 6.3 인풋 상태 4종 *(WDS 추가)*

저널·커스터마이즈 화면 구현 시 4가지 상태를 반드시 모두 설계해야 합니다.

| 상태 | 스타일 |
|---|---|
| **Default** | 테두리: `color-divider` 1px, 배경: `color-bg-surface` |
| **Focus** | 테두리: `color-action-cta` 2px, 배경: `color-bg-surface` |
| **Filled** | 테두리: `color-divider` 1px, 배경: `color-bg-deep` |
| **Error** | 테두리: `color-status-error` 2px + 하단 오류 메시지 (type-caption) |
| **Disabled** | 배경: `color-bg-deep`, 텍스트: `color-text-secondary` 50%, 포인터 없음 |

### 6.4 카드 (Card)

- **패딩:** `space-4` (16dp) — 모바일 기준
- **모서리:** `border-radius: 28px` 기본 / 소형 24px
- **다크모드 구분선:** `border: 1px solid rgba(255,255,255,0.06)` (그림자 대신 테두리)
- **선택 상태:** 테두리 `color-action-cta` 2px

### 6.5 Touch Target

모든 탭 가능 요소는 **최소 44×44pt (iOS) / 48×48dp (Android)** 영역 확보.  
현재 피드 도크 아이콘 버튼이 30px 이하로 구현될 경우, 투명 패딩 영역으로 터치 타겟을 확장해야 합니다.

### 6.6 Home Feed Dock

하단 5종 버튼 (좋아요, 싫어요, 즐겨찾기, 기록, 공유):
- `backdrop-blur-xl` + `background: rgba(17,17,17,0.72)` 플로팅 도크 형태
- 테두리: `border: 1px solid rgba(255,255,255,0.08)`
- `border-radius: 24px`
- 공유 버튼: `color-action-cta` 강조 처리
- 좋아요 토글 활성: `color-emotion-like` 강조 처리

### 6.7 네비게이션 *(WDS 추가)*

| 컴포넌트 | 위치 | 스펙 |
|---|---|---|
| Top App Bar | 화면 최상단 | 뒤로가기 + 타이틀 + 더보기. 높이 56px. |
| Bottom Tab Bar | 앱 하단 | 최대 5개 탭. 현재 탭 `color-action-cta` 강조. |
| Bottom Sheet / Modal | 화면 하단 슬라이드업 | 상단 radius 40px. Handle indicator 포함. |

---

## 7. 아이콘 시스템 *(WDS 추가)*

| 항목 | 스펙 |
|---|---|
| **크기** | 16px (Compact) / 20px (기본) / 24px (강조) |
| **두께** | Regular: 1.5px stroke / Bold: 2px stroke |
| **색상** | 부모 텍스트 색상 상속. 독립 아이콘은 `color-text-secondary` 기본 |
| **아이콘-텍스트 간격** | `space-2` (8px) 기본, `space-1` (4px) 소형 |
| **파일 형식** | SVG 우선 / PNG @2x 레거시 환경 대비 |
| **접근성** | 장식 아이콘 `aria-hidden="true"` / 기능 아이콘 `aria-label` 필수 |

---

## 8. 모션 & 인터랙션 *(WDS 추가)*

| 유형 | 지속 시간 | 이징 | Moment 적용처 |
|---|---|---|---|
| **Micro** (빠른 피드백) | 150–200ms | `ease-out` | 좋아요·즐겨찾기 토글, 버튼 탭 |
| **Standard** (전환) | 250–350ms | `ease-in-out` | 모달·커스터마이즈 시트 등장, 탭 전환 |
| **Complex** (페이지) | 400–500ms | `spring` | 피드 스와이프 전환, 온보딩 슬라이드 |
| **Skeleton Loading** | 1200ms loop | `linear` | 명언 카드 로딩 플레이스홀더 |

**모션 원칙:**
- 애니메이션은 의미를 전달해야 한다 — 단순 장식 목적 사용 금지
- `prefers-reduced-motion` 미디어 쿼리 반드시 지원
- 250ms 이상 대기 예상 시 반드시 Skeleton UI 표시

---

## 9. 다크 / 라이트 테마

### 9.1 토큰 전환 맵

| Token | 라이트 모드 | 다크 모드 |
|---|---|---|
| `color-bg-deep` | `#EEEDE8` | `#111111` |
| `color-bg-primary` | `#F4F3EF` | `#18181B` |
| `color-bg-surface` | `#FFFFFF` | `#1F2937` |
| `color-text-primary` | `#2C2B27` | `#F4F3EF` |
| `color-text-secondary` | `#706F6B` | `rgba(244,243,239,0.8)` |
| `color-action-cta` | `#E8491E` | `#E8491E` |
| `color-emotion-like` | `#E8607A` | `#E8607A` |
| `color-status-success` | `#C8DCC0` | `rgba(200,220,192,0.2)` |
| `color-divider` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` |

### 9.2 테마 전환 원칙 *(WDS 통합)*

- HEX 하드코딩 금지 — 반드시 토큰 변수로만 색상 참조
- 그림자는 다크 모드에서 `opacity` 낮추거나 `border` 테두리로 대체
- OS 다크모드 설정 자동 연동 (`@media (prefers-color-scheme: dark)`)
- 아이콘·이미지는 배경색에 따라 별도 처리 (`filter: brightness()` 또는 에셋 분리)

---

## 10. AI 바이브코딩 가이드 (Actionable)

### 10.1 기본 프로세스

1. **기초 공사:** 이 파일을 첨부하고 `"src/styles/theme.ts에 디자인 토큰을 라이트/다크 모드로 정의해줘"` 요청
2. **화면 구현:** `"R-006 화면을 만들되, 디자인 가이드의 [5.2 Full-Screen] 규칙을 엄격히 준수해"` 요청
3. **검수:** AI가 임의의 HEX 코드를 쓰는지 확인하고, 위반 시 `"모든 색상은 정의된 디자인 토큰으로만 교체해"` 수정 지시

### 10.2 실전 체크리스트

**🎨 색상**
- [ ] 모든 색상이 시맨틱 토큰으로 적용되었는가?
- [ ] 텍스트-배경 명도 대비 4.5:1 이상인가?
- [ ] Primary 버튼이 화면당 1개인가?
- [ ] 상태 컬러(Error/Success)가 의미에 맞게 쓰였는가?

**✏️ 타이포그래피**
- [ ] 폰트 스케일이 3단계 이내로 사용되었는가?
- [ ] 본문 폰트가 최소 14pt 이상인가?
- [ ] 강조를 색상과 볼드 중 하나만 사용했는가?
- [ ] 행간이 본문 기준 1.6 이상인가?

**📐 레이아웃 & 스페이싱**
- [ ] 모든 여백이 4pt 배수(space 토큰)를 사용하는가?
- [ ] 모바일 환경에서 터치 타겟이 44pt 이상인가?
- [ ] 핵심 메시지가 화면 상단 1/3 지점에 위치하는가?

**🔧 컴포넌트**
- [ ] 버튼 계층이 Primary → Secondary → Ghost 순으로 사용되었는가?
- [ ] 인풋 상태 4종(Default / Focus / Error / Disabled)이 모두 설계되었는가?
- [ ] 아이콘에 `aria-label` 또는 `aria-hidden`이 설정되었는가?
- [ ] 다크 모드 전환 시 토큰 색상이 자동 전환되는가?

**⚡ 모션**
- [ ] 인터랙션 피드백이 200ms 이내인가? (Micro 기준)
- [ ] 250ms 이상 대기 구간에 Skeleton UI가 적용되었는가?
- [ ] `prefers-reduced-motion` 대응이 되어 있는가?

---

*Moment Design System Guide v3.0 · © 2026 Moment Team*  
*WDS(원티드 디자인 시스템) Montage 2026 기반 스펙 통합 반영*
