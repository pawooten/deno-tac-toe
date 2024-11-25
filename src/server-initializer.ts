import { Server } from "node:http";
import express from "npm:express";
import { Server as SocketServer, Socket } from "npm:socket.io";

import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { ServerConstants } from "./constants/server-constants.ts";
import { SocketEvents } from "../public/constants.js";
import { CellSelectionHandler } from "./handlers/cell-selection-handler.ts";
import { GameHostHandler } from "./handlers/game-host-handler.ts";
import { ServerConfig } from "./server-config.ts";
import { validateServerConfig } from "./utilities/server-config-validator.ts";
import { GameJoinHandler } from "./handlers/game-join-handler.ts";
import { GameManager } from "./game-manager.ts";

export const staticRequestHandler = express.static(ServerConstants.Public);

export class ServerInitializer {
  private config: ServerConfig;
  private console: Console;
  private manager: GameManager;
  private socketServer: SocketServer | undefined = undefined;

  constructor(config: ServerConfig, console: Console) {
    validateServerConfig(config);
    this.config = config;
    this.console = console;
    this.manager = new GameManager();
  }

  initialize(app: express.Express, server: Server) {
    app.use(staticRequestHandler);
    this.socketServer = new SocketServer(server, { serveClient: false });
    this.initializeWebSocketServer();
    server.listen(this.config.port, this.config.hostName);
  
    this.console.log(`${LoggedMessages.ServerRunning}http://${this.config.hostName}:${this.config.port}`);
  }
  private initializeWebSocketServer() {
    if (!this.socketServer) {
      throw new Error(ErrorMessages.NoSocketServerSpecified);
    }
    this.socketServer.on(SocketEvents.Client.Connection, this.socketConnectionHandler);
    console.log(LoggedMessages.WebSocketServerInitialized);
  }

  private socketConnectionHandler = (socket: Socket) => {
    if (!this.socketServer) {
      throw new Error(ErrorMessages.NoSocketServerSpecified);
    }
    const gameHostHandler = new GameHostHandler(socket, this.socketServer, this.config, this.manager);
    const gameJoinHandler = new GameJoinHandler(socket, this.socketServer, this.manager);
    const selectionHandler = new CellSelectionHandler(socket, this.socketServer, this.manager);
    console.log(LoggedMessages.WebSocketConnection);
    socket.on(SocketEvents.Client.CellSelected, (gameId: string, selectedCell: string) => selectionHandler.handle(gameId, selectedCell));
    socket.on(SocketEvents.Client.RequestHostGame, () => gameHostHandler.handle());
    socket.on(SocketEvents.Client.RequestJoinGame, (gameId: string) => gameJoinHandler.handle(gameId));
  };
}