import express, { Express } from "npm:express";
import { initializeExpress } from "./express-server.ts";

const port = 8000;
const app: Express = express();
initializeExpress(app, port, console);
