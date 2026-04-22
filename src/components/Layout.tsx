// Shared layout with top navigation — editorial warm theme.
import { Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStats, levelFromXP, masteredCount } from "@/lib/store";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { CookieBanner } from "@/components/CookieBanner";

const TABS = [
  { to: "/", label: "Home" },
  { to: "/words", label: "Words" },
  { to: "/verbs", label: "Verbs" },
  { to: "/quiz", label: "Quiz" },
  { to: "/daily", label: "Daily" },
  { to: "/listening", label: "Listening" },
  { to: "/speaking", label: "Speaking" },
  { to: "/reading", label: "Reading" },
  { to: "/evaluation", label: "Evaluation" },
  { to: "/progress", label: "Progress" },
] as const;

export function Layout() {
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [mastered, setMastered] = useState(0);
  useEffect(() => {
    const s = loadStats();
    setStreak(s.streakDays);
    setLevel(levelFromXP(s.xp).level);
    setMastered(masteredCount(s));
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap"
      />

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 font-bold">
            <span className="bg-flag-stripe inline-block h-8 w-8 rounded-md ring-1 ring-border" aria-hidden />
            <span className="font-display text-xl tracking-tight text-foreground">
              Български <span className="text-primary">Trainer</span>
            </span>
          </Link>

          <nav className="order-3 flex w-full flex-wrap gap-1 sm:order-none sm:w-auto sm:flex-1 sm:justify-center">
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.to === "/" }}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
            <InstallButton />
            <span
              title="Daily streak"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium"
            >
              🔥 <span>{streak}</span>
            </span>
            <span
              title="Mastered words"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium"
            >
              ⭐ <span>{mastered}</span>
            </span>
            <span
              title="Level"
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary"
            >
              Lv {level}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-border bg-background/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Български Trainer · Built for foreigners surviving Bulgaria 🇧🇬</p>
          <nav className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          </nav>
        </div>
      </footer>
      <CookieBanner />
    </div>
  );
}
