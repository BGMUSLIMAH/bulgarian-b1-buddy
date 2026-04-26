import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WORDS } from "@/data/words";
import { VERBS } from "@/data/verbs";
import { loadStats, masteredCount, type Stats } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Dashboard, ssr: false });

const TILES = [
  { to: "/words", title: "Words", desc: "Bulgarian vocabulary across 11 life & career topics", emoji: "📚" },
  { to: "/verbs", title: "Verbs", desc: "Verbs with present, past & future tense", emoji: "🔤" },
  { to: "/quiz", title: "Practice Quiz", desc: "EN → BG multiple choice, instant feedback", emoji: "🎯" },
  { to: "/daily", title: "Daily Session", desc: "10–20 mixed questions for daily training", emoji: "🗓️" },
  { to: "/listening", title: "Listening", desc: "Hear Bulgarian and pick the right answer", emoji: "🎧" },
  { to: "/speaking", title: "Speaking", desc: "Listen and repeat aloud", emoji: "🎤" },
  { to: "/reading", title: "Reading", desc: "Useful sentences with hidden translation", emoji: "📖" },
  { to: "/evaluation", title: "Evaluation", desc: "Multi-section test, get your CEFR level", emoji: "🏆" },
  { to: "/progress", title: "Progress", desc: "Track answers and most practiced words", emoji: "📈" },
] as const;

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { setStats(loadStats()); }, []);
  const total = stats ? stats.correct + stats.wrong : 0;
  const acc = total > 0 ? Math.round((stats!.correct / total) * 100) : 0;
  const mastered = stats ? masteredCount(stats) : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-card to-accent/40 p-8">
        <p className="text-sm uppercase tracking-widest text-primary">Bulgarian · B1 Track</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Здравей! Let's reach <span className="text-primary">B1</span>.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Built for foreigners surviving Bulgaria 🇧🇬"
  Real words for the immigration office, the doctor, the landlord, and the market — not just tourist phrases.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Stat label="Words" value={WORDS.length} />
          <Stat label="Verbs" value={VERBS.length} />
          <Stat label="Answers" value={total} />
          <Stat label="Accuracy" value={`${acc}%`} />
          <Stat label="⭐ Mastered" value={mastered} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
          >
            <div className="text-3xl">{t.emoji}</div>
            <h3 className="mt-3 text-lg font-semibold group-hover:text-primary">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-background/50 p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
