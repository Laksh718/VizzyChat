'use client';

import React, { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Message } from '@/types';
import MessageBubble from './MessageBubble';

type MessageListProps = {
  messages: Message[];
  onSuggestionClick: (text: string) => void;
};

export default function MessageList({
  messages,
  onSuggestionClick,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    // WelcomeScreen is now rendered by ChatPage when there are no messages
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLast={i === messages.length - 1}
          />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
