import { GameManager } from "../game-manager.ts";
import { ServerConfig } from "../../server-config.ts";
import { SocketEvents } from "../../public/constants.js";
import { BaseHandler } from "./base-handler.ts";
import { Server, Socket } from "npm:socket.io";
export class GameHostHandler extends BaseHandler {
    private config: ServerConfig;

    constructor(socket: Socket, socketServer: Server, config: ServerConfig, manager: GameManager) {
        super(socket, socketServer, manager);
        this.config = config;
    }
    public handle(): void {
        const { newGameId, abandonedGameId } = this.manager.host(this.socket.id);
        if (abandonedGameId) {
            this.socket.leave(abandonedGameId);
            this.socketServer.to(abandonedGameId).emit(SocketEvents.Server.GameAbandoned);
        }
        this.socket.join(newGameId);
        this.socket.emit(SocketEvents.Server.HostGameAccepted, newGameId, `http://${this.config.hostName}:${this.config.port}?g=${newGameId}`);
    }
};