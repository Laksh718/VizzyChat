'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, X } from 'lucide-react';
import VizzyLogo from '@/components/ui/VizzyLogo';
import { useChat } from '@/lib/ChatContext';
import { cn, formatDate } from '@/lib/utils';

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    sidebarOpen,
    setSidebar,
    newConversation,
    setActive,
  } = useChat();

  return (
    <>
      {/* ── Desktop: narrow icon rail (always visible) ── */}
      <div className="hidden md:flex flex-col items-center w-[54px] h-full bg-[#06060e] border-r border-[rgba(255,255,255,0.05)] flex-shrink-0 py-3 gap-1.5 z-10">
        {/* Logo = new chat */}
        <button
          onClick={newConversation}
          title="New Chat"
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#13131f] transition-colors mb-0.5"
        >
          <VizzyLogo size={26} showTail={false} />
        </button>

        {/* Divider */}
        <div className="w-6 h-px bg-[rgba(255,255,255,0.06)] my-0.5" />

        {/* Recent conversations */}
        <div className="flex-1 flex flex-col items-center gap-1 overflow-hidden w-full px-2">
          {conversations.slice(0, 8).map((convo) => (
            <button
              key={convo.id}
              onClick={() => setActive(convo.id)}
              title={convo.title}
              className={cn(
                'w-full h-9 rounded-xl flex items-center justify-center transition-all duration-150',
                convo.id === activeConversationId
                  ? 'bg-violet-900/40 text-violet-400'
                  : 'text-[#3a3a55] hover:bg-[#13131f] hover:text-[#9090b0]',
              )}
            >
              <MessageSquare size={14} />
            </button>
          ))}
        </div>

        {/* New chat + */}
        <button
          onClick={newConversation}
          title="New Chat"
          className="w-9 h-9 rounded-xl border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#3a3a55] hover:text-[#9090b0] hover:bg-[#13131f] transition-all"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* ── Mobile: backdrop + full slide panel ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebar(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex flex-col w-[260px] h-full bg-[#080810] border-r border-[rgba(255,255,255,0.06)] md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2.5">
                  <VizzyLogo size={26} showTail={false} />
                  <div className="flex items-baseline select-none">
                    <span className="text-[15px] font-extrabold text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Vizzy
                    </span>
                    <span className="text-[15px] font-extrabold text-sky-400 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Chat
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebar(false)}
                  className="p-1.5 rounded-lg hover:bg-[#13131f] text-[#55556a] hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* New Chat */}
              <div className="px-3 pt-3 pb-2">
                <button
                  onClick={() => { newConversation(); setSidebar(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[#13131f] text-[#9090b0] hover:text-white text-[13px] font-medium transition-all"
                >
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                    <Plus size={12} className="text-white" />
                  </div>
                  New Chat
                </button>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
                {conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => { setActive(convo.id); setSidebar(false); }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all',
                      convo.id === activeConversationId
                        ? 'bg-violet-900/30 border border-violet-700/30 text-white'
                        : 'hover:bg-[#13131f] text-[#9090b0] hover:text-white border border-transparent',
                    )}
                  >
                    <MessageSquare
                      size={13}
                      className={convo.id === activeConversationId ? 'text-violet-400' : 'text-[#55556a]'}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{convo.title}</p>
                      <p className="text-[10px] text-[#55556a] mt-0.5">{formatDate(convo.updatedAt)}</p>
                    </div>
                  </button>
                ))}
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
        )}
      </AnimatePresence>
    </>
  );
}
