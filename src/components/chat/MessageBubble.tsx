'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import type { Message } from '@/types';
import { formatDate } from '@/lib/utils';
import { useChat } from '@/lib/ChatContext';
import ImageGrid from './ImageGrid';
import TypingIndicator from './TypingIndicator';

type MessageBubbleProps = {
  message: Message;
  isLast: boolean;
};

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex justify-end px-4 py-1.5">
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[78%]"
      >
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap break-words shadow-lg shadow-violet-900/20">
          {message.content}
        </div>
        <p className="text-right text-[11px] text-[#55556a] mt-1 pr-1">
          {formatDate(message.createdAt)}
        </p>
      </motion.div>
    </div>
  );
}

function AssistantBubble({ message }: { message: Message; isLast?: boolean }) {
  const { openImageViewer } = useChat();

  if (message.isGenerating) {
    return <TypingIndicator />;
  }

  return (
    <div className="flex items-start gap-3 px-4 py-1.5">
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-900/30">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="white"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -16, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-w-0"
      >
        {/* Error state */}
        {message.error ? (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/20 border border-red-900/30 rounded-2xl px-4 py-3">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{message.error}</span>
          </div>
        ) : (
          <>
            {message.content && (
              <div className="text-[14px] text-[#d0d0e8] leading-relaxed whitespace-pre-wrap break-words bg-[#13131f] border border-[rgba(255,255,255,0.06)] rounded-2xl rounded-tl-sm px-4 py-3">
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

        <p className="text-[11px] text-[#55556a] mt-1.5 pl-1">
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

