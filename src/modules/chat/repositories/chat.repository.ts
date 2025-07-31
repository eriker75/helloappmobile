import { supabase } from "@/src/utils/supabase";
import { Chat } from "../definitions/Chat.model";
import { CreateChatDto } from "../dtos/create-chat.dto";

/**
 * Get enriched chat list for a user, including:
 * - chat info
 * - last_message (content, created_at, sender)
 * - unread_count for the user
 * - last_message_date
 * Ordered by last_message.created_at DESC
 */
export async function getUserChatList(userId: string): Promise<any[]> {
  console.log("[getUserChatList] userId:", userId);

  // Paso 1: Obtener los IDs de los chats donde el usuario es miembro
  const { data: memberData, error: memberError } = await supabase
    .from("chat_members")
    .select("chat_id, user_id")
    .eq("user_id", userId);

  console.log("[getUserChatList] userId param:", userId);
  console.log("[getUserChatList] chat_members data:", memberData);

  if (memberError) {
    console.error("[getUserChatList] Error fetching chat_members:", memberError);
    return [];
  }

  const chatIds = (memberData as any[]).map((row) => row.chat_id);
  if (!chatIds.length) {
    console.log("[getUserChatList] No chats found for user. userId:", userId, "memberData:", memberData);
    return [];
  }

  // Paso 2: Obtener los chats usando esos IDs
  const { data: chatsData, error: chatsError } = await supabase
    .from("chats")
    .select("*")
    .in("id", chatIds)
    .order("updated_at", { ascending: false });

  if (chatsError) {
    console.error("[getUserChatList] Error fetching chats:", chatsError);
    return [];
  }

  console.log("[getUserChatList] Raw chatsData:", chatsData);

  // Paso 3: Enriquecer cada chat con last_message y unread_count
  const enrichedChats = await Promise.all(
    (chatsData as any[]).map(async (chat, idx) => {
      let last_message = null;
      let other_user_profile = null;
      // Obtener miembros del chat
      const { data: members, error: membersError } = await supabase
        .from("chat_members")
        .select("user_id")
        .eq("chat_id", chat.id);
      if (membersError) {
        console.error(`[getUserChatList] Error fetching members for chat ${chat.id}:`, membersError);
        return null;
      }
      // Excluir chats donde el usuario es el único miembro
      const otherMembers = members.filter((m: any) => m.user_id !== userId);
      if (otherMembers.length === 0) {
        return null;
      }
      // Para chats 1-1, obtener el perfil del otro usuario
      if (otherMembers.length === 1) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, user_id, alias, avatar")
          .eq("user_id", otherMembers[0].user_id)
          .single();
        if (!profileError && profile) {
          other_user_profile = {
            profileId: profile.id,
            userId: profile.user_id,
            alias: profile.alias,
            avatar: profile.avatar,
          };
        }
      }
      if (chat.last_message_id) {
        // 1. Obtener el mensaje sin join anidado
        const { data: lastMsg, error: lastMsgError } = await supabase
          .from("messages")
          .select(
            `
            id,
            content,
            created_at,
            sender_id,
            readed
            `
          )
          .eq("id", chat.last_message_id)
          .single();
        if (!lastMsgError && lastMsg) {
          // 2. Si hay sender_id, buscar el perfil
          let senderProfile = null;
          if (lastMsg.sender_id) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("alias, avatar")
              .eq("user_id", lastMsg.sender_id)
              .single();
            if (!profileError && profile) {
              senderProfile = profile;
            }
          }
          last_message = {
            ...lastMsg,
            profiles: senderProfile,
          };
        } else {
          // Si no existe el mensaje, solo loguea como warning
          console.warn(`[getUserChatList] No last message found for chat ${chat.id} (last_message_id: ${chat.last_message_id})`);
        }
        // Log para depuración
        console.log(`[getUserChatList] last_message para chat ${chat.id}:`, last_message);
      }
      // Contar mensajes no leídos para el usuario
      const { data: unreadMsgs, error: unreadError } = await supabase
        .from("messages")
        .select("id")
        .eq("chat_id", chat.id)
        .eq("readed", false)
        .neq("sender_id", userId);
      const unread_count = unreadError || !unreadMsgs ? 0 : unreadMsgs.length;
      const last_message_date = last_message?.created_at || chat.updated_at;
      const result = {
        ...chat,
        last_message,
        unread_count,
        last_message_date,
        other_user_profile,
      };
      console.log(`[getUserChatList] Enriched chat[${idx}]:`, result);
      return result;
    })
  );

  // Filtrar nulos (chats donde el usuario es el único miembro)
  const filteredChats = enrichedChats.filter(Boolean);
  // Ordenar por last_message_date DESC
  const sortedChats = filteredChats.sort((a, b) =>
    new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime()
  );
  console.log("[getUserChatList] Sorted chats:", JSON.stringify(sortedChats,null,2));
  return sortedChats;
}
/**
 * Paginated chat list for a user, ordered by last_message_date DESC.
 * Cursor-based pagination: pass lastMessageDateCursor (ISO string) to fetch older.
 */
