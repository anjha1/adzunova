import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  ListPartsCommand,
  ListObjectsV2Command,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'node:stream';
import { BucketCircuitBreaker, StorageRole, withStorageRetry } from './resilience';
import { StoragePortError } from './errors';

export const R2_DELETE_MANY_BATCH_LIMIT = 1000;

export interface ObjectHeadResult {
  exists: boolean;
  contentLength?: number;
  contentType?: string;
  etag?: string;
  lastModified?: Date;
}

export interface ListResult {
  keys: Array<{ key: string; size: number; etag?: string; lastModified?: Date }>;
  nextCursor?: string;
  isTruncated: boolean;
}

export interface CompletedPartInput {
  partNumber: number;
  etag: string;
}

export interface ObjectStoragePort {
  readonly role: StorageRole;
  head(bucket: string, key: string): Promise<ObjectHeadResult>;
  get(bucket: string, key: string): Promise<{ body: Readable; contentType?: string; contentLength?: number; etag?: string }>;
  put(bucket: string, key: string, body: Buffer | Uint8Array | Readable, options?: { contentType?: string; contentLength?: number; cacheControl?: string }): Promise<{ etag?: string }>;
  copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<{ etag?: string }>;
  delete(bucket: string, key: string): Promise<void>;
  deleteMany(bucket: string, keys: string[]): Promise<{ deletedCount: number; errors: number }>;
  presignPut(bucket: string, key: string, options: { contentType: string; contentLength?: number; expiresInSeconds: number }): Promise<string>;
  presignGet(bucket: string, key: string, expiresInSeconds: number, responseContentDisposition?: string): Promise<string>;
  createMultipart(bucket: string, key: string, contentType: string): Promise<{ uploadId: string }>;
  presignPart(bucket: string, key: string, uploadId: string, partNumber: number, expiresInSeconds: number): Promise<string>;
  completeMultipart(bucket: string, key: string, uploadId: string, parts: CompletedPartInput[]): Promise<{ etag?: string }>;
  abortMultipart(bucket: string, key: string, uploadId: string): Promise<void>;
  listParts(bucket: string, key: string, uploadId: string): Promise<Array<{ partNumber: number; etag: string; size: number }>>;
  /** @internal Admin and reconciliation only; forbidden on request paths. */
  list(bucket: string, prefix: string, cursor?: string, maxKeys?: number): Promise<ListResult>;
}

export type UploadSignerPort = Pick<ObjectStoragePort, 'role' | 'presignPut' | 'createMultipart' | 'presignPart' | 'completeMultipart' | 'abortMultipart' | 'listParts'>;
export type ProcessorPort = Pick<ObjectStoragePort, 'role' | 'head' | 'get' | 'put' | 'copy' | 'delete' | 'deleteMany'>;
export type ReaderPort = Pick<ObjectStoragePort, 'role' | 'head' | 'get' | 'presignGet'>;
export type AdminLifecyclePort = ObjectStoragePort;

const ROLE_ALLOWED_OPS: Record<StorageRole, ReadonlySet<keyof ObjectStoragePort>> = {
  'upload-signer': new Set(['presignPut', 'createMultipart', 'presignPart', 'completeMultipart', 'abortMultipart', 'listParts']),
  processor: new Set(['head', 'get', 'put', 'copy', 'delete', 'deleteMany']),
  reader: new Set(['head', 'get', 'presignGet']),
  'admin-lifecycle': new Set([
    'head', 'get', 'put', 'copy', 'delete', 'deleteMany',
    'presignPut', 'presignGet', 'createMultipart', 'presignPart',
    'completeMultipart', 'abortMultipart', 'listParts', 'list',
  ]),
};

export class RoleViolationError extends StoragePortError {
  constructor(role: StorageRole, operation: string) {
    super({
      type: 'urn:adzunova:problems:storage-role-violation',
      title: 'Storage Role Permission Denied',
      status: 403,
      detail: `Storage role "${role}" is not permitted to invoke "${operation}".`,
      code: 'ROLE_VIOLATION',
      retryable: false,
    });
  }
}

