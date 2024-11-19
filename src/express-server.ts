import { Server } from "node:http";
import express from "npm:express";
import { Server as SocketServer, Socket } from "npm:socket.io";

import { LoggedMessages } from "./constants/messages.ts";
import { ServerConstants } from "./constants/server-constants.ts";
import { SocketConstants } from "./constants/socket-constants.ts";
import { CellSelectionHandler } from "./handlers/cell-selection-handler.ts";
import { GameHostHandler } from "./handlers/game-host-handler.ts";
import { ServerConfig } from "../server-config.ts";
import { validateServerConfig } from "./utilities/server-config-validator.ts";
export const initialize = (app: express.Express, server: Server, config: ServerConfig, console: Console): void => {
  validateServerConfig(config);

  app.use(staticRequestHandler);
  const socketServer = new SocketServer(server, { serveClient: false });
  initializeWebSocketServer(socketServer, console);
  server.listen(config.port, config.hostName);

  console.log(`${LoggedMessages.ServerRunning}http://${config.hostName}:${config.port}`);
};

export const staticRequestHandler = express.static(ServerConstants.Public);

export const socketConnectionHandler = (socket: Socket) => {
  const gameHostHandler = new GameHostHandler(socket);
  const selectionHandler = new CellSelectionHandler(socket);
  console.log(LoggedMessages.WebSocketConnection);
  socket.on(SocketConstants.CellSelected, (selectedCell: string) => selectionHandler.handle(selectedCell));
  socket.on(SocketConstants.HostGame, () => gameHostHandler.handle());
};

export const initializeWebSocketServer = (socketServer: SocketServer, console: Console) => {
  socketServer.on(SocketConstants.Connection, socketConnectionHandler);
  console.log(LoggedMessages.WebSocketServerInitialized);
};
