import { GameManager } from "../game-manager.ts";
import { ServerConfig } from "../../server-config.ts";
import { SocketEvents } from "../constants/socket-events.ts";
import { BaseHandler } from "./base-handler.ts";
import { Server, Socket } from "npm:socket.io";
export class GameHostHandler extends BaseHandler {
    private config: ServerConfig;

    constructor(socket: Socket, socketServer: Server, config: ServerConfig, manager: GameManager) {
        super(socket, socketServer, manager);
        this.config = config;
    }
    public handle(): void {
        // TODO, surrender existing game as the user has decided to host
        const gameId = this.manager.host(this.socket.id);
        this.socket.join(gameId);
        this.socket.emit(SocketEvents.HostGame, gameId, `http://${this.config.hostName}:${this.config.port}?g=${gameId}`);
    }
};