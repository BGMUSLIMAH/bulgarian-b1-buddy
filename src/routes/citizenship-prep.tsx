// Bulgarian Citizenship Test Prep — 5 mock exams (20 questions each, pass = 12).
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CITIZENSHIP_EXAMS, type CitizenshipExam, type CitizenshipQuestion } from "@/data/citizenship";
import { shuffle } from "@/lib/store";

export const Route = createFileRoute("/citizenship-prep")({
  component: CitizenshipPrepPage,
  ssr: false,
});

const STORAGE_KEY = "btb1_citizenship_v1";
const PASS_SCORE = 12;

type ScoresMap = Record<string, { score: number; total: number; date: string; timeSec: number }>;

function loadScores(): ScoresMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveScore(examId: string, score: number, total: number, timeSec: number) {
  const all = loadScores();
  all[examId] = { score, total, date: new Date().toISOString(), timeSec };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function CitizenshipPrepPage() {
  const [activeExam, setActiveExam] = useState<CitizenshipExam | null>(null);
  const [scores, setScores] = useState<ScoresMap>({});

  useEffect(() => setScores(loadScores()), [activeExam]);

  if (!activeExam) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-3xl font-bold text-foreground">
            🏛️ Citizenship Test Prep
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            5 full mock exams modeled on the official ЦКОКУО Bulgarian language test.
            Pass = {PASS_SCORE}/20. Questions are shuffled each attempt.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {CITIZENSHIP_EXAMS.map((exam) => {
            const last = scores[exam.id];
            const passed = last && last.score >= PASS_SCORE;
            return (
              <button
                key={exam.id}
                onClick={() => setActiveExam(exam)}
                className="rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:bg-accent/40"
              >
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {exam.title}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {exam.questions.length} questions · ~15 min
                </p>
                {last && (
                  <p className={`mt-3 text-sm font-medium ${passed ? "text-green-500" : "text-red-400"}`}>
                    Last attempt: {last.score}/{last.total} · {fmtTime(last.timeSec)} ·{" "}
                    {passed ? "✓ Passed" : "✗ Failed"}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return <ExamRunner exam={activeExam} onExit={() => setActiveExam(null)} />;
}

function ExamRunner({ exam, onExit }: { exam: CitizenshipExam; onExit: () => void }) {
  // Shuffle questions once per attempt (new shuffle every time the component mounts)
  const questions = useMemo<CitizenshipQuestion[]>(
    () => shuffle([...exam.questions]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [showEn, setShowEn] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const total = questions.length;
  const q = questions[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
  }

  function next() {
    if (picked === null) return;
    if (idx + 1 >= total) {
      const score = answers.reduce<number>(
        (acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0),
        0,
      );
      saveScore(exam.id, score, total, elapsed);
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  if (done) {
    const score = answers.reduce<number>(
      (acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0),
      0,
    );
    const passed = score >= PASS_SCORE;
    const wrong = questions
      .map((qq, i) => ({ qq, i, ans: answers[i] }))
      .filter((x) => x.ans !== x.qq.correct);

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{exam.title}</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-foreground">
            {score} / {total}
          </h2>
          <p className={`mt-2 text-lg font-semibold ${passed ? "text-green-500" : "text-red-400"}`}>
            {passed ? "✓ PASSED" : "✗ FAILED"} · need {PASS_SCORE}/20
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Time: {fmtTime(elapsed)}</p>
          <button
            onClick={onExit}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try another exam
          </button>
        </div>

        {wrong.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Review wrong answers ({wrong.length})
            </h3>
            {wrong.map(({ qq, i, ans }) => (
              <div key={qq.id} className="rounded-lg border border-border bg-card p-4 text-sm">
                <p className="font-medium text-foreground">
                  Q{i + 1}. {qq.prompt}
                </p>
                <p className="mt-2 text-red-400">
                  Your answer: {ans !== null ? qq.options[ans] : "—"}
                </p>
                <p className="mt-1 text-green-400">
                  Correct: {qq.options[qq.correct]}
                </p>
                {qq.explanation && (
                  <p className="mt-1 text-xs text-muted-foreground">{qq.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </button>
        <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs">
          ⏱ {fmtTime(elapsed)}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">{exam.title}</h2>
          <button
            onClick={() => setShowEn((v) => !v)}
            className="rounded-full border border-border bg-secondary px-3 py-1 text-xs hover:bg-accent"
          >
            {showEn ? "Hide EN" : "Show EN"}
          </button>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
          {exam.passage}
        </p>
        {showEn && exam.passageEn && (
          <p className="mt-3 whitespace-pre-line border-t border-border pt-3 text-sm italic leading-relaxed text-muted-foreground">
            {exam.passageEn}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {idx + 1} / {total}</span>
          <span>Pass {PASS_SCORE}/{total}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{q.prompt}</h3>

        <div className="mt-4 grid gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct;
            const isPicked = i === picked;
            let cls =
              "rounded-lg border border-border bg-secondary px-4 py-3 text-left text-sm text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed";
            if (picked !== null) {
              if (isCorrect) cls = "rounded-lg border border-green-500 bg-green-500/20 px-4 py-3 text-left text-sm text-green-200";
              else if (isPicked) cls = "rounded-lg border border-red-500 bg-red-500/20 px-4 py-3 text-left text-sm text-red-200";
              else cls += " opacity-60";
            }
            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => pick(i)}
                className={cls}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex min-h-[2.5rem] items-center justify-between">
          {picked !== null ? (
            <>
              <p className="text-sm">
                {picked === q.correct ? (
                  <span className="font-medium text-green-400">✓ Correct</span>
                ) : (
                  <span className="font-medium text-red-400">
                    ✗ Correct: {q.options[q.correct]}
                  </span>
                )}
                {q.explanation && (
                  <span className="ml-2 text-muted-foreground">— {q.explanation}</span>
                )}
              </p>
              <button
                onClick={next}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {idx + 1 === total ? "Finish" : "Next →"}
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
