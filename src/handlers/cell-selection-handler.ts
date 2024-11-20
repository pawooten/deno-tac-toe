import { Server, Socket } from "npm:socket.io";
import { SocketConstants } from "../constants/socket-constants.ts";
import { getCellIndices, getUserMark } from "../utilities/game-state-utilities.ts";
import { BaseHandler } from "./base-handler.ts";
import { GameManager } from "../game-manager.ts";
import { ErrorMessages } from "../constants/messages.ts";

export class CellSelectionHandler extends BaseHandler {
    private socketServer: Server;

    constructor(socket: Socket, manager: GameManager, socketServer: Server | undefined) {
        super(socket, manager);
        if (!socketServer) {
            throw new Error(ErrorMessages.NoSocketServerSpecified);
        }
        this.socketServer = socketServer;
    }

    public handle(gameId: string, selectedCell: string): void {
        try {
            const game = this.manager.get(gameId);
            const mark = getUserMark(game, this.socket.id);
            const [cellRow, cellColumn] = getCellIndices(selectedCell);
            const currentCellValue = game.cells[cellRow][cellColumn];
            if (currentCellValue === mark) {
                // The cell
                this.socket.emit(SocketConstants.Error, ErrorMessages.DuplicateCellSelected);
                return;
            }
            if (currentCellValue) {
                this.socket.emit(SocketConstants.Error, ErrorMessages.CellAlreadySelected);
                return;
            }
            game.cells[cellRow][cellColumn] = mark;
            console.log(`User selected cell: ${selectedCell} game ${gameId}`);

            this.socketServer.to(gameId).emit(SocketConstants.CellMarked, selectedCell, mark);
        } catch (error) {
            this.socket.emit(SocketConstants.Error, error.message);
        }
    }
};