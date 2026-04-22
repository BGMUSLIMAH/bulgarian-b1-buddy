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
  const isIDevice = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
  return isIDevice;
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

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      setCanPrompt(true);
    }
    function onInstalled() {
      setInstalled(true);
      setCanPrompt(false);
      promptRef.current = null;
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS doesn't fire beforeinstallprompt — show banner on iOS unless dismissed.
    if (isIOS() && localStorage.getItem(IOS_DISMISSED_KEY) !== "1") {
      setShowIosBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (isIOS()) {
      setShowIosBanner(true);
      return;
    }
    const ev = promptRef.current;
    if (!ev) return;
    try {
      await ev.prompt();
      const choice = await ev.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      /* ignore */
    } finally {
      promptRef.current = null;
      setCanPrompt(false);
    }
  }

  function dismissIos() {
    localStorage.setItem(IOS_DISMISSED_KEY, "1");
    setShowIosBanner(false);
  }

  if (installed) return null;
  // Button is ALWAYS visible in the navbar. If no prompt is captured yet,
  // clicking shows a hint banner (or iOS instructions on iOS).

  async function handleClick() {
    if (canPrompt && promptRef.current) {
      await handleInstall();
      return;
    }
    // No prompt available — show iOS instructions on iOS, generic hint elsewhere.
    setShowIosBanner(true);
  }

  const iosMode = isIOS();

  return (
    <>
      <button
        onClick={handleClick}
        title="Install Bulgarian Trainer as an app"
        className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        type="button"
      >
        📲 Install App
      </button>
      {showIosBanner && (
        <div
          role="alert"
          className="fixed inset-x-3 bottom-3 z-50 flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg sm:inset-x-auto sm:left-1/2 sm:right-auto sm:max-w-md sm:-translate-x-1/2"
        >
          <span className="text-lg" aria-hidden>📲</span>
          <p className="flex-1 text-foreground">
            {iosMode ? (
              <>To install on iPhone: tap <span className="font-semibold">Share</span> → <span className="font-semibold">Add to Home Screen</span>.</>
            ) : (
              <>To install: open your browser menu and choose <span className="font-semibold">Install app</span> or <span className="font-semibold">Add to Home Screen</span>.</>
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
