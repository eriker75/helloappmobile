// use-chat-actions.ts
import { useCallback } from "react";
import { useChatStore } from "../stores/chat.store";
import {
  useCreateChatMutation,
  useSendMessageMutation,
  useUpdateChatMutation,
  useDeleteChatMutation,
  useMarkMessagesReadMutation,
} from "../services/chat.service";
import { CreateChatDto } from "../dtos/create-chat.dto";
import { AddMessageToChatDto } from "../dtos/add-message-to-chat.dto";
import { UpdateChatDto } from "../dtos/update-chat.dto";
import { DeleteChatDto } from "../dtos/delete-chat.dto";

export function useChatActions() {
  const setChats = useChatStore((s) => s.setChats);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const clear = useChatStore((s) => s.clear);

  // Get all mutation hooks
  const createChatMutation = useCreateChatMutation();

  // Create a new chat using React Query mutation
  const createChat = useCallback(
    async (dto: CreateChatDto) => {
      await createChatMutation.mutateAsync(dto);
    },
    [createChatMutation]
  );

  // Send a message with optimistic UI updates
  const sendMessage = useCallback(
    async (chatId: string, dto: AddMessageToChatDto) => {
      const sendMessageMutation = useSendMessageMutation(chatId);
      await sendMessageMutation.mutateAsync(dto, {
        onSuccess: (message) => {
          addMessage(chatId, message);
        },
        // Add error handling/rollback here if needed
      });
    },
    [addMessage]
  );

  // Update a chat using React Query mutation
  const updateChat = useCallback(async (chatId: string, dto: UpdateChatDto) => {
    const updateChatMutation = useUpdateChatMutation(chatId);
    await updateChatMutation.mutateAsync(dto);
  }, []);

  // Delete a chat using React Query mutation
  const deleteChat = useCallback(async (chatId: string, dto: DeleteChatDto) => {
    const deleteChatMutation = useDeleteChatMutation(chatId);
    await deleteChatMutation.mutateAsync(dto);
  }, []);

  // Mark messages as read
  const markMessagesRead = useCallback(async (chatId: string) => {
    const markMessagesReadMutation = useMarkMessagesReadMutation(chatId);
    await markMessagesReadMutation.mutateAsync();
  }, []);

  return {
    createChat,
    sendMessage,
    updateChat,
    deleteChat,
    markMessagesRead,
    setChats, // For direct store updates
    setMessages, // For direct store updates
    addMessage, // For optimistic UI updates
    updateMessage, // For message updates
    clear, // For store cleanup
  };
}
