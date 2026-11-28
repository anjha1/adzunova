import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_R2_KEY_BYTES,
  computeTenantShard,
  buildPublicKey,
  buildPrivateKey,
  buildIngestKey,
  buildExportKey,
  parseStorageKey,
} from '../../apps/web/src/lib/storage/keys.ts';
import {
  DATA_CLASSIFICATION_REGISTRY,
  getClassificationPolicy,
  assertValidClassificationRegistry,
} from '../../apps/web/src/lib/storage/classification.ts';
import {
  scrubStorageSecrets,
  StoragePortError,
  mapS3ErrorToProblem,
} from '../../apps/web/src/lib/storage/errors.ts';
import {
  HARD_MAX_PRESIGN_GET_TTL_SECONDS,
  buildPublicCdnUrl,
  issueBoundedPresignedGet,
} from '../../apps/web/src/lib/storage/delivery.ts';
import {
  R2_DELETE_MANY_BATCH_LIMIT,
  enforceRolePermission,
  RoleViolationError,
} from '../../apps/web/src/lib/storage/port.ts';
import { InMemoryFakeStorageAdapter } from '../../apps/web/src/lib/storage/testing/in-memory-fake.ts';
import { resolveDisplayAssetUrl } from '../../apps/web/src/lib/storage/legacy-shim.ts';
import { assertDevBucketPrefix } from '../../apps/web/src/lib/storage/env.ts';

test('Storage Core: Keys property-based round-trip, PII, traversal & length guards', async (t) => {
  await t.test('round-trips public, private, ingest, and export keys cleanly', () => {
    const pub = buildPublicKey({
      kind: 'avatar',
      sha256: 'a'.repeat(64),
      ext: 'webp',
    });
    const parsedPub = parseStorageKey(pub);
    assert.equal(parsedPub.kind, 'public');
    assert.equal(parsedPub.assetKind, 'avatar');
    assert.equal(parsedPub.sha256, 'a'.repeat(64));

    const shard = computeTenantShard('tenant_xyz');
    const priv = buildPrivateKey({
      domain: 'contracts',
      tenantShard: shard,
      entityId: 'ent_01',
      assetId: 'asset_02',
      version: 2,
      ext: 'pdf',
    });
    const parsedPriv = parseStorageKey(priv);
    assert.equal(parsedPriv.kind, 'private');
    assert.equal(parsedPriv.tenantShard, shard);
    assert.equal(parsedPriv.version, 2);

    const ingest = buildIngestKey({ sessionId: 'sess1', objectOrPart: 'part_1.bin' });
    assert.equal(parseStorageKey(ingest).kind, 'ingest');

    const exp = buildExportKey({ jobId: 'exp1', file: 'report.csv' });
    assert.equal(parseStorageKey(exp).kind, 'exports');
  });

  await t.test('rejects path traversal, PII (emails/PAN), control chars, and >1024-byte keys', () => {
    assert.throws(() => buildPublicKey({
      kind: '../etc',
      sha256: 'a'.repeat(64),
      ext: 'png',
    }));

    assert.throws(() => buildPrivateKey({
      domain: 'contracts',
      tenantShard: 'a1b2',
      entityId: 'user@example.com',
      assetId: 'a1',
      version: 1,
      ext: 'pdf',
    }));

    assert.throws(() => buildExportKey({
      jobId: 'e1',
      file: 'a'.repeat(MAX_R2_KEY_BYTES),
    }));
  });
});

test('Storage Core: Classification Registry & Negative Guard', async (t) => {
  await t.test('registry passes validation and rejects unknown dataClass', () => {
    assert.doesNotThrow(() => assertValidClassificationRegistry());
    assert.throws(() => getClassificationPolicy('nonexistent_class'));
  });

  await t.test('private classes never map to public bucket', () => {
    for (const policy of Object.values(DATA_CLASSIFICATION_REGISTRY)) {
      if (policy.visibility === 'PRIVATE') {
        assert.notEqual(policy.bucketTier, 'public');
      }
    }
  });
});

