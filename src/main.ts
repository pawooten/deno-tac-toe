import express from "npm:express";
import { initialize } from "./express-server.ts";

const port = 8000;
const app: express.Express = express();
initialize(app, port, console);
