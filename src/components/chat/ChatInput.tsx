'use client';

import React, { useRef, useState, useCallback, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  onSend: (text: string) => void;
  isLoading: boolean;
};

const PLACEHOLDER_PROMPTS = [
  'Paint something that feels like nostalgia…',
  'Create a vision board for my next chapter…',
  'Turn this idea into a dreamlike visual…',
  'Design something that feels premium and warm…',
  'Show me a city at dusk, surreal and beautiful…',
];

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [placeholderIdx] = useState(() =>
    Math.floor(Math.random() * PLACEHOLDER_PROMPTS.length),
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="px-4 pb-5 pt-2 relative z-10">
      <div
        className={cn(
          'relative flex items-end gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300',
          'bg-[#0e0e1a] border',
          focused
            ? 'border-violet-500/50 shadow-[0_0_0_3px_rgba(124,58,237,0.12),0_0_30px_rgba(124,58,237,0.08)]'
            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]',
        )}
      >
        {/* Icon */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              className="flex-shrink-0 self-end mb-1"
            >
              <Loader2 size={16} className="text-violet-400 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkle"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              className="flex-shrink-0 self-end mb-1"
            >
              <Sparkles
                size={16}
                className={cn(
                  'transition-colors duration-300',
                  focused ? 'text-violet-400' : 'text-[#55556a]',
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <TextareaAutosize
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={PLACEHOLDER_PROMPTS[placeholderIdx]}
          minRows={1}
          maxRows={8}
          disabled={isLoading}
          className="flex-1 bg-transparent text-[14px] text-[#f0f0ff] placeholder-[#3a3a55] focus:outline-none resize-none leading-relaxed py-0.5"
          autoFocus
        />

        {/* Send button */}
        <motion.button
          whileHover={canSend ? { scale: 1.06 } : {}}
          whileTap={canSend ? { scale: 0.94 } : {}}
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 self-end',
            canSend
              ? 'bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-900/40'
              : 'bg-[#1a1a2e] text-[#3a3a55] cursor-not-allowed',
          )}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </motion.button>
      </div>

      <p className="text-center text-[11px] text-[#3a3a55] mt-2.5">
        VizzyChat is built for creative exploration. Results may vary.
      </p>
    </div>
  );
}
