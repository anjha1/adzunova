import crypto from 'node:crypto';
import { mapS3ErrorToProblem, StoragePortError } from './errors';

export type StorageRole = 'upload-signer' | 'processor' | 'reader' | 'admin-lifecycle';

// Bulkhead connection concurrency caps per role
export const ROLE_BULKHEAD_MAX_SOCKETS: Record<StorageRole, number> = {
  'upload-signer': 50,
  processor: 30,
  reader: 100,
  'admin-lifecycle': 10,
};

export class BucketCircuitBreaker {
  private failures = 0;
  private openUntilMs = 0;

  constructor(
    private readonly failureThreshold = 5,
    private readonly cooldownMs = 30_000
  ) {}

  canExecute(now = Date.now()): boolean {
    if (this.openUntilMs > now) return false;
    return true;
  }

  recordSuccess(): void {
    this.failures = 0;
    this.openUntilMs = 0;
  }

  recordFailure(now = Date.now()): void {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.openUntilMs = now + this.cooldownMs;
    }
  }
}

export async function withStorageRetry<T>(
  bucket: string,
  breaker: BucketCircuitBreaker,
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  if (!breaker.canExecute()) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-circuit-open',
      title: 'Storage Circuit Breaker Open',
      status: 503,
      detail: `Circuit breaker open for bucket "${bucket}".`,
      code: 'CIRCUIT_OPEN',
      retryable: true,
    });
  }

  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 150;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      breaker.recordSuccess();
      return result;
    } catch (err) {
      lastErr = err;
      const problem = mapS3ErrorToProblem(err);
      if (!problem.retryable || attempt === maxAttempts) {
        if (problem.status >= 500 || problem.status === 429) {
          breaker.recordFailure();
        }
        throw new StoragePortError(problem, err);
      }
      const jitter = crypto.randomInt(0, 100);
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1) + jitter;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  throw new StoragePortError(mapS3ErrorToProblem(lastErr), lastErr);
}
