import {
  Palette,
  Heart,
  ThumbsDown,
  Bookmark,
  Share2,
  PenLine,
  X,
  Download,
  Copy,
  Instagram,
  MessageCircle,
  MessageSquare,
  Lock,
  RefreshCw,
  Check,
  
  MoreHorizontal,
  Quote as QuoteIcon,
  BookOpen,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mockQuotes,
  mockThemes,
  type Quote,
  type ThemeConcept,
  type UserRole,
} from "@/data/quotes";
import { showToast, ToastHost } from "@/components/Toast";
import { BottomSheet } from "@/components/BottomSheet";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getQuoteFontSize(text: string): number {
  const len = text.length;
  if (len <= 50) return 22;
  if (len <= 100) return 18;
  return 16;
}

const FALLBACK_BG = "#111111";

/* ------------------------------------------------------------------ */
/* Theme Bottom Sheet                                                  */
/* ------------------------------------------------------------------ */

type ThemeFilter = "all" | ThemeConcept;

const THEME_FILTERS: { id: ThemeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "nature", label: "자연" },
  { id: "city", label: "도시" },
  { id: "mood", label: "감성" },
];

type FontOption = {
  id: string;
  name: string;
  family: string;
};

const FONT_OPTIONS: FontOption[] = [
  { id: "f1", name: "Pretendard", family: "'Pretendard Variable', Pretendard, sans-serif" },
  { id: "f2", name: "나눔명조", family: "'Nanum Myeongjo', 'NanumMyeongjo', serif" },
  { id: "f3", name: "Inter", family: "'Inter', sans-serif" },
];

