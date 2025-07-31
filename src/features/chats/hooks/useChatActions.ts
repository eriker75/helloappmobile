import { useCallback } from 'react';
import { useChatStore } from '../stores/chat.store';
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/Chat.model';
import { Message } from '../models/Message.model';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { AddMessageToChatDto } from '../dtos/add-message-to-chat.dto';
import { UpdateChatDto } from '../dtos/update-chat.dto';
import { DeleteChatDto } from '../dtos/delete-chat.dto';

export function useChatActions() {
  const setChats = useChatStore((s) => s.setChats);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const clear = useChatStore((s) => s.clear);

  // Fetch all chats and update store
  const fetchChats = useCallback(async () => {
    const chats: Chat[] = await ChatService.getChats();
    setChats(chats);
  }, [setChats]);

  // Fetch messages for a chat and update store
  const fetchMessages = useCallback(async (chatId: string) => {
    const messages: Message[] = await ChatService.getMessages(chatId);
    setMessages(chatId, messages);
  }, [setMessages]);

  // Create a new chat and refresh chats
  const createChat = useCallback(async (dto: CreateChatDto) => {
    await ChatService.createChat(dto);
    await fetchChats();
  }, [fetchChats]);

  // Send a message and add to store
  const sendMessage = useCallback(async (chatId: string, dto: AddMessageToChatDto) => {
    const message = await ChatService.sendMessage(chatId, dto);
    addMessage(chatId, message);
  }, [addMessage]);

  // Update a chat and refresh chats
  const updateChat = useCallback(async (chatId: string, dto: UpdateChatDto) => {
    await ChatService.updateChat(chatId, dto);
    await fetchChats();
  }, [fetchChats]);

  // Delete a chat and refresh chats
  const deleteChat = useCallback(async (chatId: string, dto: DeleteChatDto) => {
    await ChatService.deleteChat(chatId, dto);
    await fetchChats();
  }, [fetchChats]);

  // Mark messages as read (no store update needed)
  const markMessagesRead = useCallback(async (chatId: string) => {
    await ChatService.markMessagesRead(chatId);
  }, []);

  return {
    fetchChats,
    fetchMessages,
    createChat,
    sendMessage,
    updateChat,
    deleteChat,
    markMessagesRead,
    setChats,
    setMessages,
    addMessage,
    updateMessage,
    clear,
  };
}
