import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPublicProfileBySlug, recordProfileReport } from '@/lib/public-profile/public-profile-repository';
import { profileReportSchema } from '@/lib/public-profile/validation';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const { profile } = await getPublicProfileBySlug(slug);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const parseRes = profileReportSchema.safeParse(body);

    if (!parseRes.success) {
      return NextResponse.json({ error: parseRes.error.issues?.[0]?.message || 'Invalid report' }, { status: 400 });
    }

    // Bot honeypot check
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const reporterHash = crypto
      .createHash('sha256')
      .update(`${ip}_adzunova_report_salt`)
      .digest('hex')
      .slice(0, 20);

    await recordProfileReport({
      profileId: profile.id,
      slug: profile.slug,
      reason: parseRes.data.reason,
      details: parseRes.data.details,
      reporterHash,
    });

    return NextResponse.json({
      ok: true,
      message: 'Report submitted successfully. Our trust & safety team will review it within 24 hours.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
