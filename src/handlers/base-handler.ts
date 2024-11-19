import { Socket } from "npm:socket.io";

export abstract class BaseHandler {
    protected readonly socket:Socket;
    constructor(socket: Socket) {
        this.socket = socket;
    }
    // deno-lint-ignore no-explicit-any
    public abstract handle(...args: any[]): void;
};