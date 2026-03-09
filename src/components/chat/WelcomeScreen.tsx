"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowUp,
  Shuffle,
  Sparkles,
  Camera,
  Mountain,
  Building2,
  Palette,
  Star,
  Layers,
  Wand2,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

const STYLES = [
  {
    icon: Camera,
    label: "Portrait",
    color: "#a78bfa",
    prompt:
      "Cinematic portrait with dramatic lighting, shallow depth of field, ultra-detailed, photorealistic",
  },
  {
    icon: Mountain,
    label: "Landscape",
    color: "#34d399",
    prompt:
      "Breathtaking landscape at golden hour — sweeping vistas, cinematic atmosphere, serene, ultra-detailed",
  },
  {
    icon: Palette,
    label: "Abstract",
    color: "#38bdf8",
    prompt:
      "Stunning abstract artwork — fluid shapes, vibrant color harmonies, expressive textures, gallery quality",
  },
  {
    icon: Building2,
    label: "City",
    color: "#f472b6",
    prompt:
      "Futuristic neon-lit city at night — rain-slick streets, glowing signs, atmospheric fog, cinematic",
  },
  {
    icon: Star,
    label: "Surreal",
    color: "#e879f9",
    prompt:
      "Dreamlike surreal scene — impossible architecture, floating elements, soft twilight colors, mysterious",
  },
  {
    icon: Layers,
    label: "Fine Art",
    color: "#fb923c",
    prompt:
      "Fine art masterpiece — rich textures, masterful composition, classical technique meets modern vision",
  },
];

const QUICK_PROMPTS = [
  {
    text: "A lone astronaut on a neon-lit alien planet at dusk",
    gradient: "from-violet-600/20 to-purple-500/10",
    border: "rgba(167,139,250,0.2)",
    icon: "🚀",
  },
  {
    text: "Cherry blossom forest path at golden hour with mist",
    gradient: "from-pink-600/20 to-rose-500/10",
    border: "rgba(244,114,182,0.2)",
    icon: "🌸",
  },
  {
    text: "Cyberpunk city rain reflections on cobblestone",
    gradient: "from-sky-600/20 to-cyan-500/10",
    border: "rgba(56,189,248,0.2)",
    icon: "🌆",
  },
  {
    text: "Ancient library with floating books, warm candlelight",
    gradient: "from-orange-600/18 to-amber-500/10",
    border: "rgba(251,146,60,0.2)",
    icon: "📚",
  },
];

const SUBTITLES = [
  "Describe a scene, style, or mood.",
  "Type a vision and watch it appear.",
  "Bring your imagination to life.",
];

const PLACEHOLDERS = [
  "A misty mountain at sunrise, golden rays through pink clouds…",
  "Neon-lit Tokyo alley at midnight, rain reflections on cobblestone…",
  "Surreal dreamscape — floating islands and cascading waterfalls…",
  "Abstract explosion of color, fluid shapes and vibrant harmonies…",
  "Serene autumn forest, leaves falling on a still mirror lake…",
];

type WelcomeScreenProps = {
  onSuggestionClick: (text: string) => void;
};

