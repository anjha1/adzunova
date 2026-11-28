import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

import { checkStorageGuardRulesForFile } from '../../scripts/storage-guard-rules.mjs';
import { getStorageConfigStatus } from '../../apps/web/src/lib/storage/env.ts';

test('Storage S0+S1: CI Guard Rules reject every forbidden pattern', async (t) => {
  await t.test('1. fails on r2.dev URLs', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/lib/avatar.ts',
      `const url = "https://pub-12345.r2.dev/avatar.png";`,
    );
    assert.equal(v.some((x) => x.rule === 'r2_dev_url'), true);
  });

  await t.test('2. fails on secrets or private bucket names in client bundles', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/components/upload.tsx',
      `'use client';\nconst bucket = process.env.R2_SECRET_ACCESS_KEY || "private-vault";`,
    );
    assert.equal(v.some((x) => x.rule === 'client_bundle_secret_or_private_bucket'), true);
  });

  await t.test('3. fails on private data classes mapped to public bucket', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/lib/storage/router.ts',
      `const target = { bucket: 'public-assets', docType: 'kyc_pan' };`,
    );
    assert.equal(v.some((x) => x.rule === 'private_data_in_public_bucket'), true);
  });

  await t.test('4. fails on hard-coded bucket or CDN host names', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/lib/media.ts',
      `const base = "https://cdn.adzunova.tech";`,
    );
    assert.equal(v.some((x) => x.rule === 'hardcoded_bucket_or_cdn_host'), true);
  });

  await t.test('5. fails on forbidden security claim strings', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/app/creator/profile/page.tsx',
      `<span>All files are virus-free and 100% secure</span>`,
    );
    assert.equal(v.some((x) => x.rule === 'forbidden_security_claim'), true);
  });

  await t.test('6. fails on console logging of presigned URLs or secret keys', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/lib/storage/presign.ts',
      `console.log('Signed:', presignedUrl);`,
    );
    assert.equal(v.some((x) => x.rule === 'logging_presigned_url_or_secret'), true);
  });

  await t.test('7. fails on floating-point arithmetic on byte or money counters in storage modules', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/lib/storage/billing.ts',
      `const fee = sizeBytes * 0.015;`,
    );
    assert.equal(v.some((x) => x.rule === 'floating_point_bytes_or_money'), true);
  });

  await t.test('8. fails on InMemoryObjectStorageFake imported in production code', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/app/api/upload/route.ts',
      `import { InMemoryObjectStorageFake } from '@/lib/storage/testing/in-memory-fake';`,
    );
    assert.equal(v.some((x) => x.rule === 'in_memory_fake_in_prod'), true);
  });

  await t.test('9. fails on storage.list() on request paths', () => {
    const v = checkStorageGuardRulesForFile(
      'apps/web/src/app/api/assets/route.ts',
      `const page = await storagePort.list('pub/', cursor);`,
    );
    assert.equal(v.some((x) => x.rule === 'storage_list_on_request_path'), true);
  });

  await t.test('10. .env.local is never tracked by git', () => {
    const out = execSync('git ls-files .env.local', { encoding: 'utf8' }).trim();
    assert.equal(out, '');
  });
});

test('Storage S0+S1: Zod Env Validation & Feature Flags', async (t) => {
  await t.test('returns "Storage metadata database not configured" cleanly when vars are missing and defaults all flags off', () => {
    const status = getStorageConfigStatus({});
    assert.equal(status.configured, false);
    assert.equal(status.status, 'NOT_CONFIGURED');
    assert.equal(status.message, 'Storage metadata database not configured');
    assert.ok(status.missingVars.includes('R2_ACCOUNT_ID'));
    assert.ok(status.missingVars.includes('MONGODB_URI'));
    assert.equal(status.flags.storageUploads, false);
    assert.equal(status.flags.s1Presign, false);
    assert.equal(status.flags.s2Multipart, false);
  });

  await t.test('validates complete config cleanly without leaking secret values', () => {
    const status = getStorageConfigStatus({
      R2_ACCOUNT_ID: 'acc_123',
      R2_ENDPOINT: 'https://acc_123.r2.cloudflarestorage.com',
      R2_UPLOAD_SIGNER_ACCESS_KEY_ID: 'ak_secret_test',
      R2_UPLOAD_SIGNER_SECRET_ACCESS_KEY: 'sk_secret_test',
      R2_PUBLIC_BUCKET_NAME: 'adzunova-dev-public',
      R2_PRIVATE_BUCKET_NAME: 'adzunova-dev-private',
      R2_QUARANTINE_BUCKET_NAME: 'adzunova-dev-quarantine',
      R2_EXPORTS_BUCKET_NAME: 'adzunova-dev-exports',
      NEXT_PUBLIC_CDN_BASE: 'https://cdn.example.test',
      MONGODB_URI: 'mongodb://127.0.0.1:27018/adzunova_storage?replicaSet=rs0',
    });
    assert.equal(status.configured, true);
    assert.equal(status.status, 'ACTIVE');
    assert.equal(status.roles['upload-signer'].configured, true);
    assert.equal(status.roles.processor.configured, false);
    assert.equal(JSON.stringify(status).includes('sk_secret_test'), false);
  });
});
