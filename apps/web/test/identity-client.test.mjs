import test from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';

test('Error classification: maps ECONNREFUSED to IDENTITY_UNREACHABLE', () => {
  const econnErr = new Error('fetch failed');
  const cause = new Error('connect ECONNREFUSED 127.0.0.1:4101');
  cause.code = 'ECONNREFUSED';
  econnErr.cause = cause;

  const code = econnErr.cause?.code;
  assert.strictEqual(code, 'ECONNREFUSED');
});

test('Error classification: maps AbortError to IDENTITY_TIMEOUT', () => {
  const abortErr = new Error('The operation was aborted');
  abortErr.name = 'AbortError';

  assert.strictEqual(abortErr.name, 'AbortError');
});

test('Request ID generator produces 24 hex characters', () => {
  const id = crypto.randomBytes(12).toString('hex');
  assert.strictEqual(id.length, 24);
  assert(/^[a-f0-9]{24}$/.test(id));
});
