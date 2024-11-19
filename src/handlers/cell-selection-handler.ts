import { Socket } from "npm:socket.io";
import { SocketConstants } from "../constants/socket-constants.ts";

export class CellSelectionHandler {
    private readonly socket:Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }

    public handle(selectedCell: string): void {
        console.log(`User selected cell: ${selectedCell}`);
        this.socket.emit(SocketConstants.CellMarked, selectedCell, 'X');
    }
};