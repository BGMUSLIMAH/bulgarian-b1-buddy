import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStats, resetStats, levelFromXP, masteredCount, type Stats } from "@/lib/store";

export const Route = createFileRoute("/progress")({ component: ProgressPage, ssr: false });

function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { setStats(loadStats()); }, []);

  if (!stats) return <p className="text-muted-foreground">Loading…</p>;

  const total = stats.correct + stats.wrong;
  const acc = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
  const lvl = levelFromXP(stats.xp);
  const mastered = masteredCount(stats);

  const top = Object.entries(stats.perWord)
    .map(([k, v]) => ({ k, total: v.correct + v.wrong, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  const categories = Object.entries(stats.perCategory)
    .map(([k, v]) => ({
      k,
      total: v.correct + v.wrong,
      acc: v.correct + v.wrong > 0 ? Math.round((v.correct / (v.correct + v.wrong)) * 100) : 0,
      ...v,
    }))
    .sort((a, b) => b.total - a.total);

  function reset() {
    if (confirm("Reset all progress? This cannot be undone.")) {
      resetStats();
      setStats(loadStats());
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Your journey</p>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">All data is stored locally on this device.</p>
        </div>
        <button
          onClick={reset}
          className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium hover:bg-destructive hover:text-destructive-foreground"
        >
          Reset
        </button>
      </div>

      {/* Hero: level + streak */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Level {lvl.level}</p>
              <h2 className="mt-1 font-display text-3xl font-bold">{lvl.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">XP</p>
              <p className="font-display text-3xl font-bold text-primary">{stats.xp}</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--gold)] transition-all"
                style={{ width: `${lvl.pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {lvl.current} / {lvl.next} XP to Level {lvl.level + 1}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily streak</p>
          <p className="mt-1 font-display text-5xl font-bold">
            🔥 <span className="text-foreground">{stats.streakDays}</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {stats.streakDays === 0
              ? "Practice today to start a streak."
              : stats.streakDays === 1
              ? "Day one — keep it going tomorrow!"
              : `${stats.streakDays} days in a row. Не спирай!`}
          </p>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total answers" value={total} />
        <Stat label="Correct" value={stats.correct} accent="text-primary" />
        <Stat label="Accuracy" value={`${acc}%`} />
        <Stat label="Mastered words" value={mastered} accent="text-[var(--gold)]" />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl font-bold">By category</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.k} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{c.k}</span>
                  <span className="text-sm text-muted-foreground">{c.acc}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${c.acc}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.correct} correct · {c.wrong} wrong
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-2xl font-bold">Most practiced</h2>
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No practice yet. Try the Daily Session or Quiz.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Correct</th>
                  <th className="px-4 py-2 text-right">Wrong</th>
                  <th className="px-4 py-2 text-right">Streak</th>
                </tr>
              </thead>
              <tbody>
                {top.map((r) => (
                  <tr key={r.k} className="border-t border-border bg-card">
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{r.k}</td>
                    <td className="px-4 py-2 text-right font-medium text-primary">{r.correct}</td>
                    <td className="px-4 py-2 text-right text-destructive">{r.wrong}</td>
                    <td className="px-4 py-2 text-right">
                      {r.streak >= 3 ? <span title="Mastered">⭐ {r.streak}</span> : r.streak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl font-bold">Recent evaluations</h2>
        {stats.evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No evaluations yet.</p>
        ) : (
          <div className="grid gap-2">
            {stats.evaluations.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-sm text-muted-foreground">{new Date(e.date).toLocaleString()}</span>
                <span className="text-sm">{e.score} / {e.total}</span>
                <span className="font-display font-bold text-primary">{e.level}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${accent ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}
