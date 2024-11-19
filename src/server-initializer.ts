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

export const staticRequestHandler = express.static(ServerConstants.Public);

export class ServerInitializer {
  private config: ServerConfig;
  private console: Console;
  
  constructor(config: ServerConfig, console: Console) {
    validateServerConfig(config);
    this.config = config;
    this.console = console;
  }

  initialize(app: express.Express, server: Server) {
    app.use(staticRequestHandler);
    const socketServer = new SocketServer(server, { serveClient: false });
    this.initializeWebSocketServer(socketServer);
    server.listen(this.config.port, this.config.hostName);
  
    this.console.log(`${LoggedMessages.ServerRunning}http://${this.config.hostName}:${this.config.port}`);
  }
  private initializeWebSocketServer(socketServer: SocketServer) {
    socketServer.on(SocketConstants.Connection, this.socketConnectionHandler);
    console.log(LoggedMessages.WebSocketServerInitialized);
  }

  private socketConnectionHandler = (socket: Socket) => {
    const gameHostHandler = new GameHostHandler(socket, this.config);
    const selectionHandler = new CellSelectionHandler(socket);
    console.log(LoggedMessages.WebSocketConnection);
    socket.on(SocketConstants.CellSelected, (selectedCell: string) => selectionHandler.handle(selectedCell));
    socket.on(SocketConstants.HostGame, () => gameHostHandler.handle());
  };
}