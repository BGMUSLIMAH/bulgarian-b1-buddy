// Local persistent stats stored in localStorage + Bulgarian text-to-speech.
// Progress is written to localStorage immediately (offline-safe) and then
// synced to Supabase in the background whenever the user is logged in.
// This ensures phone and laptop always converge to the same state.

const KEY = "btb1_progress_v2";

export interface Stats {
  correct: number;
  wrong: number;
  perWord: Record<string, { correct: number; wrong: number; streak: number }>;
  perCategory: Record<string, { correct: number; wrong: number }>;
  evaluations: { date: string; score: number; total: number; level: string }[];
  xp: number;
  lastPracticeDate: string | null;
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
  // Fire-and-forget sync to Supabase — no await, never blocks the UI
  syncToSupabase(s);
}

// ── Supabase sync ─────────────────────────────────────────────────────────
// Lazily imports the supabase client to avoid circular deps and SSR issues.
// Silently fails if not configured or user is not logged in.

async function syncToSupabase(s: Stats) {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_progress").upsert({
      user_id: user.id,
      correct: s.correct,
      wrong: s.wrong,
      xp: s.xp,
      streak_days: s.streakDays,
      last_practice_date: s.lastPracticeDate,
      per_word: s.perWord,
      per_category: s.perCategory,
    }, { onConflict: "user_id" });
  } catch {
    // Silently ignore — localStorage is source of truth
  }
}

// Pull latest stats from Supabase and merge with localStorage.
// Call this on app load when user is logged in.
// Supabase wins for aggregate counts; localStorage wins for perWord detail
// if Supabase has none (first login on new device).
export async function syncFromSupabase(): Promise<void> {
  try {
    const { supabase } = await import("@/lib/supabase");
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return;

    const local = loadStats();

    // Merge: take the maximum of each field so progress is never lost
    const merged: Stats = {
      correct: Math.max(local.correct, data.correct ?? 0),
      wrong: Math.max(local.wrong, data.wrong ?? 0),
      xp: Math.max(local.xp, data.xp ?? 0),
      streakDays: Math.max(local.streakDays, data.streak_days ?? 0),
      lastPracticeDate: local.lastPracticeDate ?? data.last_practice_date ?? null,
      perWord: { ...(data.per_word ?? {}), ...local.perWord },
      perCategory: { ...(data.per_category ?? {}), ...local.perCategory },
      evaluations: local.evaluations,
    };

    // Save merged result back to both localStorage and Supabase
    localStorage.setItem(KEY, JSON.stringify(merged));
    // Push merged back to Supabase
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      correct: merged.correct,
      wrong: merged.wrong,
      xp: merged.xp,
      streak_days: merged.streakDays,
      last_practice_date: merged.lastPracticeDate,
      per_word: merged.perWord,
      per_category: merged.perCategory,
    }, { onConflict: "user_id" });
  } catch {
    // Silently ignore
  }
}

// ── Streak helpers ────────────────────────────────────────────────────────

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

// ── Core progress recording ───────────────────────────────────────────────

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

  s.xp += isCorrect ? 10 : 2;
  bumpStreak(s);
  saveStats(s); // saves to localStorage AND syncs to Supabase
}

export function recordEvaluation(score: number, total: number, level: string) {
  const s = loadStats();
  s.evaluations.unshift({ date: new Date().toISOString(), score, total, level });
  s.evaluations = s.evaluations.slice(0, 20);
  s.xp += score * 5;
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

// ── XP / Level system ─────────────────────────────────────────────────────

export interface LevelInfo {
  level: number;
  title: string;
  current: number;
  next: number;
  pct: number;
}

import { getLevelMeta } from "@/components/LevelUpCelebration";
 
// XP thresholds per level — gentle curve so early levels feel fast,
// later levels take real effort. Caps at level 20.
//
// Level 1  →   200 XP
// Level 2  →   350 XP
// Level 3  →   500 XP
// Level 4  →   700 XP  (roughly 70 correct answers from level 1)
// ...
// Level 20 →  3,500 XP accumulated
 
export function levelFromXP(xp: number): LevelInfo {
  let level = 0;
  let acc = 0;
  let need = 200;
  while (xp >= acc + need && level < 19) { // cap at level 20
    acc += need;
    level += 1;
    need = 200 + level * 150; // steeper than before — each step costs more
  }
  const current = xp - acc;
  const pct = Math.min(100, Math.round((current / need) * 100));
  const meta = getLevelMeta(level + 1);
  return { level: level + 1, title: meta.title, current, next: need, pct };
}

// ── Mastery ───────────────────────────────────────────────────────────────
// Lowered from 3 → 2 correct answers to keep users feeling momentum.
// Users see the ⭐ mastered badge faster which is motivating.

export const MASTERY_THRESHOLD = 2;

export function masteredCount(s: Stats): number {
  return Object.values(s.perWord).filter((w) => w.correct >= MASTERY_THRESHOLD).length;
}

// ── App stats (displayed on homepage) ────────────────────────────────────
// Exact counts as of current data files.
export const APP_STATS = {
  wordCount: 683,
  verbCount: 258,
  verbsWithTenses: 32,
};

// ── Text validation ───────────────────────────────────────────────────────

export function isValidText(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const trimmed = s.trim();
  if (trimmed.length === 0) return false;
  if (/^_+$/.test(trimmed)) return false;
  return true;
}

// ── TTS ───────────────────────────────────────────────────────────────────
// Primary: Cloudflare Worker proxy → Google Translate TTS (Bulgarian voice)
// Fallback: browser SpeechSynthesis

const ttsCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

function googleTtsUrl(text: string): string {
  const enc = encodeURIComponent(text);
  return `https://bg-tts-proxy.learnbg.workers.dev/?text=${enc}`;
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
      window.speechSynthesis.onvoiceschanged = () => {
        trySpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.getVoices();
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
