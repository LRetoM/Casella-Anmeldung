import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { IServerConfig } from "../interfaces/IServerConfig.js";

const CONFIG_FILE_PATH: string = join(process.cwd(), "src/config/server.config.json");

export class ConfigService {
    private static _config: IServerConfig | undefined;

    public static getConfig(): IServerConfig {
        if (!this._config) {
            const fileContent: string = readFileSync(CONFIG_FILE_PATH, "utf-8");
            this._config = JSON.parse(fileContent) as IServerConfig;
        }
        return this._config;
    }
}
