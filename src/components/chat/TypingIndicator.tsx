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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex items-center gap-3 px-4 py-2', className)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-900/30">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Bubble */}
      <div className="flex items-center gap-[5px] bg-[#13131f] border border-[rgba(255,255,255,0.07)] rounded-2xl rounded-tl-sm px-5 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-[7px] h-[7px] rounded-full bg-gradient-to-br from-violet-400 to-pink-400 block"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
