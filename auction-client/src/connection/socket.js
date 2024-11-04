import { io } from "socket.io-client";

export const socket = io("ws://localhost:5000", {
  reconnectionDelayMax: 10000,
  query: {
    name: 42,
  },
});
