import { assertEquals } from "@std/assert";
import Express from "npm:express";

import { initializeExpress } from "./express-server.ts";
import { ErrorMessages } from "./error-messages.ts";

//#region Port Tests
Deno.test(function initializeExpress_portTooLow() {
  try {
    const app = new Express();
    const badPort = 0;
    initializeExpress(app, badPort, console);
  } catch (e) {
    assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
  }
});
Deno.test(function initializeExpress_portTooHigh() {
  try {
    const app = new Express();
    const badPort = 65536;
    initializeExpress(app, badPort, console);
  } catch (e) {
    assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
  }
});
//#endregion
