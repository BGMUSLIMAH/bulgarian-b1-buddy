// One-time cookie/analytics consent banner. Stored dismissal in localStorage.
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const KEY = "btb1_cookie_consent_v1";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY) !== "1") setShow(true);
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setShow(false);
  }

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-4 text-sm shadow-lg backdrop-blur sm:inset-x-auto sm:left-1/2 sm:right-auto sm:max-w-xl sm:-translate-x-1/2 sm:flex-row sm:items-center"
    >
      <span className="text-2xl" aria-hidden>🍪</span>
      <p className="flex-1 text-foreground">
        This app uses no tracking cookies. Anonymous usage data helps improve the app. By continuing you accept our{" "}
        <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
      </p>
      <button
        onClick={dismiss}
        className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        type="button"
      >
        Got it
      </button>
    </div>
  );
}
