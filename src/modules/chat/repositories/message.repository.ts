import { supabase } from "@/src/utils/supabase";
import { Message } from "../definitions/Message.model";
import { CreateMessageDto } from "../dtos/create-message.dto";

/**
 * Get paginated messages for a chat, ordered by created_at ASC, with sender profile
 * @param chatId string
 * @param limit number
 * @param cursor string | null (message id to start after)
 */
export async function getPaginatedMessagesForChat(
  chatId: string,
  limit: number = 20,
  cursor: string | null = null
): Promise<{ messages: any[]; nextCursor: string | null }> {
  let query = supabase
    .from("messages")
    .select(
      `
      *
      `
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    // Fetch messages after the cursor (assuming cursor is created_at)
    query = query.gt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching paginated messages:", error);
    return { messages: [], nextCursor: null };
  }

  const messages = data as any[];
  const nextCursor = messages.length === limit ? messages[messages.length - 1].created_at : null;
  return { messages, nextCursor };
}

// Send a new message
export async function sendMessage(dto: CreateMessageDto): Promise<Message | null> {
  // Insert the new message
  const { data, error } = await supabase
    .from("messages")
    .insert([dto])
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  // After sending the message, update the chat's last_message_id
  if (data && data.id && dto.chat_id) {
    const { error: updateError } = await supabase
      .from("chats")
      .update({ last_message_id: data.id })
      .eq("id", dto.chat_id);

    if (updateError) {
      console.error("Error updating chat last_message_id:", updateError);
      // Optionally, you could return null or still return the message
    }
  }

  return data as Message;
}

// Subscribe to new messages in a chat
export function subscribeToMessages(chatId: string, callback: (message: Message) => void) {
  return supabase
    .channel("chat-messages-" + chatId)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
}
/**
 * Subscribe to message state changes (delivered/read) in a chat.
 * Calls callback with the updated message.
 */
export function subscribeToMessageState(
  chatId: string,
  callback: (message: any) => void
) {
  // Listen to UPDATE events on messages table for this chat
  return supabase
    .channel("message-state-" + chatId)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}

/**
 * Mark all unread messages as read in a chat for the current user.
 * Only marks messages not sent by the current user and where readed is false or null.
 * @param chatId string
 * @param userId string
 */
export async function markAllMessagesAsRead(chatId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ readed: true })
    .eq("chat_id", chatId)
    .neq("sender_id", userId)
    .or("readed.is.false,readed.is.null");

  if (error) {
    console.error("Error marking messages as read:", error);
  }
}
