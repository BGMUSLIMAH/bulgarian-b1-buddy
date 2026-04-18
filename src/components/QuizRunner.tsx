// Runs a list of questions and reports a final score.
import { useState } from "react";
import { QuizCard, type QuizQuestion } from "./QuizCard";

interface Props {
  questions: QuizQuestion[];
  onFinish?: (score: number, total: number) => void;
  onRestart?: () => void;
}

export function QuizRunner({ questions, onFinish, onRestart }: Props) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) return <p className="text-muted-foreground">No questions.</p>;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-3xl font-bold text-foreground">Session complete!</h2>
        <p className="mt-3 text-5xl font-bold text-primary">{score} / {questions.length}</p>
        <p className="mt-2 text-muted-foreground">{pct}% correct</p>
        {onRestart && (
          <button
            onClick={() => { setI(0); setScore(0); setDone(false); onRestart(); }}
            className="mt-6 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <QuizCard
      question={questions[i]}
      index={i}
      total={questions.length}
      onAnswered={(c) => { if (c) setScore((s) => s + 1); }}
      onNext={() => {
        if (i + 1 >= questions.length) {
          setDone(true);
          onFinish?.(score, questions.length);
        } else setI(i + 1);
      }}
    />
  );
}
