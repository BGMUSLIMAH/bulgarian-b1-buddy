// Reusable multiple-choice quiz card.
// Shows question + 4 options. After picking, displays clear green/red feedback
// for at least 1.5s, then auto-advances. The card NEVER unmounts to a blank
// screen — the same card stays mounted between questions and just swaps content.
import { useEffect, useRef, useState } from "react";
import { recordAnswer, shuffle } from "@/lib/store";

export interface QuizQuestion {
  prompt: string;          // shown to user (English)
  correct: string;         // Bulgarian correct answer
  distractors: string[];   // 3 wrong Bulgarian options
  key: string;             // tracking key
  hint?: string;           // optional small hint (verbs grammar etc.) — hidden by default
  category?: string;       // for stats tracking by category
}

interface Props {
  question: QuizQuestion;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  index: number;
  total: number;
}

// ─── Tiny Web Audio beeps — no files, no dependencies ───────────────────────
function useQuizSounds() {
  const ctx = useRef<AudioContext | null>(null);

  function getCtx() {
    if (!ctx.current) ctx.current = new AudioContext();
    return ctx.current;
  }

  function playCorrect() {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      // Two rising tones: 600 Hz → 900 Hz
      osc.frequency.setValueAtTime(600, ac.currentTime);
      osc.frequency.setValueAtTime(900, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.35);
    } catch (_) { /* silently ignore if audio blocked */ }
  }

  function playWrong() {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sawtooth";
      // Low buzzy tone dropping: 300 Hz → 180 Hz
      osc.frequency.setValueAtTime(300, ac.currentTime);
      osc.frequency.setValueAtTime(180, ac.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.35);
    } catch (_) { /* silently ignore if audio blocked */ }
  }

  return { playCorrect, playWrong };
}
// ─────────────────────────────────────────────────────────────────────────────

export function QuizCard({ question, onAnswered, onNext, index, total }: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { playCorrect, playWrong } = useQuizSounds();

  useEffect(() => {
    setOptions(shuffle([question.correct, ...question.distractors]));
    setPicked(null);
    setShowHint(false);
  }, [question]);

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    const correct = opt === question.correct;
    recordAnswer(question.key, correct, question.category);
    onAnswered(correct);
    if (correct) playCorrect();
    else playWrong();
  }

  function goNext() {
    if (!picked) return;
    onNext();
  }

  const isLast = index + 1 === total;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {index + 1} / {total}</span>
        <span className="font-mono">EN → BG</span>
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-foreground">{question.prompt}</h2>

      {/* Hint toggle — hidden by default. Verb conjugation tables, grammar notes, etc. */}
      {question.hint && (
        <div className="mt-2">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-accent"
              type="button"
            >
              💡 Show Hint
            </button>
          ) : (
            <div className="flex items-start gap-2 rounded-md border border-border bg-accent/40 px-3 py-2 text-sm text-foreground">
              <span aria-hidden>💡</span>
              <span className="flex-1">{question.hint}</span>
              <button
                onClick={() => setShowHint(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
                type="button"
                aria-label="Hide hint"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isCorrect = opt === question.correct;
          const isPicked = opt === picked;
          let cls =
            "rounded-lg border border-border bg-secondary px-4 py-3 text-left text-base text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed";
          if (picked) {
            if (isCorrect) cls = cls.replace("bg-secondary", "bg-green-500/20") + " border-green-500 bg-green-500/20 text-green-200";
            else if (isPicked) cls = cls.replace("bg-secondary", "bg-green-500/20") + " border-red-500 bg-red-500/20 text-red-200";
            else cls += " opacity-60";
          }
          return (
            <button key={opt} className={cls} onClick={() => pick(opt)} disabled={!!picked} type="button">
              {opt}
            </button>
          );
        })}
      </div>
      {/* Feedback area — always reserves space so layout doesn't shift / blank */}
      <div className="mt-6 flex min-h-[3rem] items-center justify-between">
        {picked ? (
          <>
            <p className="text-sm">
              {picked === question.correct ? (
                <span className="font-medium text-green-400">✓ Correct!</span>
              ) : (
                <>
                  <span className="font-medium text-red-400">✗ Wrong.</span>{" "}
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="font-semibold text-foreground">{question.correct}</span>
                </>
              )}
            </p>
            <button
              onClick={goNext}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              type="button"
            >
              {isLast ? "Finish" : "Next →"}
            </button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Pick an answer.</p>
        )}
      </div>
    </div>
  );
}
