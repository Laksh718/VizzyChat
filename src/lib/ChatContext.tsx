"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { Conversation, Message, GeneratedImage } from "@/types";
import { generateId } from "@/lib/utils";

// ─── State ────────────────────────────────────────────────────────────────────

type ChatState = {
  conversations: Conversation[];
  activeConversationId: string | null;
  sidebarOpen: boolean;
  imageViewerSrc: string | null;
};

const STORAGE_KEY = "vizzychat_conversations";

function loadFromStorage(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {}
}

function createNewConversation(): Conversation {
  const now = Date.now();
  return {
    id: uuidv4(),
    title: "New Chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "NEW_CONVERSATION" }
  | { type: "SET_ACTIVE"; id: string }
  | { type: "DELETE_CONVERSATION"; id: string }
  | { type: "ADD_MESSAGE"; conversationId: string; message: Message }
  | {
      type: "UPDATE_MESSAGE";
      conversationId: string;
      messageId: string;
      updates: Partial<Message>;
    }
  | {
      type: "UPDATE_TITLE";
      conversationId: string;
      title: string;
    }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; open: boolean }
  | { type: "OPEN_IMAGE_VIEWER"; src: string }
  | { type: "CLOSE_IMAGE_VIEWER" }
  | { type: "LOAD_CONVERSATIONS"; conversations: Conversation[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "LOAD_CONVERSATIONS": {
      const conversations = action.conversations;
      return {
        ...state,
        conversations,
        activeConversationId:
          conversations.length > 0 ? conversations[0].id : null,
      };
    }

    case "NEW_CONVERSATION": {
      const convo = createNewConversation();
      return {
        ...state,
        conversations: [convo, ...state.conversations],
        activeConversationId: convo.id,
      };
    }

    case "SET_ACTIVE":
      return { ...state, activeConversationId: action.id };

    case "DELETE_CONVERSATION": {
      const filtered = state.conversations.filter((c) => c.id !== action.id);
      const newActive =
        state.activeConversationId === action.id
          ? (filtered[0]?.id ?? null)
          : state.activeConversationId;
      return {
        ...state,
        conversations: filtered,
        activeConversationId: newActive,
      };
    }

    case "ADD_MESSAGE": {
      const updated = state.conversations.map((c) => {
        if (c.id !== action.conversationId) return c;
        return {
          ...c,
          messages: [...c.messages, action.message],
          updatedAt: Date.now(),
        };
      });
      return { ...state, conversations: updated };
    }

    case "UPDATE_MESSAGE": {
      const updated = state.conversations.map((c) => {
        if (c.id !== action.conversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === action.messageId ? { ...m, ...action.updates } : m,
          ),
          updatedAt: Date.now(),
        };
      });
      return { ...state, conversations: updated };
    }

    case "UPDATE_TITLE": {
      const updated = state.conversations.map((c) =>
        c.id === action.conversationId ? { ...c, title: action.title } : c,
      );
      return { ...state, conversations: updated };
    }

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.open };

    case "OPEN_IMAGE_VIEWER":
      return { ...state, imageViewerSrc: action.src };

    case "CLOSE_IMAGE_VIEWER":
      return { ...state, imageViewerSrc: null };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type ChatContextValue = ChatState & {
  activeConversation: Conversation | null;
  newConversation: () => void;
  setActive: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>,
  ) => void;
  updateTitle: (conversationId: string, title: string) => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  openImageViewer: (src: string) => void;
  closeImageViewer: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [],
    activeConversationId: null,
    sidebarOpen: true,
    imageViewerSrc: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.length > 0) {
      dispatch({ type: "LOAD_CONVERSATIONS", conversations: stored });
    } else {
      dispatch({ type: "NEW_CONVERSATION" });
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    if (state.conversations.length > 0) {
      saveToStorage(state.conversations);
    }
  }, [state.conversations]);

  const activeConversation =
    state.conversations.find((c) => c.id === state.activeConversationId) ??
    null;

  const newConversation = useCallback(
    () => dispatch({ type: "NEW_CONVERSATION" }),
    [],
  );
  const setActive = useCallback(
    (id: string) => dispatch({ type: "SET_ACTIVE", id }),
    [],
  );
  const deleteConversation = useCallback(
    (id: string) => dispatch({ type: "DELETE_CONVERSATION", id }),
    [],
  );
  const addMessage = useCallback(
    (conversationId: string, message: Message) =>
      dispatch({ type: "ADD_MESSAGE", conversationId, message }),
    [],
  );
  const updateMessage = useCallback(
    (conversationId: string, messageId: string, updates: Partial<Message>) =>
      dispatch({ type: "UPDATE_MESSAGE", conversationId, messageId, updates }),
    [],
  );
  const updateTitle = useCallback(
    (conversationId: string, title: string) =>
      dispatch({ type: "UPDATE_TITLE", conversationId, title }),
    [],
  );
  const toggleSidebar = useCallback(
    () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    [],
  );
  const setSidebar = useCallback(
    (open: boolean) => dispatch({ type: "SET_SIDEBAR", open }),
    [],
  );
  const openImageViewer = useCallback(
    (src: string) => dispatch({ type: "OPEN_IMAGE_VIEWER", src }),
    [],
  );
  const closeImageViewer = useCallback(
    () => dispatch({ type: "CLOSE_IMAGE_VIEWER" }),
    [],
  );

  return (
    <ChatContext.Provider
      value={{
        ...state,
        activeConversation,
        newConversation,
        setActive,
        deleteConversation,
        addMessage,
        updateMessage,
        updateTitle,
        toggleSidebar,
        setSidebar,
        openImageViewer,
        closeImageViewer,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
