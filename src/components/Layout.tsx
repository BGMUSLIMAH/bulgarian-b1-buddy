// Shared layout with top navigation.
import { Link, Outlet } from "@tanstack/react-router";

const TABS = [
  { to: "/", label: "Dashboard" },
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="inline-block h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent" />
            <span className="text-lg tracking-tight">Bulgarian Trainer <span className="text-primary">B1</span></span>
          </Link>
          <nav className="flex flex-wrap gap-1">
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.to === "/" }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Bulgarian Trainer B1 · Real-life & technical vocabulary · Progress saved locally
      </footer>
    </div>
  );
}
