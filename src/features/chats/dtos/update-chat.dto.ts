export interface UpdateChatDto {
  chatId: string; // The chat to update
  type?: string;
  description?: string;
  name?: string;
  isActive?: boolean;
  memberIds?: string[]; // Optionally update members
}
