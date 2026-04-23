import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WORDS } from "@/data/words";
import { speak, shuffle, recordAnswer } from "@/lib/store";

export const Route = createFileRoute("/listening")({ component: ListeningPage, ssr: false });

interface Q { bg: string; en: string; opts: string[]; }

function makeQs(n = 10): Q[] {
  const picks = shuffle(WORDS).slice(0, n);
  return picks.map((w) => ({
    bg: w.bg,
    en: w.en,
    opts: shuffle([w.en, ...shuffle(WORDS.filter((x) => x.en !== w.en)).slice(0, 3).map((x) => x.en)]),
  }));
}

function ListeningPage() {
  const [qs, setQs] = useState<Q[]>(() => makeQs());
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const q = qs[i];

  useEffect(() => { setPicked(null); }, [i]);
  useEffect(() => { if (q) setTimeout(() => speak(q.bg), 300); }, [q]);

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    const ok = opt === q.en;
    if (ok) setScore((s) => s + 1);
    recordAnswer(`listen:${q.bg}`, ok);
  }

  function next() {
    if (i + 1 >= qs.length) {
      setQs(makeQs());
      setI(0);
      setScore(0);
    } else setI(i + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Listening</h1>
        <p className="mt-1 text-muted-foreground">Listen to the Bulgarian word, pick the correct English meaning. Uses your browser's Bulgarian voice.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {i + 1} / {qs.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="flex flex-col items-center gap-4 py-6">
          <button
            onClick={() => speak(q.bg)}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-4xl text-primary-foreground shadow-lg hover:bg-primary/90"
            aria-label="Play audio"
          >
            ▶
          </button>
          <p className="text-sm text-muted-foreground">Tap to replay</p>
          {picked && <p className="text-2xl font-bold text-foreground">{q.bg}</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {q.opts.map((opt) => {
            const isCorrect = opt === q.en;
            const isPicked = opt === picked;
            let cls = "rounded-lg border border-border bg-secondary px-4 py-3 text-left text-secondary-foreground hover:bg-accent";
            if (picked) {
              if (isCorrect) cls = cls.replace("bg-secondary", "bg-green-500/20") + " border-green-500 text-green-200";
              else if (isPicked) cls = cls.replace("bg-secondary", "bg-red-500/20") + " border-red-500 text-red-200";
              else cls += " opacity-60";
            }
            return (
              <button key={opt} className={cls} onClick={() => pick(opt)} disabled={!!picked}>
                {opt}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-6 flex justify-end">
            <button onClick={next} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {i + 1 === qs.length ? "Restart" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
