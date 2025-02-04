import dotenv from 'dotenv-safe';
import path from 'path';

export const loadConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  dotenv.config({
    path: path.resolve(__dirname, `../envs/.${nodeEnv}.env`),
    example: path.resolve(__dirname, '../envs/.example.env'),
    allowEmptyValues: true
  });
};

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  logLevel: string;
  encryptionKey: string;
  encryptionIv: string;
}

export const getConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  encryptionKey: process.env.ENCRYPTION_KEY || '',
  encryptionIv: process.env.ENCRYPTION_IV || ''
});
