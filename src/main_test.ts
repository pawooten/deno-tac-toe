import { assertEquals, assertNotEquals } from "@std/assert";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.15.2/mod.ts";
import Express from "npm:express";

import { initializeExpress } from "./express-server.ts";
import { ErrorMessages, LoggedMessages } from "./messages.ts";

//#region Port Tests
Deno.test(function initializeExpress_portTooLow() {
  let server;
  try {
    const app = new Express();
    const badPort = 0;
    server = initializeExpress(app, badPort, console);
  } catch (e) {
    assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
    assertEquals(server, undefined);
  }
});
Deno.test(function initializeExpress_portTooHigh() {
  let server;
  try {
    const app = new Express();
    const badPort = 65536;
    initializeExpress(app, badPort, console);
  } catch (e) {
    assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
    assertEquals(server, undefined);
  }
});
Deno.test(function initializeExpress_logsServerRunningWithSpecifiedPort() {
  // Verify initializeExpress() logs server running message with specified port
  const app = new Express();
  const port = 8000;
  const spyConsoleLog = spy(console, "log");
  const server = initializeExpress(app, port, console);
  server.close();
  const expectedLoggedMessage = `${LoggedMessages.ServerRunning}${port}`;
  assertSpyCall(spyConsoleLog, 0, { args: [expectedLoggedMessage] });
  assertNotEquals(server, undefined);
});
Deno.test(function initializeExpress_listensToSpecifiedPort() {
  // Verify initializeExpress() calls listen() with specified port and returns server instance returned by listen()
  const app = new Express();
  const port = 8000;
  const spyAppListen = spy(app, "listen");
  const server = initializeExpress(app, port, console);
  server.close();
  assertSpyCall(spyAppListen, 0, { args: [port], returned: server });
});
//#endregion
