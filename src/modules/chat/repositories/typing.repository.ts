import { supabase } from "@/src/utils/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface TypingEvent {
  id: string;
  chat_id: string;
  user_id: string;
  is_typing: boolean;
  updated_at: string;
}

export class TypingRepository {
  static async setTyping(chatId: string, userId: string, isTyping: boolean) {
    // Upsert typing event for this user in this chat
    return supabase
      .from("typing_events")
      .upsert(
        [
          {
            chat_id: chatId,
            user_id: userId,
            is_typing: isTyping,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "chat_id,user_id" }
      );
  }

  static async clearTyping(chatId: string, userId: string) {
    // Remove typing event for this user in this chat
    return supabase
      .from("typing_events")
      .delete()
      .eq("chat_id", chatId)
      .eq("user_id", userId);
  }

  static async getTypingUsers(chatId: string) {
    // Get all users currently typing in this chat
    const { data, error } = await supabase
      .from("typing_events")
      .select("*")
      .eq("chat_id", chatId)
      .eq("is_typing", true);
    if (error) throw error;
    return data as TypingEvent[];
  }

  static subscribeToTypingEvents(
    chatId: string,
    callback: (event: TypingEvent) => void
  ): RealtimeChannel {
    // Subscribe to realtime typing events for this chat
    const channel = supabase
      .channel(`typing_events:chat_id=eq.${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_events",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.new) callback(payload.new as TypingEvent);
        }
      )
      .subscribe();
    return channel;
  }
}
