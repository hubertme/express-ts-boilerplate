import { expect } from 'chai';
import AppConfig, { AppConfigType } from '../src/app_config';

describe('Config Tests', () => {
  before(() => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '9999';
    process.env.CORS_ORIGIN = 'http://localhost:3000';
    process.env.RATE_LIMIT_WINDOW_MS = '15000';
    process.env.RATE_LIMIT_MAX_REQUESTS = '100';
    process.env.LOG_LEVEL = 'error';
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012';
    process.env.ENCRYPTION_IV = '1234567890123456';
    AppConfig.loadConfig();
  });

  it('should load configuration and reflect test environment variables', () => {
    const config: AppConfigType = AppConfig.getConfig();
    expect(config).to.exist;
    expect(config.nodeEnv).to.equal('test');
    expect(config.port).to.equal(9999);
    expect(config.csrfEnabled).to.be.oneOf([true, false]);
  });

  it('should return default values if environment variables are not set (for env-dependent ones)', () => {
    delete process.env.LOG_LEVEL;
    AppConfig.loadConfig();
    const config: AppConfigType = AppConfig.getConfig();
    
    expect(config.logLevel).to.equal('info');
  });

  after(() => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.LOG_LEVEL;
    AppConfig.loadConfig();
  });
});
