import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QuizRunner } from "@/components/QuizRunner";
import { buildMixed, buildWordQuiz, buildVerbQuiz } from "@/lib/quiz";

export const Route = createFileRoute("/quiz")({ component: QuizPage, ssr: false });

type Mode = "mixed" | "words" | "verbs-inf" | "verbs-conj";

function QuizPage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [questions, setQuestions] = useState(() => [] as ReturnType<typeof buildMixed>);

  function start(m: Mode) {
    setMode(m);
    if (m === "mixed") setQuestions(buildMixed(12));
    else if (m === "words") setQuestions(buildWordQuiz(12));
    else if (m === "verbs-inf") setQuestions(buildVerbQuiz(12, "inf"));
    else setQuestions(buildVerbQuiz(12, "conj"));
  }

  if (!mode) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Practice Quiz</h1>
          <p className="mt-1 text-muted-foreground">English prompt → choose the Bulgarian answer. Pick a focus:</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card title="Mixed" desc="Words + verb infinitives + conjugations" onClick={() => start("mixed")} />
          <Card title="Words only" desc="Vocabulary across daily/work/mechanical" onClick={() => start("words")} />
          <Card title="Verbs — infinitives" desc="Match English meaning to Bulgarian infinitive" onClick={() => start("verbs-inf")} />
          <Card title="Verbs — conjugations" desc="Conjugate verbs in present tense" onClick={() => start("verbs-conj")} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setMode(null)} className="text-sm text-muted-foreground hover:text-foreground">← Back to modes</button>
      <QuizRunner questions={questions} onRestart={() => start(mode)} />
    </div>
  );
}

function Card({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary/50 hover:bg-accent/30">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}
