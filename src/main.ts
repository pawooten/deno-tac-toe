import express from "npm:express";
import { createServer } from "node:http";
import { ServerInitializer } from "./server-initializer.ts";

const config = { hostName: "localhost", port: 8000 };
const app: express.Express = express();
const server = createServer(app);
const serverInitializer = new ServerInitializer(config, console);
serverInitializer.initialize(app, server);