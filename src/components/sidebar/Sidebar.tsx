'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X, Sparkles } from 'lucide-react';
import VizzyLogo from '@/components/ui/VizzyLogo';
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
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 overflow-hidden',
        isActive
          ? 'bg-gradient-to-r from-violet-900/40 to-purple-900/20 border border-violet-700/30 text-white'
          : 'hover:bg-[#13131f] text-[#9090b0] hover:text-white border border-transparent',
      )}
      onClick={onSelect}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-violet-500 to-pink-500"
        />
      )}

      <MessageSquare
        size={13}
        className={cn(
          'flex-shrink-0',
          isActive ? 'text-violet-400' : 'text-[#55556a]',
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{convo.title}</p>
        <p className="text-[10px] text-[#55556a] mt-0.5">
          {formatDate(convo.updatedAt)}
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-900/30 hover:text-red-400 text-[#55556a] flex-shrink-0"
      >
        <Trash2 size={12} />
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
            className="fixed inset-0 bg-black/70 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed md:relative z-30 md:z-auto flex flex-col w-[260px] h-full bg-[#080810] border-r border-[rgba(255,255,255,0.06)] flex-shrink-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2.5">
            <VizzyLogo size={30} showTail={false} />
            <div className="flex items-baseline gap-0 leading-none select-none">
              <span
                className="text-[15px] font-extrabold text-white tracking-tight"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Vizzy
              </span>
              <span
                className="text-[15px] font-extrabold text-sky-400 tracking-tight"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Chat
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebar(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-[#13131f] text-[#55556a] hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={newConversation}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-violet-700/50 hover:bg-[#13131f] text-[#9090b0] hover:text-white text-[13px] font-medium transition-all duration-200 group"
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center group-hover:shadow-md group-hover:shadow-violet-900/40 transition-shadow">
              <Plus size={12} className="text-white" />
            </div>
            New Chat
          </button>
        </div>

        {/* Section label */}
        {conversations.length > 0 && (
          <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#3a3a55]">
            Recent
          </p>
        )}

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {conversations.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Sparkles size={20} className="text-[#3a3a55] mx-auto mb-2" />
              <p className="text-[12px] text-[#55556a]">
                Your conversations will appear here
              </p>
            </div>
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
        <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] text-[#3a3a55]">VizzyChat AI</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
