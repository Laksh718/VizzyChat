'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type TypingIndicatorProps = {
  className?: string;
};

export default function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className={cn('flex items-center gap-3 px-4 py-3', className)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-[5px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-[6px] h-[6px] rounded-full bg-violet-400 block"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
