import createSocketConnection from "@/src/config/socket";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

type ChatSocketEvents = {
  "message:new": (message: any) => void;
  "chat:updated": (chat: any) => void;
  typing: (data: { chatId: string; userId: string }) => void;
};

export function useChatSocket(
  userId: string,
  access_token: string,
  onMessageNew?: (message: any) => void,
  onChatUpdated?: (chat: any) => void,
  onTyping?: (data: { chatId: string; userId: string }) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Singleton pattern: only one socket connection per app
    if (!socketRef.current) {
      socketRef.current = createSocketConnection({
        userId,
        access_token,
        autoConnect: true,
      });
    }
    const socket = socketRef.current;

    // Register event listeners
    if (onMessageNew) socket.on("message:new", onMessageNew);
    if (onChatUpdated) socket.on("chat:updated", onChatUpdated);
    if (onTyping) socket.on("typing", onTyping);

    // Cleanup on unmount
    return () => {
      if (onMessageNew) socket.off("message:new", onMessageNew);
      if (onChatUpdated) socket.off("chat:updated", onChatUpdated);
      if (onTyping) socket.off("typing", onTyping);
      // Do not disconnect socket here to preserve singleton
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMessageNew, onChatUpdated, onTyping]);

  // Expose emitters for sending events
  const emit = (event: keyof ChatSocketEvents, ...args: any[]) => {
    socketRef.current?.emit(event, ...args);
  };

  return {
    socket: socketRef.current,
    emit,
  };
}
