import { SocketConstants } from "../constants/socket-constants.ts";
import { BaseHandler } from "./base-handler.ts";

export class CellSelectionHandler extends BaseHandler {
    public handle(selectedCell: string): void {
        console.log(`User selected cell: ${selectedCell}`);
        this.socket.emit(SocketConstants.CellMarked, selectedCell, 'X');
    }
};