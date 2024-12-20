import { SocketEvents } from "../../public/constants.js";
import { getUserMark } from "../utilities/game-state-utilities.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameReplayHandler extends BaseHandler {
    public handle(gameId: string): void {
        console.log(`Replaying game with id: ${gameId}`);
        try {
            this.manager.replay(gameId, this.socket.id);
            this.socket.emit(SocketEvents.Server.HostGameAccepted, gameId);

            const game = this.manager.get(gameId);
            const hostMark = getUserMark(game, game.host);
            const guestMark = getUserMark(game, game.guest);
            this.socketServer.to(gameId).emit(SocketEvents.ServerBroadcast.GuestJoined, hostMark, guestMark);
        } catch (error) {
            console.error(error);
            this.socket.emit(SocketEvents.Server.Error, error.message);
        }
    }
}