import { SocketConstants } from "../constants/socket-constants.ts";
import { getUserMark } from "../utilities/game-state-utilities.ts";
import { BaseHandler } from "./base-handler.ts";

export class CellSelectionHandler extends BaseHandler {
    public handle(gameId: string, selectedCell: string): void {
        try {
            const game = this.manager.get(gameId);
            const mark = getUserMark(game, this.socket.id);
            console.log(`User selected cell: ${selectedCell} game ${gameId}`);

            this.socket.emit(SocketConstants.CellMarked, selectedCell, mark);    
        } catch (error) {
            this.socket.emit(SocketConstants.Error, error.message);
        }
    }
};