function ThemeBottomSheet({
  open,
  onClose,
  selectedThemeId,
  onSelectTheme,
  selectedFontId,
  onSelectFont,
  previewQuote,
}: {
  open: boolean;
  onClose: () => void;
  selectedThemeId: number;
  onSelectTheme: (id: number) => void;
  selectedFontId: string;
  onSelectFont: (id: string) => void;
  previewQuote: Quote | undefined;
}) {
  const [draft, setDraft] = useState(selectedThemeId);
  const [draftFont, setDraftFont] = useState(selectedFontId);
  const [filter, setFilter] = useState<ThemeFilter>("all");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [cardW, setCardW] = useState(0);

  useEffect(() => {
    if (open) {
      setDraft(selectedThemeId);
      setDraftFont(selectedFontId);
      setFilter("all");
    }
  }, [open, selectedThemeId, selectedFontId]);

  // Compute card width = (screen - 32) / 3.7 so ~3.7 cards visible.
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const screenW = Math.min(window.innerWidth, 480);
      setCardW((screenW - 32) / 3.7);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  // Reset scroll when filter changes
  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
  }, [filter]);

  const visibleThemes = useMemo(
    () =>
      filter === "all"
        ? mockThemes
        : mockThemes.filter((t) => t.concept === filter),
    [filter],
  );

  const cardH = cardW * 1.6;

  const draftTheme = mockThemes[(draft ?? 0) % mockThemes.length];
  const draftFontFamily =
    FONT_OPTIONS.find((f) => f.id === draftFont)?.family ?? FONT_OPTIONS[0].family;

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="테마 설정">
      {/* ① Header */}
      <div className="flex items-center justify-between px-space-4 pt-space-4">
        <h2
          style={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 20,
            fontWeight: 600,
            color: "#F4F3EF",
          }}
        >
          테마 설정
        </h2>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="touch-target -mr-space-2"
          style={{ color: "rgba(244,243,239,0.7)" }}
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Body (no scroll) */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ② Live preview card — 메인과 동일한 줄바꿈 규칙(quote-text) 사용 */}
        {previewQuote && (
          <div className="px-space-4 pt-space-3">
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ height: 148, transition: "background 250ms ease-out" }}
            >
              {draftTheme?.image && (
                <img
                  key={draftTheme.id}
                  src={draftTheme.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full animate-fade-in object-cover"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55))",
                }}
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col items-center justify-center px-space-5 text-center">
                <p
                  lang="ko"
                  className="quote-text"
                  style={{
                    fontFamily: draftFontFamily,
                    fontSize: Math.round(getQuoteFontSize(previewQuote.text) * 0.6),
                    lineHeight: 1.6,
                    color: "#FFFFFF",
                    fontWeight: 400,
                    transition: "font-family 200ms ease-out, font-size 200ms ease-out",
                  }}
                >
                  {previewQuote.text}
                </p>
                <p
                  style={{
                    marginTop: 8,
                    fontFamily: draftFontFamily,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 600,
                    transition: "font-family 200ms ease-out",
                  }}
                >
                  — {previewQuote.author}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ③ Theme section */}
        <div className="px-space-4" style={{ marginTop: 20 }}>
          <h3
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(244,243,239,0.7)",
            }}
          >
            배경 테마
          </h3>
        </div>

        {/* Concept filter tabs */}
        <div
          role="tablist"
          aria-label="테마 컨셉 필터"
          className="flex gap-space-2 px-space-4 pt-space-3"
        >
          {THEME_FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className="flex h-8 items-center justify-center rounded-full px-space-4 transition-colors duration-150 ease-out"
                style={{
                  background: active ? "#E8491E" : "rgba(255,255,255,0.08)",
                  color: active ? "#FFFFFF" : "rgba(244,243,239,0.5)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Theme grid (horizontal scroll) */}
        <div className="pt-space-3">
          <div
            ref={scrollerRef}
            className="flex gap-space-2 overflow-x-auto px-space-4 pb-[8px]"
            style={{ scrollbarWidth: "none" }}
          >
            {visibleThemes.map((theme) => {
              const selected = draft === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setDraft(theme.id)}
                  aria-label={`${theme.name} 테마${selected ? ", 선택됨" : ""}`}
                  aria-pressed={selected}
                  className="relative shrink-0 overflow-hidden transition-all duration-150 ease-out active:scale-[0.97]"
                  style={{
                    width: cardW || 80,
                    height: cardH || 128,
                    borderRadius: 16,
                    outline: selected ? "2px solid #E8491E" : "none",
                    outlineOffset: -2,
                  }}
                >
                  <img
                    src={theme.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0"
                    style={{
                      height: "60%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-0 left-0 px-[8px] py-[8px] text-left"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#FFFFFF",
                    }}
                  >
                    {theme.name}
                  </span>
                  {selected && (
                    <span
                      className="absolute flex items-center justify-center rounded-full"
                      style={{
                        top: 6,
                        right: 6,
                        width: 16,
                        height: 16,
                        background: "#E8491E",
                        color: "#FFFFFF",
                      }}
                    >
                      <Check size={10} strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ④ Font section — 가로 칩 (미리보기에서 즉시 반영) */}
        <div className="px-space-4" style={{ marginTop: 20 }}>
          <h3
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(244,243,239,0.7)",
            }}
          >
            폰트 설정
          </h3>

          <div className="mt-space-3 flex gap-space-2">
            {FONT_OPTIONS.map((f) => {
              const selected = draftFont === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setDraftFont(f.id)}
                  aria-pressed={selected}
                  className="flex flex-1 items-center justify-center rounded-xl transition-all duration-150 ease-out active:scale-[0.98]"
                  style={{
                    height: 44,
                    background: selected ? "rgba(232,73,30,0.12)" : "rgba(255,255,255,0.04)",
                    border: selected
                      ? "1.5px solid #E8491E"
                      : "1px solid rgba(255,255,255,0.08)",
                    fontFamily: f.family,
                    fontSize: 14,
                    fontWeight: 500,
                    color: selected ? "#F4F3EF" : "rgba(244,243,239,0.7)",
                  }}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* spacer */}
        <div style={{ height: 16 }} />
      </div>

      {/* ⑤ Apply CTA */}
      <div className="shrink-0 px-space-4 pt-space-3 pb-[max(env(safe-area-inset-bottom,0px),16px)]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => {
            onSelectTheme(draft);
            onSelectFont(draftFont);
            onClose();
            showToast("테마가 적용되었어요");
          }}
          className="flex h-12 w-full items-center justify-center rounded-xl transition-transform duration-150 ease-out active:scale-[0.98]"
          style={{
            background: "#E8491E",
            color: "#FFFFFF",
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          적용하기
        </button>
      </div>
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ */
/* Share Bottom Sheet                                                  */
/* ------------------------------------------------------------------ */

type ShareFormat = "full" | "square";

type ShareMode = "quote" | "letter";

// Byte 계산 (R-008b 사양): 한글 등 non-ASCII = 2byte, ASCII = 1byte
export function getByteLength(str: string): number {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byte += code > 127 ? 2 : 1;
  }
  return byte;
}

// 코멘트 byte 기반 동적 폰트 사이즈
export function getCommentFontSize(byteLength: number): number {
  if (byteLength <= 80) return 14;
  if (byteLength <= 130) return 12;
  if (byteLength <= 170) return 11;
  return 10;
}

function SharePreviewCard({
  quote,
  format,
  mode,
  letterComment,
  onChangeLetterComment,
  byteLimit = 100,
  onFocusChange,
}: {
  quote: Quote;
  format: ShareFormat;
  mode: ShareMode;
  letterComment: string;
  onChangeLetterComment?: (v: string) => void;
  byteLimit?: number;
  onFocusChange?: (focused: boolean) => void;
}) {
  const isLetter = mode === "letter";
  const quoteFontSize = isLetter ? 13 : 14;
  const authorFontSize = isLetter ? 11 : 12;
  // Full: 9:16 portrait (height = width * 16/9). Square: 1:1.
  const ratio = format === "full" ? 16 / 9 : 1;
  const [box, setBox] = useState({ w: 0, h: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Fit card within both available width and available height.
  const widthFromHeight = box.h > 0 ? box.h / ratio : box.w;
  const cardWidth =
    box.w === 0 ? 0 : Math.max(0, Math.min(box.w, widthFromHeight));
  const height = cardWidth * ratio;
  // Letter 모드: 편지 + 명언 + 저자 모두 세로 중앙 정렬
  // Quote 모드: Full은 하단 1/3, Square는 중앙
  const contentJustify =
    isLetter || format === "square" ? "justify-center" : "justify-end";
  const contentPaddingBottom =
    !isLetter && format === "full" ? height / 3 : 0;

  const currentByte = getByteLength(letterComment);
  const commentFontSize = getCommentFontSize(currentByte);

  // textarea 자동 높이 — 스크롤 없이 모든 텍스트 노출
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [letterComment, isLetter, cardWidth]);

  return (
    <div ref={wrapperRef} className="flex h-full w-full items-center justify-center">
      <div
        className="relative overflow-hidden rounded-[20px]"
        style={{
          width: cardWidth === 0 ? "100%" : cardWidth,
          height: cardWidth === 0 ? undefined : height,
          aspectRatio: cardWidth === 0 ? `1 / ${ratio}` : undefined,
          background: FALLBACK_BG,
          transition: "height 250ms ease-in-out, width 250ms ease-in-out",
        }}
      >
        <img
          src={quote.bg_image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* scrims */}
        <div
          className="canvas-scrim-top pointer-events-none absolute inset-x-0 top-0"
          style={{ height: "35%" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: format === "full" ? "60%" : "45%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
          }}
          aria-hidden="true"
        />
        {/* content */}
        <div
          className={`absolute inset-0 flex flex-col items-center px-space-4 text-center ${contentJustify}`}
          style={{
            paddingBottom: !isLetter && format === "full" ? contentPaddingBottom : undefined,
            transition: "padding-bottom 250ms ease-in-out",
          }}
        >
          {/* 편지(코멘트) — 명언 위에 표시 */}
          {isLetter && (
            <div
              className="w-full"
              style={{
                paddingInline: 16,
                marginBottom: 12,
              }}
            >
              <textarea
                ref={textareaRef}
                value={letterComment}
                onChange={(e) => {
                  const v = e.target.value;
                  if (getByteLength(v) <= byteLimit) {
                    onChangeLetterComment?.(v);
                  }
                }}
                onFocus={() => {
                  onFocusChange?.(true);
                  setTimeout(() => {
                    wrapperRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }, 250);
                }}
                onBlur={() => onFocusChange?.(false)}
                placeholder="이 글귀를 전하고 싶은 분에게 한 줄을 남겨보세요."
                rows={1}
                readOnly={!onChangeLetterComment}
                className="w-full resize-none overflow-hidden bg-transparent text-center outline-none placeholder:text-[rgba(255,255,255,0.6)] placeholder:italic"
                style={{
                  fontFamily:
                    "'Pretendard Variable', Pretendard, sans-serif",
                  fontSize: Math.max(commentFontSize, 13),
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: "#F4F3EF",
                  caretColor: "#F4F3EF",
                  wordBreak: "keep-all",
                  transition: "font-size 150ms ease-out",
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  height: 1,
                  background: "rgba(255,255,255,0.2)",
                  width: "60%",
                  marginInline: "auto",
                }}
                aria-hidden="true"
              />
            </div>
          )}

          <p
            className="quote-text"
            style={{ fontSize: quoteFontSize, lineHeight: 1.7, color: "white" }}
          >
            {quote.text}
          </p>
          <p
            className={isLetter ? "mt-[6px]" : "mt-space-3"}
            style={{
              fontSize: authorFontSize,
              fontWeight: 600,
              color: "white",
            }}
          >
            {quote.author}
          </p>
        </div>
        {/* watermark */}
        <span
          className="absolute"
          style={{
            right: 12,
            bottom: 12,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Moment
        </span>
      </div>
    </div>
  );
}

function ShareFormatToggle({
  value,
  onChange,
}: {
  value: ShareFormat;
  onChange: (v: ShareFormat) => void;
}) {
  const baseBtn =
    "flex h-8 w-[72px] items-center justify-center rounded-full transition-colors duration-150 ease-out";
  const labelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 500,
  } as const;
  return (
    <div
      role="tablist"
      aria-label="공유 카드 형식"
      className="mx-auto inline-flex items-center gap-space-1 rounded-full p-1"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <button
        role="tab"
        aria-selected={value === "full"}
        onClick={() => onChange("full")}
        className={baseBtn}
        style={{
          background: value === "full" ? "#E8491E" : "transparent",
          color: value === "full" ? "#FFFFFF" : "rgba(244,243,239,0.4)",
          ...labelStyle,
        }}
      >
        Full
      </button>
      <button
        role="tab"
        aria-selected={value === "square"}
        onClick={() => onChange("square")}
        className={baseBtn}
        style={{
          background: value === "square" ? "#E8491E" : "transparent",
          color: value === "square" ? "#FFFFFF" : "rgba(244,243,239,0.4)",
          ...labelStyle,
        }}
      >
        Square
      </button>
    </div>
  );
}

function ShareCircleButton({
  label,
  bg,
  iconColor,
  onClick,
  children,
  ariaLabel,
}: {
  label: string;
  bg: string;
  iconColor: string;
  onClick: () => void;
  children: ReactSVGIconChildren;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className="flex flex-col items-center gap-[6px] active:scale-[0.96] transition-transform"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: bg, color: iconColor }}
      >
        {children}
      </span>
      <span
        className="type-caption"
        style={{ color: "rgba(244,243,239,0.7)" }}
      >
        {label}
      </span>
    </button>
  );
}

// Helper type just to keep button children typed
type ReactSVGIconChildren = React.ReactNode;

function ShareBottomSheet({
  open,
  onClose,
  quote,
  onOpenTheme,
  shareFormat,
  onChangeFormat,
  shareMode,
  onChangeMode,
  letterComment,
  onChangeLetterComment,
}: {
  open: boolean;
  onClose: () => void;
  quote: Quote | undefined;
  onOpenTheme: () => void;
  shareFormat: ShareFormat;
  onChangeFormat: (v: ShareFormat) => void;
  shareMode: ShareMode;
  onChangeMode: (v: ShareMode) => void;
  letterComment: string;
  onChangeLetterComment: (v: string) => void;
}) {
  const [inputFocused, setInputFocused] = useState(false);

  if (!quote) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(`${quote.text}\n— ${quote.author}`);
    } catch {
      // ignore
    }
  };

  const handleChannelShare = (label: string, msg: string) => {
    if (shareMode === "letter" && letterComment.trim().length === 0) {
      showToast("전하고 싶은 말을 먼저 입력해보세요");
      return;
    }
    showToast(msg);
  };

  const BYTE_LIMIT = 100;
  const currentByte = getByteLength(letterComment);
  const isOverLimit = currentByte > BYTE_LIMIT;
  const counterColor =
    currentByte >= BYTE_LIMIT
      ? "#E8491E"
      : currentByte >= Math.floor(BYTE_LIMIT * 0.8)
        ? "#D97706"
        : "rgba(244,243,239,0.4)";
  const isQuoteOnly = shareMode === "quote";

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="공유하기">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        style={{ maxHeight: "85dvh", paddingBottom: 8 }}
      >
        {/* ① Format toggle (Full / Square) */}
        <div className="flex justify-center pt-space-4">
          <ShareFormatToggle value={shareFormat} onChange={onChangeFormat} />
        </div>

        {/* ② Mode toggle (명언만 공유 / 편지와 함께) — 외부 Textarea 제거 */}
        <div className="px-space-4" style={{ marginTop: 16 }}>
          <div
            role="tablist"
            aria-label="공유 모드"
            className="flex w-full items-center rounded-full p-1"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {([
              { id: "quote", label: "명언만 공유" },
              { id: "letter", label: "편지와 함께" },
            ] as { id: ShareMode; label: string }[]).map((t) => {
              const active = shareMode === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeMode(t.id)}
                  className="flex h-10 flex-1 items-center justify-center rounded-full transition-colors duration-150 ease-out"
                  style={{
                    background: active ? "#E8491E" : "transparent",
                    color: active ? "#FFFFFF" : "rgba(244,243,239,0.45)",
                    fontFamily:
                      "'Pretendard Variable', Pretendard, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ③ Preview canvas with inline editor (letter mode only) */}
        <div
          className="flex justify-center px-space-4"
          style={{ height: "38vh", marginTop: 12 }}
        >
          <SharePreviewCard
            quote={quote}
            format={shareFormat}
            mode={shareMode}
            letterComment={letterComment}
            onChangeLetterComment={onChangeLetterComment}
            byteLimit={BYTE_LIMIT}
            onFocusChange={setInputFocused}
          />
        </div>

        {/* ④ Byte counter (캔버스 외부 우측 정렬) */}
        <div
          className="px-space-4"
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "flex-end",
            visibility: isQuoteOnly ? "hidden" : "visible",
            minHeight: 14,
          }}
          aria-live="polite"
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: isOverLimit ? "#E8491E" : counterColor,
              transition: "color 150ms ease-out",
            }}
          >
            {currentByte} / {BYTE_LIMIT} bytes
          </span>
        </div>

        {/* divider before channels */}
        <div
          className="mx-space-4"
          style={{ marginTop: 12, marginBottom: 12, height: 1, background: "rgba(255,255,255,0.06)" }}
          aria-hidden="true"
        />

        {/* ⑤ Bottom share channels — Instagram / KakaoTalk / Message / ImageSave / TextCopy */}
        <div className="px-space-4">
          <div className="flex items-start justify-between gap-2">
            <ShareCircleButton
              label="인스타그램"
              bg="linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)"
              iconColor="#FFFFFF"
              onClick={() => {
                handleChannelShare("인스타그램", "인스타그램으로 공유합니다");
                onClose();
              }}
            >
              <Instagram size={24} aria-hidden="true" />
            </ShareCircleButton>
            <ShareCircleButton
              label="카카오톡"
              bg="#FEE500"
              iconColor="#3C1E1E"
              onClick={() => {
                handleChannelShare("카카오톡", "카카오톡으로 공유합니다");
                onClose();
              }}
            >
              <MessageCircle size={24} aria-hidden="true" />
            </ShareCircleButton>
            <ShareCircleButton
              label="메시지"
              bg="#34C759"
              iconColor="#FFFFFF"
              onClick={() => {
                handleChannelShare("메시지", "메시지로 공유합니다");
                onClose();
              }}
            >
              <MessageSquare size={24} aria-hidden="true" />
            </ShareCircleButton>
            <ShareCircleButton
              label="이미지저장"
              bg="rgba(255,255,255,0.08)"
              iconColor="#F4F3EF"
              onClick={() => showToast("저장되었습니다")}
            >
              <Download size={24} aria-hidden="true" />
            </ShareCircleButton>
            <ShareCircleButton
              label="텍스트복사"
              bg="rgba(255,255,255,0.08)"
              iconColor="#F4F3EF"
              onClick={async () => {
                await handleCopy();
                showToast("복사되었습니다");
              }}
            >
              <Copy size={24} aria-hidden="true" />
            </ShareCircleButton>
          </div>
        </div>

        <div className="px-space-4 pt-space-3 pb-[max(env(safe-area-inset-bottom,0px),12px)]">
          <button
            onClick={onClose}
            className="touch-target w-full"
            style={{
              color: "rgba(244,243,239,0.5)",
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ */
/* Journal Bottom Sheet                                                */
/* ------------------------------------------------------------------ */

// 한글 2byte / 그 외 1byte (R-008 사양)
function getJournalByteLength(str: string): number {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    byte += code > 127 ? 2 : 1;
  }
  return byte;
}

const JOURNAL_BYTE_LIMIT = 100;

// Mock: 오늘 작성한 저널이 있다면 불러옴
const MOCK_TODAY_JOURNAL: { quote_id: string; date: string; text: string } | null = {
  quote_id: "q_001",
  date: "2026-04-28",
  text: "이전에 작성했던 내용이 있다면 이 텍스트를 불러옵니다.",
};

function JournalBottomSheet({
  open,
  onClose,
  quote,
}: {
  open: boolean;
  onClose: () => void;
  quote: Quote | undefined;
}) {
  const [journalText, setJournalText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 마운트(오픈) 시 mock todayJournal 바인딩
  useEffect(() => {
    if (open) {
      const initial = MOCK_TODAY_JOURNAL?.text ?? "";
      setJournalText(initial);
      setIsSaved(Boolean(initial));
    }
  }, [open]);

  const currentByte = getJournalByteLength(journalText);
  const isOver = currentByte > JOURNAL_BYTE_LIMIT;

  const handleChange = (next: string) => {
    // 100바이트 초과 시 입력 차단
    if (getJournalByteLength(next) > JOURNAL_BYTE_LIMIT) return;
    setJournalText(next);
  };

  const handleSave = () => {
    if (isOver || journalText.trim().length === 0) return;
    textareaRef.current?.blur();
    setIsSaved(true);
    showToast("저널이 저장되었어요");
  };

  const handleEdit = () => {
    setIsSaved(false);
    // 다음 프레임에 포커스
    requestAnimationFrame(() => textareaRef.current?.focus());
  };


  const counterColor = isOver
    ? "hsl(var(--status-error))"
    : currentByte >= JOURNAL_BYTE_LIMIT * 0.8
      ? "#D97706"
      : "rgba(244,243,239,0.5)";

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="저널 작성">
      {/* Header */}
      <div className="flex items-start justify-between px-space-4 pt-space-4">
        <div>
          <h2
            style={{
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#F4F3EF",
            }}
          >
            오늘의 문장, 마음에 새기다
          </h2>
          <p
            style={{
              marginTop: 6,
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(244,243,239,0.6)",
            }}
          >
            이 문장이 떠올린 한 줄을 남겨보세요.
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="touch-target -mr-space-2"
          style={{ color: "rgba(244,243,239,0.7)" }}
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Textarea */}
      <div className="px-space-4 pt-space-4">
        <div
          className="relative rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: isOver
              ? "1px solid hsl(var(--status-error))"
              : "1px solid rgba(255,255,255,0.08)",
            transition: "border-color 150ms ease-out",
          }}
        >
          <textarea
            ref={textareaRef}
            value={journalText}
            onChange={(e) => handleChange(e.target.value)}
            readOnly={isSaved}
            placeholder="오늘 이 문장이 내 마음에 남긴 한 줄을 적어보세요."
            aria-invalid={isOver}
            className="w-full resize-none bg-transparent px-space-4 py-space-3 text-text-primary placeholder:text-text-primary/40 focus:outline-none"
            style={{
              minHeight: 160,
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
            }}
            onFocus={(e) => {
              if (!isOver) {
                e.currentTarget.parentElement!.style.border =
                  "2px solid #E8491E";
              }
            }}
            onBlur={(e) => {
              e.currentTarget.parentElement!.style.border = isOver
                ? "1px solid hsl(var(--status-error))"
                : "1px solid rgba(255,255,255,0.08)";
            }}
          />
          <span
            className="absolute"
            style={{
              right: 12,
              bottom: 8,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: counterColor,
              transition: "color 150ms ease-out",
            }}
            aria-live="polite"
          >
            {currentByte} / {JOURNAL_BYTE_LIMIT} bytes
          </span>
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-space-4"
        style={{
          paddingTop: 24,
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
          transition: "all 200ms ease-out",
        }}
      >
        {!isSaved ? (
          <button
            onClick={handleSave}
            disabled={isOver || journalText.trim().length === 0}
            className="flex h-12 w-full items-center justify-center rounded-xl transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "#E8491E",
              color: "#FFFFFF",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            저장
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="flex h-12 w-full items-center justify-center rounded-xl transition-all duration-200 ease-out active:scale-[0.98]"
            style={{
              background: "#FFFFFF",
              color: "#2C2B27",
              border: "1px solid rgba(0,0,0,0.08)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            수정
          </button>
        )}
      </div>
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ */
/* Softgate Bottom Sheet                                               */
/* ------------------------------------------------------------------ */

function SoftgateBottomSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="로그인 안내">
      <div className="px-space-4" style={{ paddingTop: 32 }}>
        <div className="flex justify-center">
          <Lock size={48} aria-hidden="true" color="#E8491E" />
        </div>
        <h2
          className="text-center text-text-primary"
          style={{
            marginTop: 16,
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          무료로 시작해보세요
        </h2>
        <p
          className="text-center"
          style={{
            marginTop: 8,
            color: "rgba(244,243,239,0.7)",
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {"저널 작성, 명언 공유 등 더 많은 기능을\n무료 가입으로 바로 사용할 수 있어요."}
        </p>

        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => {
              onClose();
              showToast("Google 로그인 (Mock)");
            }}
            className="flex h-12 w-full items-center justify-center gap-space-2 rounded-xl px-space-4"
            style={{ background: "white", color: "#2C2B27", fontSize: 14, fontWeight: 500 }}
          >
            {/* Google G */}
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.5-8 19.5-20 0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.9 6 29.2 4 24 4 16.4 4 9.8 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.5-11.3-8.4l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2 3.9-3.7 5.3l6.2 5.2C41.3 35.5 44 30.2 44 24c0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Google로 계속하기
          </button>

          <button
            onClick={() => {
              onClose();
              showToast("Apple 로그인 (Mock)");
            }}
            className="flex h-12 w-full items-center justify-center gap-space-2 rounded-xl px-space-4"
            style={{
              marginTop: 12,
              background: "#111111",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true" fill="white">
              <path d="M13.4 9.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.8-3.6.8s-1.9-.8-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.5 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.9zM11.1 2.7c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"/>
            </svg>
            Apple로 계속하기
          </button>
        </div>

        <button
          onClick={onClose}
          className="touch-target mt-space-4 w-full"
          style={{
            color: "rgba(244,243,239,0.4)",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
          }}
        >
          나중에 할게요
        </button>
      </div>
      <div style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }} />
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

function CanvasSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end bg-bg-deep px-space-8 pb-[35%]">
      <div className="mb-space-3 h-6 w-20 rounded-full skeleton-shimmer" />
      <div className="mb-space-2 h-5 w-full max-w-[320px] rounded-md skeleton-shimmer" />
      <div className="mb-space-2 h-5 w-[85%] max-w-[280px] rounded-md skeleton-shimmer" />
      <div className="mb-space-6 h-5 w-[60%] max-w-[200px] rounded-md skeleton-shimmer" />
      <div className="h-4 w-24 rounded-md skeleton-shimmer" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-4 bg-bg-deep px-space-8 text-center">
      <p className="type-body" style={{ color: "rgba(244,243,239,0.6)" }}>
        불러올 명언이 없어요
      </p>
      <button
        onClick={onRefresh}
        aria-label="새로고침"
        className="touch-target rounded-full border border-white/10 p-space-3 text-text-primary"
      >
        <RefreshCw size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quote Canvas                                                        */
/* ------------------------------------------------------------------ */

function QuoteCanvas({
  quote,
  swipeKey,
  direction,
  actionBar,
  fontFamily,
}: {
  quote: Quote;
  swipeKey: string;
  direction: 1 | -1 | 0;
  actionBar?: React.ReactNode;
  fontFamily?: string;
}) {
  const fontSize = getQuoteFontSize(quote.text);
  const visibleCategories = quote.categories.slice(0, 2);

  const enterAnim =
    direction === 1
      ? "animate-swipe-in-right"
      : direction === -1
      ? "animate-swipe-in-left"
      : "animate-fade-in";

  const [imgError, setImgError] = useState(false);

  return (
    <div
      key={swipeKey}
      className={`absolute inset-0 ${enterAnim}`}
      style={{ background: FALLBACK_BG }}
    >
      {/* Background image */}
      {!imgError && (
        <img
          src={quote.bg_image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      )}

      {/* Top scrim 220 */}
      <div
        className="canvas-scrim-top pointer-events-none absolute inset-x-0 top-0"
        style={{ height: 220 }}
        aria-hidden="true"
      />
      {/* Bottom scrim 360 */}
      <div
        className="canvas-scrim-bottom pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: 360 }}
        aria-hidden="true"
      />

      {/* Quote block — Editorial composition per DSG v3.0 §5.2 Full-Screen */}
      <div
        className="absolute inset-x-0 px-space-8"
        style={{
          top: 64,
          bottom: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          {/* ── Tag row (§6.1 pill / §3.2 type-label) ── */}
          <div className="flex items-center justify-center gap-space-2">
            {visibleCategories.map((cat) => (
              <span
                key={cat}
                className="type-label inline-flex items-center"
                style={{
                  borderRadius: 999,
                  paddingInline: 12,
                  paddingBlock: 5,
                  background: "rgba(244,243,239,0.10)",
                  border: "1px solid rgba(244,243,239,0.18)",
                  color: "rgba(244,243,239,0.92)",
                  letterSpacing: "0.02em",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* ── Opening quotation mark — Cormorant Garamond §3.2 type-display ── */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 64,
              lineHeight: 0.6,
              color: "rgba(244,243,239,0.55)",
              marginTop: 24, /* space-6 */
              marginBottom: 12, /* space-3 */
              filter: "var(--shadow-canvas-text)",
            }}
          >
            “
          </span>

          {/* ── Quote body (§3.2 type-body / §3.3 강조는 색·볼드 중 하나만) ── */}
          <p
            lang="ko"
            className="quote-text"
            style={{
              fontSize,
              lineHeight: 1.7,
              ...(fontFamily ? { fontFamily } : null),
              transition: "font-family 250ms ease-out, font-size 250ms ease-out",
            }}
          >
            {quote.text}
          </p>

          {/* ── Hairline divider (§2.1 color-divider on dark) ── */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: 32,
              height: 1,
              background: "rgba(244,243,239,0.25)",
              marginTop: 24, /* space-6 */
              marginBottom: 12, /* space-3 */
            }}
          />

          {/* ── Author (§3.2 type-author 14pt/600) ── */}
          <p
            style={{
              filter: "var(--shadow-canvas-text)",
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.4,
              color: "rgba(244,243,239,0.95)",
              letterSpacing: "0.01em",
            }}
          >
            {quote.author}
          </p>

          {/* ── Author role (§3.2 type-caption 11pt Inter) ── */}
          <p
            className="line-clamp-1 max-w-full"
            style={{
              filter: "var(--shadow-canvas-text)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              lineHeight: 1.5,
              color: "rgba(244,243,239,0.65)",
              marginTop: 4, /* space-1 */
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {quote.author_role}
          </p>

          {/* ── Action bar (separated with breathing room §4 space-8) ── */}
          <div style={{ marginTop: 32 }}>{actionBar}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inline Action Bar (transparent, below quote)                        */
/* ------------------------------------------------------------------ */

function InlineActionBar({
  isLiked,
  onLike,
  onShare,
  onJournal,
  onMore,
}: {
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onJournal: () => void;
  onMore: () => void;
}) {
  const [popKey, setPopKey] = useState(0);
  const handleLike = () => {
    setPopKey((k) => k + 1);
    onLike();
  };

  // §6.6 Home Feed Dock: rgba(17,17,17,0.72) + backdrop-blur-xl + radius 24
  const dockStyle: React.CSSProperties = {
    background: "rgba(17,17,17,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    paddingInline: 8, /* space-2 */
    paddingBlock: 4,
  };

  const iconBtn =
    "touch-target flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 ease-out active:scale-90";

  return (
    <div
      className="inline-flex items-center gap-space-1"
      role="toolbar"
      aria-label="명언 액션"
      style={dockStyle}
    >
      <button
        onClick={handleLike}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        aria-pressed={isLiked}
        className={iconBtn}
      >
        <span key={popKey} className="inline-flex animate-tap-pop">
          <Heart
            size={22}
            aria-hidden="true"
            className={isLiked ? "text-emotion-like" : "text-text-primary/85"}
            fill={isLiked ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </span>
      </button>
      <button onClick={onJournal} aria-label="저널 작성" className={iconBtn}>
        <PenLine size={22} aria-hidden="true" className="text-text-primary/85" strokeWidth={2} />
      </button>
      <button
        onClick={onShare}
        aria-label="공유하기"
        className={iconBtn}
        style={{ color: "hsl(var(--action-cta))" }}
      >
        <Share2 size={22} aria-hidden="true" strokeWidth={2.25} />
      </button>
      <button onClick={onMore} aria-label="더보기" className={iconBtn}>
        <MoreHorizontal size={22} aria-hidden="true" className="text-text-primary/85" strokeWidth={2} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom Tab Bar                                                      */
/* ------------------------------------------------------------------ */

type BottomTab = "quote" | "journal" | "my";

function BottomTabBar({
  active,
  onSelect,
}: {
  active: BottomTab;
  onSelect: (t: BottomTab) => void;
}) {
  const items: { id: BottomTab; label: string; Icon: typeof QuoteIcon }[] = [
    { id: "quote", label: "명언", Icon: QuoteIcon },
    { id: "journal", label: "저널", Icon: BookOpen },
    { id: "my", label: "마이", Icon: UserCircle2 },
  ];
  return (
    <nav
      className="absolute inset-x-0 z-30 flex justify-center px-space-4"
      style={{
        bottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
      }}
      aria-label="메인 내비게이션"
    >
      <ul
        className="flex items-stretch justify-around"
        style={{
          width: "min(100%, 320px)",
          background: "rgba(31, 41, 55, 0.25)",
          backdropFilter: "blur(12px) saturate(140%)",
          WebkitBackdropFilter: "blur(12px) saturate(140%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 999,
          padding: "8px 8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                className="flex w-full flex-col items-center justify-center gap-[2px] py-space-1"
                style={{
                  borderRadius: 999,
                  color: isActive ? "hsl(var(--action-cta))" : "hsl(var(--text-secondary) / 0.7)",
                }}
              >
                <Icon size={20} aria-hidden="true" strokeWidth={isActive ? 2.25 : 1.75} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: 1.4,
                  }}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* More Bottom Sheet (Dislike + Save)                                  */
/* ------------------------------------------------------------------ */

function MoreBottomSheet({
  open,
  onClose,
  isSaved,
  onDislike,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  isSaved: boolean;
  onDislike: () => void;
  onSave: () => void;
}) {
  const Item = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={() => {
        onClick();
        onClose();
      }}
      className="flex w-full items-center gap-space-4 px-space-4 py-space-4 text-left transition-colors hover:bg-white/5"
      style={{ color: "hsl(var(--text-primary))" }}
    >
      <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 15, fontWeight: 500 }}>
        {label}
      </span>
    </button>
  );

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="더보기">
      <div className="flex items-center justify-between px-space-4 pt-space-4">
        <h2 style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontSize: 18, fontWeight: 600, color: "#F4F3EF" }}>
          더보기
        </h2>
        <button onClick={onClose} aria-label="닫기" className="touch-target -mr-space-2" style={{ color: "rgba(244,243,239,0.7)" }}>
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-space-2 flex flex-col">
        <Item icon={<ThumbsDown size={20} />} label="이 명언 다시 보지 않기" onClick={onDislike} />
        <Item
          icon={<Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />}
          label={isSaved ? "보관함에서 제거" : "보관함에 저장"}
          onClick={onSave}
        />
      </div>
      <div style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }} />
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const QuoteToday = () => {
  const navigate = useNavigate();

  // Client state (from spec)
  const [activeTab, setActiveTab] = useState<BottomTab>("quote");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isJournalSheetOpen, setIsJournalSheetOpen] = useState(false);
  const [isSoftgateOpen, setIsSoftgateOpen] = useState(false);
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [shareFormat, setShareFormat] = useState<ShareFormat>("full");
  const [shareMode, setShareMode] = useState<ShareMode>("quote");
  const [letterComment, setLetterComment] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("subscribed");

  // Local UI state
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<1 | -1 | 0>(0);

  // Per-quote like/save (mock — keep within session)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Theme override (preview only — mock)
  const [themeOverride, setThemeOverride] = useState<number | null>(null);
  const [activeFontId, setActiveFontId] = useState<string>("f1");

  // Single-sheet rule: opening one closes the others
  const openOnly = (
    which: "share" | "journal" | "softgate" | "theme" | "more" | null,
  ) => {
    setIsShareSheetOpen(which === "share");
    setIsJournalSheetOpen(which === "journal");
    setIsSoftgateOpen(which === "softgate");
    setIsThemeSheetOpen(which === "theme");
    setIsMoreSheetOpen(which === "more");
  };

  const handleSelectTab = (tab: BottomTab) => {
    if (tab === "quote") {
      setActiveTab("quote");
      navigate("/main/quote/today");
      return;
    }
    if (tab === "journal") {
      navigate("/main/journal/list");
      showToast("저널 화면은 준비 중이에요");
      return;
    }
    if (tab === "my") {
      navigate("/main/my/index");
      showToast("마이 화면은 준비 중이에요");
      return;
    }
  };

  // Simulate initial loading skeleton
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  const visibleQuotes = useMemo(
    () => mockQuotes.filter((q) => !hiddenIds.has(q.id)),
    [hiddenIds]
  );

  const safeIndex =
    visibleQuotes.length > 0
      ? Math.min(currentIndex, visibleQuotes.length - 1)
      : 0;
  const currentQuote = visibleQuotes[safeIndex];

  // Sync isLiked/isSaved to current quote
  useEffect(() => {
    if (!currentQuote) {
      setIsLiked(false);
      setIsSaved(false);
      return;
    }
    setIsLiked(likedIds.has(currentQuote.id));
    setIsSaved(savedIds.has(currentQuote.id));
  }, [currentQuote, likedIds, savedIds]);

  /* --------------- Swipe gesture --------------- */
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const movedRef = useRef(false);

  const goNext = () => {
    if (visibleQuotes.length === 0) return;
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % visibleQuotes.length);
  };
  const goPrev = () => {
    if (visibleQuotes.length === 0) return;
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + visibleQuotes.length) % visibleQuotes.length);
  };

  const handleLongPress = () => {
    if (userRole === "guest") {
      openOnly("softgate");
    } else {
      openOnly("theme");
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    movedRef.current = false;
    longPressTimer.current = window.setTimeout(() => {
      if (!movedRef.current) handleLongPress();
    }, 600);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      movedRef.current = true;
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = (e.changedTouches[0].clientY ?? 0) - (touchStartY.current ?? 0);
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  // Mouse fallback (drag) for desktop preview
  const mouseStart = useRef<number | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStart.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStart.current === null) return;
    const dx = e.clientX - mouseStart.current;
    mouseStart.current = null;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  // Keyboard arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleQuotes.length]);

  /* --------------- Action handlers --------------- */
  const handleOpenThemeSheet = () => {
    if (userRole === "guest") {
      openOnly("softgate");
      return;
    }
    openOnly("theme");
  };

  const handleLike = () => {
    if (!currentQuote) return;
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuote.id)) next.delete(currentQuote.id);
      else next.add(currentQuote.id);
      return next;
    });
  };

  const handleDislike = () => {
    if (!currentQuote) return;
    const remaining = visibleQuotes.filter((q) => q.id !== currentQuote.id);
    setHiddenIds((prev) => new Set(prev).add(currentQuote.id));
    if (remaining.length === 0) {
      showToast("모든 명언을 확인했어요. 숨긴 명언을 초기화해보세요.");
      return;
    }
    setDirection(1);
    setCurrentIndex((i) => i % remaining.length);
    showToast("이 명언은 다시 보지 않을게요");
  };

  const handleSave = () => {
    if (userRole === "guest") {
      showToast("로그인 후 이용할 수 있어요");
      return;
    }
    if (userRole !== "subscribed") {
      showToast("구독 후 이용할 수 있어요");
      return;
    }
    if (!currentQuote) return;
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuote.id)) next.delete(currentQuote.id);
      else next.add(currentQuote.id);
      return next;
    });
  };

  const handleShare = () => {
    if (userRole === "guest") {
      openOnly("softgate");
      return;
    }
    setShareMode("quote");
    setLetterComment("");
    openOnly("share");
  };

  const handleJournal = () => {
    if (userRole === "guest") {
      openOnly("softgate");
      return;
    }
    openOnly("journal");
  };

  // Theme override visualization (mock: overlay selected theme image)
  const overlayImage =
    themeOverride !== null
      ? mockThemes[themeOverride % mockThemes.length].image
      : null;

  return (
    <main
      className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden bg-bg-deep"
      aria-label="오늘의 명언"
    >
      {/* Canvas */}
      <div
        className="absolute inset-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {loading ? (
          <CanvasSkeleton />
        ) : !currentQuote ? (
          <EmptyState
            onRefresh={() => {
              setHiddenIds(new Set());
              setCurrentIndex(0);
            }}
          />
        ) : (
          <QuoteCanvas
            quote={currentQuote}
            swipeKey={`${currentQuote.id}-${direction}`}
            direction={direction}
            fontFamily={
              FONT_OPTIONS.find((f) => f.id === activeFontId)?.family
            }
            actionBar={
              <InlineActionBar
                isLiked={isLiked}
                onLike={handleLike}
                onShare={handleShare}
                onJournal={handleJournal}
                onMore={() => openOnly("more")}
              />
            }
          />
        )}

        {/* Theme tint overlay (mock visualization) — 부드럽게 fade-in */}
        {overlayImage && !loading && currentQuote && (
          <div
            key={overlayImage}
            className="pointer-events-none absolute inset-0 animate-fade-in"
            style={{
              backgroundImage: `url(${overlayImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.55,
              mixBlendMode: "multiply",
              transition: "opacity 350ms ease-out",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Top overlay */}
      <header className="safe-pt absolute inset-x-0 top-0 z-20 flex items-center justify-between px-space-4 pt-space-2">
        <h1
          className="type-logo text-text-primary"
          style={{ filter: "var(--shadow-canvas-text)" }}
        >
          Moment
        </h1>
        <div className="flex items-center gap-space-3">
          <button
            onClick={handleOpenThemeSheet}
            aria-label="테마 설정 열기"
            className="touch-target"
            style={{ color: "rgba(244,243,239,0.9)" }}
          >
            <Palette size={24} aria-hidden="true" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Dev role switcher (frontend-only demo) */}
      <div
        className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-space-2 py-space-1 backdrop-blur"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 64px)" }}
        role="group"
        aria-label="역할 전환 (데모)"
      >
        <div className="flex items-center gap-space-1 type-caption">
          {(["guest", "free", "subscribed"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setUserRole(r)}
              className={`rounded-full px-space-3 py-space-1 transition-colors ${
                userRole === r
                  ? "bg-action-cta text-action-cta-foreground"
                  : "text-text-primary/70 hover:text-text-primary"
              }`}
              aria-pressed={userRole === r}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      {!loading && visibleQuotes.length > 0 && (
        <div
          className="pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-space-1"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" }}
          aria-hidden="true"
        >
          {visibleQuotes.map((q, i) => (
            <span
              key={q.id}
              className={`h-1 rounded-full transition-all duration-200 ${
                i === safeIndex ? "w-6 bg-text-primary" : "w-1.5 bg-text-primary/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar active={activeTab} onSelect={handleSelectTab} />


      {/* Sheets */}
      <ThemeBottomSheet
        open={isThemeSheetOpen}
        onClose={() => setIsThemeSheetOpen(false)}
        selectedThemeId={themeOverride ?? 0}
        onSelectTheme={(id) => setThemeOverride(id)}
        selectedFontId={activeFontId}
        onSelectFont={(id) => setActiveFontId(id)}
        previewQuote={currentQuote}
      />
      <ShareBottomSheet
        open={isShareSheetOpen}
        onClose={() => {
          setIsShareSheetOpen(false);
          setShareMode("quote");
          setLetterComment("");
        }}
        quote={currentQuote}
        onOpenTheme={() => openOnly("theme")}
        shareFormat={shareFormat}
        onChangeFormat={setShareFormat}
        shareMode={shareMode}
        onChangeMode={(m) => {
          setShareMode(m);
          if (m === "quote") setLetterComment("");
        }}
        letterComment={letterComment}
        onChangeLetterComment={setLetterComment}
      />
      <JournalBottomSheet
        open={isJournalSheetOpen}
        onClose={() => setIsJournalSheetOpen(false)}
        quote={currentQuote}
      />
      <SoftgateBottomSheet
        open={isSoftgateOpen}
        onClose={() => setIsSoftgateOpen(false)}
      />
      <MoreBottomSheet
        open={isMoreSheetOpen}
        onClose={() => setIsMoreSheetOpen(false)}
        isSaved={isSaved}
        onDislike={handleDislike}
        onSave={handleSave}
      />

      {/* Toasts */}
      <ToastHost />
    </main>
  );
};

export default QuoteToday;
