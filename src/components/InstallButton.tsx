// PWA install button + iOS instructions banner.
// Captures `beforeinstallprompt` and exposes a click handler. On iOS shows a
// dismissable banner with the Share → Add to Home Screen instructions.
import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const IOS_DISMISSED_KEY = "btb1_ios_install_dismissed";

function isIOS(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return window.matchMedia?.("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
}

export function InstallButton() {
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIosBanner, setShowIosBanner] = useState(false);
  // "not ready yet" tooltip state for Android when prompt hasn't fired
  const [showNotReady, setShowNotReady] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    // 1. Check if the root HTML script already captured the prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const earlyPrompt = (window as any).deferredPrompt;
    if (earlyPrompt) {
      promptRef.current = earlyPrompt;
      setCanPrompt(true);
    }

    // 2. Fallback event handler if it fires right during hydration
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = e;
      setCanPrompt(true);
    }

    // 3. Custom event notifier sent from our __root.tsx inline script
    function onPwaInstallable() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = (window as any).deferredPrompt;
      if (e) {
        promptRef.current = e;
        setCanPrompt(true);
      }
    }

    function onInstalled() {
      setInstalled(true);
      setCanPrompt(false);
      promptRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = null;
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("pwa-installable", onPwaInstallable);
    window.addEventListener("appinstalled", onInstalled);

    // iOS: show banner on first visit unless dismissed
    if (isIOS() && localStorage.getItem(IOS_DISMISSED_KEY) !== "1") {
      setShowIosBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("pwa-installable", onPwaInstallable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleClick() {
    // iOS — always show the share instructions banner
    if (isIOS()) {
      setShowIosBanner(true);
      return;
    }

    // Android / desktop Chrome — prompt is ready, fire it
    if (canPrompt && promptRef.current) {
      try {
        await promptRef.current.prompt();
        const choice = await promptRef.current.userChoice;
        if (choice.outcome === "accepted") setInstalled(true);
      } catch {
        /* ignore */
      } finally {
        promptRef.current = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).deferredPrompt = null;
        setCanPrompt(false);
      }
      return;
    }

    // Prompt not ready yet (Chrome needs engagement / HTTPS / valid manifest).
    setShowNotReady(true);
    setTimeout(() => setShowNotReady(false), 3000);
  }

  function dismissIos() {
    localStorage.setItem(IOS_DISMISSED_KEY, "1");
    setShowIosBanner(false);
  }

  if (installed) return null;

  return (
    <>
      <div className="relative inline-flex">
        <button
          onClick={handleClick}
          title="Install Bulgarian Trainer as an app"
          className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          type="button"
        >
          📲 Install App
        </button>

        {/* "Not ready yet" tooltip — shows briefly when Android prompt hasn't fired */}
        {showNotReady && (
          <div className="absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg">
            Chrome needs a moment — try again in a few seconds, or use the browser menu → <span className="font-medium text-foreground">Add to Home Screen</span>.
          </div>
        )}
      </div>

      {/* iOS / generic install instructions banner */}
      {showIosBanner && (
        <div
          role="alert"
          className="fixed inset-x-3 bottom-3 z-50 flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg sm:inset-x-auto sm:left-1/2 sm:right-auto sm:max-w-md sm:-translate-x-1/2"
        >
          <span className="text-lg" aria-hidden>📲</span>
          <p className="flex-1 text-foreground">
            {isIOS() ? (
              <>Tap <span className="font-semibold">Share</span> then <span className="font-semibold">Add to Home Screen</span> to install.</>
            ) : (
              <>Tap the browser menu then <span className="font-semibold">Add to Home Screen</span> to install.</>
            )}
          </p>
          <button
            onClick={dismissIos}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
            type="button"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
