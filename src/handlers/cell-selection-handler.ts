import { SocketEvents } from "../constants/socket-events.ts";
import { getCellIndices, getUserMark } from "../utilities/game-state-utilities.ts";
import { BaseHandler } from "./base-handler.ts";
import { ErrorMessages } from "../constants/messages.ts";

export class CellSelectionHandler extends BaseHandler {

    public handle(gameId: string, selectedCell: string): void {
        try {
            const game = this.manager.get(gameId);
            const mark = getUserMark(game, this.socket.id);
            const [cellRow, cellColumn] = getCellIndices(selectedCell);
            const currentCellValue = game.cells[cellRow][cellColumn];
            if (currentCellValue === mark) {
                // The cell
                this.socket.emit(SocketEvents.Error, ErrorMessages.DuplicateCellSelected);
                return;
            }
            if (currentCellValue) {
                this.socket.emit(SocketEvents.Error, ErrorMessages.CellAlreadySelected);
                return;
            }
            game.cells[cellRow][cellColumn] = mark;
            console.log(`User selected cell: ${selectedCell} game ${gameId}`);

            this.socketServer.to(gameId).emit(SocketEvents.ServerBroadcast.CellMarked, selectedCell, mark);
        } catch (error) {
            this.socket.emit(SocketEvents.Error, error.message);
        }
    }
};