import { useEffect, useState } from "react";

type Toast = { id: number; message: string };

let listeners: ((t: Toast) => void)[] = [];
let counter = 0;

export function showToast(message: string) {
  const t = { id: ++counter, message };
  listeners.forEach((l) => l(t));
}

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 2000);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[100] flex w-full max-w-[480px] -translate-x-1/2 flex-col items-center gap-space-2 px-space-4"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-toast-in rounded-xl bg-bg-surface px-space-4 py-space-3 type-body-sm text-text-primary shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
