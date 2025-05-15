import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import AppConfig, { AppConfigType } from '../src/app_config';
import express from 'express';

const config: AppConfigType = AppConfig.getConfig();

export const applySecurityMiddleware = (app: express.Express) => {
  if (config.helmetEnabled) {
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    }));
    console.log('Helmet (including CSP) initialized.');
  } else {
    console.log('Helmet (including CSP) is DISABLED by config.');
  }

  if (config.corsEnabled) {
    const corsOptions: cors.CorsOptions = {
      origin: config.corsOrigin === undefined ? false : config.corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));
    console.log('CORS initialized with origin:', corsOptions.origin);
  } else {
    console.log('CORS is DISABLED by config.');
  }

  if (config.rateLimitEnabled) {
    app.use(rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMaxRequests
    }));
    console.log('Rate limiting initialized.');
  } else {
    console.log('Rate limiting is DISABLED by config.');
  }
};

// Old export (array of middlewares) - can be removed or kept if direct use is needed elsewhere, but applySecurityMiddleware is preferred.
export const securityMiddleware = [
  // This structure is no longer ideal for conditional application.
  // The applySecurityMiddleware function should be used instead.
];
