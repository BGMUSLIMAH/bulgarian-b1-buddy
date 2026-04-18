import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QuizRunner } from "@/components/QuizRunner";
import { buildMixed } from "@/lib/quiz";

export const Route = createFileRoute("/daily")({ component: DailyPage });

function DailyPage() {
  const [count, setCount] = useState(15);
  const [questions, setQuestions] = useState(() => buildMixed(15));
  const [started, setStarted] = useState(false);

  function start(n: number) {
    setCount(n);
    setQuestions(buildMixed(n));
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Daily Session</h1>
          <p className="mt-1 text-muted-foreground">A short mixed session: words, verbs, and conjugations. Train every day.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => start(n)}
              className="rounded-xl border border-border bg-card px-6 py-4 text-left hover:border-primary/50"
            >
              <div className="text-2xl font-bold text-primary">{n}</div>
              <div className="text-sm text-muted-foreground">questions</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setStarted(false)} className="text-sm text-muted-foreground hover:text-foreground">← Change length</button>
      <QuizRunner questions={questions} onRestart={() => start(count)} />
    </div>
  );
}
