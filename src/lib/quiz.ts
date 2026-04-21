// Quiz question builders.
import { WORDS, type Word } from "@/data/words";
import { VERBS, VERB_TENSES, type Verb } from "@/data/verbs";
import { shuffle, isValidText } from "@/lib/store";
import type { QuizQuestion } from "@/components/QuizCard";

function pickDistractors(correct: string, pool: string[], n = 3): string[] {
  const filtered = pool.filter((p) => p !== correct && isValidText(p));
  const unique = Array.from(new Set(filtered));
  return shuffle(unique).slice(0, n);
}

// ---------- Validation ----------
// A word entry is usable if both bg and en are valid (non-empty, not all underscores).
const VALID_WORDS = WORDS.filter((w) => isValidText(w.bg) && isValidText(w.en));
const VALID_VERBS = VERBS.filter(
  (v) => isValidText(v.inf) && isValidText(v.en) && isValidText(v.az)
);

if (typeof window !== "undefined" && import.meta.env?.DEV) {
  const badWords = WORDS.filter((w) => !isValidText(w.bg) || !isValidText(w.en));
  const badVerbs = VERBS.filter(
    (v) => !isValidText(v.inf) || !isValidText(v.en) || !isValidText(v.az)
  );
  if (badWords.length) console.warn("[quiz] Filtered invalid word entries:", badWords);
  if (badVerbs.length) console.warn("[quiz] Filtered invalid verb entries:", badVerbs);
}

// ---------- Word questions ----------
export function wordQuestion(w: Word, allWords: Word[] = VALID_WORDS): QuizQuestion {
  return {
    prompt: w.en,
    correct: w.bg,
    distractors: pickDistractors(w.bg, allWords.map((x) => x.bg)),
    key: `word:${w.bg}`,
    hint: `Category: ${w.category}`,
    category: w.category,
  };
}

// ---------- Verb infinitive ----------
export function verbInfQuestion(v: Verb): QuizQuestion {
  return {
    prompt: `${v.en} (infinitive)`,
    correct: v.inf,
    distractors: pickDistractors(v.inf, VALID_VERBS.map((x) => x.inf)),
    key: `verb:${v.inf}`,
    category: "verbs",
  };
}

// ---------- Present tense conjugation ----------
const PRONOUNS: { label: string; field: keyof Verb }[] = [
  { label: "аз", field: "az" },
  { label: "ти", field: "ti" },
  { label: "той/тя", field: "toj" },
  { label: "ние", field: "nie" },
  { label: "вие", field: "vie" },
  { label: "те", field: "te" },
];

export function verbConjQuestion(v: Verb): QuizQuestion {
  const p = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
  const correct = v[p.field];
  const pool = VALID_VERBS.map((x) => x[p.field]).filter(isValidText);
  return {
    prompt: `Conjugate "${v.en}" — ${p.label} ___`,
    correct,
    distractors: pickDistractors(correct, pool),
    key: `conj:${v.inf}:${p.field}`,
    hint: `Infinitive: ${v.inf}. Present-tense personal endings differ by group (а-, и-, е-).`,
    category: "verbs",
  };
}

// ---------- Past (1sg aorist) ----------
export function verbPastQuestion(v: Verb): QuizQuestion | null {
  const t = VERB_TENSES[v.inf];
  if (!t || !isValidText(t.past1sg)) return null;
  const pool = Object.values(VERB_TENSES).map((x) => x.past1sg).filter(isValidText);
  return {
    prompt: `Past tense — "${v.en}" — аз ___ (вчера)`,
    correct: t.past1sg,
    distractors: pickDistractors(t.past1sg, pool),
    key: `past:${v.inf}`,
    hint: `Минало свършено време (aorist), 1st person singular. Endings: -ах / -ях / -их / -ох. Infinitive: ${v.inf}.`,
    category: "verbs-past",
  };
}

// ---------- Future (ще + present 1sg) ----------
export function verbFutureQuestion(v: Verb): QuizQuestion | null {
  const t = VERB_TENSES[v.inf];
  if (!t || !isValidText(t.future1sg)) return null;
  const pool = Object.values(VERB_TENSES).map((x) => x.future1sg).filter(isValidText);
  return {
    prompt: `Future tense — "${v.en}" — аз ___ (утре)`,
    correct: t.future1sg,
    distractors: pickDistractors(t.future1sg, pool),
    key: `fut:${v.inf}`,
    hint: `Future = "ще" + present 1sg form. Infinitive: ${v.inf}.`,
    category: "verbs-future",
  };
}

// Verbs that have past/future curated.
const VERBS_WITH_TENSES = VALID_VERBS.filter((v) => v.inf in VERB_TENSES);

// ---------- Mixed quiz ----------
export function buildMixed(count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const wordsShuffled = shuffle(VALID_WORDS);
  const verbsShuffled = shuffle(VALID_VERBS);
  const tensedShuffled = shuffle(VERBS_WITH_TENSES);
  let wi = 0, vi = 0, ti = 0;
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let q: QuizQuestion | null = null;
    if (r < 0.4) q = wordQuestion(wordsShuffled[wi++ % wordsShuffled.length]);
    else if (r < 0.7) q = verbInfQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
    else if (r < 0.85) q = verbConjQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
    else if (r < 0.95 && tensedShuffled.length > 0)
      q = verbPastQuestion(tensedShuffled[ti++ % tensedShuffled.length]);
    else if (tensedShuffled.length > 0)
      q = verbFutureQuestion(tensedShuffled[ti++ % tensedShuffled.length]);
    if (!q) q = wordQuestion(wordsShuffled[wi++ % wordsShuffled.length]);
    out.push(q);
  }
  return out;
}

export function buildWordQuiz(count: number, category?: Word["category"]): QuizQuestion[] {
  const pool = category ? VALID_WORDS.filter((w) => w.category === category) : VALID_WORDS;
  return shuffle(pool).slice(0, count).map((w) => wordQuestion(w, pool));
}

// Verb quiz: weighted present 60% / past 25% / future 15% when mode is "mix".
export function buildVerbQuiz(
  count: number,
  mode: "inf" | "conj" | "mix" | "tenses" = "mix"
): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const verbsShuffled = shuffle(VALID_VERBS);
  const tensedShuffled = shuffle(VERBS_WITH_TENSES);
  let vi = 0, ti = 0;
  for (let i = 0; i < count; i++) {
    let q: QuizQuestion | null = null;
    if (mode === "inf") q = verbInfQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
    else if (mode === "conj") q = verbConjQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
    else if (mode === "tenses" && tensedShuffled.length > 0) {
      const r = Math.random();
      const v = tensedShuffled[ti++ % tensedShuffled.length];
      q = r < 0.6 ? verbPastQuestion(v) : verbFutureQuestion(v);
    } else {
      // mix: 60% present (split between inf and conj), 25% past, 15% future
      const r = Math.random();
      if (r < 0.3) q = verbInfQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
      else if (r < 0.6) q = verbConjQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
      else if (r < 0.85 && tensedShuffled.length > 0)
        q = verbPastQuestion(tensedShuffled[ti++ % tensedShuffled.length]);
      else if (tensedShuffled.length > 0)
        q = verbFutureQuestion(tensedShuffled[ti++ % tensedShuffled.length]);
      else q = verbConjQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
    }
    if (!q) q = verbConjQuestion(verbsShuffled[vi++ % verbsShuffled.length]);
    out.push(q);
  }
  return out;
}
