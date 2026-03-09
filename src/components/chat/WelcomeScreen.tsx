'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  { label: '🎨 Abstract art', prompt: 'Create an abstract artwork that captures the feeling of nostalgia and longing' },
  { label: '🌅 Dream landscape', prompt: 'Paint a surreal dreamlike landscape at golden hour with floating islands' },
  { label: '📋 Vision board', prompt: 'Generate a vision board for a successful creative entrepreneur in 2026' },
  { label: '🍽️ Food portrait', prompt: 'Create an indulgent but refined portrait of a gourmet dish with soft lighting' },
  { label: '🏙️ Neon city', prompt: 'Illustrate a futuristic neon-lit city street at night with rain reflections' },
  { label: '🎭 Renaissance style', prompt: 'Transform a modern scene into a Renaissance-style painting with dramatic lighting' },
];

type WelcomeScreenProps = {
  onSuggestionClick: (text: string) => void;
};

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-xl text-center"
      >
        {/* Logo / Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-2xl glow-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">
          What do you want to create?
        </h1>
        <p className="text-[#a1a1a1] text-sm mb-10 leading-relaxed">
          Describe anything — an emotion, a scene, a vision — and I&apos;ll bring it to life visually.
        </p>

        {/* Suggestions */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
              onClick={() => onSuggestionClick(s.prompt)}
              className="text-left px-4 py-3 rounded-xl border border-[#2a2a2a] bg-[#111] hover:bg-[#1a1a1a] hover:border-violet-800/60 transition-all duration-200 text-sm text-[#d4d4d4] hover:text-white"
            >
              {s.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
