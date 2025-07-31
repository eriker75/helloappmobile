import { Message } from './Message.model';

export interface Chat {
  id: string;
  createdAt: string; // ISO string for frontend
  updatedAt: string;
  isActive: boolean;
  type: 'private' | 'group' | string;
  lastMessage?: Message;
  description?: string | null;
  creator?: {
    id: string;
    name?: string;
    avatarUrl?: string;
    // Add more user fields as needed
  } | null;
  name?: string | null;
  members?: Array<{
    id: string;
    userId: string;
    // Add more member fields as needed
  }>;
  messages?: Message[];
}
