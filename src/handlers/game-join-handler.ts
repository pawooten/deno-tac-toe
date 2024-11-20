import { BaseHandler } from "./base-handler.ts";

export class GameJoinHandler extends BaseHandler {
    public handle(gameId: string): void {
        console.log(`Joining game with id: ${gameId}`);
        this.socket.emit("join-game", true);
    }
}