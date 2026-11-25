import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getYouTubeConfigStatus } from '@/lib/config';
import { runYouTubeProbeMatrix } from '@/lib/social/youtube-client';
import { scrubSensitiveData } from '@/lib/social/security/log-scrubber';

/**
 * Phase 1 Diagnostic Probe Endpoint:
 * Runs live YouTube Data API v3 + YouTube Analytics API v2 probes
 * and returns scrubbed shape/status/error-reason diagnostics.
 * Strictly gated behind DEBUG_OAUTH=true and CREATOR session.
 */
export async function GET(req: NextRequest) {
  if (process.env.DEBUG_OAUTH !== 'true') {
    return NextResponse.json(
      { error: 'Debug probes disabled. Set DEBUG_OAUTH=true.' },
      { status: 403 }
    );
  }

  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ytConfig = getYouTubeConfigStatus();
  if (!ytConfig.configured) {
    return NextResponse.json(
      { error: ytConfig.reason || 'YouTube Connect is not configured' },
      { status: 400 }
    );
  }

  const probeToken = req.headers.get('x-debug-token');
  if (!probeToken) {
    return NextResponse.json(
      { error: 'Provide x-debug-token header with a live Google OAuth access token (never logged/stored)' },
      { status: 400 }
    );
  }

  try {
    const matrix = await runYouTubeProbeMatrix(probeToken);
    return NextResponse.json(matrix, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: scrubSensitiveData(err instanceof Error ? err.message : 'Probe execution failed') },
      { status: 500 }
    );
  }
}
