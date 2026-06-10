"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

type ConfirmFn = (opts: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(async () => false);

export function useConfirm(): ConfirmFn {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ message: "" });
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((input) => {
    const normalized: ConfirmOptions =
      typeof input === "string" ? { message: input } : input;
    setOpts(normalized);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    setOpen(false);
    resolver.current?.(result);
    resolver.current = null;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {open && (
        <div
          className="admin-modal-overlay"
          onClick={() => close(false)}
          role="presentation"
        >
          <div
            className="admin-modal"
            role="alertdialog"
            aria-modal="true"
            aria-label={opts.title || "Confirm"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`admin-modal-icon${opts.danger ? " danger" : ""}`}>
              {opts.danger ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              )}
            </div>
            <h3 className="admin-modal-title">{opts.title || "Are you sure?"}</h3>
            <p className="admin-modal-message">{opts.message}</p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn ghost"
                onClick={() => close(false)}
              >
                {opts.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                className={`admin-btn${opts.danger ? " danger" : ""}`}
                onClick={() => close(true)}
                autoFocus
              >
                {opts.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