export default function WelcomeScreen({
  onSuggestionClick,
}: WelcomeScreenProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [subIdx, setSubIdx] = useState(0);
  const [phIdx, setPhIdx] = useState(0);
  const [shuffleRotate, setShuffleRotate] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0;

  // Mouse parallax for orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.025);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.025);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  // Generate floating particles once
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        dur: 5 + Math.random() * 8,
        delay: Math.random() * 5,
        color: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#ec4899" : "#38bdf8",
      })),
    [],
  );

  useEffect(() => {
    const t = setInterval(
      () => setSubIdx((i) => (i + 1) % SUBTITLES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (focused || canSend) return;
    const t = setInterval(
      () => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length),
      3400,
    );
    return () => clearInterval(t);
  }, [focused, canSend]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSuggestionClick(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fillPrompt = (prompt: string) => {
    setValue(prompt);
    textareaRef.current?.focus();
  };

  const shuffle = () => {
    const r = STYLES[Math.floor(Math.random() * STYLES.length)];
    fillPrompt(r.prompt);
    setShuffleRotate((v) => !v);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden min-h-0">
      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [-14, 14, -14],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Parallax ambient orbs ── */}
      <motion.div
        className="absolute top-[-5%] left-[15%] w-[380px] h-[280px] rounded-full pointer-events-none"
        style={{
          x: springX,
          y: springY,
          background:
            "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-5%] right-[10%] w-[300px] h-[240px] rounded-full pointer-events-none"
        style={{
          x: springX,
          y: springY,
          background:
            "radial-gradient(ellipse, rgba(236,72,153,0.13) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 7,
          delay: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[40%] right-[5%] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{
          duration: 5.5,
          delay: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="w-full max-w-[580px] flex flex-col items-center z-10 relative">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-7"
        >
          {/* Pulsing wand badge */}
          <div className="relative mb-5">
            {/* Ping rings */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(236,72,153,0.25))",
              }}
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.15))",
              }}
              animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
              transition={{
                duration: 2,
                delay: 0.6,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(236,72,153,0.18))",
                border: "1px solid rgba(167,139,250,0.35)",
                boxShadow:
                  "0 0 40px rgba(124,58,237,0.35), 0 0 80px rgba(236,72,153,0.12)",
              }}
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 2,
              }}
            >
              <Wand2 size={26} className="text-violet-300" strokeWidth={1.6} />
            </motion.div>
          </div>

          {/* Animated gradient title */}
          <motion.h1
            className="text-[2.6rem] sm:text-[3.2rem] font-extrabold tracking-tight leading-[1.04] text-center mb-3 select-none"
            style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.82) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              What will you
            </span>{" "}
            <motion.span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #ec4899 55%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              create?
            </motion.span>
          </motion.h1>

          {/* Cycling subtitle */}
          <div className="h-5 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={subIdx}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.38 }}
                className="text-[13.5px] text-center select-none"
                style={{ color: "rgba(180,160,255,0.55)" }}
              >
                {SUBTITLES[subIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Compose box ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-4"
        >
          <motion.div
            className="w-full rounded-2xl overflow-hidden"
            animate={
              focused || canSend
                ? {
                    boxShadow:
                      "0 0 0 2px rgba(139,92,246,0.4), 0 8px 48px rgba(0,0,0,0.45), 0 0 60px rgba(124,58,237,0.12)",
                  }
                : {
                    boxShadow: "0 4px 28px rgba(0,0,0,0.32)",
                  }
            }
            transition={{ duration: 0.25 }}
            style={{
              background: "rgba(255,255,255,0.038)",
              backdropFilter: "blur(20px)",
              border:
                focused || canSend
                  ? "1px solid rgba(139,92,246,0.45)"
                  : "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <TextareaAutosize
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={PLACEHOLDERS[phIdx]}
              minRows={3}
              maxRows={8}
              autoFocus
              className="w-full bg-transparent px-5 pt-4 pb-2 text-[15px] leading-relaxed text-white/90 placeholder-white/[0.17] resize-none focus:outline-none"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 pb-3.5 pt-1">
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-lg text-[11px] font-semibold select-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(236,72,153,0.1))",
                    border: "1px solid rgba(167,139,250,0.28)",
                    color: "rgba(196,167,255,0.9)",
                  }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={9} />
                  AI Vision
                </motion.span>

                <motion.button
                  title="Random prompt"
                  onClick={shuffle}
                  animate={{ rotate: shuffleRotate ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="p-1.5 rounded-lg transition-all duration-200"
                  style={{ color: "rgba(180,160,255,0.35)" }}
                  whileHover={{
                    color: "rgba(196,167,255,0.8)",
                    backgroundColor: "rgba(124,58,237,0.12)",
                  }}
                >
                  <Shuffle size={13} />
                </motion.button>

                <AnimatePresence>
                  {value.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="text-[11px] tabular-nums select-none"
                      style={{ color: "rgba(180,160,255,0.3)" }}
                    >
                      {value.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Send button with ripple */}
              <motion.button
                whileHover={canSend ? { scale: 1.14 } : {}}
                whileTap={canSend ? { scale: 0.86 } : {}}
                onClick={handleSend}
                disabled={!canSend}
                className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
                style={
                  canSend
                    ? {
                        background:
                          "linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #ec4899 100%)",
                        boxShadow:
                          "0 4px 20px rgba(124,58,237,0.65), 0 0 40px rgba(236,72,153,0.22)",
                        color: "white",
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.2)",
                        cursor: "not-allowed",
                      }
                }
              >
                <ArrowUp size={17} strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Quick prompt cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.5 }}
          className="w-full mb-5 grid grid-cols-2 gap-2"
        >
          {QUICK_PROMPTS.map((qp, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.28 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                scale: 1.03,
                y: -3,
                transition: { duration: 0.18 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fillPrompt(qp.text)}
              className={cn(
                "group text-left px-3.5 py-3.5 rounded-xl bg-gradient-to-br transition-colors duration-200",
                qp.gradient,
              )}
              style={{ border: `1px solid ${qp.border}` }}
            >
              <div className="text-[15px] mb-1.5 leading-none">{qp.icon}</div>
              <p
                className="text-[12px] leading-snug line-clamp-2"
                style={{ color: "rgba(220,210,255,0.65)" }}
              >
                {qp.text}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Style chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {STYLES.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.1, y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.92 }}
              onClick={() => fillPrompt(s.prompt)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors duration-200"
              style={{
                background: `${s.color}14`,
                border: `1px solid ${s.color}32`,
                color: `${s.color}cc`,
              }}
            >
              <s.icon size={12} strokeWidth={1.9} />
              {s.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
