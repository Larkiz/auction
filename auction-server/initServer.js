import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  pingInterval: 2000,
  pingTimeout: 5000,
  cors: "http://26.1.73.214:3000/",
});

const port = 5000;

export const initServer = (callback) => {
  io.on("connection", (socket) => {
    callback(socket, io);
  });
};
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
