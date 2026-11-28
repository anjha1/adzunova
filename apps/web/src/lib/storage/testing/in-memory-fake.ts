import { Readable } from 'node:stream';
import crypto from 'node:crypto';
import type { ObjectStoragePort, CompletedPartInput } from '../port';
import type { StorageRole } from '../resilience';

/**
 * Unit-test-only In-Memory Fake Storage Adapter.
 * CI Guard (l) strictly forbids importing this file from production code.
 */
export class InMemoryFakeStorageAdapter implements ObjectStoragePort {
  private objects = new Map<string, { body: Buffer; contentType?: string; etag: string }>();
  private multiparts = new Map<string, { bucket: string; key: string; parts: Map<number, { etag: string; size: number }> }>();

  constructor(public readonly role: StorageRole = 'admin-lifecycle') {}

  private k(bucket: string, key: string) {
    return `${bucket}::${key}`;
  }

  async head(bucket: string, key: string) {
    const obj = this.objects.get(this.k(bucket, key));
    if (!obj) return { exists: false };
    return { exists: true, contentLength: obj.body.length, contentType: obj.contentType, etag: obj.etag };
  }

  async get(bucket: string, key: string) {
    const obj = this.objects.get(this.k(bucket, key));
    if (!obj) throw Object.assign(new Error('NoSuchKey'), { name: 'NoSuchKey', $metadata: { httpStatusCode: 404 } });
    return { body: Readable.from(obj.body), contentType: obj.contentType, contentLength: obj.body.length, etag: obj.etag };
  }

  async put(bucket: string, key: string, body: Buffer | Uint8Array | Readable, options?: { contentType?: string }) {
    const buf = Buffer.isBuffer(body)
      ? body
      : body instanceof Uint8Array
      ? Buffer.from(body)
      : await (async () => {
          const chunks: Buffer[] = [];
          for await (const c of body) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
          return Buffer.concat(chunks);
        })();
    const etag = `"${crypto.createHash('md5').update(buf).digest('hex')}"`;
    this.objects.set(this.k(bucket, key), { body: buf, contentType: options?.contentType, etag });
    return { etag };
  }

  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string) {
    const src = this.objects.get(this.k(sourceBucket, sourceKey));
    if (!src) throw Object.assign(new Error('NoSuchKey'), { name: 'NoSuchKey', $metadata: { httpStatusCode: 404 } });
    this.objects.set(this.k(destBucket, destKey), { ...src });
    return { etag: src.etag };
  }

  async delete(bucket: string, key: string) {
    this.objects.delete(this.k(bucket, key));
  }

  async deleteMany(bucket: string, keys: string[]) {
    let deletedCount = 0;
    for (const k of keys) {
      if (this.objects.delete(this.k(bucket, k))) deletedCount++;
    }
    return { deletedCount, errors: 0 };
  }

  async presignPut(bucket: string, key: string, options: { expiresInSeconds: number }) {
    return `https://fake.local/${bucket}/${key}?X-Amz-Expires=${options.expiresInSeconds}`;
  }

  async presignGet(bucket: string, key: string, expiresInSeconds: number) {
    return `https://fake.local/${bucket}/${key}?X-Amz-Expires=${expiresInSeconds}`;
  }

  async createMultipart(bucket: string, key: string) {
    const uploadId = crypto.randomUUID();
    this.multiparts.set(uploadId, { bucket, key, parts: new Map() });
    return { uploadId };
  }

  async presignPart(bucket: string, key: string, uploadId: string, partNumber: number, expiresInSeconds: number) {
    return `https://fake.local/${bucket}/${key}?uploadId=${uploadId}&partNumber=${partNumber}&X-Amz-Expires=${expiresInSeconds}`;
  }

  async completeMultipart(bucket: string, key: string, uploadId: string, parts: CompletedPartInput[]) {
    this.multiparts.delete(uploadId);
    const etag = `"${crypto.randomUUID()}"`;
    this.objects.set(this.k(bucket, key), { body: Buffer.from(`parts:${parts.length}`), etag });
    return { etag };
  }

  async abortMultipart(_bucket: string, _key: string, uploadId: string) {
    this.multiparts.delete(uploadId);
  }

  async listParts(_bucket: string, _key: string, uploadId: string) {
    const mp = this.multiparts.get(uploadId);
    if (!mp) return [];
    return Array.from(mp.parts.entries()).map(([partNumber, v]) => ({ partNumber, ...v }));
  }

  async list(bucket: string, prefix: string) {
    const keys: Array<{ key: string; size: number; etag?: string }> = [];
    const p = `${bucket}::${prefix}`;
    for (const [k, v] of this.objects.entries()) {
      if (k.startsWith(p)) keys.push({ key: k.slice(bucket.length + 2), size: v.body.length, etag: v.etag });
    }
    return { keys, isTruncated: false };
  }
}
