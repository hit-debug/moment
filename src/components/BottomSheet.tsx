import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: ReactNode;
};

export function BottomSheet({ open, onClose, ariaLabel, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[92vh] w-full max-w-[480px] animate-slide-up flex-col rounded-t-sheet bg-bg-surface"
      >
        <div className="flex shrink-0 justify-center pt-space-3" aria-hidden="true">
          <div className="h-1 w-10 rounded-full bg-white/30" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
