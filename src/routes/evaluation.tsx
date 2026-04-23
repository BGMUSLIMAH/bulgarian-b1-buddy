import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { buildCefrTest, scoreCefrTest, SECTIONS, type CefrQuestion, type SectionId, type CefrResult } from "@/lib/cefr";
import { recordEvaluation, speak } from "@/lib/store";

export const Route = createFileRoute("/evaluation")({
  component: EvalPage,
  ssr: false,
  head: () => ({
    meta: [
      { title: "CEFR Level Test — Bulgarian Trainer" },
      { name: "description", content: "60-question CEFR placement test for Bulgarian — vocabulary, grammar, reading, listening and writing. Get your A1/A2/B1/B2 level." },
    ],
  }),
});

function EvalPage() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<CefrQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [i, setI] = useState(0);
  const [result, setResult] = useState<CefrResult | null>(null);

  function start() {
    const qs = buildCefrTest();
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setI(0);
    setStarted(true);
    setResult(null);
  }

  function pick(idx: number) {
    if (answers[i] !== null) return;
    const next = [...answers];
    next[i] = idx;
    setAnswers(next);
  }

  function goNext() {
    if (i + 1 >= questions.length) {
      const r = scoreCefrTest(questions, answers);
      setResult(r);
      try {
        recordEvaluation(r.correct, r.total, r.level);
        localStorage.setItem("btb1_cefr_result_v1", JSON.stringify({ ...r, takenAt: new Date().toISOString() }));
      } catch { /* ignore */ }
    } else {
      setI(i + 1);
    }
  }

  if (!started && !result) return <Intro onStart={start} />;
  if (result) return <Results r={result} onRestart={start} />;
  return (
    <Runner
      q={questions[i]}
      i={i}
      total={questions.length}
      answer={answers[i]}
      onPick={pick}
      onNext={goNext}
    />
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  const total = SECTIONS.reduce((a, s) => a + s.count, 0);
  const previous = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("btb1_cefr_result_v1");
      return raw ? (JSON.parse(raw) as CefrResult & { takenAt: string }) : null;
    } catch { return null; }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">CEFR placement</p>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Bulgarian level test</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {total} questions across 5 sections. Takes about 15–25 minutes. At the end you'll get your CEFR level (A1/A2/B1/B2) with a per-section breakdown.
        </p>
      </div>

      {previous && (
        <div className="rounded-xl border border-border bg-card/60 p-4 text-sm">
          Last result: <strong className="text-primary">{previous.level}</strong> · {previous.correct}/{previous.total} ({previous.pct}%) · {new Date(previous.takenAt).toLocaleDateString()}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl">{s.emoji}</p>
            <h3 className="mt-2 font-semibold">{s.label} <span className="text-xs text-muted-foreground">· {s.count} q</span></h3>
            <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Start the test →
      </button>
    </div>
  );
}

function Runner({
  q, i, total, answer, onPick, onNext,
}: {
  q: CefrQuestion;
  i: number;
  total: number;
  answer: number | null;
  onPick: (idx: number) => void;
  onNext: () => void;
}) {
  const sec = SECTIONS.find((s) => s.id === q.section)!;
  const sectionStart = SECTIONS.slice(0, SECTIONS.findIndex((s) => s.id === q.section)).reduce((a, s) => a + s.count, 0);
  const sectionIndex = i - sectionStart + 1;
  const overallPct = Math.round(((i + (answer !== null ? 1 : 0)) / total) * 100);

  // Auto-play listening prompts on first render of the question.
  useEffect(() => {
    if (q.audio) speak(q.audio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-primary">{sec.emoji} {sec.label}</span>
          <span className="text-muted-foreground">Section {sectionIndex}/{sec.count} · Overall {i + 1}/{total}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
        {q.passage && (
          <div className="mb-4 rounded-md border border-border bg-background/60 p-4 text-sm">
            <p className="whitespace-pre-line text-foreground">{q.passage.bg}</p>
          </div>
        )}

        <h2 className="text-xl font-semibold text-foreground">{q.prompt}</h2>

        {q.audio && (
          <button
            onClick={() => speak(q.audio!)}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
            type="button"
          >
            ▶ Replay audio
          </button>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correct;
            const isPicked = idx === answer;
            let cls =
              "rounded-lg border border-border bg-secondary px-4 py-3 text-left text-base text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed";
            if (answer !== null) {
              if (isCorrect) cls += " !border-green-500 !bg-green-500/20 !text-green-200";
              else if (isPicked) cls += " !border-red-500 !bg-red-500/20 !text-red-200";
              else cls += " opacity-60";
            }
            return (
              <button key={idx} className={cls} onClick={() => onPick(idx)} disabled={answer !== null} type="button">
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex min-h-[3rem] items-center justify-between">
          {answer !== null ? (
            <>
              <p className="text-sm">
                {answer === q.correct ? (
                  <span className="font-medium text-green-400">✓ Correct</span>
                ) : (
                  <>
                    <span className="font-medium text-red-400">✗ Wrong.</span>{" "}
                    <span className="text-muted-foreground">Correct: </span>
                    <span className="font-semibold text-foreground">{q.options[q.correct]}</span>
                  </>
                )}
              </p>
              <button
                onClick={onNext}
                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                type="button"
              >
                {i + 1 >= total ? "See result" : "Next →"}
              </button>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Pick an answer.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Results({ r, onRestart }: { r: CefrResult; onRestart: () => void }) {
  const shareText = `I scored ${r.level} (${r.pct}%) on the Български Trainer CEFR test 🇧🇬`;

  function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "My Bulgarian CEFR result", text: shareText }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert("Copied: " + shareText);
    }
  }

  const colorByLevel: Record<string, string> = {
    A1: "text-orange-400",
    A2: "text-yellow-400",
    B1: "text-green-400",
    B2: "text-emerald-300",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-accent/40 p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Your CEFR level</p>
        <p className={`mt-2 font-display text-7xl font-bold ${colorByLevel[r.level]}`}>{r.level}</p>
        <p className="mt-2 text-2xl text-foreground">{r.correct} / {r.total} <span className="text-muted-foreground">({r.pct}%)</span></p>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Per-section score</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(r.perSection) as SectionId[]).map((id) => {
            const s = r.perSection[id];
            const meta = SECTIONS.find((x) => x.id === id)!;
            return (
              <div key={id} className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{meta.emoji} {meta.label}</span>
                  <span className="text-sm text-muted-foreground">{s.correct}/{s.total}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.pct}%` }} />
                </div>
                <p className="mt-1 text-right text-xs text-muted-foreground">{s.pct}%</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">What this means</h2>
        <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Recommended focus</h3>
        <p className="mt-1 text-sm text-muted-foreground">{r.recommendation}</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={share}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          📤 Share my result
        </button>
        <button
          onClick={onRestart}
          className="rounded-md border border-border bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent"
        >
          Take again
        </button>
      </div>
    </div>
  );
}
