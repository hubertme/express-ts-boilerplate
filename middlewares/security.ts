import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { getConfig } from '../utils/config';

const config = getConfig();

export const securityMiddleware = [
  helmet(),
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests
  })
];
