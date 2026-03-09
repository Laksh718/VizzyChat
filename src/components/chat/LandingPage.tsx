"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Wand2,
  Layers,
  Camera,
  Star,
  Mountain,
  Palette,
  ChevronDown,
  ImageIcon,
  Cpu,
} from "lucide-react";
import VizzyLogo from "@/components/ui/VizzyLogo";

/* ─── Data ────────────────────────────────────────────────────────── */
const TAGLINES = [
  "Turn words into worlds.",
  "Imagine. Describe. Create.",
  "Art at the speed of thought.",
];

const FEATURES = [
  {
    icon: Wand2,
    label: "Text → Image",
    desc: "Type any scene, concept, or mood and watch it render in seconds.",
    gradient: "from-violet-600 to-purple-500",
    glow: "rgba(124,58,237,0.5)",
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.25)",
  },
  {
    icon: Layers,
    label: "Infinite Styles",
    desc: "Portraits, landscapes, surrealism, fine art — every aesthetic at your fingertips.",
    gradient: "from-pink-600 to-rose-500",
    glow: "rgba(236,72,153,0.5)",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.22)",
  },
  {
    icon: Zap,
    label: "Instant Results",
    desc: "DALL·E 3 powered generation delivers stunning images in moments.",
    gradient: "from-sky-500 to-cyan-400",
    glow: "rgba(56,189,248,0.5)",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.22)",
  },
  {
    icon: Cpu,
    label: "GPT-4o Chat",
    desc: "Intelligent conversation that understands context, refines prompts, tells stories.",
    gradient: "from-emerald-500 to-teal-400",
    glow: "rgba(52,211,153,0.5)",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.22)",
  },
];

const STYLE_CARDS = [
  {
    icon: Camera,
    label: "Portrait",
    sub: "Cinematic & photorealistic",
    color: "#a78bfa",
    bg: "rgba(124,58,237,0.15)",
  },
  {
    icon: Mountain,
    label: "Landscape",
    sub: "Epic vistas & golden hour",
    color: "#34d399",
    bg: "rgba(16,185,129,0.12)",
  },
  {
    icon: Star,
    label: "Surreal",
    sub: "Dreamlike & impossible",
    color: "#f472b6",
    bg: "rgba(236,72,153,0.12)",
  },
  {
    icon: Palette,
    label: "Abstract",
    sub: "Color & form unleashed",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
  },
  {
    icon: ImageIcon,
    label: "Fine Art",
    sub: "Classical & gallery-grade",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
  },
  {
    icon: Sparkles,
    label: "Fantasy",
    sub: "Mythical & enchanted worlds",
    color: "#e879f9",
    bg: "rgba(232,121,249,0.12)",
  },
];

/* Decorative floating particles — generated inside component to avoid SSR mismatch */
function useParticles(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (i * 37.3 + 11) % 100,
        y: (i * 53.7 + 7) % 100,
        size: 1.5 + (i % 5) * 0.5,
        dur: 6 + (i % 7) * 1.4,
        delay: (i * 0.41) % 5,
        opacity: 0.18 + (i % 4) * 0.07,
        color:
          i % 3 === 0
            ? "167,139,250"
            : i % 3 === 1
              ? "236,72,153"
              : "56,189,248",
      })),
    [count],
  );
}

type Props = { onEnter: () => void };

