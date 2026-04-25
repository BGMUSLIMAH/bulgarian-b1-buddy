// Medical Bulgarian — vocabulary, dialogues, practice test, oral prep.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  MEDICAL_VOCAB,
  DISEASE_DIALOGUES,
  MEDICAL_QUESTIONS,
  ORAL_TOPICS,
  CASE_STUDY_CARDS,
  EXAM_CONFIG,
  type MedicalCategory,
  type OralTopic,
  type CaseStudyCard,
} from "@/data/medical";
import { speak, shuffle } from "@/lib/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/medical-bg")({
  component: MedicalBgPage,
  ssr: false,
});

const STORAGE_KEY = "btb1_medical_v1";
const EXAM_STORAGE_KEY = "btb1_medical_exam_v1";

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
  const [tab, setTab] = useState("vocab");
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">
          🏥 Medical Bulgarian
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vocabulary, doctor-patient dialogues, written test, and oral prep for
          foreign medical students and doctors in Bulgaria.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="vocab">Vocabulary</TabsTrigger>
          <TabsTrigger value="dialogues">Dialogues</TabsTrigger>
          <TabsTrigger value="test">Practice Test</TabsTrigger>
          <TabsTrigger value="oral">Oral Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="vocab" className="mt-4">
          <VocabularyTab />
        </TabsContent>
        <TabsContent value="dialogues" className="mt-4">
          <DialoguesTab />
        </TabsContent>
        <TabsContent value="test" className="mt-4">
          <PracticeTestTab setTab={setTab} />
        </TabsContent>
        <TabsContent value="oral" className="mt-4">
          <OralPrepTab />
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

// ─────────────────────────── Practice Test ───────────────────────────

type TestMode = "study" | "exam";

function PracticeTestTab({ setTab }: { setTab: (t: string) => void }) {
  const [mode, setMode] = useState<TestMode | null>(null);

  if (mode === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setMode("study")}
          className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:bg-accent/40"
        >
          <p className="font-display text-2xl font-bold text-foreground">
            📖 Study Mode
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {EXAM_CONFIG.studyQuestionCount} random questions, no timer. Practice
            and learn at your own pace.
          </p>
        </button>
        <button
          onClick={() => setMode("exam")}
          className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:bg-accent/40"
        >
          <p className="font-display text-2xl font-bold text-foreground">
            🏥 Exam Mode
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            All {EXAM_CONFIG.writtenQuestionCount} questions, count-up timer,
            {" "}{EXAM_CONFIG.writtenDurationMinutes}-minute soft limit. Pass at{" "}
            {Math.round(EXAM_CONFIG.writtenPassThreshold * 100)}% to unlock oral.
          </p>
        </button>
      </div>
    );
  }

  return mode === "study" ? (
    <StudyModeRunner onExit={() => setMode(null)} />
  ) : (
    <ExamModeRunner onExit={() => setMode(null)} setTab={setTab} />
  );
}

function useQuestions(count: number) {
  return useMemo(() => shuffle(MEDICAL_QUESTIONS).slice(0, count), [count]);
}

