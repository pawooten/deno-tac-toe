import { Express, Request, Response } from "npm:express";
import { Server } from "npm:http";

import { ErrorMessages, LoggedMessages } from "./messages.ts";

export const initializeExpress = (app: Express, port: number, console: Console): Server => {
    if (port < 1 || port > 65535) {
        throw new Error(ErrorMessages.InvalidPortSpecified);
    }
    app.get("/", (_req: Request, res: Response) => {
        res.send("Hello World!");
    });
    const server: Server = app.listen(port);
    console.log(`${LoggedMessages.ServerRunning}${port}`);
    return server;
};