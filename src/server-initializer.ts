import { Server } from "node:http";
import express from "npm:express";
import { Server as SocketServer, Socket } from "npm:socket.io";

import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { ServerConstants } from "./constants/server-constants.ts";
import { SocketConstants } from "./constants/socket-constants.ts";
import { CellSelectionHandler } from "./handlers/cell-selection-handler.ts";
import { GameHostHandler } from "./handlers/game-host-handler.ts";
import { ServerConfig } from "../server-config.ts";
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
    this.socketServer.on(SocketConstants.Connection, this.socketConnectionHandler);
    console.log(LoggedMessages.WebSocketServerInitialized);
  }

  private socketConnectionHandler = (socket: Socket) => {
    const gameHostHandler = new GameHostHandler(socket, this.config, this.manager);
    const gameJoinHandler = new GameJoinHandler(socket, this.manager);
    const selectionHandler = new CellSelectionHandler(socket, this.manager, this.socketServer);
    console.log(LoggedMessages.WebSocketConnection);
    socket.on(SocketConstants.CellSelected, (gameId: string, selectedCell: string) => selectionHandler.handle(gameId, selectedCell));
    socket.on(SocketConstants.HostGame, () => gameHostHandler.handle());
    socket.on(SocketConstants.JoinGame, (gameId: string) => gameJoinHandler.handle(gameId));
  };
}