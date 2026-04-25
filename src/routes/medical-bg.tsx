// Medical Bulgarian — vocabulary, dialogues, practice test.
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MEDICAL_VOCAB,
  DISEASE_DIALOGUES,
  MEDICAL_QUESTIONS,
  type MedicalCategory,
} from "@/data/medical";
import { speak } from "@/lib/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/medical-bg")({
  component: MedicalBgPage,
  ssr: false,
});

const STORAGE_KEY = "btb1_medical_v1";

const CATEGORIES: { id: MedicalCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "body", label: "Body" },
  { id: "symptoms", label: "Symptoms" },
  { id: "diseases", label: "Diseases" },
  { id: "procedures", label: "Procedures" },
  { id: "history", label: "History" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "emergency", label: "Emergency" },
];

function MedicalBgPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">
          🏥 Medical Bulgarian
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vocabulary, doctor-patient dialogues, and a practice test for foreign
          medical students and doctors in Bulgaria.
        </p>
      </header>

      <Tabs defaultValue="vocab" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="vocab">Vocabulary</TabsTrigger>
          <TabsTrigger value="dialogues">Dialogues</TabsTrigger>
          <TabsTrigger value="test">Practice Test</TabsTrigger>
        </TabsList>

        <TabsContent value="vocab" className="mt-4">
          <VocabularyTab />
        </TabsContent>
        <TabsContent value="dialogues" className="mt-4">
          <DialoguesTab />
        </TabsContent>
        <TabsContent value="test" className="mt-4">
          <PracticeTestTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VocabularyTab() {
  const [cat, setCat] = useState<MedicalCategory | "all">("all");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const filtered = useMemo(
    () => (cat === "all" ? MEDICAL_VOCAB : MEDICAL_VOCAB.filter((w) => w.category === cat)),
    [cat],
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              cat === c.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => {
          const key = `${w.category}-${w.bg}`;
          const flip = !!flipped[key];
          return (
            <button
              key={key}
              onClick={() => setFlipped((p) => ({ ...p, [key]: !flip }))}
              className="group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-lg font-semibold text-foreground">
                  {flip ? w.en : w.bg}
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                  {w.category}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {flip ? w.bg : w.en}
              </p>
              <span className="mt-2 inline-block text-[10px] text-muted-foreground/70">
                Tap to flip
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DialoguesTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {DISEASE_DIALOGUES.map((d, i) => {
        const open = openIdx === i;
        return (
          <div key={d.disease} className="rounded-xl border border-border bg-card shadow-sm">
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  {d.disease}
                </p>
                <p className="text-xs text-muted-foreground">{d.diseaseEn}</p>
              </div>
              <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
            </button>
            {open && (
              <div className="space-y-4 border-t border-border p-4">
                <div className="space-y-2">
                  {d.dialogue.map((line, j) => (
                    <div key={j} className="rounded-md border border-border bg-secondary/40 p-3">
                      <p className="text-[10px] font-bold uppercase text-primary">
                        {line.speaker}
                      </p>
                      <div className="mt-1 flex items-start justify-between gap-2">
                        <p className="text-sm text-foreground">{line.bg}</p>
                        <button
                          onClick={() => speak(line.bg)}
                          className="shrink-0 rounded-full border border-border bg-card px-2 py-1 text-xs hover:bg-accent"
                          aria-label="Play audio"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="mt-1 text-xs italic text-muted-foreground">{line.en}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Key vocabulary
                  </p>
                  <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                    {d.keyVocab.map((v) => (
                      <li key={v.bg}>
                        <span className="font-medium text-foreground">{v.bg}</span>
                        <span className="text-muted-foreground"> — {v.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Treatment
                  </p>
                  <p className="mt-1 text-sm text-foreground">{d.treatment}</p>
                  <p className="mt-1 text-xs italic text-muted-foreground">{d.treatmentEn}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PracticeTestTab() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    MEDICAL_QUESTIONS.map(() => null),
  );
  const [done, setDone] = useState(false);
  const total = MEDICAL_QUESTIONS.length;
  const q = MEDICAL_QUESTIONS[idx];

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
      const score = answers.reduce(
        (acc, a, i) => acc + (a === MEDICAL_QUESTIONS[i].correct ? 1 : 0),
        0,
      );
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ score, total, date: new Date().toISOString() }),
        );
      } catch {}
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  function restart() {
    setIdx(0);
    setPicked(null);
    setAnswers(MEDICAL_QUESTIONS.map(() => null));
    setDone(false);
  }

  if (done) {
    const score = answers.reduce(
      (acc, a, i) => acc + (a === MEDICAL_QUESTIONS[i].correct ? 1 : 0),
      0,
    );
    const byCat: Record<string, { c: number; t: number }> = {};
    MEDICAL_QUESTIONS.forEach((qq, i) => {
      const k = qq.category;
      byCat[k] = byCat[k] || { c: 0, t: 0 };
      byCat[k].t++;
      if (answers[i] === qq.correct) byCat[k].c++;
    });
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h3 className="font-display text-3xl font-bold text-foreground">
            {score} / {total}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.round((score / total) * 100)}%
          </p>
          <button
            onClick={restart}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            By category
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(byCat).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="capitalize text-foreground">{k}</span>
                <span className="font-mono text-muted-foreground">
                  {v.c}/{v.t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {idx + 1} / {total}</span>
        <span className="capitalize">{q.category}</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{q.prompt}</h3>
      <div className="mt-4 grid gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isPicked = i === picked;
          let cls =
            "rounded-lg border border-border bg-secondary px-4 py-3 text-left text-sm text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed";
          if (picked !== null) {
            if (isCorrect)
              cls = "rounded-lg border border-green-500 bg-green-500/20 px-4 py-3 text-left text-sm text-green-200";
            else if (isPicked)
              cls = "rounded-lg border border-red-500 bg-red-500/20 px-4 py-3 text-left text-sm text-red-200";
            else cls += " opacity-60";
          }
          return (
            <button key={i} disabled={picked !== null} onClick={() => pick(i)} className={cls}>
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
  );
}