export async function getPaginatedUserChats(
  userId: string,
  pageSize: number = 20,
  lastMessageDateCursor: string | null = null
): Promise<{ chats: any[]; nextCursor: string | null }> {
  // Step 1: Get chat IDs for user
  const { data: memberData, error: memberError } = await supabase
    .from("chat_members")
    .select("chat_id, user_id")
    .eq("user_id", userId);

  if (memberError) {
    console.error("[getPaginatedUserChats] Error fetching chat_members:", memberError);
    return { chats: [], nextCursor: null };
  }

  const chatIds = (memberData as any[]).map((row) => row.chat_id);
  if (!chatIds.length) {
    return { chats: [], nextCursor: null };
  }

  // Step 2: Fetch chats with pagination
  let chatQuery = supabase
    .from("chats")
    .select("*")
    .in("id", chatIds)
    .order("updated_at", { ascending: false })
    .limit(pageSize);

  if (lastMessageDateCursor) {
    chatQuery = chatQuery.lt("updated_at", lastMessageDateCursor);
  }

  const { data: chatsData, error: chatsError } = await chatQuery;

  if (chatsError) {
    console.error("[getPaginatedUserChats] Error fetching chats:", chatsError);
    return { chats: [], nextCursor: null };
  }

  // Enrich and filter as in getUserChatList
  const enrichedChats = await Promise.all(
    (chatsData as any[]).map(async (chat, idx) => {
      let last_message = null;
      let other_user_profile = null;
      // Get members
      const { data: members, error: membersError } = await supabase
        .from("chat_members")
        .select("user_id")
        .eq("chat_id", chat.id);
      if (membersError) return null;
      const otherMembers = members.filter((m: any) => m.user_id !== userId);
      if (otherMembers.length === 0) return null;
      // 1-1: get other user profile
      if (otherMembers.length === 1) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, user_id, alias, avatar")
          .eq("user_id", otherMembers[0].user_id)
          .single();
        if (!profileError && profile) {
          other_user_profile = {
            profileId: profile.id,
            userId: profile.user_id,
            alias: profile.alias,
            avatar: profile.avatar,
          };
        }
      }
      if (chat.last_message_id) {
        const { data: lastMsg, error: lastMsgError } = await supabase
          .from("messages")
          .select("id, content, created_at, sender_id, readed")
          .eq("id", chat.last_message_id)
          .single();
        if (!lastMsgError && lastMsg) {
          let senderProfile = null;
          if (lastMsg.sender_id) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("alias, avatar")
              .eq("user_id", lastMsg.sender_id)
              .single();
            if (!profileError && profile) {
              senderProfile = profile;
            }
          }
          last_message = {
            ...lastMsg,
            profiles: senderProfile,
          };
        }
      }
      // Unread count
      const { data: unreadMsgs, error: unreadError } = await supabase
        .from("messages")
        .select("id")
        .eq("chat_id", chat.id)
        .eq("readed", false)
        .neq("sender_id", userId);
      const unread_count = unreadError || !unreadMsgs ? 0 : unreadMsgs.length;
      const last_message_date = last_message?.created_at || chat.updated_at;
      return {
        ...chat,
        last_message,
        unread_count,
        last_message_date,
        other_user_profile,
      };
    })
  );

  const filteredChats = enrichedChats.filter(Boolean);
  // Already ordered by updated_at DESC, but sort again by last_message_date DESC for safety
  const sortedChats = filteredChats.sort((a, b) =>
    new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime()
  );

  // Next cursor: last_message_date of the last chat in this page
  const nextCursor =
    sortedChats.length === pageSize
      ? sortedChats[sortedChats.length - 1].last_message_date
      : null;

  return { chats: sortedChats, nextCursor };
}

// Get all chats for a user (where user is a member)
export async function getUserChats(userId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from("chat_members")
    .select("chat:chat_id(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
  // data is array of { chat: Chat }
  return data.map((row: any) => row.chat as Chat);
}

// Create a new chat
export async function createChat(dto: CreateChatDto): Promise<Chat | null> {
  const { data, error } = await supabase
    .from("chats")
    .insert([dto])
    .select()
    .single();

  if (error) {
    console.error("Error creating chat:", error);
    return null;
  }
  return data as Chat;
}

// Subscribe to real-time chat changes (for a user)
export function subscribeToUserChats(
  userId: string,
  callback: (chat: Chat) => void
) {
  // Listen to new chat_members for this user
  return supabase
    .channel("user-chats-" + userId)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_members",
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        // Fetch the full chat object
        const chatId = payload.new.chat_id;
        const { data, error } = await supabase
          .from("chats")
          .select("*")
          .eq("id", chatId)
          .single();
        if (!error && data) callback(data as Chat);
      }
    )
    .subscribe();
}
