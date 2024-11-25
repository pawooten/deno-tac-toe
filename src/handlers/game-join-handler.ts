import { SocketEvents } from "../../public/constants.js";
import { getSubtitleMessage, getUserMark } from "../utilities/game-state-utilities.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameJoinHandler extends BaseHandler {
    public handle(gameId: string): void {
        console.log(`Joining game with id: ${gameId}`);
        try {
            this.manager.join(gameId, this.socket.id);
            this.socket.emit(SocketEvents.Server.JoinGameAccepted, gameId);
            this.socket.join(gameId);
            const game = this.manager.get(gameId);
            const hostMark = getUserMark(game, game.host);
            const guestMark = getUserMark(game, game.guest);
            this.socketServer.to(gameId).emit(SocketEvents.ServerBroadcast.GuestJoined, getSubtitleMessage(this.manager.get(gameId).theme), hostMark, guestMark);
        } catch (error) {
            console.error(error);
            this.socket.emit(SocketEvents.Server.Error, error.message);
        }
    }
}