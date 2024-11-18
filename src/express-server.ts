import { Server } from "node:http";
import express from "npm:express";
import { Server as SocketServer } from "npm:socket.io";

import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { ServerConstants } from "./constants/server-constants.ts";

export const initialize = (app: express.Express, server: Server, port: number, console: Console): ExpressInitializationResult => {
    if (port < 1 || port > 65535) {
        throw new Error(ErrorMessages.InvalidPortSpecified);
    }

    const staticHandler = express.static(ServerConstants.Public);
    app.use(staticHandler);
    const socketServer = new SocketServer(server, { serveClient: false });
    socketServer.on("connection", (socket) => {
    console.log("a user connected by websocket");
    socket.on('message', (message) => console.log(message));
    });
    server.listen(port);

    console.log(`${LoggedMessages.ServerRunning}${port}`);
    return { server, staticHandler };
};

export interface ExpressInitializationResult {
    server: Server,
    staticHandler: express.Handler;
}