function StudyModeRunner({ onExit }: { onExit: () => void }) {
  const questions = useQuestions(EXAM_CONFIG.studyQuestionCount);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [done, setDone] = useState(false);
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
        (acc, a, i) => acc + (a === questions[i].correct ? 1 : 0),
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

  if (done) {
    const score = answers.reduce<number>(
      (acc, a, i) => acc + (a === questions[i].correct ? 1 : 0),
      0,
    );
    const byCat: Record<string, { c: number; t: number }> = {};
    questions.forEach((qq, i) => {
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
            onClick={onExit}
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
    <McqCard
      q={q}
      idx={idx}
      total={total}
      picked={picked}
      onPick={pick}
      onNext={next}
      headerRight={<span className="capitalize">{q.category}</span>}
    />
  );
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ExamModeRunner({
  onExit,
  setTab,
}: {
  onExit: () => void;
  setTab: (t: string) => void;
}) {
  const questions = useQuestions(EXAM_CONFIG.writtenQuestionCount);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (
          !warnedRef.current &&
          next >= EXAM_CONFIG.writtenDurationMinutes * 60
        ) {
          warnedRef.current = true;
          toast("⏱️ 90 minutes reached — submit when ready");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

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
        (acc, a, i) => acc + (a === questions[i].correct ? 1 : 0),
        0,
      );
      const passed = score >= EXAM_CONFIG.writtenPassThreshold * total;
      try {
        localStorage.setItem(
          EXAM_STORAGE_KEY,
          JSON.stringify({
            score,
            total,
            passed,
            date: new Date().toISOString(),
          }),
        );
      } catch {}
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  if (done) {
    const score = answers.reduce<number>(
      (acc, a, i) => acc + (a === questions[i].correct ? 1 : 0),
      0,
    );
    const passed = score >= EXAM_CONFIG.writtenPassThreshold * total;
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h3 className="font-display text-3xl font-bold text-foreground">
            {score} / {total}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.round((score / total) * 100)}% · Time {fmtTime(seconds)}
          </p>
          {passed ? (
            <p className="mt-4 text-sm font-medium text-green-400">
              ✅ Written section passed! Oral section unlocked.
            </p>
          ) : (
            <>
              <p className="mt-4 text-sm font-medium text-red-400">
                ❌ Score below 60%. Retake the written section.
              </p>
              <button
                onClick={onExit}
                className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
            </>
          )}
        </div>
        {passed && <OralResultsUnlock setTab={setTab} />}
      </div>
    );
  }

  return (
    <McqCard
      q={q}
      idx={idx}
      total={total}
      picked={picked}
      onPick={pick}
      onNext={next}
      headerRight={
        <span className="font-mono tabular-nums text-foreground">
          ⏱ {fmtTime(seconds)}
        </span>
      }
    />
  );
}

function OralResultsUnlock({ setTab }: { setTab: (t: string) => void }) {
  return (
    <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-5 shadow-sm">
      <p className="text-sm text-foreground">
        Scroll down to the Oral Prep tab to practice your case studies and
        discussion topics.
      </p>
      <button
        onClick={() => setTab("oral")}
        className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go to Oral Prep →
      </button>
    </div>
  );
}

function McqCard({
  q,
  idx,
  total,
  picked,
  onPick,
  onNext,
  headerRight,
}: {
  q: (typeof MEDICAL_QUESTIONS)[number];
  idx: number;
  total: number;
  picked: number | null;
  onPick: (i: number) => void;
  onNext: () => void;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {idx + 1} / {total}
        </span>
        {headerRight}
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
              cls =
                "rounded-lg border border-green-500 bg-green-500/20 px-4 py-3 text-left text-sm text-green-200";
            else if (isPicked)
              cls =
                "rounded-lg border border-red-500 bg-red-500/20 px-4 py-3 text-left text-sm text-red-200";
            else cls += " opacity-60";
          }
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => onPick(i)}
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
            </p>
            <button
              onClick={onNext}
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

// ─────────────────────────── Oral Prep ───────────────────────────

type OralSection = "topics" | "cases";

function OralPrepTab() {
  const [section, setSection] = useState<OralSection>("topics");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSection("topics")}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            section === "topics"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          💬 Discussion Topics
        </button>
        <button
          onClick={() => setSection("cases")}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            section === "cases"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          📋 Case Studies
        </button>
      </div>
      {section === "topics" ? <DiscussionTopics /> : <CaseStudies />}
    </div>
  );
}

function DiscussionTopics() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {ORAL_TOPICS.map((t: OralTopic) => {
        const open = openId === t.id;
        return (
          <div
            key={t.id}
            className="rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {t.topic}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.topicEn}</p>
                </div>
                <button
                  onClick={() => speak(t.topic)}
                  className="shrink-0 rounded-full border border-border bg-card px-2 py-1 text-xs hover:bg-accent"
                  aria-label="Play audio"
                >
                  🔊
                </button>
              </div>
              <button
                onClick={() => setOpenId(open ? null : t.id)}
                className="mt-3 rounded-md border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-accent"
              >
                {open ? "Hide Sample Answer" : "Show Sample Answer"}
              </button>
            </div>
            {open && (
              <div className="space-y-3 border-t border-border p-4">
                <div className="rounded-md border border-primary/30 bg-primary/10 p-3">
                  <p className="text-sm text-foreground">{t.sampleAnswer}</p>
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    {t.sampleAnswerEn}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Key phrases
                  </p>
                  <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                    {t.keyPhrases.map((p) => (
                      <li key={p.bg}>
                        <span className="font-medium text-foreground">
                          {p.bg}
                        </span>
                        <span className="text-muted-foreground"> — {p.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CaseStudies() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {CASE_STUDY_CARDS.map((c: CaseStudyCard) => {
        const open = openId === c.id;
        return (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="p-4">
              <p className="font-display text-lg font-semibold text-foreground">
                {c.disease}
              </p>
              <p className="text-xs text-muted-foreground">{c.diseaseEn}</p>
              <p className="mt-3 text-sm text-foreground">{c.scenario}</p>
              <p className="mt-1 text-xs italic text-muted-foreground">
                {c.scenarioEn}
              </p>
              <button
                onClick={() => setOpenId(open ? null : c.id)}
                className="mt-3 rounded-md border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-accent"
              >
                {open ? "Hide Expected Points" : "Show Expected Points"}
              </button>
            </div>
            {open && (
              <div className="border-t border-border p-4">
                <ol className="space-y-3 text-sm">
                  {c.expectedPoints.map((p, i) => (
                    <li key={i}>
                      <p className="text-foreground">
                        <span className="mr-1 font-semibold text-primary">
                          {i + 1}.
                        </span>
                        {p}
                      </p>
                      {c.expectedPointsEn[i] && (
                        <p className="ml-5 text-xs italic text-muted-foreground">
                          {c.expectedPointsEn[i]}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
