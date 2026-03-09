'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import type { Message } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { useChat } from '@/lib/ChatContext';
import ImageGrid from './ImageGrid';
import TypingIndicator from './TypingIndicator';

type MessageBubbleProps = {
  message: Message;
  isLast: boolean;
};

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex justify-end px-4 py-1">
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-[75%]"
      >
        <div className="bg-violet-600 text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <p className="text-right text-[11px] text-[#6b6b6b] mt-1 pr-1">
          {formatDate(message.createdAt)}
        </p>
      </motion.div>
    </div>
  );
}

function AssistantBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const { openImageViewer } = useChat();

  if (message.isGenerating) {
    return <TypingIndicator />;
  }

  return (
    <div className="flex items-start gap-3 px-4 py-1">
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 min-w-0"
      >
        {/* Error state */}
        {message.error ? (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{message.error}</span>
          </div>
        ) : (
          <>
            {message.content && (
              <div className="text-sm text-[#e0e0e0] leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}

            {message.images && message.images.length > 0 && (
              <ImageGrid
                images={message.images}
                onImageClick={openImageViewer}
              />
            )}
          </>
        )}

        <p className="text-[11px] text-[#6b6b6b] mt-1.5">
          {formatDate(message.createdAt)}
        </p>
      </motion.div>
    </div>
  );
}

export default function MessageBubble({ message, isLast }: MessageBubbleProps) {
  return message.role === 'user' ? (
    <UserBubble message={message} />
  ) : (
    <AssistantBubble message={message} isLast={isLast} />
  );
}
