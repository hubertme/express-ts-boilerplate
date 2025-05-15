import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file'; // Correct import
import AppConfig, { AppConfigType } from '../app_config'; // Import AppConfig class for its static methods and AppConfigType for type annotations

const config: AppConfigType = AppConfig.getConfig(); // Use static method

// Define sensitive keys to redact
const SENSITIVE_KEYS = ['password', 'token', 'apiKey', 'secretKey', 'encryptionKey', 'encryptionIv', 'authorization'];

// Custom format to redact sensitive information
const redactFormat = winston.format((info) => {
  const newInfo = { ...info };

  function redact(obj: any): any { // Added return type annotation
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(redact);
    }

    const redactedObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
          redactedObj[key] = '********';
        } else if (typeof obj[key] === 'string' && key.toLowerCase().includes('token')) { // Broader check for token in key name
          redactedObj[key] = '********';
        }
        else {
          redactedObj[key] = redact(obj[key]);
        }
      }
    }
    return redactedObj;
  }

  if (newInfo.message && typeof newInfo.message === 'object') {
    newInfo.message = redact(newInfo.message);
  }
  if (newInfo.meta && typeof newInfo.meta === 'object') {
    newInfo.meta = redact(newInfo.meta);
  }
  // Redact top-level keys in the info object as well, if they are objects
  // For example, if extra data is logged directly like logger.info('message', { user: { password: '...' }})
  Object.keys(newInfo).forEach(key => {
    if (typeof newInfo[key] === 'object' && newInfo[key] !== null) {
      newInfo[key] = redact(newInfo[key]);
    } else if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        newInfo[key] = '********';
    } else if (typeof newInfo[key] === 'string' && key.toLowerCase().includes('token')) {
        newInfo[key] = '********';
    }
  });


  return newInfo;
});


const transports: winston.transport[] = [
  new DailyRotateFile({ // Corrected instantiation
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: config.logLevel,
  }),
];

if (config.nodeEnv !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: config.logLevel,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    redactFormat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' }, // TODO: Make service name configurable
  transports: transports,
  exitOnError: false, // do not exit on handled exceptions
});

// Stream for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
}; 