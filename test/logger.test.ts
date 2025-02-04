import { assert } from 'chai';
import { LoggerService } from '../utils/logger';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

describe('Logger Utility', () => {
  const logDir = path.join(process.cwd(), 'logs');
  const errorLogFile = path.join(logDir, 'error.log');
  const combinedLogFile = path.join(logDir, 'combined.log');
  const waitTimeout = 10000;

  const waitForFile = async (filePath: string, timeout = waitTimeout): Promise<boolean> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (fs.existsSync(filePath)) {
        // Wait for file to be fully written
        const initialSize = fs.statSync(filePath).size;
        await new Promise(resolve => setTimeout(resolve, 500));
        const finalSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
        
        if (finalSize > 0 && finalSize === initialSize) {
          return true;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Timeout waiting for file: ${filePath}`);
  };

  let logger: winston.Logger;

  beforeEach(async function() {
    this.timeout(waitTimeout);
    await LoggerService.reset();
    logger = LoggerService.getInstance();
  });

  afterEach(async function() {
    this.timeout(waitTimeout);
    await LoggerService.reset();
  });

  it('should create log files', async function() {
    this.timeout(waitTimeout);
    
    logger.error('Test error message');
    logger.info('Test info message');

    await waitForFile(errorLogFile);
    await waitForFile(combinedLogFile);

    assert.isTrue(fs.existsSync(errorLogFile), 'Error log file should exist');
    assert.isTrue(fs.existsSync(combinedLogFile), 'Combined log file should exist');
  });

  it('should write error logs to error.log', async function() {
    this.timeout(waitTimeout);
    
    const errorMessage = 'Test error message';
    logger.error(errorMessage);

    await waitForFile(errorLogFile);
    const logContent = fs.readFileSync(errorLogFile, 'utf8');
    const logEntry = JSON.parse(logContent.split('\n')[0]);
    
    assert.include(logEntry.message, errorMessage);
    assert.equal(logEntry.level, 'error');
  });

  it('should write all logs to combined.log', async function() {
    this.timeout(waitTimeout);
    
    const errorMessage = 'Test error message';
    const infoMessage = 'Test info message';

    logger.error(errorMessage);
    logger.info(infoMessage);

    await waitForFile(combinedLogFile);
    const logContent = fs.readFileSync(combinedLogFile, 'utf8');
    const logLines = logContent.split('\n').filter(line => line);
    const logEntries = logLines.map(line => JSON.parse(line));

    assert.isTrue(logEntries.some(entry => entry.message === errorMessage && entry.level === 'error'));
    assert.isTrue(logEntries.some(entry => entry.message === infoMessage && entry.level === 'info'));
  });

  it('should include timestamp in logs', async function() {
    this.timeout(waitTimeout);
    
    logger.info('Test message');

    await waitForFile(combinedLogFile);
    const logContent = fs.readFileSync(combinedLogFile, 'utf8');
    const logEntry = JSON.parse(logContent.split('\n')[0]);
    
    assert.exists(logEntry.timestamp);
    assert.match(logEntry.timestamp, /^\d{4}-\d{2}-\d{2}/);
  });
});
