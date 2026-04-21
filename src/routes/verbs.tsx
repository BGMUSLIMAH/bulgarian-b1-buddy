import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { VERBS, VERB_TENSES, hasTenses, type Verb } from "@/data/verbs";
import { QuizRunner } from "@/components/QuizRunner";
import { buildVerbQuiz } from "@/lib/quiz";

export const Route = createFileRoute("/verbs")({ component: VerbsPage });

function VerbsPage() {
  const [tab, setTab] = useState<"list" | "practice">("list");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return VERBS;
    const s = q.toLowerCase();
    return VERBS.filter((v) => v.inf.toLowerCase().includes(s) || v.en.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verbs</h1>
        <p className="mt-1 text-muted-foreground">
          {VERBS.length} verbs with present tense; {Object.keys(VERB_TENSES).length} top verbs also include past + future tense.
        </p>
      </div>

      <div className="flex gap-2">
        <Tab active={tab === "list"} onClick={() => setTab("list")}>Browse</Tab>
        <Tab active={tab === "practice"} onClick={() => setTab("practice")}>Practice (mixed tenses)</Tab>
      </div>

      {tab === "list" && (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search verb..."
            className="w-full max-w-xs rounded-md border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((v) => (
              <VerbCard key={v.inf} v={v} />
            ))}
          </div>
        </>
      )}

      {tab === "practice" && <PracticeBlock />}
    </div>
  );
}

function VerbCard({ v }: { v: Verb }) {
  const [tense, setTense] = useState<"present" | "past" | "future">("present");
  const tenses = VERB_TENSES[v.inf];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-primary">{v.inf}</h3>
        <span className="text-sm text-muted-foreground">{v.en}</span>
      </div>

      {hasTenses(v.inf) && (
        <div className="mt-3 flex gap-1">
          <MiniTab active={tense === "present"} onClick={() => setTense("present")}>Present</MiniTab>
          <MiniTab active={tense === "past"} onClick={() => setTense("past")}>Past</MiniTab>
          <MiniTab active={tense === "future"} onClick={() => setTense("future")}>Future</MiniTab>
        </div>
      )}

      {tense === "present" && (
        <table className="mt-3 w-full text-sm">
          <tbody>
            <Row p="аз" v={v.az} />
            <Row p="ти" v={v.ti} />
            <Row p="той/тя" v={v.toj} />
            <Row p="ние" v={v.nie} />
            <Row p="вие" v={v.vie} />
            <Row p="те" v={v.te} />
          </tbody>
        </table>
      )}

      {tense === "past" && tenses && (
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Минало свършено (1st person sg)
          </p>
          <p className="font-medium text-foreground">аз {tenses.past1sg}</p>
          <p className="text-xs text-muted-foreground">Endings pattern: -ах / -ях / -их / -ох</p>
        </div>
      )}

      {tense === "future" && tenses && (
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Бъдеще време (1st person sg)</p>
          <p className="font-medium text-foreground">аз {tenses.future1sg}</p>
          <p className="text-xs text-muted-foreground">Future = ще + present 1sg form.</p>
        </div>
      )}
    </div>
  );
}

function Row({ p, v }: { p: string; v: string }) {
  return (
    <tr className="border-t border-border">
      <td className="py-1 pr-4 text-muted-foreground">{p}</td>
      <td className="py-1 font-medium text-foreground">{v}</td>
    </tr>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm transition ${
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function MiniTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-0.5 text-xs transition ${
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function PracticeBlock() {
  const [questions, setQuestions] = useState(() => buildVerbQuiz(15, "mix"));
  return (
    <QuizRunner questions={questions} onRestart={() => setQuestions(buildVerbQuiz(15, "mix"))} />
  );
}
