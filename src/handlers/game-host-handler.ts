import { SocketConstants } from "../constants/socket-constants.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameHostHandler extends BaseHandler {
    public handle(): void {
        console.log(`Game host handler called`);
        // TODO, surrender existing game as the user has decided to host
        
        const gameId =  crypto.randomUUID();
        this.socket.emit(SocketConstants.HostGame, gameId);;
    }
};