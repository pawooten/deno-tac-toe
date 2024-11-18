import express from "npm:express";
import { createServer } from "node:http";
import { initialize } from "./express-server.ts";

const port = 8000;
const app: express.Express = express();
const server = createServer(app);
initialize(app, server, port, console);
