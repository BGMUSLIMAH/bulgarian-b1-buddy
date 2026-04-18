import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { WORDS } from "@/data/words";
import { SENTENCES } from "@/data/sentences";
import { speak, shuffle } from "@/lib/store";

export const Route = createFileRoute("/speaking")({ component: SpeakingPage });

function SpeakingPage() {
  const items = useMemo(
    () => shuffle([
      ...WORDS.map((w) => ({ bg: w.bg, en: w.en })),
      ...SENTENCES.map((s) => ({ bg: s.bg, en: s.en })),
    ]).slice(0, 30),
    [],
  );
  const [i, setI] = useState(0);
  const it = items[i];

  useEffect(() => { setTimeout(() => speak(it.bg), 200); }, [it]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Speaking</h1>
        <p className="mt-1 text-muted-foreground">Listen, then say it out loud. Repeat until it feels natural.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{i + 1} / {items.length}</p>
        <p className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">{it.bg}</p>
        <p className="mt-3 text-muted-foreground">{it.en}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => speak(it.bg)}
            className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            🔊 Play
          </button>
          <button
            onClick={() => setI((x) => (x + 1) % items.length)}
            className="rounded-md border border-border bg-secondary px-5 py-2 font-medium text-secondary-foreground hover:bg-accent"
          >
            Next →
          </button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Tip: speak after the audio. Compare your pronunciation by replaying.</p>
      </div>
    </div>
  );
}
