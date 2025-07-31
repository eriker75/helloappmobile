export interface Message {
  id: string;
  chatId: string;
  sender?: {
    id: string;
    name?: string;
    avatarUrl?: string;
    // Add more user fields as needed
  } | null;
  parentId?: string | null;
  replies?: Message[];
  content?: string | null;
  draftContent?: string | null;
  type?: string | null;
  readed: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
