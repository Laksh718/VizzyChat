'use client';

import React from 'react';
import { motion } from 'framer-motion';
import VizzyLogo from '@/components/ui/VizzyLogo';

const STYLES = [
  {
    emoji: '🖼',
    label: 'Portraits',
    prompt:
      'Create a stunning cinematic portrait — dramatic lighting, shallow depth of field, elegant color grade, ultra-detailed, photorealistic',
  },
  {
    emoji: '🌄',
    label: 'Landscapes',
    prompt:
      'Paint a breathtaking landscape at golden hour — sweeping vistas, cinematic atmosphere, serene natural beauty, ultra-detailed',
  },
  {
    emoji: '✨',
    label: 'Abstract',
    prompt:
      'Create a stunning abstract artwork — fluid shapes, vibrant color harmonies, expressive textures, gallery quality finish',
  },
  {
    emoji: '🌆',
    label: 'Cityscapes',
    prompt:
      'Illustrate a futuristic neon-lit city at night — rain-slick streets, glowing signs, atmospheric fog, cinematic composition',
  },
  {
    emoji: '🎭',
    label: 'Surreal',
    prompt:
      'Design a dreamlike surreal landscape — impossible architecture, floating elements, soft twilight colors, poetic and mysterious',
  },
  {
    emoji: '🎨',
    label: 'Fine Art',
    prompt:
      'Create a work of fine art — rich textures, masterful composition, classical technique meets modern vision, timeless beauty',
  },
];

type WelcomeScreenProps = {
  onSuggestionClick: (text: string) => void;
};

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto relative min-h-0">
      {/* Ambient background orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-violet-700/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-pink-600/[0.04] blur-[80px] pointer-events-none" />

      <div className="w-full max-w-lg text-center relative z-10 flex flex-col items-center">

        {/* ── Brand mark ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center gap-3"
        >
          <div className="float">
            <VizzyLogo size={76} showTail />
          </div>
          {/* Logotype */}
          <div className="flex items-baseline gap-0 leading-none select-none">
            <span
              className="text-[28px] font-extrabold text-white tracking-tight"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Vizzy
            </span>
            <span
              className="text-[28px] font-extrabold text-sky-400 tracking-tight"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Chat
            </span>
          </div>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.5rem] sm:text-[3rem] font-bold text-white tracking-tight leading-[1.1] mb-3"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Your Visuals,{' '}
          <span className="gradient-text">Alive.</span>
        </motion.h1>

        {/* ── Subtitle ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="text-[15px] text-[#9090b0] leading-relaxed mb-10 max-w-xs"
        >
          Describe a scene, a style, or a mood.
          <br />
          Watch it come to life in seconds.
        </motion.p>

        {/* ── Style chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.46 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {STYLES.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.42 + i * 0.055, duration: 0.3 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSuggestionClick(s.prompt)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#13131f] border border-[rgba(255,255,255,0.08)] hover:border-violet-600/40 hover:bg-[#1a1a2e] text-[13px] font-medium text-[#b0b0c8] hover:text-white transition-all duration-200"
            >
              <span className="text-[15px] leading-none">{s.emoji}</span>
              {s.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Hint ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-9 text-[12px] text-[#55556a]"
        >
          Pick a style or type anything below ↓
        </motion.p>
      </div>
    </div>
  );
}

