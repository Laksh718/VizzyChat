"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  X,
  Trash2,
  PanelLeftOpen,
  PanelLeftClose,
  Clock,
  Wifi,
} from "lucide-react";
import VizzyLogo from "@/components/ui/VizzyLogo";
import { useChat } from "@/lib/ChatContext";
import { cn, formatDate, truncate } from "@/lib/utils";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
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
      {/* ── Desktop collapsible rail ── */}
      <motion.aside
        initial={false}
        animate={{ width: expanded ? 240 : 58 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="hidden md:flex flex-col h-full flex-shrink-0 overflow-hidden z-20 border-r"
        style={{
          background: "rgba(7,7,15,0.72)",
          backdropFilter: "blur(24px) saturate(160%)",
          borderColor: "rgba(255,255,255,0.055)",
        }}
      >
        {/* Header: logo + name */}
        <div
          className="flex items-center h-14 px-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
            <VizzyLogo size={24} showTail={false} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="ml-2.5 overflow-hidden whitespace-nowrap select-none"
              >
                <span className="text-[14.5px] font-bold text-white/90 tracking-tight">
                  Vizzy
                </span>
                <span className="text-[14.5px] font-bold text-violet-400 tracking-tight">
                  Chat
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New conversation */}
        <div className="px-2.5 pt-3 pb-2.5">
          <button
            onClick={newConversation}
            title={expanded ? undefined : "New Chat"}
            className={cn(
              "group flex items-center rounded-xl transition-all duration-200",
              "border border-violet-500/20 hover:border-violet-400/45",
              "bg-violet-600/[0.13] hover:bg-violet-600/[0.22]",
              expanded
                ? "w-full gap-2.5 px-3 py-2.5"
                : "w-8 h-8 justify-center mx-auto",
            )}
          >
            <Plus
              size={15}
              className="text-violet-400 flex-shrink-0"
              strokeWidth={2.2}
            />
            {expanded && (
              <span className="text-[13px] font-medium text-violet-300 whitespace-nowrap">
                New Chat
              </span>
            )}
          </button>
        </div>

        {/* Recent label */}
        <AnimatePresence>
          {expanded && conversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 px-4 pb-1.5"
            >
              <Clock size={9} className="text-white/20" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/20 select-none">
                Recent
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-1 px-2 space-y-0.5">
          {conversations.length === 0 && (
            <div className="flex flex-col items-center py-5 gap-2 opacity-25">
              <MessageSquare size={15} className="text-white/40" />
              {expanded && (
                <p className="text-[11px] text-white/30">No chats yet</p>
              )}
            </div>
          )}
          {conversations.slice(0, 14).map((convo) => {
            const isActive = convo.id === activeConversationId;
            return (
              <div key={convo.id} className="group/row relative">
                <button
                  onClick={() => setActive(convo.id)}
                  title={!expanded ? convo.title : undefined}
                  className={cn(
                    "w-full flex items-center rounded-xl transition-all duration-150",
                    expanded
                      ? "px-2.5 py-[9px] gap-2.5"
                      : "justify-center w-8 h-8 mx-auto",
                    isActive
                      ? "bg-violet-500/[0.14] border border-violet-500/25 text-violet-300"
                      : "border border-transparent hover:bg-white/[0.05] text-white/35 hover:text-white/75",
                  )}
                >
                  <MessageSquare
                    size={14}
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      isActive ? "text-violet-400" : "",
                    )}
                    strokeWidth={isActive ? 2 : 1.8}
                  />
                  {expanded && (
                    <span className="text-[12.5px] text-left flex-1 truncate leading-none">
                      {truncate(convo.title, 22)}
                    </span>
                  )}
                </button>
                {/* Delete on hover (expanded only) */}
                {expanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(convo.id);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover/row:opacity-100 hover:bg-red-500/15 text-white/25 hover:text-red-400 transition-all duration-150"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: status + expand toggle */}
        <div
          className="px-2.5 py-2.5 border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          {expanded ? (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-[11px] text-white/25 whitespace-nowrap">
                  Online
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                title="Collapse"
                className="p-1.5 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all"
              >
                <PanelLeftClose size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)] animate-pulse" />
              <button
                onClick={() => setExpanded(true)}
                title="Expand sidebar"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-white/65 hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/[0.07]"
              >
                <PanelLeftOpen size={14} />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ── Mobile: backdrop + slide drawer ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/65 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebar(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex flex-col w-[264px] h-full border-r md:hidden"
              style={{
                background: "rgba(7,7,15,0.97)",
                backdropFilter: "blur(28px) saturate(160%)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-2.5">
                  <VizzyLogo size={24} showTail={false} />
                  <span className="text-[14.5px] font-bold select-none">
                    <span className="text-white/90">Vizzy</span>
                    <span className="text-violet-400">Chat</span>
                  </span>
                </div>
                <button
                  onClick={() => setSidebar(false)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/75 hover:bg-white/[0.06] transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* New Chat */}
              <div className="px-3 pt-3 pb-2">
                <button
                  onClick={() => {
                    newConversation();
                    setSidebar(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-violet-600/[0.14] hover:bg-violet-600/[0.24] border border-violet-500/20 text-violet-300 hover:text-violet-200 text-[13px] font-medium transition-all duration-200"
                >
                  <Plus size={15} strokeWidth={2.2} />
                  New Chat
                </button>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
                {conversations.length === 0 && (
                  <div className="flex flex-col items-center py-8 gap-2 opacity-30">
                    <MessageSquare size={18} className="text-white/40" />
                    <p className="text-[11px] text-white/30">No chats yet</p>
                  </div>
                )}
                {conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => {
                      setActive(convo.id);
                      setSidebar(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all",
                      convo.id === activeConversationId
                        ? "bg-violet-500/[0.14] border border-violet-500/25 text-white"
                        : "hover:bg-white/[0.05] text-white/45 hover:text-white/85 border border-transparent",
                    )}
                  >
                    <MessageSquare
                      size={13}
                      className={
                        convo.id === activeConversationId
                          ? "text-violet-400"
                          : "text-white/25"
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate leading-snug">
                        {convo.title}
                      </p>
                      <p className="text-[10px] text-white/25 mt-0.5">
                        {formatDate(convo.updatedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-4 py-3 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Wifi size={11} className="text-emerald-400/70" />
                  <p className="text-[11px] text-white/25">
                    VizzyChat AI · Online
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
