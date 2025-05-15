import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler } from '../src/utils/error_handler';
// import sinon from 'sinon'; // Comment out if not installed/configured
import { logger } from '../src/utils/logger';
import AppConfig, { AppConfigType } from '../src/app_config';

describe('Error Handler Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = () => {}; // Use a no-op or a spy if sinon is configured
  let statusStub: any;
  let jsonStub: any;
  let consoleErrorStub: any;
  let loggerErrorStub: any; // To stub logger.error without sinon for now

  before(() => {
    AppConfig.loadConfig(); // Ensure config is loaded
  });

  beforeEach(() => {
    statusStub = (code: number) => {
      return { json: jsonStub };
    };
    jsonStub = (data: any) => {}; 
    consoleErrorStub = (...args: any[]) => {}; 
    loggerErrorStub = (...args: any[]) => {}; // Simple stub for logger.error
    
    // Manually stub logger.error if sinon is not used
    (logger as any).originalError = logger.error; // Backup original
    logger.error = loggerErrorStub as any;
    
    // sinon.stub(logger, 'error'); // Stub logger.error using Sinon if available
    // sinon.stub(console, 'error').callsFake(consoleErrorStub); // Stub console.error

    mockRequest = {
      path: '/test',
      method: 'GET'
    };
    mockResponse = {
      status: statusStub,
    };
    // nextFunction = sinon.spy(); // If using sinon
    nextFunction = (() => { (nextFunction as any).called = true; }) as NextFunction; // Simple spy behavior
    (nextFunction as any).called = false; // Reset spy
  });

  afterEach(() => {
    // sinon.restore(); // Restore all sinon stubs
    if ((logger as any).originalError) { // Restore logger.error if manually stubbed
      logger.error = (logger as any).originalError;
      delete (logger as any).originalError;
    }
  });

  it('should handle AppError in development', () => {
    const originalNodeEnv = AppConfig.getConfig().nodeEnv;
    (AppConfig.getConfig() as any).nodeEnv = 'development'; 
    
    const error = new AppError(400, 'Test AppError');
    let capturedResponse: any;
    jsonStub = (data: any) => { capturedResponse = data; };
    (mockResponse as any).status = (code: number) => {
        expect(code).to.equal(400);
        return { json: jsonStub };
    };
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
    
    // Check if logger.error was called (using our simple stub)
    // This is a bit manual; sinon makes this cleaner.
    // expect((logger.error as any).calledOnce).to.be.true; // Sinon style
    expect(capturedResponse.status).to.equal('error');
    expect(capturedResponse.message).to.equal('Test AppError');
    expect((nextFunction as any).called).to.be.false; // Should not call next for AppError

    (AppConfig.getConfig() as any).nodeEnv = originalNodeEnv;
  });

  it('should handle AppError in production (generic message)', () => {
    const originalNodeEnv = AppConfig.getConfig().nodeEnv;
    (AppConfig.getConfig() as any).nodeEnv = 'production';

    const error = new AppError(500, 'Detailed Secret Error');
    let capturedResponse: any;
    jsonStub = (data: any) => { capturedResponse = data; };
    (mockResponse as any).status = (code: number) => {
        expect(code).to.equal(500);
        return { json: jsonStub };
    };
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

    expect(capturedResponse.status).to.equal('error');
    expect(capturedResponse.message).to.equal('An unexpected error occurred. Please try again later.');

    (AppConfig.getConfig() as any).nodeEnv = originalNodeEnv;
  });

  it('should handle generic errors (non-AppError)', () => {
    const error = new Error('Generic Error');
    let capturedResponse: any;
    jsonStub = (data: any) => { capturedResponse = data; };
    (mockResponse as any).status = (code: number) => {
        expect(code).to.equal(500);
        return { json: jsonStub };
    };
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
    
    expect(capturedResponse.status).to.equal('error');
    expect(capturedResponse.message).to.equal('Internal server error');
  });

});
