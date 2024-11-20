import { SocketConstants } from "../constants/socket-constants.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameJoinHandler extends BaseHandler {
    public handle(gameId: string): void {
        console.log(`Joining game with id: ${gameId}`);
        try {
            this.manager.join(gameId, this.socket.id);
        } catch (error) {
            console.error(error);
            this.socket.emit(SocketConstants.Error, error.message);
        }
        this.socket.emit(SocketConstants.JoinGame, gameId);
    }
}