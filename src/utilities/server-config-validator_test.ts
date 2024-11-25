import { assertEquals } from "@std/assert";
import { ErrorMessages } from "../constants/messages.ts";
import { ServerConfig } from "../server-config.ts";
import { validateServerConfig } from "./server-config-validator.ts";

//#region Port Tests
Deno.test(function validateServerConfig_portTooLow() {
    try {
        const badConfig = { hostName: 'localhost', port: 0 };
        validateServerConfig(badConfig);
    } catch (e) {
        assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
    }
});
Deno.test(function validateServerConfig_portTooHigh() {
    try {
        const badConfig = { hostName: 'localhost', port: 65536 };
        validateServerConfig(badConfig);
    } catch (e) {
        assertEquals(e.message, ErrorMessages.InvalidPortSpecified);
    }
});
//#endregion
//#region Hostname Tests
Deno.test(function validateServerConfig_noConfig() {
    try {
        validateServerConfig(undefined as unknown as ServerConfig );
    } catch (e) {
        assertEquals(e.message, ErrorMessages.NoServerConfigSpecified);
    }
});
Deno.test(function validateServerConfig_invalidHostname() {
    try {
        const badConfig = { hostName: '', port: 8000 };
        validateServerConfig(badConfig );
    } catch (e) {
        assertEquals(e.message, ErrorMessages.InvalidHostnameSpecified);
    }
});
//#endregion