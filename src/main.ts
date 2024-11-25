import express from "npm:express";
import { createServer } from "node:http";
import { ServerInitializer } from "./server-initializer.ts";
import { getServerConfig } from "./utilities/server-config-validator.ts";

const config = getServerConfig();
const app: express.Express = express();
const server = createServer(app);
const serverInitializer = new ServerInitializer(config, console);
serverInitializer.initialize(app, server);