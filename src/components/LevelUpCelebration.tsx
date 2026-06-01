// ─────────────────────────────────────────────────────────────────────────────
// LevelUpCelebration.tsx
// Drop this file into src/components/LevelUpCelebration.tsx
//
// Usage (add to progress.tsx or a root layout so it fires app-wide):
//
//   import { LevelUpCelebration } from "@/components/LevelUpCelebration";
//   ...
//   <LevelUpCelebration currentLevel={lvl.level} currentTitle={lvl.title} />
//
// The component watches `currentLevel` and fires the animation whenever it
// increases vs. the last value stored in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";

// ── Level name system ──────────────────────────────────────────────────────
// 20 levels — a cultural/geographic journey through Bulgaria.
// Each name is memorable and tells a mini-story of progress.
//
// LEVELS 1–5   "Tourist" arc   — you just arrived
// LEVELS 6–10  "Resident" arc  — you're finding your feet
// LEVELS 11–15 "Local" arc     — people stop code-switching for you
// LEVELS 16–20 "Bulgarian soul" arc — you dream in Cyrillic
//
export const LEVEL_NAMES: Record<number, { title: string; subtitle: string; emoji: string; color: string }> = {
  1:  { title: "Турист",        subtitle: "Just landed at Sofia Airport",          emoji: "✈️",  color: "#60a5fa" },
  2:  { title: "Разходчик",     subtitle: "Exploring Vitosha Boulevard",            emoji: "🚶", color: "#818cf8" },
  3:  { title: "Кварталец",     subtitle: "Found your neighbourhood bakery",        emoji: "🥐",  color: "#a78bfa" },
  4:  { title: "Пазарджия",     subtitle: "Haggling at the Women's Market",         emoji: "🛒",  color: "#c084fc" },
  5:  { title: "Любопитко",     subtitle: "Asking \"защо?\" about everything",      emoji: "🔍",  color: "#e879f9" },
  6:  { title: "Наемател",      subtitle: "Signed your first rental contract",      emoji: "🔑",  color: "#f472b6" },
  7:  { title: "Трамваджия",    subtitle: "Riding tram 1 without Google Maps",      emoji: "🚃",  color: "#fb7185" },
  8:  { title: "Кафеджия",      subtitle: "Ordering кафе without pointing",         emoji: "☕",  color: "#f97316" },
  9:  { title: "Съсед",         subtitle: "Your neighbours invited you for ракия",  emoji: "🏠",  color: "#eab308" },
  10: { title: "Местен",        subtitle: "Tourists are asking *you* for directions", emoji: "🗺️", color: "#84cc16" },
  11: { title: "Пловдивчанин",  subtitle: "You appreciate that Plovdiv > Sofia",    emoji: "🏛️",  color: "#22c55e" },
  12: { title: "Балканец",      subtitle: "You understand why everything takes time", emoji: "⛰️", color: "#10b981" },
  13: { title: "Книжник",       subtitle: "Reading menus without a dictionary",     emoji: "📚",  color: "#06b6d4" },
  14: { title: "Разказвач",     subtitle: "Telling stories in Bulgarian",           emoji: "💬",  color: "#0ea5e9" },
  15: { title: "Наш Човек",     subtitle: "Bulgarians say \"ти си наш\"",           emoji: "🤝",  color: "#6366f1" },
  16: { title: "Гражданин",     subtitle: "Navigating bureaucracy like a pro",      emoji: "📋",  color: "#8b5cf6" },
  17: { title: "Велотърновец",  subtitle: "You've climbed Tsarevets at sunset",     emoji: "🏰",  color: "#a855f7" },
  18: { title: "Кириличар",     subtitle: "You dream in Cyrillic",                  emoji: "🔤",  color: "#d946ef" },
  19: { title: "Родолюбец",     subtitle: "You cry at Horo on national holidays",  emoji: "🇧🇬",  color: "#f43f5e" },
  20: { title: "Истински Българин", subtitle: "\"Майка ми е от Пловдив\" — you wish", emoji: "👑", color: "#fbbf24" },
};

export function getLevelMeta(level: number) {
  const clamped = Math.max(1, Math.min(20, level));
  return LEVEL_NAMES[clamped] ?? LEVEL_NAMES[20];
}

// ── Particle system ────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: "square" | "circle" | "strip";
  opacity: number;
}

const CONFETTI_COLORS = ["#fbbf24", "#f43f5e", "#60a5fa", "#34d399", "#a78bfa", "#fb923c", "#e879f9"];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20, // percent — cluster near center
    y: -5,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    shape: (["square", "circle", "strip"] as const)[Math.floor(Math.random() * 3)],
    opacity: 1,
  }));
}

