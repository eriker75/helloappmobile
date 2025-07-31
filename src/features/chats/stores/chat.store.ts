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
