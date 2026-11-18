/**
 * Shared server-side HTTP client for identity-service.
 * Provides: 5-second timeout, 1 retry on connection errors, error.cause preservation,
 * structured error codes, elapsed time measurement, and request-ID propagation.
 *
 * Node-runtime only. Never import into client components.
 */

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:4101';

const REQUEST_TIMEOUT_MS = 15_000;
const RETRY_DELAY_MS = 300;

export type IdentityErrorCode =
  | 'IDENTITY_UNREACHABLE'   // ECONNREFUSED / network connect error
  | 'IDENTITY_TIMEOUT'       // AbortError / request timeout
  | 'IDENTITY_BAD_RESPONSE'  // 5xx from identity-service
  | 'IDENTITY_CLIENT_ERROR'  // 4xx from identity-service
  | 'IDENTITY_UNKNOWN';

export interface IdentityError {
  code: IdentityErrorCode;
  message: string;
  /** Internal diagnostic details — logged server-side only, NEVER sent to the browser */
  _internal: {
    causeCode?: string;
    url: string;
    status?: number;
    elapsedMs: number;
    attempts: number;
  };
}

export interface IdentityResult<T> {
  data?: T;
  err?: IdentityError;
}

const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function classifyFetchError(
  err: unknown,
  url: string,
  elapsedMs: number,
  attempts: number
): IdentityError {
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return {
        code: 'IDENTITY_TIMEOUT',
        message: `identity-service did not respond within ${REQUEST_TIMEOUT_MS}ms`,
        _internal: {
          causeCode: 'ETIMEDOUT',
          url,
          elapsedMs,
          attempts,
        },
      };
    }

    const cause = (err as NodeJS.ErrnoException & { cause?: unknown }).cause;
    const causeCode =
      cause instanceof Error
        ? (cause as NodeJS.ErrnoException).code
        : undefined;

    if (
      causeCode === 'ECONNREFUSED' ||
      causeCode === 'ENOTFOUND' ||
      causeCode === 'ECONNRESET' ||
      causeCode === 'ETIMEDOUT' ||
      err.message.includes('fetch failed')
    ) {
      return {
        code: 'IDENTITY_UNREACHABLE',
        message: 'identity-service is not reachable. Ensure it is running on the configured port.',
        _internal: {
          causeCode: causeCode ?? 'FETCH_FAILED',
          url,
          elapsedMs,
          attempts,
        },
      };
    }
  }

  return {
    code: 'IDENTITY_UNKNOWN',
    message: err instanceof Error ? err.message : 'Unknown fetch error',
    _internal: {
      url,
      elapsedMs,
      attempts,
    },
  };
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const signal = init.signal
      ? AbortSignal.any([controller.signal, init.signal])
      : controller.signal;
    return await fetch(url, { ...init, signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Execute a resilient HTTP request to identity-service.
 */
export async function identityFetch<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestInit & { requestId?: string } = {}
): Promise<IdentityResult<T>> {
  const { requestId, ...fetchOptions } = options;
  const url = `${IDENTITY_SERVICE_URL}${endpoint}`;
  const method = (fetchOptions.method ?? 'GET').toUpperCase();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
    ...(requestId ? { 'x-request-id': requestId } : {}),
  };

  const startTime = performance.now();
  let attempt = 0;
  const maxAttempts = IDEMPOTENT_METHODS.has(method) ? 2 : 1;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      const res = await fetchWithTimeout(url, { ...fetchOptions, headers });
      const elapsedMs = Math.round(performance.now() - startTime);

      if (res.status >= 500) {
        const body = await res.json().catch(() => ({}));
        return {
          err: {
            code: 'IDENTITY_BAD_RESPONSE',
            message: 'identity-service returned an upstream error',
            _internal: {
              url,
              status: res.status,
              causeCode: body?.error,
              elapsedMs,
              attempts: attempt,
            },
          },
        };
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return {
          err: {
            code: 'IDENTITY_CLIENT_ERROR',
            message: body?.error ?? 'Request rejected by identity-service',
            _internal: {
              url,
              status: res.status,
              elapsedMs,
              attempts: attempt,
            },
          },
        };
      }

      const data = (await res.json()) as T;
      return { data };
    } catch (err: unknown) {
      const elapsedMs = Math.round(performance.now() - startTime);
      const structured = classifyFetchError(err, url, elapsedMs, attempt);

      // Retry connection errors on idempotent requests
      if (attempt < maxAttempts && structured.code === 'IDENTITY_UNREACHABLE') {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      return { err: structured };
    }
  }

  return {
    err: {
      code: 'IDENTITY_UNKNOWN',
      message: 'Exhausted retry attempts',
      _internal: { url, elapsedMs: Math.round(performance.now() - startTime), attempts: attempt },
    },
  };
}
