// Shared layout with top navigation — editorial warm theme.
import { Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStats, levelFromXP, masteredCount } from "@/lib/store";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallButton } from "@/components/InstallButton";
import { CookieBanner } from "@/components/CookieBanner";
import { AuthProvider } from "@/lib/auth";
import { AuthButton } from "@/components/AuthButton";

const PRIMARY_TABS = [
  { to: "/", label: "Home" },
  { to: "/words", label: "Words" },
  { to: "/verbs", label: "Verbs" },
  { to: "/quiz", label: "Quiz" },
  { to: "/daily", label: "Daily" },
  { to: "/listening", label: "Listening" },
  { to: "/speaking", label: "Speaking" },
  { to: "/reading", label: "Scenarios" },
  { to: "/evaluation", label: "Evaluation" },
] as const;

const PREMIUM_TABS = [
  { to: "/citizenship-prep", label: "🏛️ Citizenship", premium: true },
  { to: "/medical-bg", label: "🏥 Medical БГ", premium: true },
  { to: "/leaderboard", label: "🏆 Leaderboard", premium: true },
  { to: "/progress", label: "Progress", premium: false },
] as const;

const ALL_TABS = [...PRIMARY_TABS, ...PREMIUM_TABS];

function NavLink({
  to,
  label,
  premium,
  onClick,
}: {
  to: string;
  label: string;
  premium?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:font-semibold ${
        premium ? "text-yellow-500/80" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      <img
        src="/icon-512.PNG"
        alt="Български Trainer"
        className="h-10 w-10 rounded-xl object-cover"
      />

      <span className="font-display text-xl font-black tracking-tight text-foreground leading-none">
        Български<span className="text-[#00966E]"> Trainer</span>
      </span>
    </Link>
  );
}

export function Layout() {
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [mastered, setMastered] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const s = loadStats();
    setStreak(s.streakDays);
    setLevel(levelFromXP(s.xp).level);
    setMastered(masteredCount(s));
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const StatPills = () => (
    <>
      <InstallButton />
      <span
        title="Daily streak"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium"
      >
        🔥 <span>{streak}</span>
      </span>
      <span
        title="Mastered words"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium"
      >
        ⭐ <span>{mastered}</span>
      </span>
      <span
        title="Level"
        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
      >
        Lv {level}
      </span>
      <ThemeToggle />
      <AuthButton />
    </>
  );

  return (
    <AuthProvider>
      <div className="min-h-screen text-foreground">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap"
        />

        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3">
            {/* Top row: Logo + (desktop right controls / mobile hamburger) */}
            <div className="flex items-center justify-between gap-4">
              <Logo />

              {/* Desktop right controls */}
              <div className="hidden md:flex flex-wrap items-center gap-2 shrink-0">
                <StatPills />
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-lg"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>

            {/* Desktop nav: 2 rows */}
            <nav className="hidden md:block mt-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1">
                {PRIMARY_TABS.map((t) => (
                  <NavLink key={t.to} to={t.to} label={t.label} />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1 border-l-2 border-border/60 pl-2">
                {PREMIUM_TABS.map((t) => (
                  <NavLink key={t.to} to={t.to} label={t.label} premium={t.premium} />
                ))}
              </div>
            </nav>

            {/* Mobile dropdown panel */}
            {menuOpen && (
              <div className="md:hidden mt-3 border-t border-border/60 pt-3 space-y-1">
                <div className="flex flex-col gap-1">
                  {ALL_TABS.map((t) => (
                    <NavLink
                      key={t.to}
                      to={t.to}
                      label={t.label}
                      premium={"premium" in t ? t.premium : false}
                      onClick={closeMenu}
                    />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                  <StatPills />
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </main>

        <footer className="mt-12 border-t border-border bg-background/50">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2026 Български Trainer · Built for foreigners surviving Bulgaria 🇧🇬</p>
            <nav className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
        <CookieBanner />
      </div>
    </AuthProvider>
  );
}
