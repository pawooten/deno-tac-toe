import { SocketConstants } from "../constants/socket-constants.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameHostHandler extends BaseHandler {
    public handle(): void {
        console.log(`Game host handler called`);
        // TODO, surrender existing game as the user has decided to host
        
        const gameId =  crypto.randomUUID();
        const gameUrl = `http://localhost:8000?gameId=${gameId}`; // TODO hardcoded port
        this.socket.emit(SocketConstants.HostGame, gameUrl);;
    }
};