import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadStats, resetStats, type Stats } from "@/lib/store";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { setStats(loadStats()); }, []);

  if (!stats) return <p className="text-muted-foreground">Loading…</p>;

  const total = stats.correct + stats.wrong;
  const acc = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

  const top = Object.entries(stats.perWord)
    .map(([k, v]) => ({ k, total: v.correct + v.wrong, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

  function reset() {
    if (confirm("Reset all progress? This cannot be undone.")) {
      resetStats();
      setStats(loadStats());
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress</h1>
          <p className="mt-1 text-muted-foreground">All data is stored locally in your browser.</p>
        </div>
        <button onClick={reset} className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm hover:bg-destructive hover:text-destructive-foreground">
          Reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Total answers" value={total} />
        <Stat label="Correct" value={stats.correct} />
        <Stat label="Wrong" value={stats.wrong} />
        <Stat label="Accuracy" value={`${acc}%`} />
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Most practiced</h2>
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No practice yet. Try the Daily Session or Quiz.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Correct</th>
                  <th className="px-4 py-2 text-right">Wrong</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {top.map((r) => (
                  <tr key={r.k} className="border-t border-border">
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{r.k}</td>
                    <td className="px-4 py-2 text-right text-green-400">{r.correct}</td>
                    <td className="px-4 py-2 text-right text-red-400">{r.wrong}</td>
                    <td className="px-4 py-2 text-right">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Recent evaluations</h2>
        {stats.evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No evaluations yet.</p>
        ) : (
          <div className="grid gap-2">
            {stats.evaluations.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2">
                <span className="text-sm text-muted-foreground">{new Date(e.date).toLocaleString()}</span>
                <span className="text-sm">{e.score} / {e.total}</span>
                <span className="font-bold text-primary">{e.level}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
