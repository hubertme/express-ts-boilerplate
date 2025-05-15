#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import http from 'http';
// Import AppConfig class for its static methods and AppConfigType for type annotations
import AppConfig, { AppConfigType } from '../src/app_config'; 
import { logger } from '../src/utils/logger';

// Ensure configuration is loaded before accessing it, if not already done in app.ts
// AppConfig.loadConfiguration(); // Typically called in app.ts already
const config: AppConfigType = AppConfig.getConfig();

const port = normalizePort(config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string | number): number | string | boolean {
  const portNum = typeof val === 'string' ? parseInt(val, 10) : val;

  if (isNaN(portNum)) {
    return val;
  }

  if (portNum >= 0) {
    return portNum;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : addr ? 'port ' + addr.port : 'unknown port';
  logger.info('Listening on ' + bind);

  console.log('Server is running on PORT:', port);
}

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { message: error.message, stack: error.stack });
  // It's often recommended to exit the process gracefully after an uncaught exception
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  // Optionally, exit or take other actions
  process.exit(1);
});
