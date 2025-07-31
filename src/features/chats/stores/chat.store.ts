import { create, StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { createZustandAsyncStorage } from "@/src/config/zustandAsyncStorage";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";

// State interface
export interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
}

// Actions interface
export interface ChatActions {
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  addChats: (chats: Chat[]) => void;
  updateChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, message: Message) => void;
  clear: () => void;
}

type ChatStore = ChatState & ChatActions;

const initialChatState = {
  chats: [],
  messages: {},
};

const createChatStore = (
  set: StoreApi<ChatStore>["setState"],
  get: StoreApi<ChatStore>["getState"]
): ChatStore => ({
  ...initialChatState,
  setChats: (chats) =>
    set((state) => {
      state.chats = chats;
      return state;
    }),
  addChat: (chat) =>
    set((state) => {
      // Avoid duplicates by id
      if (!state.chats.some((c) => c.id === chat.id)) {
        state.chats.push(chat);
      }
      return state;
    }),
  addChats: (chats) =>
    set((state) => {
      // Add only new chats (by id)
      const existingIds = new Set(state.chats.map((c) => c.id));
      const newChats = chats.filter((c) => !existingIds.has(c.id));
      state.chats.push(...newChats);
      return state;
    }),
  updateChat: (chat) =>
    set((state) => {
      const idx = state.chats.findIndex((c) => c.id === chat.id);
      if (idx !== -1) {
        state.chats[idx] = { ...state.chats[idx], ...chat };
      }
      return state;
    }),
  deleteChat: (chatId) =>
    set((state) => {
      state.chats = state.chats.filter((c) => c.id !== chatId);
      // Optionally, also remove messages for this chat
      if (state.messages[chatId]) {
        delete state.messages[chatId];
      }
      return state;
    }),
  setMessages: (chatId, messages) =>
    set((state) => {
      state.messages[chatId] = messages;
      return state;
    }),
  addMessage: (chatId, message) =>
    set((state) => {
      if (!state.messages[chatId]) state.messages[chatId] = [];
      state.messages[chatId].push(message);
      return state;
    }),
  updateMessage: (chatId, message) =>
    set((state) => {
      if (!state.messages[chatId]) return state;
      const idx = state.messages[chatId].findIndex((m) => m.id === message.id);
      if (idx !== -1) state.messages[chatId][idx] = message;
      return state;
    }),
  clear: () =>
    set((state) => {
      state.chats = [];
      state.messages = {};
      return state;
    }),
});

// Export store with immer and persist (AsyncStorage)
// Only persist state, not actions
export const useChatStore = create<ChatStore>()(
  persist(immer(createChatStore), {
    name: "chat-store",
    storage: createZustandAsyncStorage<ChatState>(),
    partialize: (state) => ({
      chats: state.chats,
      messages: state.messages,
    }),
  })
);
