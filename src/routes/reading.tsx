import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SENTENCES } from "@/data/sentences";
import { speak } from "@/lib/store";

export const Route = createFileRoute("/reading")({ component: ReadingPage });

function ReadingPage() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reading</h1>
        <p className="mt-1 text-muted-foreground">Read each Bulgarian sentence. Try to translate it, then reveal the answer.</p>
      </div>
      <div className="grid gap-3">
        {SENTENCES.map((s, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg text-foreground">{s.bg}</p>
              <button onClick={() => speak(s.bg)} className="shrink-0 rounded-md bg-secondary px-2 py-1 text-sm hover:bg-accent" aria-label="Play">🔊</button>
            </div>
            {revealed[idx] ? (
              <p className="mt-2 text-sm text-primary">{s.en}</p>
            ) : (
              <button
                onClick={() => setRevealed((r) => ({ ...r, [idx]: true }))}
                className="mt-2 text-sm text-muted-foreground underline hover:text-foreground"
              >
                Reveal translation
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
