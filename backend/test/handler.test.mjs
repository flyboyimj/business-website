/**
 * Backend tests. Run with: npm test   (uses Node's built-in test runner)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../src/contact/handler.mjs';

const env = { TO_EMAIL: 'owner@example.com', FROM_EMAIL: 'website@example.com', ALLOWED_ORIGINS: 'https://www.example.com' };
const good = {
  name: 'Pat Doe',
  company: 'Doe Builders',
  email: 'pat@doebuilders.com',
  phone: '',
  location: 'League City',
  service: 'Structured Network Cabling',
  timeline: '1 to 3 months',
  description: 'Twenty drops for a new office suite with one rack.',
  requestType: 'Site walk request',
  website: '',
};
const event = (body, origin = 'https://www.example.com') => ({
  requestContext: { http: { method: 'POST' } },
  headers: { Origin: origin },
  body: JSON.stringify(body),
});

test('sends email and returns ok only after SES accepts', async () => {
  const sent = [];
  const handler = createHandler({ env, send: async (m) => sent.push(m) });
  const res = await handler(event(good));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { ok: true });
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].ReplyToAddresses, ['pat@doebuilders.com']);
  assert.match(sent[0].Content.Simple.Subject.Data, /Doe Builders/);
});

test('returns an error, not ok, when SES fails', async () => {
  const handler = createHandler({ env, send: async () => { throw new Error('boom'); } });
  const res = await handler(event(good));
  assert.equal(res.statusCode, 502);
  assert.equal(JSON.parse(res.body).ok, false);
});

test('returns field errors for invalid input', async () => {
  const handler = createHandler({ env, send: async () => assert.fail('should not send') });
  const res = await handler(event({ ...good, email: 'nope', description: 'short' }));
  assert.equal(res.statusCode, 400);
  const body = JSON.parse(res.body);
  assert.ok(body.errors.email);
  assert.ok(body.errors.description);
});

test('rejects other origins', async () => {
  const handler = createHandler({ env, send: async () => assert.fail('should not send') });
  const res = await handler(event(good, 'https://evil.example'));
  assert.equal(res.statusCode, 403);
});

test('discards honeypot submissions without sending', async () => {
  const handler = createHandler({ env, send: async () => assert.fail('should not send') });
  const res = await handler(event({ ...good, website: 'http://spam' }));
  assert.equal(res.statusCode, 200);
});

test('strips line breaks from single-line fields', async () => {
  const sent = [];
  const handler = createHandler({ env, send: async (m) => sent.push(m) });
  await handler(event({ ...good, company: 'Acme\r\nBcc: x@y.com' }));
  assert.doesNotMatch(sent[0].Content.Simple.Subject.Data, /[\r\n]/);
});

test('fails clearly when email settings are missing', async () => {
  const handler = createHandler({ env: { ALLOWED_ORIGINS: env.ALLOWED_ORIGINS }, send: async () => {} });
  const res = await handler(event(good));
  assert.equal(res.statusCode, 500);
});
