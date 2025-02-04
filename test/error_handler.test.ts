import { assert } from 'chai';
import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler } from '../utils/error_handler';

describe('Error Handler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFn: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: function(code: number) { return this as Response; },
      json: function(data: any) { return this as Response; }
    } as Partial<Response>;
    nextFn = () => {};

    // Spy on methods
    const originalStatus = mockRes.status;
    const originalJson = mockRes.json;
    
    mockRes.status = function(code: number) {
      (this as any).statusCode = code;
      return this as Response;
    };
    mockRes.json = function(data: any) {
      (this as any).body = data;
      return this as Response;
    };
  });

  it('should handle AppError correctly', () => {
    const error = new AppError(400, 'Bad Request');
    errorHandler(error, mockReq as Request, mockRes as Response, nextFn);

    assert.equal((mockRes as any).statusCode, 400);
    assert.deepEqual((mockRes as any).body, {
      status: 'error',
      message: 'Bad Request',
      isOperational: true
    });
  });

  it('should handle unknown errors as 500', () => {
    const error = new Error('Unknown error');
    errorHandler(error, mockReq as Request, mockRes as Response, nextFn);

    assert.equal((mockRes as any).statusCode, 500);
    assert.deepEqual((mockRes as any).body, {
      status: 'error',
      message: 'Internal server error'
    });
  });

  it('should create AppError with custom properties', () => {
    const error = new AppError(403, 'Forbidden', false);
    
    assert.equal(error.statusCode, 403);
    assert.equal(error.message, 'Forbidden');
    assert.equal(error.isOperational, false);
  });
});
