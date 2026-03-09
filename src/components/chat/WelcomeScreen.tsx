'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Maximize2, Shuffle } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';

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
      'Design a dreamlike surreal scene — impossible architecture, floating elements, soft twilight colors, poetic and mysterious',
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
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSuggestionClick(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fillStyle = (prompt: string) => {
    setValue(prompt);
    textareaRef.current?.focus();
  };

  const canSend = value.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden min-h-0">
      <div className="w-full max-w-[540px] flex flex-col items-center z-10">

        {/* ── Heading ── */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[3.2rem] sm:text-[3.6rem] font-bold text-white tracking-tight leading-[1.08] text-center mb-3 select-none"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Your Visuals, Alive.
        </motion.h1>

        {/* ── Subtitle ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-[15px] text-[#5a5a7a] text-center mb-8 select-none"
        >
          Describe a scene, style, or mood.
        </motion.p>

        {/* ── Big compose box ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div
            className={cn(
              'w-full rounded-2xl transition-all duration-300',
              'bg-[#0d0d18] border',
              focused
                ? 'border-[rgba(255,255,255,0.15)] shadow-[0_0_0_3px_rgba(100,40,220,0.1),0_8px_40px_rgba(0,0,0,0.4)]'
                : 'border-[rgba(255,255,255,0.08)] shadow-[0_4px_32px_rgba(0,0,0,0.3)] hover:border-[rgba(255,255,255,0.12)]',
            )}
          >
            <TextareaAutosize
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Describe a vision, mood, or scene…"
              minRows={3}
              maxRows={8}
              autoFocus
              className="w-full bg-transparent px-5 pt-4 pb-2 text-[15px] leading-relaxed text-[#e8e8f4] placeholder-[#2e2e48] resize-none focus:outline-none"
            />

            {/* Toolbar row */}
            <div className="flex items-center justify-between px-4 pb-3.5 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181828] text-[11px] font-medium text-[#6060a0] select-none border border-[rgba(255,255,255,0.05)]">
                  <span className="text-violet-500 text-[12px] leading-none">✦</span>
                  Vision
                </span>
                <button
                  title="Shuffle prompt"
                  onClick={() => {
                    const r = STYLES[Math.floor(Math.random() * STYLES.length)];
                    fillStyle(r.prompt);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#181828] text-[#2e2e50] hover:text-[#6060a0] transition-colors"
                >
                  <Shuffle size={13} />
                </button>
                <button
                  title="Expand"
                  className="p-1.5 rounded-lg hover:bg-[#181828] text-[#2e2e50] hover:text-[#6060a0] transition-colors"
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              <motion.button
                whileHover={canSend ? { scale: 1.1 } : {}}
                whileTap={canSend ? { scale: 0.9 } : {}}
                onClick={handleSend}
                disabled={!canSend}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                  canSend
                    ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-900/40'
                    : 'bg-[#181828] text-[#2e2e50] cursor-not-allowed',
                )}
              >
                <ArrowRight size={15} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Style chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-4"
        >
          {STYLES.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 + i * 0.04 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => fillStyle(s.prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-transparent hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.04)] text-[13px] text-[#5a5a7a] hover:text-[#a0a0c4] transition-all duration-200"
            >
              <span className="text-[14px] leading-none">{s.emoji}</span>
              {s.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

