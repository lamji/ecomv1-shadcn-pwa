"use client";

import { useAppSelector } from '@/lib/store';

export default function GlobalSpinner() {
  const { isLoading, message } = useAppSelector(state => state.loading);
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop removed as requested */}

      {/* Spinner Card */}
      <div
        role="status"
        aria-live="polite"
        className="relative mx-4 w-full max-w-xs rounded-lg border bg-background/95 p-6 shadow-lg backdrop-blur"
      >
        <div className="flex items-center gap-4">
          <svg
            className="h-6 w-6 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div>
            <p className="text-sm font-medium text-foreground">Loading…</p>
            {message ? (
              <p className="mt-1 text-xs text-muted-foreground">{message}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
