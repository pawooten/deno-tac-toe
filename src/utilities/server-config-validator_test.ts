import { assertEquals } from "@std/assert";
import { ErrorMessages } from "../constants/messages.ts";
import { validateServerConfig } from "./server-config-validator.ts";

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