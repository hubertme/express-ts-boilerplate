import AppConfig from "./app_config";

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// Setup all modules
import { loadConfig, getConfig } from './utils/config';
loadConfig();
const config = getConfig();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Import security middleware
import { securityMiddleware } from './middlewares/security';
// Apply security middleware
app.use(securityMiddleware);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes registration
AppConfig.initDependencies(app);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(404));
});

// Import error handler
import { errorHandler } from './utils/error_handler';

// error handler - must be last middleware
app.use(errorHandler);

export default app;
