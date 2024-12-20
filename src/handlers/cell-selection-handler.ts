import { SocketEvents } from "../../public/constants.js";
import { getCellIndices, getGameResult, getUserMark } from "../utilities/game-state-utilities.ts";
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
                this.socket.emit(SocketEvents.Server.Error, ErrorMessages.DuplicateCellSelected);
                return;
            }
            if (currentCellValue) {
                this.socket.emit(SocketEvents.Server.Error, ErrorMessages.CellAlreadySelected);
                return;
            }
            const isHost = this.socket.id === game.host;
            const isGuest = this.socket.id === game.guest;

            if ((game.isHostTurn && !isHost) || (!game.isHostTurn && !isGuest)) {
                this.socket.emit(SocketEvents.Server.Error, ErrorMessages.NotYourTurn);
                return;
            }
            game.cells[cellRow][cellColumn] = mark;
            game.isHostTurn = !game.isHostTurn;

            const result = getGameResult(game, this.socket.id, [cellRow, cellColumn]);
            console.log(`User selected cell: ${selectedCell} game ${gameId}`);

            this.socketServer.to(gameId).emit(SocketEvents.ServerBroadcast.CellMarked, { selectedCell, mark, isHostTurn: game.isHostTurn, result });
        } catch (error) {
            this.socket.emit(SocketEvents.Server.Error, error.message);
        }
    }
};