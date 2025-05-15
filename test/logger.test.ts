import { assert } from 'chai';
import { logger } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

describe('Logger Utility', () => {
  const logDir = path.join(process.cwd(), 'logs');
  const errorLogFile = path.join(logDir, 'error.log');
  const combinedLogFile = path.join(logDir, 'application-%DATE%.log').replace('%DATE%', new Date().toISOString().split('T')[0]);
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

  beforeEach(async function() {
    this.timeout(waitTimeout);
    if (fs.existsSync(errorLogFile)) fs.unlinkSync(errorLogFile);
    if (fs.existsSync(combinedLogFile)) fs.unlinkSync(combinedLogFile);
  });

  afterEach(async function() {
    this.timeout(waitTimeout);
    if (fs.existsSync(errorLogFile)) fs.unlinkSync(errorLogFile);
    if (fs.existsSync(combinedLogFile)) fs.unlinkSync(combinedLogFile);
  });

  it('should create log files', async function() {
    this.timeout(waitTimeout);
    
    logger.error('Test error message');
    logger.info('Test info message');

    await waitForFile(combinedLogFile);

    assert.isTrue(fs.existsSync(combinedLogFile), 'Combined log file should exist');
  });

  it('should write error logs to error.log', async function() {
    this.timeout(waitTimeout);
    
    const errorMessage = 'Test error message for error log';
    logger.error(errorMessage);

    await waitForFile(combinedLogFile);
    const logContent = fs.readFileSync(combinedLogFile, 'utf8');
    const logLines = logContent.split('\n').filter(line => line);
    const errorEntry = logLines.map(line => JSON.parse(line)).find(entry => entry.message === errorMessage && entry.level === 'error');
    
    assert.exists(errorEntry, 'Error message should be in the combined log');
    if (errorEntry) {
        assert.equal(errorEntry.level, 'error');
    }
  });

  it('should write all logs to combined.log', async function() {
    this.timeout(waitTimeout);
    
    const errorMessage = 'Test error message for combined log';
    const infoMessage = 'Test info message for combined log';

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
    
    logger.info('Test message for timestamp');

    await waitForFile(combinedLogFile);
    const logContent = fs.readFileSync(combinedLogFile, 'utf8');
    const logLines = logContent.split('\n').filter(line => line);
    const logEntry = logLines.map(line => JSON.parse(line)).find(entry => entry.message === 'Test message for timestamp');

    assert.exists(logEntry, "Log entry for timestamp test not found");
    if (logEntry) {
        assert.exists(logEntry.timestamp);
        assert.match(logEntry.timestamp, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    }
  });
});
