process.env.NODE_ENV = 'test';
const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');

describe('Adrenaline Energy Store — Backend Core Telemetry Suite', () => {

  describe('1. Health & Observability Endpoints', () => {
    it('GET /health returns 200 with OPTIMAL_READY', async () => {
      const res = await request(app).get('/health');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'OPTIMAL_READY');
      assert.strictEqual(res.body.service, 'adrenaline-backend');
    });

    it('GET /api/cache/stats returns cache metrics', async () => {
      const res = await request(app).get('/api/cache/stats');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok('hits' in res.body.stats);
      assert.ok('misses' in res.body.stats);
    });
  });

  describe('2. Security & Auth Guardrails', () => {
    it('POST /api/auth/login rejects request with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('GET /api/orders rejects unauthorized access without JWT token', async () => {
      const res = await request(app).get('/api/orders');
      assert.strictEqual(res.statusCode, 401);
      assert.ok('error' in res.body);
    });

    it('POST /api/orders/checkout rejects unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/orders/checkout')
        .send({ items: [{ id: 'cran', cartQuantity: 1 }] });
      assert.strictEqual(res.statusCode, 401);
    });
  });

  describe('3. AI Shopping Copilot & Tool Calling Engine', () => {
    it('POST /api/ai/chat returns helpful response and searches policies', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'What is your shipping policy and delivery speed?' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.toolCalled, 'searchStorePolicies');
      assert.ok(res.body.reply.includes('Adrenaline delivers worldwide'));
    });

    it('POST /api/ai/chat handles order tracking without authentication safely', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'Where is my order?' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.requiresAuth, true);
      assert.ok(res.body.reply.includes('authenticate into your Driver Profile'));
    });

    it('POST /api/ai/chat validates empty message payload', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: '   ' });
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('POST /api/ai/chat handles product comparison via tool', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'Compare cranberry and peach water drinks' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.toolCalled, 'compareProducts');
      assert.ok(res.body.data && res.body.data.comparison);
    });
  });

});
