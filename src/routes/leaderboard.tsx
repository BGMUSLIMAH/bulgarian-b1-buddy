// Weekly XP Leaderboard — top 20 users this ISO week, plus current user's rank.
//
// SQL to run in Supabase (one time) so the anon key can read leaderboard data.
// The user_progress table already has user_id (uuid) and xp (int).
// Email comes from auth.users — we expose it via a SECURITY DEFINER view that
// strips everything after the @ so the public never sees full emails.
//
// ─── SQL ────────────────────────────────────────────────────────────────────
// -- Public leaderboard view (anonymized display name, no full emails leak)
// create or replace view public.leaderboard_weekly as
// select
//   up.user_id,
//   coalesce(split_part(u.email, '@', 1), 'anon') as display_name,
//   up.xp,
//   up.last_practice_date
// from public.user_progress up
// left join auth.users u on u.id = up.user_id
// where up.last_practice_date is not null;
//
// grant select on public.leaderboard_weekly to anon, authenticated;
//
// -- Allow public SELECT on user_progress columns we expose (RLS).
// -- If you prefer to keep user_progress private, the view above with
// -- security_invoker = false is sufficient. Otherwise add:
// -- create policy "leaderboard_read"
// --   on public.user_progress for select to anon, authenticated using (true);
// ────────────────────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { loadStats } from "@/lib/store";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  ssr: false,
});

interface Row {
  user_id: string;
  display_name: string;
  xp: number;
  last_practice_date: string | null;
}

function startOfIsoWeek(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7; // 1..7, Mon..Sun
  if (day !== 1) date.setUTCDate(date.getUTCDate() - (day - 1));
  return date.toISOString().slice(0, 10);
}

function LeaderboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meRow, setMeRow] = useState<Row | null>(null);
  const [meRank, setMeRank] = useState<number | null>(null);
  const [guestXp, setGuestXp] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGuestXp(loadStats().xp);

    if (!supabaseEnabled || !supabase) {
      setError("Leaderboard is not configured.");
      setLoading(false);
      return;
    }

    const weekStart = startOfIsoWeek();
    // Try the view first; gracefully fall back to user_progress only.
    let data: Row[] | null = null;
    let err: unknown = null;
    {
      const r = await supabase
        .from("leaderboard_weekly")
        .select("user_id, display_name, xp, last_practice_date")
        .gte("last_practice_date", weekStart)
        .order("xp", { ascending: false })
        .limit(100);
      data = (r.data as Row[] | null) ?? null;
      err = r.error;
    }
    if (err || !data) {
      const r2 = await supabase
        .from("user_progress")
        .select("user_id, xp, last_practice_date")
        .gte("last_practice_date", weekStart)
        .order("xp", { ascending: false })
        .limit(100);
      if (r2.error) {
        setError(r2.error.message);
        setLoading(false);
        return;
      }
      data = (r2.data || []).map((r) => ({
        user_id: r.user_id as string,
        display_name: "user",
        xp: (r.xp as number) ?? 0,
        last_practice_date: (r.last_practice_date as string | null) ?? null,
      }));
    }

    const top20 = data.slice(0, 20);
    setRows(top20);

    if (user) {
      const myIdx = data.findIndex((r) => r.user_id === user.id);
      if (myIdx >= 0) {
        setMeRank(myIdx + 1);
        setMeRow(data[myIdx]);
      } else {
        setMeRank(null);
        setMeRow(null);
      }
    } else {
      setMeRank(null);
      setMeRow(null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const inTop20 = user && rows.some((r) => r.user_id === user.id);
  const myDisplay = user?.email?.split("@")[0] ?? "you";

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            🏆 Weekly Leaderboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Top XP earners since Monday {startOfIsoWeek()}.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
        >
          {loading ? "…" : "↻ Refresh"}
        </button>
      </header>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading && rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Loading leaderboard…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No XP earned yet this week. Be the first!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r, i) => {
              const rank = i + 1;
              const isMe = user && r.user_id === user.id;
              return (
                <li
                  key={r.user_id}
                  className={`flex items-center gap-3 px-4 py-3 text-sm ${
                    isMe ? "bg-primary/15" : ""
                  }`}
                >
                  <span className="w-8 font-mono text-muted-foreground">#{rank}</span>
                  <span className="w-6 text-center text-lg">
                    {rank === 1 ? "👑" : rank <= 3 ? "🏅" : ""}
                  </span>
                  <span className="flex-1 truncate font-medium text-foreground">
                    {r.display_name}
                    {isMe && <span className="ml-1 text-xs text-primary">(you)</span>}
                  </span>
                  <span className="font-mono text-foreground">{r.xp} XP</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* My rank when not in top 20 */}
      {user && meRank && !inTop20 && meRow && (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 shadow-sm">
          <p className="text-xs uppercase text-muted-foreground">Your rank</p>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="w-8 font-mono text-muted-foreground">#{meRank}</span>
            <span className="flex-1 truncate font-medium text-foreground">
              {myDisplay} <span className="text-xs text-primary">(you)</span>
            </span>
            <span className="font-mono text-foreground">{meRow.xp} XP</span>
          </div>
        </div>
      )}

      {!user && (
        <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
          You (guest) — sign in to appear here.{" "}
          <span className="font-mono text-foreground">{guestXp} XP</span> saved locally.
        </div>
      )}
    </div>
  );
}
