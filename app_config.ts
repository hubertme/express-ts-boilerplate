import { resolve } from "path";
import { config } from "dotenv";
import { Express } from "express";
import indexRouter from "./src/index/index_router";
import { getConfig } from "./utils/config";

export default class AppConfig {
    private static app: Express;

    public static initDependencies(app: Express): void {
        this.app = app;
        this.registerRoutes();
        this.setupEnvironments();
    }

    private static setupEnvironments(): void {
        const appConfig = getConfig();
        const envPath = resolve(__dirname, `./envs/.${appConfig.nodeEnv}.env`);
        config({ path: envPath });
    }

    private static registerRoutes(): void {
        this.app.use('/', indexRouter);
    }
}
