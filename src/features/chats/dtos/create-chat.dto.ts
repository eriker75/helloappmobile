export interface CreateChatDto {
  type?: string; // e.g., "individual", "group"
  description?: string;
  creatorId?: string;
  name?: string;
  memberIds?: string[]; // User IDs to add as members
}
