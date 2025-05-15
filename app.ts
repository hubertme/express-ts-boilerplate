import AppConfig, { AppConfigType } from "./src/app_config";
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
const connectCSRF = require('tiny-csrf'); // Using require as a workaround for type issues
import morgan from 'morgan';
// Import AppConfigType for type annotations if needed, and the AppConfig class for its static methods
import { applySecurityMiddleware } from './middlewares/security';
import { logRequest } from './middlewares/request_logging';
import { errorHandler } from './src/utils/error_handler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/swagger_config'; // Import the generated spec

// Load configuration once at the very start
AppConfig.loadConfig();
const config: AppConfigType = AppConfig.getConfig(); // Now AppConfig.getConfig()

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// --- Swagger UI Setup ---
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true, // Adds a search bar
  // You can customize the UI options here
  // customCss: '.swagger-ui .topbar { display: none }' // Example: hide the top bar
}));

// Apply core security middleware (Helmet, CORS, Rate Limiting) based on config
// applySecurityMiddleware will internally call AppConfig.getConfig()
applySecurityMiddleware(app);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Initialize cookie-parser. Pass secret if CSRF is enabled, as tiny-csrf might need it for signed cookies.
// If CSRF is disabled, the secret is not strictly necessary here but doesn't harm.
app.use(cookieParser(config.csrfEnabled ? config.csrfSecret : undefined)); 

// Custom request logging
app.use(logRequest);

// CSRF Protection (conditionally applied)
if (config.csrfEnabled) {
  app.use(connectCSRF(config.csrfSecret));
  console.log('CSRF protection (tiny-csrf) initialized.');

  // Middleware to make CSRF token available to views
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken();
    } else {
      console.warn('req.csrfToken() is not available. CSRF token will not be set in locals.');
      res.locals.csrfToken = ''; 
    }
    next();
  });
} else {
  // If CSRF is disabled, ensure res.locals.csrfToken is still defined for view compatibility, but empty.
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.csrfToken = ''; 
    next();
  });
  console.log('CSRF protection (tiny-csrf) is DISABLED by config.');
}

app.use(express.static(path.join(__dirname, 'public')));

// Routes registration
AppConfig.initDependencies(app);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(404));
});

// Global error handler - must be last middleware
app.use(errorHandler);

export default app;