/* ─── Component ───────────────────────────────────────────────────── */
export default function LandingPage({ onEnter }: Props) {
  const [tagIdx, setTagIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const particles = useParticles(28);

  useEffect(() => {
    const t = setInterval(
      () => setTagIdx((i) => (i + 1) % TAGLINES.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ── Fixed decorative particles ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `rgba(${p.color},${p.opacity})`,
            }}
            animate={{
              opacity: [p.opacity, p.opacity * 2.5, p.opacity],
              y: [0, -18, 0],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Fixed ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.13) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
          animate={{ scale: [1, 1.12, 1], y: [0, -30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
          animate={{ scale: [1, 1.08, 1], x: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-16 pb-20 z-10">
        {/* Top nav badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 px-4 py-2 rounded-full mb-10 select-none"
          style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.28)",
            boxShadow: "0 0 20px rgba(124,58,237,0.15)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span
            className="text-[12px] font-medium"
            style={{ color: "rgba(196,167,255,0.9)" }}
          >
            AI Image Generation · Now Live
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 relative"
        >
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(236,72,153,0.12))",
              border: "1px solid rgba(139,92,246,0.3)",
              boxShadow:
                "0 0 60px rgba(124,58,237,0.35), 0 0 120px rgba(236,72,153,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <VizzyLogo size={64} showTail={false} />
          </div>
          {/* Orbiting ring */}
          <motion.div
            className="absolute inset-[-12px] rounded-full border border-violet-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ borderStyle: "dashed" }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          style={{
            y: heroY,
            fontFamily: "'Bricolage Grotesque', Inter, sans-serif",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center select-none mb-4"
        >
          <span
            className="block text-[3.5rem] sm:text-[5rem] font-extrabold tracking-tight leading-[0.95]"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vizzy
          </span>
          <span
            className="block text-[3.5rem] sm:text-[5rem] font-extrabold tracking-tight leading-[0.95] mt-1"
            style={{
              background:
                "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chat
          </span>
        </motion.h1>

        {/* Cycling tagline */}
        <div className="h-8 flex items-center mb-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={tagIdx}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="text-[18px] sm:text-[20px] font-medium text-center select-none"
              style={{ color: "rgba(180,160,255,0.8)" }}
            >
              {TAGLINES[tagIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-16"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            className="relative flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-[16px] text-white overflow-hidden group select-none"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #ec4899 100%)",
              boxShadow:
                "0 6px 40px rgba(124,58,237,0.6), 0 0 80px rgba(236,72,153,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            {/* Shimmer */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                animation: "none",
              }}
            />
            <Wand2 size={18} strokeWidth={2} />
            Start Creating
            <ArrowRight size={16} strokeWidth={2.5} />
          </motion.button>

          {/* Secondary */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-[15px] select-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            <Sparkles size={15} />
            See Examples
          </motion.button>
        </motion.div>

        {/* Stat row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-6 sm:gap-10 mb-14"
        >
          {[
            ["DALL·E 3", "Powered"],
            ["GPT-4o", "AI Chat"],
            ["Instant", "Generation"],
          ].map(([val, lbl]) => (
            <div key={val} className="flex flex-col items-center select-none">
              <span className="text-[15px] font-bold text-white/90">{val}</span>
              <span className="text-[10px] text-white/28 uppercase tracking-widest mt-0.5">
                {lbl}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col items-center gap-1.5 select-none"
        >
          <span className="text-[11px] text-white/20 uppercase tracking-widest">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2 — FEATURES
      ════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 py-20">
        <div className="max-w-[860px] mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-14"
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 select-none"
              style={{
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
              }}
            >
              <Sparkles size={11} className="text-violet-400" />
              <span className="text-[11px] font-semibold text-violet-400 tracking-wider uppercase">
                What you get
              </span>
            </div>
            <h2
              className="text-[2rem] sm:text-[2.6rem] font-bold text-center tracking-tight select-none"
              style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}
            >
              <span className="text-white">Everything you need</span>{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                to create.
              </span>
            </h2>
          </motion.div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-6 rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background: f.bg,
                  border: `1px solid ${f.border}`,
                  boxShadow: `0 4px 32px rgba(0,0,0,0.35), 0 0 0 0px ${f.glow}`,
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    boxShadow: `inset 0 0 60px ${f.glow.replace("0.5", "0.12")}`,
                  }}
                />
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  style={{ boxShadow: `0 4px 20px ${f.glow}` }}
                >
                  <f.icon size={20} className="text-white" strokeWidth={1.8} />
                </div>
                <h3 className="text-[16px] font-bold text-white/90 mb-2">
                  {f.label}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(180,180,220,0.65)" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 3 — STYLE GALLERY
      ════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 py-20">
        <div className="max-w-[860px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-12"
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 select-none"
              style={{
                background: "rgba(236,72,153,0.1)",
                border: "1px solid rgba(236,72,153,0.2)",
              }}
            >
              <Palette size={11} className="text-pink-400" />
              <span className="text-[11px] font-semibold text-pink-400 tracking-wider uppercase">
                Styles
              </span>
            </div>
            <h2
              className="text-[2rem] sm:text-[2.6rem] font-bold text-center tracking-tight select-none"
              style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}
            >
              <span className="text-white">Any style,</span>{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f472b6, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                any vision.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STYLE_CARDS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ scale: 1.04, y: -4 }}
                className="relative flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-2xl text-center cursor-default overflow-hidden"
                style={{ background: s.bg, border: `1px solid ${s.color}22` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${s.color}22`,
                    border: `1px solid ${s.color}40`,
                    boxShadow: `0 0 24px ${s.color}30`,
                  }}
                >
                  <s.icon
                    size={22}
                    style={{ color: s.color }}
                    strokeWidth={1.6}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white/85">
                    {s.label}
                  </p>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "rgba(180,180,220,0.5)" }}
                  >
                    {s.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 4 — FINAL CTA
      ════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[680px] mx-auto flex flex-col items-center text-center relative"
        >
          {/* Big glowing orb behind CTA */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.18))",
              border: "1px solid rgba(167,139,250,0.35)",
              boxShadow: "0 0 40px rgba(124,58,237,0.3)",
            }}
          >
            <Wand2 size={28} className="text-violet-400" strokeWidth={1.6} />
          </div>

          <h2
            className="text-[2.2rem] sm:text-[3rem] font-extrabold tracking-tight mb-4 select-none"
            style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}
          >
            <span className="text-white">Ready to</span>{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a78bfa 0%, #ec4899 60%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              create something
            </span>
            <br />
            <span className="text-white">amazing?</span>
          </h2>

          <p
            className="text-[15px] mb-10 max-w-[440px] leading-relaxed select-none"
            style={{ color: "rgba(180,160,255,0.55)" }}
          >
            No sign-up. No limits. Just describe your vision and let the AI
            bring it to life.
          </p>

          <motion.button
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={onEnter}
            className="relative flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-[17px] text-white overflow-hidden group select-none"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #c026d3 45%, #ec4899 100%)",
              boxShadow:
                "0 8px 50px rgba(124,58,237,0.65), 0 0 100px rgba(236,72,153,0.18), inset 0 1px 0 rgba(255,255,255,0.22)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.16) 50%, transparent 75%)",
              }}
            />
            <Wand2 size={20} strokeWidth={1.8} />
            Launch VizzyChat
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>

          <p
            className="mt-5 text-[12px] select-none"
            style={{ color: "rgba(120,100,180,0.5)" }}
          >
            Powered by OpenAI · Free to use · No account required
          </p>
        </motion.div>
      </section>
    </div>
  );
}
