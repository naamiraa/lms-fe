"use client";
import { useEffect, useRef, type ReactNode } from "react";
export default function ModalFrame({
  children,
  onClose,
  title,
  busy = false,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  busy?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);
  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  }, [onClose, busy]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = ref.current;
    const focusables = () =>
      Array.from(
        root?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
        ) ?? [],
      ).filter((el) => el.getClientRects().length > 0);
    (focusables()[0] ?? root)?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !busyRef.current) {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === "Tab") {
        const elements = focusables();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) {
          event.preventDefault();
          root?.focus();
          return;
        }
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === root)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === root)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    root?.addEventListener("keydown", handleKey);
    return () => {
      root?.removeEventListener("keydown", handleKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
