import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { WORDS, type Category } from "@/data/words";
import { speak } from "@/lib/store";

export const Route = createFileRoute("/words")({ component: WordsPage });

const CATS: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "daily", label: "Daily life" },
  { key: "work", label: "Work" },
  { key: "mechanical", label: "Mechanical / Technical" },
];

function WordsPage() {
  const [cat, setCat] = useState<"all" | Category>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return WORDS.filter((w) => {
      if (cat !== "all" && w.category !== cat) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return w.bg.toLowerCase().includes(s) || w.en.toLowerCase().includes(s);
    });
  }, [cat, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Words</h1>
        <p className="mt-1 text-muted-foreground">{WORDS.length} curated Bulgarian words. Click any word to hear it.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                cat === c.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search BG or EN..."
          className="ml-auto w-full max-w-xs rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="text-sm text-muted-foreground">{filtered.length} results</div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => (
          <button
            key={w.bg + w.en}
            onClick={() => speak(w.bg)}
            className="rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary/50"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-lg font-semibold text-foreground">{w.bg}</span>
              <span className="text-xs uppercase tracking-wider text-primary">{w.category}</span>
            </div>
            <p className="text-sm text-muted-foreground">{w.en}</p>
            <p className="mt-2 text-sm italic text-foreground/80">"{w.example}"</p>
            <p className="text-xs text-muted-foreground">{w.exampleEn}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