export function enforceRolePermission(port: ObjectStoragePort): ObjectStoragePort {
  const allowed = ROLE_ALLOWED_OPS[port.role];
  return new Proxy(port, {
    get(target, prop) {
      const val = Reflect.get(target, prop, target);
      if (typeof val === 'function' && prop !== 'constructor') {
        const opName = String(prop) as keyof ObjectStoragePort;
        if (!allowed.has(opName)) {
          return () => {
            throw new RoleViolationError(target.role, opName);
          };
        }
        return val.bind(target);
      }
      return val;
    },
  });
}

export interface R2Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export class R2S3Adapter implements ObjectStoragePort {
  private client: S3Client;
  private breakers = new Map<string, BucketCircuitBreaker>();
  private clockOffsetMs = 0;
  private clockSyncedAt = 0;

  constructor(
    public readonly role: StorageRole,
    private readonly endpoint: string,
    private credentials: R2Credentials,
    private readonly region = 'auto'
  ) {
    this.client = this.buildClient(credentials, 0);
  }

  private buildClient(credentials: R2Credentials, systemClockOffset: number): S3Client {
    return new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true,
      systemClockOffset,
      credentials,
      requestHandler: { requestTimeout: 15_000 } as unknown as NonNullable<ConstructorParameters<typeof S3Client>[0]>['requestHandler'],
    });
  }

  private async ensureClockSync(): Promise<void> {
    if (Date.now() - this.clockSyncedAt < 5 * 60_000) return;
    try {
      const res = await fetch(this.endpoint, { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      const dateHeader = res.headers.get('date');
      if (dateHeader) {
        const remoteMs = Date.parse(dateHeader);
        if (Number.isFinite(remoteMs)) {
          const offset = remoteMs - Date.now();
          this.clockOffsetMs = Math.abs(offset) > 5_000 ? offset : 0;
          if (this.clockOffsetMs !== 0) {
            this.client = this.buildClient(this.credentials, this.clockOffsetMs);
          }
        }
      }
      this.clockSyncedAt = Date.now();
    } catch {
      // Non-fatal: keep existing clockOffsetMs
    }
  }

  /**
   * Dual-key hot credential rotation without dropping in-flight requests.
   */
  rotateCredentials(nextCredentials: R2Credentials): void {
    this.credentials = nextCredentials;
    this.client = this.buildClient(nextCredentials, this.clockOffsetMs);
  }

  private getBreaker(bucket: string): BucketCircuitBreaker {
    let b = this.breakers.get(bucket);
    if (!b) {
      b = new BucketCircuitBreaker();
      this.breakers.set(bucket, b);
    }
    return b;
  }

  async head(bucket: string, key: string): Promise<ObjectHeadResult> {
    try {
      const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
        this.client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
      );
      return {
        exists: true,
        contentLength: out.ContentLength,
        contentType: out.ContentType,
        etag: out.ETag,
        lastModified: out.LastModified,
      };
    } catch (err) {
      if (err instanceof StoragePortError && err.problem.status === 404) {
        return { exists: false };
      }
      throw err;
    }
  }

  async get(bucket: string, key: string) {
    const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    );
    return {
      body: out.Body as Readable,
      contentType: out.ContentType,
      contentLength: out.ContentLength,
      etag: out.ETag,
    };
  }

  async put(bucket: string, key: string, body: Buffer | Uint8Array | Readable, options?: { contentType?: string; contentLength?: number; cacheControl?: string }) {
    const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: options?.contentType,
          ContentLength: options?.contentLength,
          CacheControl: options?.cacheControl,
        })
      )
    );
    return { etag: out.ETag };
  }

  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string) {
    const out = await withStorageRetry(destBucket, this.getBreaker(destBucket), () =>
      this.client.send(
        new CopyObjectCommand({
          Bucket: destBucket,
          Key: destKey,
          CopySource: `${sourceBucket}/${encodeURIComponent(sourceKey).replace(/%2F/g, '/')}`,
        })
      )
    );
    return { etag: out.CopyObjectResult?.ETag };
  }

  async delete(bucket: string, key: string) {
    await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    );
  }

  async deleteMany(bucket: string, keys: string[]) {
    let deletedCount = 0;
    let errors = 0;
    for (let i = 0; i < keys.length; i += R2_DELETE_MANY_BATCH_LIMIT) {
      const batch = keys.slice(i, i + R2_DELETE_MANY_BATCH_LIMIT);
      const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
        this.client.send(
          new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
          })
        )
      );
      errors += out.Errors?.length || 0;
      deletedCount += batch.length - (out.Errors?.length || 0);
    }
    return { deletedCount, errors };
  }

  async presignPut(bucket: string, key: string, options: { contentType: string; contentLength?: number; expiresInSeconds: number }) {
    await this.ensureClockSync();
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: options.contentType,
      ContentLength: options.contentLength,
    });
    return getSignedUrl(this.client, cmd, {
      expiresIn: options.expiresInSeconds,
      signingDate: new Date(Date.now() + this.clockOffsetMs),
    });
  }

  async presignGet(bucket: string, key: string, expiresInSeconds: number, responseContentDisposition?: string) {
    await this.ensureClockSync();
    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: responseContentDisposition,
    });
    return getSignedUrl(this.client, cmd, {
      expiresIn: expiresInSeconds,
      signingDate: new Date(Date.now() + this.clockOffsetMs),
    });
  }

  async createMultipart(bucket: string, key: string, contentType: string) {
    await this.ensureClockSync();
    const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(new CreateMultipartUploadCommand({ Bucket: bucket, Key: key, ContentType: contentType }))
    );
    if (!out.UploadId) throw new Error('R2 did not return UploadId');
    return { uploadId: out.UploadId };
  }

  async presignPart(bucket: string, key: string, uploadId: string, partNumber: number, expiresInSeconds: number) {
    await this.ensureClockSync();
    const cmd = new UploadPartCommand({ Bucket: bucket, Key: key, UploadId: uploadId, PartNumber: partNumber });
    return getSignedUrl(this.client, cmd, {
      expiresIn: expiresInSeconds,
      signingDate: new Date(Date.now() + this.clockOffsetMs),
    });
  }

  async completeMultipart(bucket: string, key: string, uploadId: string, parts: CompletedPartInput[]) {
    const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(
        new CompleteMultipartUploadCommand({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts.map((p) => ({ PartNumber: p.partNumber, ETag: p.etag })) },
        })
      )
    );
    return { etag: out.ETag };
  }

  async abortMultipart(bucket: string, key: string, uploadId: string) {
    await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(new AbortMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId: uploadId }))
    );
  }

  async listParts(bucket: string, key: string, uploadId: string) {
    const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(new ListPartsCommand({ Bucket: bucket, Key: key, UploadId: uploadId }))
    );
    return (out.Parts || []).map((p) => ({
      partNumber: Number(p.PartNumber || 0),
      etag: p.ETag || '',
      size: Number(p.Size || 0),
    }));
  }

  async list(bucket: string, prefix: string, cursor?: string, maxKeys = 100): Promise<ListResult> {
    const out = await withStorageRetry(bucket, this.getBreaker(bucket), () =>
      this.client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: cursor,
          MaxKeys: Math.min(maxKeys, 1000),
        })
      )
    );
    return {
      keys: (out.Contents || []).map((c) => ({
        key: c.Key || '',
        size: Number(c.Size || 0),
        etag: c.ETag,
        lastModified: c.LastModified,
      })),
      nextCursor: out.NextContinuationToken,
      isTruncated: Boolean(out.IsTruncated),
    };
  }
}
