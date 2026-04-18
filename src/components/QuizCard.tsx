// Reusable multiple-choice quiz card.
// Question shown in English (or as provided), 4 Bulgarian options.
// Correct answer is hidden until the user clicks; then green/red feedback appears.
import { useEffect, useState } from "react";
import { recordAnswer, shuffle } from "@/lib/store";

export interface QuizQuestion {
  prompt: string;          // shown to user (English)
  correct: string;         // Bulgarian correct answer
  distractors: string[];   // 3 wrong Bulgarian options
  key: string;             // tracking key
  hint?: string;           // optional small hint under prompt
}

interface Props {
  question: QuizQuestion;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  index: number;
  total: number;
}

export function QuizCard({ question, onAnswered, onNext, index, total }: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    setOptions(shuffle([question.correct, ...question.distractors]));
    setPicked(null);
  }, [question]);

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    const correct = opt === question.correct;
    recordAnswer(question.key, correct);
    onAnswered(correct);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {index + 1} / {total}</span>
        <span className="font-mono">EN → BG</span>
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-foreground">{question.prompt}</h2>
      {question.hint && <p className="mb-4 text-sm text-muted-foreground">{question.hint}</p>}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isCorrect = opt === question.correct;
          const isPicked = opt === picked;
          let cls =
            "rounded-lg border border-border bg-secondary px-4 py-3 text-left text-base text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed";
          if (picked) {
            if (isCorrect) cls += " !border-green-500 !bg-green-500/20 !text-green-200";
            else if (isPicked) cls += " !border-red-500 !bg-red-500/20 !text-red-200";
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
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm">
            {picked === question.correct ? (
              <span className="text-green-400">✓ Correct!</span>
            ) : (
              <>
                <span className="text-red-400">✗ Wrong.</span>{" "}
                <span className="text-muted-foreground">Correct answer: </span>
                <span className="font-semibold text-foreground">{question.correct}</span>
              </>
            )}
          </p>
          <button
            onClick={onNext}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {index + 1 === total ? "Finish" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
