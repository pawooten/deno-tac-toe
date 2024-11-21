import { Server, Socket } from "npm:socket.io";
import { GameManager } from "../game-manager.ts";

export abstract class BaseHandler {
    protected readonly socket:Socket;
    protected readonly socketServer: Server;

    protected readonly manager: GameManager;
    constructor(socket: Socket, socketServer: Server, manager: GameManager) {
        this.socket = socket;
        this.socketServer = socketServer;
        this.manager = manager;
    }
    // deno-lint-ignore no-explicit-any
    public abstract handle(...args: any[]): void;
};