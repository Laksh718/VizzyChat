'use client';

import React, { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { ChatProvider, useChat } from '@/lib/ChatContext';
import { generateId, truncate } from '@/lib/utils';
import type { Message, GeneratedImage } from '@/types';
import Sidebar from '@/components/sidebar/Sidebar';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import ImageViewer from '@/components/ui/ImageViewer';

// ─── Inner content (needs ChatContext) ───────────────────────────────────────

function ChatContent() {
  const {
    activeConversation,
    activeConversationId,
    sidebarOpen,
    toggleSidebar,
    addMessage,
    updateMessage,
    updateTitle,
    newConversation,
  } = useChat();

  // Auto-create a conversation on first load if none exists
  useEffect(() => {
    if (!activeConversationId) {
      newConversation();
    }
  }, [activeConversationId, newConversation]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeConversationId) return;

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: text,
        createdAt: Date.now(),
      };

      addMessage(activeConversationId, userMessage);

      // Auto-title from first user message
      if (
        activeConversation &&
        activeConversation.messages.length === 0
      ) {
        updateTitle(activeConversationId, truncate(text, 38));
      }

      // Placeholder assistant message (typing indicator)
      const assistantId = uuidv4();
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        isGenerating: true,
        createdAt: Date.now(),
      };
      addMessage(activeConversationId, assistantPlaceholder);

      try {
        // Build message history for context (last 10 messages)
        const history = (activeConversation?.messages ?? [])
          .filter((m) => !m.isGenerating)
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...history, { role: 'user', content: text }],
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          updateMessage(activeConversationId, assistantId, {
            isGenerating: false,
            error: (err as { error?: string }).error ?? 'Something went wrong.',
          });
          return;
        }

        const data: { content: string; images?: GeneratedImage[] } =
          await res.json();

        updateMessage(activeConversationId, assistantId, {
          content: data.content,
          images: data.images ?? [],
          isGenerating: false,
        });
      } catch {
        updateMessage(activeConversationId, assistantId, {
          isGenerating: false,
          error: 'Network error — please check your connection and try again.',
        });
      }
    },
    [
      activeConversationId,
      activeConversation,
      addMessage,
      updateMessage,
      updateTitle,
    ],
  );

  const isLoading =
    activeConversation?.messages.some((m) => m.isGenerating) ?? false;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0">
          <AnimatePresence mode="wait">
            {!sidebarOpen && (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#6b6b6b] hover:text-white transition-colors"
              >
                <Menu size={17} />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#a1a1a1]">
              {activeConversation?.title ?? 'New Chat'}
            </span>
          </div>

          {isLoading && (
            <div className="ml-auto flex items-center gap-1.5 text-[#6b6b6b] text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Creating…
            </div>
          )}
        </div>

        {/* Messages */}
        <MessageList
          messages={activeConversation?.messages ?? []}
          onSuggestionClick={handleSend}
        />

        {/* Input */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>

      {/* Image lightbox */}
      <ImageViewer />
    </div>
  );
}

// ─── Root export (wraps with provider) ───────────────────────────────────────

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
}
