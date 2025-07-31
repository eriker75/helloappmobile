import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatRepository } from "../repositories/chat.repository";
import { CreateChatDto } from "../dtos/create-chat.dto";
import { AddMessageToChatDto } from "../dtos/add-message-to-chat.dto";
import { UpdateChatDto } from "../dtos/update-chat.dto";
import { DeleteChatDto } from "../dtos/delete-chat.dto";

// Query to fetch all chats
export function useChatsQuery() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => ChatRepository.getChats(),
  });
}

// Query to fetch messages for a chat
export function useMessagesQuery(chatId: string) {
  return useQuery({
    queryKey: ["chats", chatId, "messages"],
    queryFn: () => ChatRepository.getMessages(chatId),
    enabled: !!chatId,
  });
}

// Mutation to create a new chat
export function useCreateChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateChatDto) => ChatRepository.createChat(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

// Mutation to send a message
export function useSendMessageMutation(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddMessageToChatDto) =>
      ChatRepository.sendMessage(chatId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats", chatId, "messages"],
      });
    },
  });
}

// Mutation to update a chat
export function useUpdateChatMutation(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateChatDto) => ChatRepository.updateChat(chatId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

// Mutation to delete a chat
export function useDeleteChatMutation(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: DeleteChatDto) => ChatRepository.deleteChat(chatId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

// Mutation to mark messages as read
export function useMarkMessagesReadMutation(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ChatRepository.markMessagesRead(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats", chatId, "messages"],
      });
    },
  });
}
