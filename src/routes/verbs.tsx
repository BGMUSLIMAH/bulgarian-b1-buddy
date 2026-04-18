import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { VERBS } from "@/data/verbs";
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
        <p className="mt-1 text-muted-foreground">{VERBS.length} verbs with full present-tense conjugations.</p>
      </div>

      <div className="flex gap-2">
        <Tab active={tab === "list"} onClick={() => setTab("list")}>Browse</Tab>
        <Tab active={tab === "practice"} onClick={() => setTab("practice")}>Practice conjugations</Tab>
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
              <div key={v.inf} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-primary">{v.inf}</h3>
                  <span className="text-sm text-muted-foreground">{v.en}</span>
                </div>
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
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "practice" && (
        <PracticeBlock />
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

function PracticeBlock() {
  const [questions, setQuestions] = useState(() => buildVerbQuiz(15, "conj"));
  return (
    <QuizRunner questions={questions} onRestart={() => setQuestions(buildVerbQuiz(15, "conj"))} />
  );
}
