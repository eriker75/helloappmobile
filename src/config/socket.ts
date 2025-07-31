import { io, Socket } from "socket.io-client";

const BACKEDN_API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export interface SocketConnectionParams {
  userId: string;
  access_token: string;
  autoConnect?: boolean;
}

export default function createSocketConnection({
  userId,
  access_token,
  autoConnect = false,
}: SocketConnectionParams): Socket {
  return io(BACKEDN_API_URL, {
    query: { userId },
    transports: ["websocket"],
    autoConnect: autoConnect,
    auth: {
      token: access_token,
    },
  });
}
