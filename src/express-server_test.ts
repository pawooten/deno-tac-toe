import { createServer } from 'node:http';
import { assertEquals } from "@std/assert";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.15.2/mod.ts";
import express from "npm:express";

import { initialize, initializeWebSocketServer, socketConnectionHandler, staticRequestHandler } from "./express-server.ts";
import { ErrorMessages, LoggedMessages } from "./constants/messages.ts";
import { SocketConstants } from "./constants/socket-constants.ts";

//#region Port Tests
Deno.test(function initializeExpress_portTooLow() {
  try {
    const app = new express();
    const server = createServer(app);
    const badPort = 0;
    initialize(app, server, badPort, console);
  } catch (e) {
    assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
  }
});
Deno.test(function initializeExpress_portTooHigh() {
  let server;
  try {
    const app = new express();
    const server = createServer(app);
    const badPort = 65536;
    initialize(app, server, badPort, console);
  } catch (e) {
    assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
    assertEquals(server, undefined);
  }
});
Deno.test(function initializeExpress_logsServerRunningWithSpecifiedPort() {
  // Verify initializeExpress() logs server running message with specified port
  const app = new express();
  const server = createServer(app);
  const port = 8000;
  const spyConsoleLog = spy(console, "log");
  initialize(app, server, port, console);
  server.close();
  assertSpyCall(spyConsoleLog, 0, { args: [LoggedMessages.WebSocketServerInitialized ] });
  const expectedLoggedMessage = `${LoggedMessages.ServerRunning}${port}`;
  assertSpyCall(spyConsoleLog, 1, { args: [expectedLoggedMessage] });
});
Deno.test(function initializeExpress_listensToSpecifiedPort() {
  // Verify initializeExpress() calls listen() with specified port and returns server instance returned by listen()
  const app = new express();
  const server = createServer(app);
  const port = 8000;
  const spyServerListen = spy(server, "listen");
  initialize(app, server, port, console);
  server.close();
  assertSpyCall(spyServerListen, 0, { args: [port], returned: server });
});
//#endregion

//#region Static File Tests
Deno.test(function initializeExpress_servesStaticFiles() {
  // Verify initializeExpress() calls use() with static handler
  const app = new express();
  const server = createServer(app);
  const port = 8000;
  const spyAppUse = spy(app, "use");
  initialize(app, server, port, console);
  server.close();
  assertSpyCall(spyAppUse, 0, { args: [staticRequestHandler] });
});
//#endregion

//#region WebSocket Tests
Deno.test(function initializeWebSocketServer_logsWebServerInitialized() {
  const app = new express();
  const server = createServer(app);
  const spyConsoleLog = spy(console, "log");
  initializeWebSocketServer(server, console);
  server.close();
  assertSpyCall(spyConsoleLog, 0, { args: [LoggedMessages.WebSocketServerInitialized] });
});
//#endregion