export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  retryable: boolean;
}

/**
 * Scrubs R2 access keys, secret keys, presigned URL signatures, and query strings from any text.
 */
export function scrubStorageSecrets(input: string): string {
  if (!input) return '';
  return input
    .replace(/(X-Amz-Signature=)[^&\s"']+/gi, '$1[REDACTED]')
    .replace(/(X-Amz-Credential=)[^&\s"']+/gi, '$1[REDACTED]')
    .replace(/(X-Amz-Security-Token=)[^&\s"']+/gi, '$1[REDACTED]')
    .replace(/https?:\/\/[^\s"']*\.r2\.cloudflarestorage\.com[^\s"']*/gi, '[REDACTED_PRESIGNED_URL]')
    .replace(/\b[A-Fa-f0-9]{32,64}\b/g, (m) => (m.length >= 32 ? '[REDACTED_KEY_OR_HASH]' : m));
}

export class StoragePortError extends Error {
  constructor(
    public readonly problem: ProblemDetails,
    cause?: unknown
  ) {
    super(problem.detail);
    this.name = 'StoragePortError';
    if (cause instanceof Error) this.cause = cause;
  }
}

export function mapS3ErrorToProblem(err: unknown): ProblemDetails {
  const record = (err && typeof err === 'object' ? err : {}) as {
    name?: string;
    Code?: string;
    $metadata?: { httpStatusCode?: number };
  };
  const rawName = record.name || record.Code || '';
  const httpStatus = Number(record.$metadata?.httpStatusCode || 500);
  const msg = scrubStorageSecrets(err instanceof Error ? err.message : String(err || 'Storage error'));

  if (rawName === 'SignatureDoesNotMatch' || msg.includes('SignatureDoesNotMatch')) {
    return {
      type: 'urn:adzunova:problems:storage-signature-mismatch',
      title: 'Storage Signature / Clock Skew Error',
      status: 502,
      detail: 'R2 request signature rejected (check server system clock skew or rotated key pairing).',
      code: 'SIGNATURE_MISMATCH_CLOCK_SKEW',
      retryable: false,
    };
  }

  if (httpStatus === 429 || rawName === 'TooManyRequests' || rawName === 'SlowDown') {
    return {
      type: 'urn:adzunova:problems:storage-rate-limited',
      title: 'Storage Rate Limited',
      status: 429,
      detail: 'Object storage throttled request (per-key 1 write/sec or bucket limit).',
      code: 'RATE_LIMITED',
      retryable: true,
    };
  }

  if (httpStatus === 404 || rawName === 'NoSuchKey' || rawName === 'NotFound') {
    return {
      type: 'urn:adzunova:problems:storage-not-found',
      title: 'Object Not Found',
      status: 404,
      detail: 'Requested storage object does not exist.',
      code: 'OBJECT_NOT_FOUND',
      retryable: false,
    };
  }

  if (httpStatus === 403 || rawName === 'AccessDenied') {
    return {
      type: 'urn:adzunova:problems:storage-forbidden',
      title: 'Storage Access Denied',
      status: 403,
      detail: 'Storage role lacks permission for this bucket or operation.',
      code: 'ACCESS_DENIED',
      retryable: false,
    };
  }

  if (httpStatus >= 500 || rawName === 'ServiceUnavailable' || rawName === 'InternalError') {
    return {
      type: 'urn:adzunova:problems:storage-upstream-unavailable',
      title: 'Storage Temporarily Unavailable',
      status: 503,
      detail: 'Object storage returned a transient upstream error.',
      code: 'UPSTREAM_5XX',
      retryable: true,
    };
  }

  return {
    type: 'urn:adzunova:problems:storage-error',
    title: 'Storage Operation Failed',
    status: httpStatus >= 400 ? httpStatus : 500,
    detail: msg || 'Storage operation failed.',
    code: 'STORAGE_ERROR',
    retryable: false,
  };
}
