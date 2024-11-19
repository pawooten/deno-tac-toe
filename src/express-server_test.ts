import { createServer } from 'node:http';
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.15.2/mod.ts";
import express from "npm:express";
import { Server as SocketServer } from "npm:socket.io";
import { LoggedMessages } from "./constants/messages.ts";
import { SocketConstants } from "./constants/socket-constants.ts";
import { ServerInitializer, staticRequestHandler } from "./server-initializer.ts";
const config = { hostName: "localhost", port: 8000 };
const spyConsoleLog = spy(console, "log");

//#region Port Tests
Deno.test(function initializeExpress_logsServerRunningWithSpecifiedPort() {
  // Verify initializeExpress() logs server running message with specified port
  const app = new express();
  const server = createServer(app);
  const config = { hostName: 'localhost', port: 8000 };
  const initializer = new ServerInitializer(config, console);
  initializer.initialize(app, server);
  server.close();
  assertSpyCall(spyConsoleLog, 0, { args: [LoggedMessages.WebSocketServerInitialized ] });
  const expectedLoggedMessage = `${LoggedMessages.ServerRunning}http://${config.hostName}:${config.port}`;
  assertSpyCall(spyConsoleLog, 1, { args: [expectedLoggedMessage] });
});
Deno.test(function initializeExpress_listensToSpecifiedPort() {
  // Verify initializeExpress() calls listen() with specified port and returns server instance returned by listen()
  const app = new express();
  const server = createServer(app);
  const spyServerListen = spy(server, "listen");
  const config = { hostName: 'localhost', port: 8000 };
  const initializer = new ServerInitializer(config, console);
  initializer.initialize(app, server);
  server.close();
  assertSpyCall(spyServerListen, 0, { args: [config.port, config.hostName] });
});
//#endregion

//#region Static File Tests
Deno.test(function initializeExpress_servesStaticFiles() {
  // Verify initializeExpress() calls use() with static handler
  const app = new express();
  const server = createServer(app);
  const spyAppUse = spy(app, "use");
  const initializer = new ServerInitializer(config, console);
  initializer.initialize(app, server);
  server.close();
  assertSpyCall(spyAppUse, 0, { args: [staticRequestHandler] });
});
//#endregion

//#region WebSocket Tests
// Deno.test(function initializeWebSocketServer_logsWebServerInitialized() {
//   const app = new express();
//   const server = createServer(app);
//   const socketServer = new SocketServer(server, { serveClient: false });
//   initializeWebSocketServer(socketServer, console);
//   const initializer = new ServerInitializer(config, console);
//   initializer.initialize(app, server);
//   server.close();
//   assertSpyCall(spyConsoleLog, 0, { args: [LoggedMessages.WebSocketServerInitialized] });
// });
// Deno.test(function initializeWebSocketServer_bindsToConnectionEvent() {
//   const app = new express();
//   const server = createServer(app);
//   const socketServer = new SocketServer(server, { serveClient: false });
//   const spySocketServerOn = spy(socketServer, "on");
//   initializeWebSocketServer(socketServer, console);
//   server.close();
//   assertSpyCall(spySocketServerOn, 0, { args: [SocketConstants.Connection, socketConnectionHandler] });
// });
// //#endregion