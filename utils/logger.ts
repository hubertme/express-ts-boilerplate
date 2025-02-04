import winston from 'winston';
import fs from 'fs';
import path from 'path';

export class LoggerService {
  private static instance: winston.Logger | null = null;
  private static readonly logsDir = path.join(process.cwd(), 'logs');

  public static getInstance(): winston.Logger {
    if (!this.instance) {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }

      this.instance = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          }),
          new winston.transports.File({ 
            filename: path.join(this.logsDir, 'error.log'), 
            level: 'error'
          }),
          new winston.transports.File({ 
            filename: path.join(this.logsDir, 'combined.log')
          })
        ]
      });
    }
    return this.instance;
  }

  public static async reset(): Promise<void> {
    if (this.instance) {
      const transports = this.instance.transports;
      for (const t of Object.values(transports)) {
        await new Promise<void>((resolve) => {
          t.on('finish', resolve);
          t.end();
        });
      }
      this.instance = null;
    }
    if (fs.existsSync(this.logsDir)) {
      fs.rmSync(this.logsDir, { recursive: true, force: true });
    }
  }
}

export const logger = LoggerService.getInstance();
