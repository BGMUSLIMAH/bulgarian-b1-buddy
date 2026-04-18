import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QuizCard } from "@/components/QuizCard";
import { buildMixed } from "@/lib/quiz";
import { recordEvaluation } from "@/lib/store";

export const Route = createFileRoute("/evaluation")({ component: EvalPage });

const TOTAL = 25;

function levelOf(pct: number) {
  if (pct >= 75) return { code: "B1", label: "Intermediate — you're at B1!", color: "text-green-400" };
  if (pct >= 50) return { code: "A2", label: "Elementary — solid A2 base", color: "text-yellow-400" };
  return { code: "A1", label: "Beginner — keep practicing daily", color: "text-orange-400" };
}

function EvalPage() {
  const [questions, setQuestions] = useState(() => buildMixed(TOTAL));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function restart() {
    setQuestions(buildMixed(TOTAL));
    setI(0); setScore(0); setDone(false);
  }

  if (done) {
    const pct = Math.round((score / TOTAL) * 100);
    const lvl = levelOf(pct);
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Evaluation result</p>
        <h2 className="mt-2 text-5xl font-bold">{score} / {TOTAL}</h2>
        <p className="mt-2 text-2xl text-foreground">{pct}%</p>
        <p className={`mt-6 text-4xl font-bold ${lvl.color}`}>Level: {lvl.code}</p>
        <p className="mt-2 text-muted-foreground">{lvl.label}</p>
        <button onClick={restart} className="mt-8 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90">
          Take again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Evaluation</h1>
        <p className="mt-1 text-muted-foreground">{TOTAL} mixed questions. Your final % maps to A1 / A2 / B1.</p>
      </div>
      <QuizCard
        question={questions[i]}
        index={i}
        total={TOTAL}
        onAnswered={(c) => { if (c) setScore((s) => s + 1); }}
        onNext={() => {
          if (i + 1 >= TOTAL) {
            const final = score; // already updated in onAnswered before next click
            const pct = Math.round((final / TOTAL) * 100);
            recordEvaluation(final, TOTAL, levelOf(pct).code);
            setDone(true);
          } else setI(i + 1);
        }}
      />
    </div>
  );
}
