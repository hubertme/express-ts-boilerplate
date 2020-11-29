import path from "path";
import * as dotenv from "dotenv";
import {Express} from "express";
import indexRouter from "./src/index/index_router";

export default class AppConfig {
    static readonly IS_PRODUCTION: boolean = false;
    private static app: Express;

    /**
     * Initialise all dependencies in this method
     */
    public static initDependencies(app: Express) {
        this.app = app;
        this.registerRoutes();

        this.setupEnvironments();
    }

    private static setupEnvironments() {
        const envPath = path.resolve(__dirname, `./envs/.${this.IS_PRODUCTION ? 'prod' : 'dev'}.env`);
        dotenv.config({
            path: envPath,
        });
        console.log('Test:', process.env.TEST_KEY);
    }

    private static registerRoutes() {
        this.app.use('/', indexRouter);
    }
}
