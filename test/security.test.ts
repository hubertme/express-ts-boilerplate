import { assert } from 'chai';
import express from 'express';
import request from 'supertest';
import { securityMiddleware } from '../middlewares/security';

describe('Security Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(securityMiddleware);
    app.get('/test', (_req, res) => {
      res.json({ message: 'test' });
    });
  });

  it('should set security headers', async () => {
    const response = await request(app)
      .get('/test')
      .expect(200);

    assert.exists(response.headers['x-frame-options']);
    assert.exists(response.headers['x-content-type-options']);
    assert.exists(response.headers['x-xss-protection']);
  });

  it('should handle CORS', async () => {
    const response = await request(app)
      .options('/test')
      .expect(204);

    assert.exists(response.headers['access-control-allow-origin']);
    assert.exists(response.headers['access-control-allow-methods']);
    assert.exists(response.headers['access-control-allow-headers']);
  });

  it('should implement rate limiting', async () => {
    const requests = Array(101).fill(null);
    for (const _ of requests) {
      await request(app).get('/test');
    }

    const response = await request(app)
      .get('/test')
      .expect(429);

    assert.exists(response.headers['retry-after']);
  });
});
