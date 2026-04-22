import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SENTENCES } from "@/data/sentences";
import { SCENARIOS, type Scenario } from "@/data/scenarios";
import { speak } from "@/lib/store";

export const Route = createFileRoute("/reading")({ component: ReadingPage });

function ReadingPage() {
  const [tab, setTab] = useState<"sentences" | "scenarios">("scenarios");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reading</h1>
        <p className="mt-1 text-muted-foreground">
          Practice with real-life scenarios or short B1 sentences.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("scenarios")}
          className={`rounded-md px-4 py-2 text-sm transition ${
            tab === "scenarios" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          🎭 Real-life scenarios
        </button>
        <button
          onClick={() => setTab("sentences")}
          className={`rounded-md px-4 py-2 text-sm transition ${
            tab === "sentences" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          📖 Sentences
        </button>
      </div>

      {tab === "scenarios" ? (
        <div className="grid gap-4">
          {SCENARIOS.map((s) => (
            <ScenarioCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {SENTENCES.map((s, idx) => (
            <SentenceCard key={idx} bg={s.bg} en={s.en} />
          ))}
        </div>
      )}
    </div>
  );
}

function SentenceCard({ bg, en }: { bg: string; en: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg text-foreground">{bg}</p>
        <button
          onClick={() => speak(bg)}
          className="shrink-0 rounded-md bg-secondary px-2 py-1 text-sm hover:bg-accent"
          aria-label="Play"
        >
          🔊
        </button>
      </div>
      {revealed ? (
        <p className="mt-2 text-sm text-primary">{en}</p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="mt-2 text-sm text-muted-foreground underline hover:text-foreground"
        >
          Reveal translation
        </button>
      )}
    </div>
  );
}

function ScenarioCard({ s }: { s: Scenario }) {
  const [showEn, setShowEn] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            <span className="mr-2">{s.emoji}</span>
            {s.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{s.context}</p>
        </div>
        <button
          onClick={() => setShowEn((v) => !v)}
          className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1 text-xs hover:bg-accent"
        >
          {showEn ? "Hide EN" : "Show EN"}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {s.dialogue.map((line, i) => (
          <div key={i} className="rounded-md border border-border bg-background/50 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm">
                <span className="mr-2 font-semibold text-primary">{line.speaker}:</span>
                <span className="text-foreground">{line.bg}</span>
              </p>
              <button
                onClick={() => speak(line.bg)}
                className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs hover:bg-accent"
                aria-label="Play line"
              >
                🔊
              </button>
            </div>
            {showEn && <p className="mt-1 text-xs text-muted-foreground">{line.en}</p>}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-border bg-accent/30 p-4">
        <p className="text-sm font-medium">{s.question}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {s.options.map((opt, i) => {
            const isCorrect = i === s.correct;
            const isPicked = i === picked;
            let cls =
              "rounded-md border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed";
            if (picked !== null) {
              if (isCorrect) cls += " !border-green-500 !bg-green-500/20 !text-green-200";
              else if (isPicked) cls += " !border-red-500 !bg-red-500/20 !text-red-200";
              else cls += " opacity-60";
            }
            return (
              <button key={i} className={cls} onClick={() => picked === null && setPicked(i)} disabled={picked !== null} type="button">
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p className="mt-3 text-xs text-muted-foreground">💡 {s.explanation}</p>
        )}
      </div>
    </div>
  );
}
