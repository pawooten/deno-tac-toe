import { GameManager } from "../game-manager.ts";
import { ServerConfig } from "../server-config.ts";
import { SocketEvents } from "../../public/constants.js";
import { BaseHandler } from "./base-handler.ts";
import { Server, Socket } from "npm:socket.io";
export class GameHostHandler extends BaseHandler {
    private config: ServerConfig;

    constructor(socket: Socket, socketServer: Server, config: ServerConfig, manager: GameManager) {
        super(socket, socketServer, manager);
        this.config = config;
    }
    public handle(theme: string): void {
        const { newGameId, abandonedGameId } = this.manager.host(this.socket.id, theme);
        if (abandonedGameId) {
            this.socket.leave(abandonedGameId);
            this.socketServer.to(abandonedGameId).emit(SocketEvents.Server.GameAbandoned);
        }
        this.socket.join(newGameId);
    
        const scheme = Deno.env.get("USE_HTTP") ? 'http' : 'https';
        let url =  `${scheme}://${this.config.hostName}?g=${newGameId}`;
        if (this.config.port) {
            url = `${scheme}://${this.config.hostName}:${this.config.port}?g=${newGameId}`;
        }
        this.socket.emit(SocketEvents.Server.HostGameAccepted, newGameId, url);
    }
};