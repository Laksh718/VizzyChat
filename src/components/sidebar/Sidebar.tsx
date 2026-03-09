'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { useChat } from '@/lib/ChatContext';
import { cn, truncate, formatDate } from '@/lib/utils';
import type { Conversation } from '@/types';

type ConversationItemProps = {
  convo: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

function ConversationItem({
  convo,
  isActive,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150',
        isActive
          ? 'bg-[#1e1e2e] border border-violet-900/50 text-white'
          : 'hover:bg-[#1a1a1a] text-[#a1a1a1] hover:text-white border border-transparent',
      )}
      onClick={onSelect}
    >
      <MessageSquare
        size={14}
        className={cn(
          'flex-shrink-0',
          isActive ? 'text-violet-400' : 'text-[#6b6b6b]',
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{convo.title}</p>
        <p className="text-[11px] text-[#6b6b6b] mt-0.5">
          {formatDate(convo.updatedAt)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-900/30 hover:text-red-400 text-[#6b6b6b]"
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  );
}

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    sidebarOpen,
    setSidebar,
    newConversation,
    setActive,
    deleteConversation,
  } = useChat();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed md:relative z-30 md:z-auto flex flex-col w-[260px] h-full bg-[#0d0d0d] border-r border-[#1f1f1f] flex-shrink-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-white tracking-tight">
              VizzyChat
            </span>
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#6b6b6b] hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={newConversation}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#2a2a2a] hover:border-violet-800/60 hover:bg-[#1a1a1a] text-[#a1a1a1] hover:text-white text-[13px] font-medium transition-all duration-150"
          >
            <Plus size={15} className="text-violet-400" />
            New Chat
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {conversations.length === 0 ? (
            <p className="text-[12px] text-[#6b6b6b] text-center py-8">
              No chats yet
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {conversations.map((convo) => (
                <ConversationItem
                  key={convo.id}
                  convo={convo}
                  isActive={convo.id === activeConversationId}
                  onSelect={() => setActive(convo.id)}
                  onDelete={() => deleteConversation(convo.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1f1f1f]">
          <p className="text-[11px] text-[#4a4a4a] text-center">
            Powered by DALL·E 3 + GPT-4
          </p>
        </div>
      </motion.aside>
    </>
  );
}