// ── Main component ─────────────────────────────────────────────────────────

const SEEN_KEY = "btb1_last_seen_level";

interface Props {
  currentLevel: number;
  currentTitle?: string; // fallback if you want to pass the old title
}

export function LevelUpCelebration({ currentLevel }: Props) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [celebLevel, setCelebLevel] = useState(1);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 3500; // ms

  useEffect(() => {
    if (typeof window === "undefined") return;
    const lastSeen = parseInt(localStorage.getItem(SEEN_KEY) ?? "0", 10);
    if (currentLevel > lastSeen && lastSeen > 0) {
      // Genuine level-up — trigger celebration
      setCelebLevel(currentLevel);
      setShow(true);
      particlesRef.current = createParticles(90);
      setParticles([...particlesRef.current]);
      startTimeRef.current = null;
      runAnimation();
    }
    // Always update the seen level
    localStorage.setItem(SEEN_KEY, String(currentLevel));
  }, [currentLevel]);

  function runAnimation() {
    const canvas = canvasRef.current;
    if (!canvas) {
      animRef.current = requestAnimationFrame(runAnimation);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.map((p) => ({
        ...p,
        x: p.x + p.vx * 0.4,
        y: p.y + p.vy * 0.5,
        vy: p.vy + 0.08, // gravity
        rotation: p.rotation + p.rotationSpeed,
        opacity: elapsed > DURATION - 800 ? p.opacity - 0.025 : p.opacity,
      }));

      for (const p of particlesRef.current) {
        if (p.y > 110 || p.opacity <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        const px = (p.x / 100) * canvas.width;
        const py = (p.y / 100) * canvas.height;
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "strip") {
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }

      if (elapsed < DURATION) {
        // Spawn extra burst at 400ms
        if (elapsed > 400 && elapsed < 500 && particlesRef.current.length < 160) {
          const burst = createParticles(70).map((p) => ({ ...p, x: 30 + Math.random() * 40, y: 20 }));
          particlesRef.current = [...particlesRef.current, ...burst];
        }
        animRef.current = requestAnimationFrame(step);
      } else {
        setShow(false);
      }
    };
    animRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (!show) return null;

  const meta = getLevelMeta(celebLevel);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Canvas for confetti */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Level-up card */}
      <div
        style={{
          pointerEvents: "auto",
          position: "relative",
          background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%)",
          border: `2px solid ${meta.color}`,
          borderRadius: "24px",
          padding: "40px 48px",
          textAlign: "center",
          boxShadow: `0 0 60px ${meta.color}55, 0 20px 60px rgba(0,0,0,0.8)`,
          animation: "levelUpPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          maxWidth: "360px",
          width: "calc(100vw - 48px)",
        }}
        onClick={() => setShow(false)}
      >
        <style>{`
          @keyframes levelUpPop {
            0%   { transform: scale(0.6) translateY(30px); opacity: 0; }
            70%  { transform: scale(1.05) translateY(-4px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 20px currentColor; }
            50%       { text-shadow: 0 0 40px currentColor, 0 0 80px currentColor; }
          }
          @keyframes emojiFloat {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50%       { transform: translateY(-8px) rotate(5deg); }
          }
        `}</style>

        {/* Level badge */}
        <div style={{
          display: "inline-block",
          background: `${meta.color}22`,
          border: `1px solid ${meta.color}66`,
          borderRadius: "100px",
          padding: "4px 14px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: meta.color,
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Level {celebLevel}
        </div>

        {/* Emoji */}
        <div style={{
          fontSize: "56px",
          marginBottom: "12px",
          display: "block",
          animation: "emojiFloat 2s ease-in-out infinite",
        }}>
          {meta.emoji}
        </div>

        {/* Title */}
        <h2 style={{
          margin: "0 0 6px",
          fontSize: "32px",
          fontWeight: 800,
          color: meta.color,
          animation: "glowPulse 2s ease-in-out infinite",
          letterSpacing: "-0.02em",
        }}>
          {meta.title}
        </h2>

        {/* Subtitle */}
        <p style={{
          margin: "0 0 20px",
          fontSize: "14px",
          color: "#94a3b8",
          lineHeight: 1.5,
          fontStyle: "italic",
        }}>
          {meta.subtitle}
        </p>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${meta.color}55, transparent)`,
          marginBottom: "16px",
        }} />

        {/* Tap to dismiss */}
        <p style={{ margin: 0, fontSize: "12px", color: "#475569", letterSpacing: "0.05em" }}>
          tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
