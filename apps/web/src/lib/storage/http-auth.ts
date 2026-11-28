import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { mapS3ErrorToProblem, StoragePortError } from './errors';
import { checkStorageRateLimit, extractClientIp } from './rate-limit';
import { safeLogStorageError, type AuthActor } from './upload-service';

export async function requireStorageActor(
  req: NextRequest,
  bucket = 'default',
  limit = 60
): Promise<{ ok: true; actor: AuthActor } | { ok: false; response: NextResponse }> {
  const ip = extractClientIp(req);
  const ipLimit = checkStorageRateLimit(`ip:${bucket}:${ip}`, limit * 2, 60_000);
  if (!ipLimit.allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          type: 'urn:adzunova:problems:rate-limited',
          title: 'Too Many Requests',
          status: 429,
          detail: 'Too many upload requests from this IP. Please retry shortly.',
          code: 'RATE_LIMITED',
          retryable: true,
        },
        { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSeconds) } }
      ),
    };
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          type: 'urn:adzunova:problems:unauthorized',
          title: 'Unauthorized',
          status: 401,
          detail: 'Authentication required.',
          code: 'UNAUTHORIZED',
          retryable: false,
        },
        { status: 401 }
      ),
    };
  }

  const userLimit = checkStorageRateLimit(`user:${bucket}:${session.user.id}`, limit, 60_000);
  if (!userLimit.allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          type: 'urn:adzunova:problems:rate-limited',
          title: 'Too Many Requests',
          status: 429,
          detail: 'Too many upload requests. Please slow down.',
          code: 'RATE_LIMITED',
          retryable: true,
        },
        { status: 429, headers: { 'Retry-After': String(userLimit.retryAfterSeconds) } }
      ),
    };
  }

  const ownerType = session.user.role === 'BRAND' ? 'BRAND' : 'CREATOR';
  return {
    ok: true,
    actor: {
      userId: session.user.id,
      tenantId: `${ownerType.toLowerCase()}:${session.user.id}`,
      ownerType,
      ownerId: session.user.id,
    },
  };
}

export function problemResponse(context: string, err: unknown): NextResponse {
  safeLogStorageError(context, err);
  if (err instanceof StoragePortError) {
    return NextResponse.json(err.problem, { status: err.problem.status });
  }
  const problem = mapS3ErrorToProblem(err);
  return NextResponse.json(problem, { status: problem.status });
}
