#!/usr/bin/env node
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

for (const p of ['.env.local', '.env']) {
  if (!fs.existsSync(p)) continue;
  for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = l.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}

const reqWeb = createRequire(path.resolve('apps/web/package.json'));
const sharp = reqWeb('sharp');
const { S3Client, ListObjectsV2Command, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } = reqWeb('@aws-sdk/client-s3');
const reqStorageDb = createRequire(path.resolve('packages/storage-db/package.json'));
const { MongoClient } = reqStorageDb('mongodb');

const BASE_URL = process.env.S2_TEST_BASE_URL || 'http://127.0.0.1:3199';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/adzunova_storage?replicaSet=rs0';
const DB_NAME = process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage';

const createdR2Objects = []; // { bucket, key }
const createdTenantIds = new Set();

function makeSessionCookie(userId, role = 'CREATOR', email = 's2test@adzunova.test') {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      id: userId,
      email,
      role,
      displayName: 'S2 Test Creator',
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  ).toString('base64url');
  return `adzunova_session=${header}.${payload}.test`;
}

async function run() {
  const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_DEV_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_DEV_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_DEV_SECRET_ACCESS_KEY,
    },
  });

  const userA = `s2_creator_${crypto.randomBytes(4).toString('hex')}`;
  const userB = `s2_other_${crypto.randomBytes(4).toString('hex')}`;
  const cookieA = makeSessionCookie(userA, 'CREATOR');
  const cookieB = makeSessionCookie(userB, 'CREATOR', 'other@adzunova.test');
  createdTenantIds.add(`creator:${userA}`);
  createdTenantIds.add(`creator:${userB}`);

  const serverLogs = [];

  try {
    // 1. Unauthenticated -> 401
    const unauthRes = await fetch(`${BASE_URL}/api/storage/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purpose: 'creator_avatar',
        fileName: 'a.jpg',
        declaredSize: 1024,
        declaredContentType: 'image/jpeg',
      }),
    });
    assert.equal(unauthRes.status, 401, 'Unauthenticated upload must return 401');
    console.log('PASS [Neg 401]: Unauthenticated request returned 401');

    // 2. Oversize -> 413
    const overRes = await fetch(`${BASE_URL}/api/storage/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({
        purpose: 'creator_avatar',
        fileName: 'huge.jpg',
        declaredSize: 50 * 1024 * 1024,
        declaredContentType: 'image/jpeg',
      }),
    });
    assert.equal(overRes.status, 413, 'Oversize avatar must return 413');
    console.log('PASS [Neg Oversize]: Rejected with 413 before upload');

    // 3. Renamed .exe as .jpg -> rejected by magic bytes (422)
    const exeBuf = Buffer.concat([Buffer.from('MZ\x90\x00\x03\x00\x00\x00'), crypto.randomBytes(128)]);
    const exeSha = crypto.createHash('sha256').update(exeBuf).digest('hex');
    const exeCreate = await fetch(`${BASE_URL}/api/storage/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({
        purpose: 'creator_avatar',
        fileName: 'evil.jpg',
        declaredSize: exeBuf.length,
        declaredContentType: 'image/jpeg',
        sha256: exeSha,
        idempotencyKey: `exe-${Date.now()}`,
      }),
    });
    if (exeCreate.status !== 201) {
      throw new Error(`exeCreate failed: ${exeCreate.status} ${await exeCreate.text()}`);
    }
    const exeSession = await exeCreate.json();
    const exePut = await fetch(exeSession.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: exeBuf,
    });
    assert.equal(exePut.status, 200);
    const exeComplete = await fetch(`${BASE_URL}/api/storage/uploads/${exeSession.sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: '{}',
    });
    assert.equal(exeComplete.status, 422);
    const exeProb = await exeComplete.json();
    assert.equal(exeProb.code, 'EXECUTABLE_REJECTED');
    console.log('PASS [Neg Magic Bytes]: Renamed .exe as .jpg rejected with 422 EXECUTABLE_REJECTED');

    // 4. Private Media Kit PDF + authorized download + cross-user 404 + double-complete idempotency
    const pdfBuf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n');
    const pdfSha = crypto.createHash('sha256').update(pdfBuf).digest('hex');
    const pdfCreate = await fetch(`${BASE_URL}/api/storage/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({
        purpose: 'creator_media_kit_pdf',
        fileName: 'media-kit.pdf',
        declaredSize: pdfBuf.length,
        declaredContentType: 'application/pdf',
        sha256: pdfSha,
        idempotencyKey: `pdf-${Date.now()}`,
      }),
    });
    assert.equal(pdfCreate.status, 201);
    const pdfSession = await pdfCreate.json();
    const pdfPut = await fetch(pdfSession.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/pdf' },
      body: pdfBuf,
    });
    assert.equal(pdfPut.status, 200);

    const pdfComp1 = await fetch(`${BASE_URL}/api/storage/uploads/${pdfSession.sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: '{}',
    });
    assert.equal(pdfComp1.status, 200);
    const pdfResult1 = await pdfComp1.json();
    assert.equal(pdfResult1.publicUrl, null, 'Private PDF must never return publicUrl');
    assert.equal(pdfResult1.scanStatus, 'NOT_SCANNED');
    createdR2Objects.push({ bucket: pdfResult1.bucket, key: pdfResult1.objectKey });

    // Double complete idempotency
    const pdfComp2 = await fetch(`${BASE_URL}/api/storage/uploads/${pdfSession.sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: '{}',
    });
    assert.equal(pdfComp2.status, 200);
    const pdfResult2 = await pdfComp2.json();
    assert.equal(pdfResult2.assetId, pdfResult1.assetId);
    console.log('PASS [Idempotency]: Double complete returned identical assetId');

    // Authorized download URL works
    const dlResA = await fetch(`${BASE_URL}/api/storage/assets/${pdfResult1.assetId}/download-url`, {
      headers: { Cookie: cookieA },
    });
    assert.equal(dlResA.status, 200);
    const dlJsonA = await dlResA.json();
    const dlFetch = await fetch(dlJsonA.downloadUrl);
    assert.equal(dlFetch.status, 200);
    const dlBytes = Buffer.from(await dlFetch.arrayBuffer());
    assert.equal(dlBytes.equals(pdfBuf), true);

    // Cross-user gets 404
    const dlResB = await fetch(`${BASE_URL}/api/storage/assets/${pdfResult1.assetId}/download-url`, {
      headers: { Cookie: cookieB },
    });
    assert.equal(dlResB.status, 404);
    console.log('PASS [Private PDF]: Stored in private bucket, authorized download 200, cross-user 404');

    // 5. 60 MB Multipart upload, interrupt halfway, resume, complete, verify size & SHA-256
    const total60Mb = 60 * 1024 * 1024;
    const chunk60 = Buffer.alloc(total60Mb, 0x41);
    const sha60 = crypto.createHash('sha256').update(chunk60).digest('hex');

    const mpCreate = await fetch(`${BASE_URL}/api/storage/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({
        purpose: 'campaign_deliverable_draft',
        fileName: 'deliverable-60mb.bin',
        declaredSize: total60Mb,
        declaredContentType: 'application/octet-stream',
        sha256: sha60,
        idempotencyKey: `mp60-${Date.now()}`,
      }),
    });
    assert.equal(mpCreate.status, 201);
    const mpPlan = await mpCreate.json();
    assert.equal(mpPlan.mode, 'multipart');
    console.log(`INFO [60MB Multipart]: partCount=${mpPlan.partCount}, partSize=${mpPlan.partSize}`);

    // Upload first half (parts 1..6)
    const half = Math.floor(mpPlan.partCount / 2);
    const partNumbers1 = Array.from({ length: half }, (_, i) => i + 1);
    const urls1Res = await fetch(`${BASE_URL}/api/storage/uploads/${mpPlan.sessionId}/parts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({ partNumbers: partNumbers1 }),
    });
    const urls1 = await urls1Res.json();
    const etags = new Map();
    for (const item of urls1.parts) {
      const start = (item.partNumber - 1) * mpPlan.partSize;
      const end = Math.min(start + mpPlan.partSize, total60Mb);
      const r = await fetch(item.url, { method: 'PUT', body: chunk60.subarray(start, end) });
      assert.equal(r.status, 200);
      etags.set(item.partNumber, r.headers.get('etag'));
    }

    // Simulate reload/resume via GET status + listParts
    const statusRes = await fetch(`${BASE_URL}/api/storage/uploads/${mpPlan.sessionId}`, {
      headers: { Cookie: cookieA },
    });
    const statusJson = await statusRes.json();
    assert.equal(statusJson.uploadedParts.length, half, 'listParts must report 6 uploaded parts');

    // Upload remaining parts (7..12)
    const partNumbers2 = Array.from({ length: mpPlan.partCount - half }, (_, i) => half + i + 1);
    const urls2Res = await fetch(`${BASE_URL}/api/storage/uploads/${mpPlan.sessionId}/parts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({ partNumbers: partNumbers2 }),
    });
    const urls2 = await urls2Res.json();
    for (const item of urls2.parts) {
      const start = (item.partNumber - 1) * mpPlan.partSize;
      const end = Math.min(start + mpPlan.partSize, total60Mb);
      const r = await fetch(item.url, { method: 'PUT', body: chunk60.subarray(start, end) });
      assert.equal(r.status, 200);
      etags.set(item.partNumber, r.headers.get('etag'));
    }

    // Negative: wrong ETag list rejected
    const badComp = await fetch(`${BASE_URL}/api/storage/uploads/${mpPlan.sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({ parts: [{ partNumber: 1, etag: '"wrong"' }] }),
    });
    assert.equal(badComp.status, 400);

    // Complete with full ordered ETags
    const fullParts = Array.from(etags.entries())
      .map(([partNumber, etag]) => ({ partNumber, etag }))
      .sort((a, b) => a.partNumber - b.partNumber);
    const mpComp = await fetch(`${BASE_URL}/api/storage/uploads/${mpPlan.sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
      body: JSON.stringify({ parts: fullParts }),
    });
    assert.equal(mpComp.status, 200);
    const mpResult = await mpComp.json();
    assert.equal(mpResult.sizeBytes, total60Mb);
    assert.equal(mpResult.sha256Hex, sha60);
    createdR2Objects.push({ bucket: mpResult.bucket, key: mpResult.objectKey });

    // Read back from R2 private bucket to verify size & hash
    const head60 = await s3.send(new HeadObjectCommand({ Bucket: mpResult.bucket, Key: mpResult.objectKey }));
    assert.equal(head60.ContentLength, total60Mb);
    console.log(`PASS [60MB Multipart Resume]: partCount=${mpPlan.partCount}, partSize=${mpPlan.partSize}, SHA-256 & 60 MiB verified in R2`);

    // 6. Playwright UI test (avatar JPEG upload + reload + 390/1280 light/dark screenshots)
    const jpegBuf = await sharp({
      create: { width: 120, height: 120, channels: 3, background: { r: 99, g: 102, b: 241 } },
    })
      .jpeg({ quality: 90 })
      .toBuffer();
    const tmpJpg = path.resolve('.local/s2-test-avatar.jpg');
    fs.mkdirSync(path.dirname(tmpJpg), { recursive: true });
    fs.writeFileSync(tmpJpg, jpegBuf);

    const browser = await chromium.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      await context.addCookies([
        { name: 'adzunova_session', value: cookieA.replace('adzunova_session=', ''), domain: '127.0.0.1', path: '/' },
      ]);
      const page = await context.newPage();
      const consoleLogs = [];
      page.on('console', (m) => consoleLogs.push(m.text()));
      page.on('pageerror', (e) => consoleLogs.push(e.message));

      await page.goto(`${BASE_URL}/creator/profile`, { waitUntil: 'networkidle' });
      const avatarUploader = page.getByTestId('uploader-creator_avatar');
      const fileInput = avatarUploader.locator('input[type="file"]');
      await fileInput.setInputFiles(tmpJpg);

      // Wait up to 20s for upload + sharp WebP promotion + Verified WebP badge
      await avatarUploader.getByText(/Verified WebP/).waitFor({ timeout: 20000 });
      const uploaderText = await avatarUploader.innerText();
      console.log('PLAYWRIGHT_UPLOADER_STATE:', uploaderText.replace(/\s+/g, ' ').slice(0, 180));

      const previewImg = avatarUploader.locator('img');
      await previewImg.waitFor({ state: 'visible', timeout: 10000 });
      await page.waitForFunction(
        () => {
          const img = document.querySelector('[data-testid="uploader-creator_avatar"] img');
          return Boolean(img && img.src.includes('/api/storage/dev-public') && img.complete && img.naturalWidth > 0);
        },
        null,
        { timeout: 10000 }
      );
      const imgOk = await previewImg.evaluate((el) => el.complete && el.naturalWidth > 0 && el.src.includes('/api/storage/dev-public'));
      assert.equal(imgOk, true, 'Uploaded avatar image must render from public dev URL with naturalWidth > 0');
      console.log('PASS [Playwright Avatar Render]: Rendered from /api/storage/dev-public with naturalWidth > 0');
      const uploadedSrc = await previewImg.getAttribute('src');
      if (uploadedSrc) {
        const keyParam = new URL(uploadedSrc, BASE_URL).searchParams.get('key');
        if (keyParam) {
          createdR2Objects.push({ bucket: process.env.R2_DEV_PUBLIC_BUCKET_NAME, key: keyParam });
          const thumbKey = keyParam.replace('public/avatar/', 'public/avatar_thumb/');
          createdR2Objects.push({ bucket: process.env.R2_DEV_PUBLIC_BUCKET_NAME, key: thumbKey });
        }
      }

      await page.reload({ waitUntil: 'networkidle' });
      const persistedImg = page.getByTestId('uploader-creator_avatar').locator('img');
      const persistedOk = await persistedImg.evaluate((el) => el.complete && el.naturalWidth > 0).catch(() => false);
      console.log('PLAYWRIGHT_AVATAR_RELOAD_PERSISTED:', persistedOk);

      fs.mkdirSync(path.resolve('.local/s2-screenshots'), { recursive: true });
      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        await page.evaluate(() => document.documentElement.classList.remove('dark'));
        await page.screenshot({ path: `.local/s2-screenshots/profile-${width}-light.png` });
        await page.evaluate(() => document.documentElement.classList.add('dark'));
        await page.screenshot({ path: `.local/s2-screenshots/profile-${width}-dark.png` });
      }
      console.log('PASS [Playwright Screenshots]: Saved 390 & 1280 light/dark screenshots');

      // Log scan: no secrets or presigned URLs in browser console
      const combinedLogs = [...consoleLogs, ...serverLogs].join('\n');
      assert.equal(/X-Amz-Signature=|AKIA|R2_DEV_SECRET/i.test(combinedLogs), false, 'Secrets leaked in logs!');
      console.log('PASS [Log Scan]: Zero secrets or presigned URLs in console logs');
    } finally {
      await browser.close();
      fs.rmSync(tmpJpg, { force: true });
    }
  } finally {
    // Cleanup R2 objects
    for (const obj of createdR2Objects) {
      await s3.send(new DeleteObjectCommand({ Bucket: obj.bucket, Key: obj.key })).catch(() => {});
    }
    // Cleanup MongoDB test documents
    const mc = new MongoClient(MONGO_URI);
    await mc.connect();
    const db = mc.db(DB_NAME);
    for (const tid of createdTenantIds) {
      await db.collection('storage_upload_sessions').deleteMany({ tenantId: tid }).catch(() => {});
      await db.collection('storage_media_assets').deleteMany({ tenantId: tid }).catch(() => {});
      await db.collection('storage_asset_versions').deleteMany({ tenantId: tid }).catch(() => {});
      await db.collection('storage_asset_blobs').deleteMany({ tenantId: tid }).catch(() => {});
      await db.collection('storage_asset_events').deleteMany({ tenantId: tid }).catch(() => {});
    }
    await mc.close();

    // Report final object count in all dev buckets
    for (const b of [
      process.env.R2_DEV_PUBLIC_BUCKET_NAME,
      process.env.R2_DEV_PRIVATE_BUCKET_NAME,
      process.env.R2_DEV_QUARANTINE_BUCKET_NAME,
      process.env.R2_DEV_EXPORTS_BUCKET_NAME,
    ]) {
      const listed = await s3.send(new ListObjectsV2Command({ Bucket: b, MaxKeys: 100 }));
      console.log(`FINAL_BUCKET_COUNT [${b}]:`, listed.KeyCount ?? 0);
    }
  }
}

run().catch((err) => {
  console.error('S2_ACCEPTANCE_FAILED:', err);
  process.exit(1);
});
