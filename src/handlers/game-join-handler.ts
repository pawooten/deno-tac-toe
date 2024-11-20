import { SocketConstants } from "../constants/socket-constants.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameJoinHandler extends BaseHandler {
    public handle(gameId: string): void {
        console.log(`Joining game with id: ${gameId}`);
        this.socket.emit(SocketConstants.JoinGame, gameId);
    }
}