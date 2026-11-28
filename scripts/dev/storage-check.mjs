#!/usr/bin/env node
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}

export function assertDevBucketPrefix(bucketName) {
  if (!bucketName || !bucketName.startsWith('adzunova-dev-')) {
    throw new Error(
      `SAFETY REFUSAL: Bucket "${bucketName || '(empty)'}" does not start with "adzunova-dev-". Never run storage-check or integration tests against production buckets.`,
    );
  }
}

async function run() {
  loadEnvLocal();

  const useR2Dev = Boolean(process.env.R2_DEV_ENDPOINT && process.env.R2_DEV_ACCESS_KEY_ID && process.env.R2_DEV_SECRET_ACCESS_KEY);
  const useMinio = Boolean(process.env.MINIO_ENDPOINT && process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY);

  if (!useR2Dev && !useMinio) {
    console.log('STORAGE-CHECK: SKIPPED (Neither R2_DEV_* nor MINIO_* credentials are configured in .env.local or environment.)');
    process.exit(0);
  }

  const target = useR2Dev ? 'R2_DEV' : 'MINIO';
  const endpoint = useR2Dev ? process.env.R2_DEV_ENDPOINT : process.env.MINIO_ENDPOINT;
  const accessKeyId = useR2Dev ? process.env.R2_DEV_ACCESS_KEY_ID : process.env.MINIO_ACCESS_KEY;
  const secretAccessKey = useR2Dev ? process.env.R2_DEV_SECRET_ACCESS_KEY : process.env.MINIO_SECRET_KEY;
  const buckets = useR2Dev
    ? [
        process.env.R2_DEV_PUBLIC_BUCKET || 'adzunova-dev-public',
        process.env.R2_DEV_PRIVATE_BUCKET || 'adzunova-dev-private',
        process.env.R2_DEV_QUARANTINE_BUCKET || 'adzunova-dev-quarantine',
        process.env.R2_DEV_EXPORTS_BUCKET || 'adzunova-dev-exports',
      ]
    : [
        process.env.MINIO_PUBLIC_BUCKET || 'adzunova-dev-public',
        process.env.MINIO_PRIVATE_BUCKET || 'adzunova-dev-private',
      ];

  for (const b of buckets) {
    assertDevBucketPrefix(b);
  }

  const reqFromWeb = createRequire(path.resolve(process.cwd(), 'apps/web/package.json'));
  const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand, CreateMultipartUploadCommand, AbortMultipartUploadCommand } = reqFromWeb('@aws-sdk/client-s3');
  const { getSignedUrl } = reqFromWeb('@aws-sdk/s3-request-presigner');

  const headProbe = await fetch(endpoint, { method: 'HEAD' }).catch(() => null);
  const remoteDate = headProbe?.headers.get('date');
  const clockOffsetMs = remoteDate && Number.isFinite(Date.parse(remoteDate))
    ? (Math.abs(Date.parse(remoteDate) - Date.now()) > 5000 ? Date.parse(remoteDate) - Date.now() : 0)
    : 0;

  const client = new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    systemClockOffset: clockOffsetMs,
    credentials: { accessKeyId, secretAccessKey },
  });

  const testBucket = buckets[0];
  const testKey = `dev-probe/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.txt`;
  const payload = Buffer.from(`adzunova-storage-check-${new Date().toISOString()}`);

  let uploadId = null;
  try {
    await client.send(new PutObjectCommand({ Bucket: testBucket, Key: testKey, Body: payload, ContentType: 'text/plain' }));
    console.log(`PASS [${target}]: PutObject ${testBucket}/${testKey}`);

    const head = await client.send(new HeadObjectCommand({ Bucket: testBucket, Key: testKey }));
    console.log(`PASS [${target}]: HeadObject ContentLength=${head.ContentLength}`);

    const getRes = await client.send(new GetObjectCommand({ Bucket: testBucket, Key: testKey }));
    const chunks = [];
    for await (const chunk of getRes.Body) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    if (!body.equals(payload)) throw new Error('GetObject body mismatch');
    console.log(`PASS [${target}]: GetObject roundtrip matched`);

    const signedGet = await getSignedUrl(client, new GetObjectCommand({ Bucket: testBucket, Key: testKey }), { expiresIn: 60 });
    if (!signedGet.includes('X-Amz-Signature=')) throw new Error('Presigned URL missing signature');
    console.log(`PASS [${target}]: PresignGet generated (redacted)`);

    const mp = await client.send(new CreateMultipartUploadCommand({ Bucket: testBucket, Key: `${testKey}.mp` }));
    uploadId = mp.UploadId;
    await client.send(new AbortMultipartUploadCommand({ Bucket: testBucket, Key: `${testKey}.mp`, UploadId: uploadId }));
    uploadId = null;
    console.log(`PASS [${target}]: CreateMultipart + AbortMultipart`);
  } finally {
    await client.send(new DeleteObjectCommand({ Bucket: testBucket, Key: testKey })).catch(() => {});
    if (uploadId) {
      await client.send(new AbortMultipartUploadCommand({ Bucket: testBucket, Key: `${testKey}.mp`, UploadId: uploadId })).catch(() => {});
    }
    console.log(`PASS [${target}]: Cleanup DeleteObject`);
  }
}

run().catch((err) => {
  console.error(`FAIL [STORAGE-CHECK]: ${err.message}`);
  process.exit(1);
});
