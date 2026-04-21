// Local persistent stats stored in localStorage + Bulgarian text-to-speech.
// TTS uses the public Google Translate audio endpoint as the primary source
// (reliable BG voice, no API key needed) and falls back to the browser's
// built-in speechSynthesis if the network request fails.

const KEY = "btb1_progress_v2";

export interface Stats {
  correct: number;
  wrong: number;
  perWord: Record<string, { correct: number; wrong: number; streak: number }>;
  perCategory: Record<string, { correct: number; wrong: number }>;
  evaluations: { date: string; score: number; total: number; level: string }[];
  // Gamification
  xp: number;
  // Daily streak — counted in calendar days the user practiced at least once
  lastPracticeDate: string | null; // YYYY-MM-DD
  streakDays: number;
}

const DEFAULT: Stats = {
  correct: 0,
  wrong: 0,
  perWord: {},
  perCategory: {},
  evaluations: [],
  xp: 0,
  lastPracticeDate: null,
  streakDays: 0,
};

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

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86_400_000);
}

function bumpStreak(s: Stats) {
  const today = todayStr();
  if (s.lastPracticeDate === today) return;
  if (s.lastPracticeDate && diffDays(s.lastPracticeDate, today) === 1) {
    s.streakDays += 1;
  } else {
    s.streakDays = 1;
  }
  s.lastPracticeDate = today;
}

export function recordAnswer(key: string, isCorrect: boolean, category?: string) {
  const s = loadStats();
  if (isCorrect) s.correct++;
  else s.wrong++;

  const pw = s.perWord[key] || { correct: 0, wrong: 0, streak: 0 };
  if (isCorrect) {
    pw.correct++;
    pw.streak++;
  } else {
    pw.wrong++;
    pw.streak = 0;
  }
  s.perWord[key] = pw;

  if (category) {
    const pc = s.perCategory[category] || { correct: 0, wrong: 0 };
    if (isCorrect) pc.correct++;
    else pc.wrong++;
    s.perCategory[category] = pc;
  }

  // XP: +10 correct, +2 wrong (still tried)
  s.xp += isCorrect ? 10 : 2;

  bumpStreak(s);
  saveStats(s);
}

export function recordEvaluation(score: number, total: number, level: string) {
  const s = loadStats();
  s.evaluations.unshift({ date: new Date().toISOString(), score, total, level });
  s.evaluations = s.evaluations.slice(0, 20);
  s.xp += score * 5; // bonus XP for evaluations
  bumpStreak(s);
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

// XP -> level system
export interface LevelInfo {
  level: number;
  title: string;
  current: number; // xp into this level
  next: number;   // xp needed for next level
  pct: number;
}
const LEVEL_TITLES = [
  "Beginner", "Curious", "Explorer", "A1 Learner", "A1 Advanced",
  "A2 Learner", "A2 Strong", "B1 Apprentice", "B1 Confident", "B1 Master",
];
export function levelFromXP(xp: number): LevelInfo {
  // Each level needs 200 XP more than the previous: L1=200, L2=400 cumulative, etc.
  let level = 0;
  let acc = 0;
  let need = 200;
  while (xp >= acc + need && level < 49) {
    acc += need;
    level += 1;
    need = 200 + level * 100;
  }
  const current = xp - acc;
  const pct = Math.min(100, Math.round((current / need) * 100));
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
  return { level: level + 1, title, current, next: need, pct };
}

// "Mastered" = answered correctly 3+ times overall (lifetime correct count).
// Streak still tracked separately and shown with a star ⭐ on the progress page.
export const MASTERY_THRESHOLD = 3;
export function masteredCount(s: Stats): number {
  return Object.values(s.perWord).filter((w) => w.correct >= MASTERY_THRESHOLD).length;
}

// Validate a question/answer pair — rejects empty, underscore-only, or whitespace-only strings.
export function isValidText(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const trimmed = s.trim();
  if (trimmed.length === 0) return false;
  if (/^_+$/.test(trimmed)) return false;
  return true;
}

// ---------------- TTS ----------------
//
// Uses Google Translate's free TTS endpoint (translate.google.com/translate_tts)
// for high-quality Bulgarian audio. Has no quota for short single-word/sentence
// requests in a learning app context. Falls back to the browser SpeechSynthesis
// if the audio request fails (e.g. offline).

const ttsCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

function googleTtsUrl(text: string): string {
  // Google's TTS expects URL-encoded text and tl=bg for Bulgarian.
  // The "client=tw-ob" param is the well-known public path used by browser
  // extensions; "ttsspeed=1" is normal speed, "0.7" slower. We use 1.
  const enc = encodeURIComponent(text);
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=bg&client=tw-ob&q=${enc}`;
}

function browserSpeak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const trySpeak = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "bg-BG";
      u.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const bg = voices.find((v) => v.lang.toLowerCase().startsWith("bg"));
      if (bg) u.voice = bg;
      window.speechSynthesis.speak(u);
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Voices not yet loaded — wait once, then speak.
      window.speechSynthesis.onvoiceschanged = () => {
        trySpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
      // Trigger voice loading
      window.speechSynthesis.getVoices();
      // Fallback: speak after a short delay anyway
      setTimeout(trySpeak, 250);
    } else {
      trySpeak();
    }
  } catch {
    /* ignore */
  }
}

export function speak(text: string) {
  if (typeof window === "undefined") return;
  // Stop anything currently playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const url = googleTtsUrl(text);
  const cached = ttsCache.get(text);
  const audio = new Audio(cached || url);
  audio.crossOrigin = "anonymous";
  currentAudio = audio;

  let fellBack = false;
  audio.onerror = () => {
    if (fellBack) return;
    fellBack = true;
    browserSpeak(text);
  };
  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null;
  };
  // Cache the URL so repeated plays are instant from the browser HTTP cache.
  ttsCache.set(text, url);

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise.catch(() => {
      if (fellBack) return;
      fellBack = true;
      browserSpeak(text);
    });
  }
}
