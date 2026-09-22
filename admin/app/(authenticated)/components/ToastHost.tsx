"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type DismissibleToastProps = {
  title: string;
  message: string;
  variant: string;
};

type ToastState = {
  title: string;
  message: string;
  variant: string;
};

const TOAST_STORAGE_KEY = "drop-ox-toast";
const TOAST_COOKIE_NAME = "drop_ox_toast";
let cachedToastRaw: string | null = null;
let cachedToastSnapshot: ToastState | null = null;

function readToastSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToast = window.localStorage.getItem(TOAST_STORAGE_KEY);

  if (!storedToast) {
    cachedToastRaw = null;
    cachedToastSnapshot = null;
    return null;
  }

  if (storedToast === cachedToastRaw) {
    return cachedToastSnapshot;
  }

  try {
    const parsedToast = JSON.parse(storedToast) as ToastState;
    cachedToastRaw = storedToast;
    cachedToastSnapshot = parsedToast;
    return parsedToast;
  } catch {
    window.localStorage.removeItem(TOAST_STORAGE_KEY);
    cachedToastRaw = null;
    cachedToastSnapshot = null;
    return null;
  }
}

function subscribeToToastChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("drop-ox-toast", callback as EventListener);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("drop-ox-toast", callback as EventListener);
  };
}

export function ToastHost() {
  const toast = useSyncExternalStore(
    subscribeToToastChanges,
    readToastSnapshot,
    () => null,
  );

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${TOAST_COOKIE_NAME}=`))
      ?.split("=")
      .slice(1)
      .join("=");

    if (cookieValue) {
      try {
        const parsedToast = JSON.parse(decodeURIComponent(cookieValue)) as ToastState;
        window.localStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(parsedToast));
        window.dispatchEvent(new Event("drop-ox-toast"));
      } finally {
        document.cookie = `${TOAST_COOKIE_NAME}=; Max-Age=0; path=/`;
      }
    }
  });

  if (toast === null) {
    return null;
  }

  return (
    <DismissibleToast
      key={`${toast.title}:${toast.message}:${toast.variant}`}
      title={toast.title}
      message={toast.message}
      variant={toast.variant}
    />
  );
}

function DismissibleToast({ title, message, variant }: DismissibleToastProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const styles =
    variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : "border-zinc-200 bg-white text-zinc-950";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsDismissed(true);
      window.localStorage.removeItem(TOAST_STORAGE_KEY);
      window.dispatchEvent(new Event("drop-ox-toast"));
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <div className={`fixed right-6 top-6 z-50 w-full max-w-sm rounded-2xl border px-4 py-3 shadow-lg ${styles}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsDismissed(true);
            window.localStorage.removeItem(TOAST_STORAGE_KEY);
            window.dispatchEvent(new Event("drop-ox-toast"));
          }}
          className="text-sm font-semibold transition hover:opacity-75"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}