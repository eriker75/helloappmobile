export interface AddMessageToChatDto {
  chatId: string;
  senderId: string;
  content: string;
  type?: string;
  parentId?: string;
  draftContent?: string;
}
