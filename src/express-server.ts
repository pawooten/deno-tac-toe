import express from "npm:express";
import http from "npm:http";

import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { ServerConstants } from "./constants/server-constants.ts";

export const initialize = (app: express.Express, port: number, console: Console): ExpressInitializationResult => {
    if (port < 1 || port > 65535) {
        throw new Error(ErrorMessages.InvalidPortSpecified);
    }
    const staticHandler = express.static(ServerConstants.Public)
    app.use(staticHandler);
    const server: http.Server = app.listen(port);
    console.log(`${LoggedMessages.ServerRunning}${port}`);
    return { server, staticHandler };
};

export interface ExpressInitializationResult {
    server: http.Server,
    staticHandler: express.Handler;
}