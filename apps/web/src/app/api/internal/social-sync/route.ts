import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { runSchedulerIteration } from '@/lib/social/scheduler';
import { globalYouTubeQuotaBudgeter } from '@/lib/social/youtube-quota';

function timingSafeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Authenticated internal endpoint invoked by Render Cron Job to drive
 * sharded social sync across Instagram and YouTube accounts.
 * Fails closed when INTERNAL_CRON_SECRET is unset or does not match.
 */
export async function POST(req: NextRequest) {
  const expectedSecret = (process.env.INTERNAL_CRON_SECRET || '').trim();
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Internal cron endpoint not configured' },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token || !timingSafeMatch(token, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const shardIndex = Number.isInteger(body?.shardIndex) ? body.shardIndex : 0;
  const totalShards = Number.isInteger(body?.totalShards) ? body.totalShards : 1;
  const batchSize = Number.isInteger(body?.batchSize) ? Math.min(body.batchSize, 50) : 20;

  const summary = await runSchedulerIteration({
    shardIndex,
    totalShards,
    batchSize,
    maxConcurrency: 5,
  });

  return NextResponse.json({
    ok: true,
    summary: {
      accountsEvaluated: summary.accountsEvaluated,
      jobsDispatched: summary.jobsDispatched,
      jobsDeduplicated: summary.jobsDeduplicated,
      successCount: summary.successCount,
      failureCount: summary.failureCount,
      durationMs: summary.durationMs,
    },
    youtubeQuota: globalYouTubeQuotaBudgeter.getStatus(),
  });
}
