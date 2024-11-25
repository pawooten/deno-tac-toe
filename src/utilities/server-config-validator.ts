import { ServerConfig } from "../server-config.ts";
import { ErrorMessages } from "../constants/messages.ts";
import { ServerConstants } from "../constants/server-constants.ts";

export const validateServerConfig = (config: ServerConfig): void => {
    if (!config) {
        throw new Error(ErrorMessages.NoServerConfigSpecified);
      }
      if (config.port && (config.port < ServerConstants.minPort || config.port > ServerConstants.maxPort)) {
          throw new Error(ErrorMessages.InvalidPortSpecified);
      }
      if (config.hostName === '') {
        throw new Error(ErrorMessages.InvalidHostnameSpecified);
      }
}
export const getServerConfig = (): ServerConfig => {
    const hostName = Deno.env.get("HOSTNAME") || "localhost";
    let port = undefined;
    const envPort = Deno.env.get("PORT");
    if (envPort) {
      port = +envPort;
    }
    return { hostName, port };
}