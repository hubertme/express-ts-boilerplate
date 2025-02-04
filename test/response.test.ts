import { assert } from 'chai';
import { Response } from 'express';
import { ApiResponse } from '../utils/response';

describe('Response Utility', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: function(code: number) { return this as Response; },
      json: function(data: any) { return this as Response; },
      send: function() { return this as Response; }
    } as Partial<Response>;

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

  it('should send success response', () => {
    const data = { id: 1, name: 'test' };
    ApiResponse.success(mockRes as Response, data, 'Success message');

    assert.equal((mockRes as any).statusCode, 200);
    assert.deepEqual((mockRes as any).body, {
      status: 'success',
      message: 'Success message',
      data
    });
  });

  it('should send error response', () => {
    ApiResponse.error(mockRes as Response, 'Error message', 400);

    assert.equal((mockRes as any).statusCode, 400);
    assert.deepEqual((mockRes as any).body, {
      status: 'error',
      message: 'Error message',
      statusCode: 400
    });
  });

  it('should send created response', () => {
    const data = { id: 1 };
    ApiResponse.created(mockRes as Response, data);

    assert.equal((mockRes as any).statusCode, 201);
    assert.deepEqual((mockRes as any).body, {
      status: 'success',
      message: 'Resource created successfully',
      data
    });
  });

  it('should send no content response', () => {
    let sentStatus = 0;
    mockRes.status = function(code) {
      sentStatus = code;
      return this as Response;
    };
    mockRes.send = function() {
      return this as Response;
    };

    ApiResponse.noContent(mockRes as Response);
    assert.equal(sentStatus, 204);
  });
});
