// Local persistent stats stored in localStorage.
const KEY = "btb1_progress_v1";

export interface Stats {
  correct: number;
  wrong: number;
  perWord: Record<string, { correct: number; wrong: number }>;
  evaluations: { date: string; score: number; total: number; level: string }[];
}

const DEFAULT: Stats = { correct: 0, wrong: 0, perWord: {}, evaluations: [] };

export function loadStats(): Stats {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveStats(s: Stats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordAnswer(key: string, isCorrect: boolean) {
  const s = loadStats();
  if (isCorrect) s.correct++;
  else s.wrong++;
  const pw = s.perWord[key] || { correct: 0, wrong: 0 };
  if (isCorrect) pw.correct++;
  else pw.wrong++;
  s.perWord[key] = pw;
  saveStats(s);
}

export function recordEvaluation(score: number, total: number, level: string) {
  const s = loadStats();
  s.evaluations.unshift({ date: new Date().toISOString(), score, total, level });
  s.evaluations = s.evaluations.slice(0, 20);
  saveStats(s);
}

export function resetStats() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "bg-BG";
    u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const bg = voices.find((v) => v.lang.toLowerCase().startsWith("bg"));
    if (bg) u.voice = bg;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
