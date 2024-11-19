import { Server } from "node:http";
import express from "npm:express";
import { Server as SocketServer, Socket } from "npm:socket.io";

import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { ServerConstants } from "./constants/server-constants.ts";
import { SocketConstants } from "./constants/socket-constants.ts";

export const initialize = (app: express.Express, server: Server, port: number, console: Console): void => {
    if (port < ServerConstants.minPort || port > ServerConstants.maxPort) {
        throw new Error(ErrorMessages.InvalidPortSpecified);
    }

    app.use(staticRequestHandler);
    initializeWebSocketServer(server, console);
    server.listen(port);

    console.log(`${LoggedMessages.ServerRunning}${port}`);
};

export const staticRequestHandler = express.static(ServerConstants.Public);

export const socketConnectionHandler = (socket: Socket) => {
  console.log(LoggedMessages.WebSocketConnection);
  socket.on(SocketConstants.Message, (message: string) => console.log(message));
};

export const initializeWebSocketServer = (server: Server, console: Console) => {
  const socketServer = new SocketServer(server, { serveClient: false });
  socketServer.on(SocketConstants.Connection, socketConnectionHandler);
  console.log(LoggedMessages.WebSocketServerInitialized);
};
