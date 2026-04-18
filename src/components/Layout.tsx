// Shared layout with top navigation — editorial warm theme.
import { Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStats, levelFromXP } from "@/lib/store";

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
  useEffect(() => {
    const s = loadStats();
    setStreak(s.streakDays);
    setLevel(levelFromXP(s.xp).level);
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      {/* Inject Google fonts once */}
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

          <div className="ml-auto flex items-center gap-2 text-xs">
            <span
              title="Daily streak"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium"
            >
              🔥 <span>{streak}</span>
            </span>
            <span
              title="Level"
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary"
            >
              Lv {level}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Български Trainer · Real-life & technical vocabulary · Progress saved on this device
      </footer>
    </div>
  );
}
