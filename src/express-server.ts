import express, { Express } from "npm:express";
import { Server } from "npm:http";

import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";

export const initializeExpress = (app: Express, port: number, console: Console): Server => {
    if (port < 1 || port > 65535) {
        throw new Error(ErrorMessages.InvalidPortSpecified);
    }
    app.use(express.static("public"));
    const server: Server = app.listen(port);
    console.log(`${LoggedMessages.ServerRunning}${port}`);
    return server;
};