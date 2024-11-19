import { Socket } from "npm:socket.io";
import { SocketConstants } from "../constants/socket-constants.ts";

export class GameHostHandler {
    private readonly socket:Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }

    public handle(): void {
        console.log(`Game host handler called`);
        // TODO, surrender existing game as the user has decided to host
        
        const gameId =  crypto.randomUUID();
        this.socket.emit(SocketConstants.HostGame, gameId);;
    }
};