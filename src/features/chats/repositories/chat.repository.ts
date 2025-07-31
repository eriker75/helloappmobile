import api from "../../../config/api";
import { CreateChatDto } from "../dtos/create-chat.dto";
import { AddMessageToChatDto } from "../dtos/add-message-to-chat.dto";
import { UpdateChatDto } from "../dtos/update-chat.dto";
import { DeleteChatDto } from "../dtos/delete-chat.dto";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";

export class ChatRepository {
  // Fetch all chats for the current user
  static async getChats(): Promise<Chat[]> {
    const res = await api.get("/chat");
    return res.data;
  }

  // Fetch messages for a specific chat
  static async getMessages(chatId: string): Promise<Message[]> {
    const res = await api.get(`/chat/${chatId}/messages`);
    return res.data;
  }

  // Create a new chat
  static async createChat(dto: CreateChatDto): Promise<Chat> {
    const res = await api.post("/chat", dto);
    return res.data;
  }

  // Send a message to a chat
  static async sendMessage(
    chatId: string,
    dto: AddMessageToChatDto
  ): Promise<Message> {
    const res = await api.post(`/chat/${chatId}/messages`, dto);
    return res.data;
  }

  // Update a chat
  static async updateChat(chatId: string, dto: UpdateChatDto): Promise<Chat> {
    const res = await api.patch(`/chat/${chatId}`, dto);
    return res.data;
  }

  // Delete a chat
  static async deleteChat(chatId: string, dto: DeleteChatDto): Promise<void> {
    await api.delete(`/chat/${chatId}`, { data: dto });
  }

  // Mark messages as read
  static async markMessagesRead(chatId: string): Promise<void> {
    await api.post(`/chat/${chatId}/messages/read`);
  }
}
