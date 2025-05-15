import { Express } from "express";
import mainRouter from "./index/index_router";
import dotenv from 'dotenv-safe';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = '3000';
const CORS_ORIGIN = undefined;
const RATE_LIMIT_WINDOW_MS = '900000';
const RATE_LIMIT_MAX_REQUESTS = '100';
const LOG_LEVEL = 'info';
const ENCRYPTION_KEY = '';
const ENCRYPTION_IV = '';
const CSRF_SECRET = 'this-is-a-default-secret-32-ch'; // IMPORTANT: Replace in production!

// Control Constans
const CSRF_ENABLED: boolean = false;
const CORS_ENABLED: boolean = true;
const HELMET_ENABLED: boolean = true;
const RATE_LIMIT_ENABLED: boolean = true;

export interface AppConfigType {
  port: number;
  nodeEnv: string;
  corsOrigin?: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  encryptionKey: string;
  encryptionIv: string;
  csrfSecret: string;
  csrfEnabled: boolean;
  corsEnabled: boolean;
  helmetEnabled: boolean;
  rateLimitEnabled: boolean;
}

export default class AppConfig {
    private static app: Express;
    private static config: AppConfigType;

    /**
     * Loads environment variables and initializes the configuration.
     * This should be called once at the beginning of the application startup.
     */
    public static loadConfig(): void {
        dotenv.config({
            path: path.resolve(__dirname, `../../envs/.${NODE_ENV}.env`),
            example: path.resolve(__dirname, '../../envs/.example.env'),
            allowEmptyValues: true
        });

        // Initialize and cache the configuration object
        this.config = {
            port: parseInt(process.env.PORT || PORT, 10),
            nodeEnv: NODE_ENV,
            corsOrigin: process.env.CORS_ORIGIN || CORS_ORIGIN,
            rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || RATE_LIMIT_WINDOW_MS, 10),
            rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || RATE_LIMIT_MAX_REQUESTS, 10),
            logLevel: process.env.LOG_LEVEL || LOG_LEVEL,
            encryptionKey: process.env.ENCRYPTION_KEY || ENCRYPTION_KEY,
            encryptionIv: process.env.ENCRYPTION_IV || ENCRYPTION_IV,
            csrfSecret: process.env.CSRF_SECRET || CSRF_SECRET,
            csrfEnabled: CSRF_ENABLED,
            corsEnabled: CORS_ENABLED,
            helmetEnabled: HELMET_ENABLED,
            rateLimitEnabled: RATE_LIMIT_ENABLED,
        };
    }

    /**
     * Returns the cached application configuration.
     * Ensure loadConfiguration() has been called before this.
     * @returns {AppConfigType} The application configuration object.
     */
    public static getConfig(): AppConfigType {
        if (!this.config) {
            // This is a fallback, ideally loadConfiguration should be called explicitly at startup.
            console.warn("AppConfig.getConfig() called before loadConfiguration(). Loading config now, but explicit call at startup is recommended.");
            this.loadConfig();
        }
        return this.config;
    }

    public static initDependencies(app: Express): void {
        this.app = app;
        this.registerRoutes();
    }

    private static registerRoutes(): void {
        this.app.use('/', mainRouter);
    }
} 