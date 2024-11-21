import { SocketEvents } from "../constants/socket-events.ts";
import { BaseHandler } from "./base-handler.ts";

export class GameJoinHandler extends BaseHandler {
    public handle(gameId: string): void {
        console.log(`Joining game with id: ${gameId}`);
        try {
            this.manager.join(gameId, this.socket.id);
            this.socket.emit(SocketEvents.Server.JoinGameAccepted, gameId);
            this.socket.join(gameId);
            this.socketServer.to(gameId).emit(SocketEvents.ServerBroadcast.GuestJoined);
        } catch (error) {
            console.error(error);
            this.socket.emit(SocketEvents.Server.Error, error.message);
        }
    }
}