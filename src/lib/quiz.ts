// Quiz question builders.
import { WORDS, type Word } from "@/data/words";
import { VERBS, type Verb } from "@/data/verbs";
import { shuffle } from "@/lib/store";
import type { QuizQuestion } from "@/components/QuizCard";

function pickDistractors(correct: string, pool: string[], n = 3): string[] {
  const filtered = pool.filter((p) => p !== correct);
  return shuffle(filtered).slice(0, n);
}

export function wordQuestion(w: Word, allWords: Word[] = WORDS): QuizQuestion {
  return {
    prompt: w.en,
    correct: w.bg,
    distractors: pickDistractors(w.bg, allWords.map((x) => x.bg)),
    key: `word:${w.bg}`,
    hint: `Category: ${w.category}`,
  };
}

export function verbInfQuestion(v: Verb): QuizQuestion {
  return {
    prompt: `${v.en} (infinitive)`,
    correct: v.inf,
    distractors: pickDistractors(v.inf, VERBS.map((x) => x.inf)),
    key: `verb:${v.inf}`,
  };
}

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
  // Distractors: same pronoun form from other verbs
  const pool = VERBS.map((x) => x[p.field]);
  return {
    prompt: `Conjugate "${v.en}" — ${p.label} ___`,
    correct,
    distractors: pickDistractors(correct, pool),
    key: `conj:${v.inf}:${p.field}`,
    hint: `Infinitive: ${v.inf}`,
  };
}

export function buildMixed(count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const wordsShuffled = shuffle(WORDS);
  const verbsShuffled = shuffle(VERBS);
  let wi = 0, vi = 0;
  for (let i = 0; i < count; i++) {
    const r = i % 3;
    if (r === 0) out.push(wordQuestion(wordsShuffled[wi++ % wordsShuffled.length]));
    else if (r === 1) out.push(verbInfQuestion(verbsShuffled[vi++ % verbsShuffled.length]));
    else out.push(verbConjQuestion(verbsShuffled[vi++ % verbsShuffled.length]));
  }
  return out;
}

export function buildWordQuiz(count: number, category?: Word["category"]): QuizQuestion[] {
  const pool = category ? WORDS.filter((w) => w.category === category) : WORDS;
  return shuffle(pool).slice(0, count).map((w) => wordQuestion(w, pool));
}

export function buildVerbQuiz(count: number, mode: "inf" | "conj" | "mix" = "mix"): QuizQuestion[] {
  return shuffle(VERBS).slice(0, count).map((v) => {
    if (mode === "inf") return verbInfQuestion(v);
    if (mode === "conj") return verbConjQuestion(v);
    return Math.random() < 0.5 ? verbInfQuestion(v) : verbConjQuestion(v);
  });
}
