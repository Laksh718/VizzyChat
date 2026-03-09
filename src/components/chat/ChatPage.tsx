"use client";

import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import VizzyLogo from "@/components/ui/VizzyLogo";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import LandingPage from "@/components/chat/LandingPage";
import { ChatProvider, useChat } from "@/lib/ChatContext";
import { generateId, truncate } from "@/lib/utils";
import type { Message, GeneratedImage } from "@/types";
import Sidebar from "@/components/sidebar/Sidebar";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import ImageViewer from "@/components/ui/ImageViewer";

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

  // Three-stage flow: landing → welcome (compose) → chat
  type Stage = "landing" | "welcome" | "chat";
  const [stage, setStage] = useState<Stage>("landing");

  // Auto-create a conversation on first load if none exists
  useEffect(() => {
    if (!activeConversationId) {
      newConversation();
    }
  }, [activeConversationId, newConversation]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!activeConversationId) return;

      // Move to chat stage as soon as user sends
      setStage("chat");

      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content: text,
        createdAt: Date.now(),
      };

      addMessage(activeConversationId, userMessage);

      // Auto-title from first user message
      if (activeConversation && activeConversation.messages.length === 0) {
        updateTitle(activeConversationId, truncate(text, 38));
      }

      // Placeholder assistant message (typing indicator)
      const assistantId = uuidv4();
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
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

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...history, { role: "user", content: text }],
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          updateMessage(activeConversationId, assistantId, {
            isGenerating: false,
            error: (err as { error?: string }).error ?? "Something went wrong.",
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
          error: "Network error — please check your connection and try again.",
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#07070f]">
      {/* Sidebar — hidden on landing screen, shown for welcome+chat */}
      {stage !== "landing" && <Sidebar />}

      <div className="flex-1 min-w-0 h-full relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "landing" && (
            <motion.div
              key="landing"
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <LandingPage onEnter={() => setStage("welcome")} />
            </motion.div>
          )}

          {stage === "welcome" && (
            <motion.div
              key="welcome"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
              }}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Mobile hamburger */}
              <button
                onClick={toggleSidebar}
                className="absolute top-4 left-4 md:hidden z-10 p-2 rounded-xl glass-card text-[#55556a] hover:text-white transition-colors"
              >
                <Menu size={17} />
              </button>
              <WelcomeScreen onSuggestionClick={handleSend} />
            </motion.div>
          )}

          {stage === "chat" && (
            <motion.div
              key="chat"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top bar */}
              <div className="flex items-center gap-3 px-4 py-3 glass-topbar flex-shrink-0">
                {/* Mobile hamburger */}
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-1.5 rounded-xl hover:bg-white/6 text-[#55556a] hover:text-white transition-colors"
                >
                  <Menu size={17} />
                </button>
                <VizzyLogo size={22} showTail={false} />
                <span
                  className="text-[13px] font-semibold text-[#7070a0] truncate flex-1 min-w-0"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {activeConversation?.title ?? "New Chat"}
                </span>
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-[12px] text-violet-400 flex-shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                      Creating…
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <MessageList
                messages={activeConversation?.messages ?? []}
                onSuggestionClick={handleSend}
              />
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
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