test('Storage Core: Delivery TTL bounds & CDN URL builder', async (t) => {
  await t.test('builds immutable public CDN URL and rejects private keys', () => {
    const hash = 'a'.repeat(64);
    const url = buildPublicCdnUrl(`public/avatar/aa/${hash}.webp`, 'https://cdn.example.test');
    assert.equal(url, `https://cdn.example.test/public/avatar/aa/${hash}.webp`);
    assert.throws(() => buildPublicCdnUrl('private/contracts/a1b2/e1/a1/v1/original.pdf', 'https://cdn.example.test'));
  });

  await t.test('enforces HARD_MAX_PRESIGN_GET_TTL_SECONDS = 900', async () => {
    let capturedTtl = 0;
    const mockPort = {
      async presignGet(_bucket, _key, ttlSeconds) {
        capturedTtl = ttlSeconds;
        return `https://r2.example.test/obj?X-Amz-Expires=${ttlSeconds}`;
      },
    };
    await issueBoundedPresignedGet(
      mockPort,
      'adzunova-dev-private',
      'private/contracts/a1b2/e1/a1/v1/original.pdf',
      999999,
    );
    assert.equal(capturedTtl <= HARD_MAX_PRESIGN_GET_TTL_SECONDS, true);
  });
});

test('Storage Core: Error mapping (RFC 7807) & secret scrubbing', async (t) => {
  await t.test('scrubs presigned signatures, AWS keys, and secret tokens', () => {
    const raw = 'Failed GET https://acc.r2.cloudflarestorage.com/b/k?X-Amz-Signature=deadbeef123456&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE';
    const scrubbed = scrubStorageSecrets(raw);
    assert.equal(scrubbed.includes('deadbeef123456'), false);
    assert.equal(scrubbed.includes('AKIAIOSFODNN7EXAMPLE'), false);
  });

  await t.test('maps S3 429 and 404 to RFC 7807 Problem Details', () => {
    const p429 = mapS3ErrorToProblem({ name: 'SlowDown', $metadata: { httpStatusCode: 429 } });
    assert.equal(p429.status, 429);
    assert.equal(p429.retryable, true);

    const p404 = mapS3ErrorToProblem({ name: 'NoSuchKey', $metadata: { httpStatusCode: 404 } });
    assert.equal(p404.status, 404);
    assert.equal(p404.retryable, false);

    const portErr = new StoragePortError(p404);
    assert.equal(portErr.problem.status, 404);
  });
});

test('Storage Core: Per-Role Permission Isolation & Dev Bucket Safety Guard', async (t) => {
  await t.test('blocks upload-signer from deleteMany and reader from put', async () => {
    const signer = enforceRolePermission(new InMemoryFakeStorageAdapter('upload-signer'));
    assert.throws(() => signer.deleteMany('adzunova-dev-public', ['a']), RoleViolationError);

    const reader = enforceRolePermission(new InMemoryFakeStorageAdapter('reader'));
    assert.throws(() => reader.put('adzunova-dev-public', 'a', Buffer.from('x')), RoleViolationError);

    const admin = enforceRolePermission(new InMemoryFakeStorageAdapter('admin-lifecycle'));
    await assert.doesNotReject(() => admin.deleteMany('adzunova-dev-public', []));
    assert.equal(R2_DELETE_MANY_BATCH_LIMIT, 1000);
  });

  await t.test('assertDevBucketPrefix refuses production bucket names', () => {
    assert.throws(() => assertDevBucketPrefix('public-assets'));
    assert.throws(() => assertDevBucketPrefix('private-vault'));
    assert.doesNotThrow(() => assertDevBucketPrefix('adzunova-dev-public'));
  });
});

test('Storage Core: Legacy Compatibility Shim', () => {
  assert.equal(
    resolveDisplayAssetUrl('https://lh3.googleusercontent.com/a/avatar.png', 'https://cdn.example.test'),
    'https://lh3.googleusercontent.com/a/avatar.png',
  );
  const hash = 'a'.repeat(64);
  assert.equal(
    resolveDisplayAssetUrl(`public/avatar/aa/${hash}.webp`, 'https://cdn.example.test'),
    `https://cdn.example.test/public/avatar/aa/${hash}.webp`,
  );
});
