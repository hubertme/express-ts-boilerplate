import { assert } from 'chai';
import { getConfig, loadConfig } from '../utils/config';

describe('Config Utility', () => {
  before(() => {
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    process.env.RATE_LIMIT_WINDOW_MS = '15000';
    process.env.RATE_LIMIT_MAX_REQUESTS = '100';
    process.env.LOG_LEVEL = 'error';
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012';
    process.env.ENCRYPTION_IV = '1234567890123456';
  });

  it('should load configuration from environment', () => {
    loadConfig();
    const config = getConfig();

    assert.equal(config.port, 4000);
    assert.equal(config.nodeEnv, 'test');
    assert.equal(config.corsOrigin, 'http://localhost:3000');
    assert.equal(config.rateLimitWindowMs, 15000);
    assert.equal(config.rateLimitMaxRequests, 100);
    assert.equal(config.logLevel, 'error');
    assert.equal(config.encryptionKey, '12345678901234567890123456789012');
    assert.equal(config.encryptionIv, '1234567890123456');
  });

  it('should use default values when environment variables are not set', () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGIN;
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX_REQUESTS;
    delete process.env.LOG_LEVEL;

    loadConfig();
    const config = getConfig();

    assert.equal(config.port, 34342);
    assert.equal(config.nodeEnv, 'development');
    assert.equal(config.corsOrigin, '*');
    assert.equal(config.rateLimitWindowMs, 900000);
    assert.equal(config.rateLimitMaxRequests, 100);
    assert.equal(config.logLevel, 'info');
  });
});
