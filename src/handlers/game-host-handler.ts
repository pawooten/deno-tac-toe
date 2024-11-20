import { ServerConfig } from "../../server-config.ts";
import { SocketConstants } from "../constants/socket-constants.ts";
import { BaseHandler } from "./base-handler.ts";
import { Socket } from "npm:socket.io";
export class GameHostHandler extends BaseHandler {
    private config: ServerConfig;

    constructor(socket: Socket, config: ServerConfig) {
        super(socket);
        this.config = config;
    }
    public handle(): void {
        // TODO, surrender existing game as the user has decided to host
        
        const gameId =  crypto.randomUUID();
        this.socket.emit(SocketConstants.HostGame, gameId, `http://${this.config.hostName}:${this.config.port}?g=${gameId}`);;
    }
};