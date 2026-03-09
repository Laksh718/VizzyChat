'use client';

import React, { useRef, useState, useCallback, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { ArrowUp, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  onSend: (text: string) => void;
  isLoading: boolean;
};

const PLACEHOLDER_PROMPTS = [
  'Paint something that feels like nostalgia…',
  'Create a vision board for my next 3 years…',
  'Turn this idea into a Renaissance painting…',
  'Design a poster that feels premium but warm…',
  'Show me a dreamlike version of a city at dusk…',
];

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
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
    <div className="px-4 pb-4 pt-2">
      <div
        className={cn(
          'relative flex items-end gap-2 bg-[#141414] border rounded-2xl px-4 py-3 transition-all duration-200',
          value.length > 0
            ? 'border-violet-700/60 shadow-[0_0_0_3px_rgba(124,58,237,0.1)]'
            : 'border-[#2a2a2a]',
        )}
      >
        {/* Sparkles icon */}
        <Sparkles
          size={16}
          className="flex-shrink-0 mb-1 text-[#6b6b6b] self-end"
        />

        <TextareaAutosize
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER_PROMPTS[placeholderIdx]}
          minRows={1}
          maxRows={8}
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm text-white placeholder-[#4a4a4a] focus:outline-none resize-none leading-relaxed py-0.5"
          autoFocus
        />

        {/* Send button */}
        <motion.button
          whileHover={canSend ? { scale: 1.05 } : {}}
          whileTap={canSend ? { scale: 0.95 } : {}}
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 self-end mb-0.5',
            canSend
              ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40'
              : 'bg-[#2a2a2a] text-[#4a4a4a] cursor-not-allowed',
          )}
        >
          {isLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ArrowUp size={15} />
          )}
        </motion.button>
      </div>

      <p className="text-center text-[11px] text-[#3a3a3a] mt-2">
        VizzyChat can generate inaccurate images. Use for creative inspiration.
      </p>
    </div>
  );
}
