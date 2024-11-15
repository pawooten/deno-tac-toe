import { Express, Request, Response } from "npm:express";
import { ErrorMessages } from "./error-messages.ts";

export const initializeExpress = (app: Express, port: number, console: Console) => {
    if (port < 1 || port > 65535) {
        throw new Error(ErrorMessages.InvalidPortSpecified);
    }
    app.get("/", (_req: Request, res: Response) => {
        res.send("Hello World!");
      });
      app.listen(port);
      console.log(`Server running on http://localhost:${port}`);
};