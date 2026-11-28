import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { mapS3ErrorToProblem } from '../../apps/web/src/lib/storage/errors.ts';
import { InMemoryFakeStorageAdapter } from '../../apps/web/src/lib/storage/testing/in-memory-fake.ts';

const fixtures = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'tests/fixtures/r2/s3-responses.json'), 'utf8'),
);

test('Contract: S3/R2 scrubbed fixture parsing and error mapping', () => {
  assert.equal(fixtures.headObject.status, 200);
  assert.equal(fixtures.headObject.headers['content-type'], 'image/webp');

  const p429 = mapS3ErrorToProblem(fixtures.error429);
  assert.equal(p429.status, 429);
  assert.equal(p429.retryable, true);

  const p404 = mapS3ErrorToProblem(fixtures.error404);
  assert.equal(p404.status, 404);
  assert.equal(p404.retryable, false);
});

test('Contract: InMemoryFakeStorageAdapter adheres to ObjectStoragePort semantics', async () => {
  const fake = new InMemoryFakeStorageAdapter();
  const bucket = 'adzunova-dev-public';
  const key = `public/avatar/aa/${'a'.repeat(64)}.webp`;
  const payload = Buffer.from('hello-r2-contract');

  await fake.put(bucket, key, payload, { contentType: 'image/webp' });
  const head = await fake.head(bucket, key);
  assert.equal(head.exists, true);
  assert.equal(head.contentLength, payload.length);
  assert.equal(head.contentType, 'image/webp');

  const got = await fake.get(bucket, key);
  const chunks = [];
  for await (const c of got.body) chunks.push(c);
  assert.equal(Buffer.concat(chunks).equals(payload), true);

  const mp = await fake.createMultipart(bucket, `${key}.mp`);
  const partUrl = await fake.presignPart(bucket, `${key}.mp`, mp.uploadId, 1, 300);
  assert.equal(partUrl.includes('partNumber=1'), true);
  await fake.completeMultipart(bucket, `${key}.mp`, mp.uploadId, [{ partNumber: 1, etag: '"p1"' }]);
  const mpHead = await fake.head(bucket, `${key}.mp`);
  assert.equal(mpHead.exists, true);

  const delRes = await fake.deleteMany(bucket, [key, `${key}.mp`]);
  assert.equal(delRes.deletedCount, 2);
});
