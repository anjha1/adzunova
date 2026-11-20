import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPublicProfileBySlug, recordProfileEvent } from '@/lib/public-profile/public-profile-repository';
import { profileEventSchema } from '@/lib/public-profile/validation';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const { profile } = await getPublicProfileBySlug(slug);

    if (!profile || !profile.isPublished) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const parseRes = profileEventSchema.safeParse(body);

    if (!parseRes.success) {
      return NextResponse.json({ error: parseRes.error.issues?.[0]?.message || 'Invalid event' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || '';

    // Privacy-safe 1-way session hash (NEVER store raw IP or personal identifier)
    const sessionHash = crypto
      .createHash('sha256')
      .update(`${ip}_${userAgent}_${new Date().toISOString().slice(0, 10)}_adzunova_salt`)
      .digest('hex')
      .slice(0, 24);

    let deviceType: 'mobile' | 'desktop' | 'tablet' | 'unknown' = 'desktop';
    const lowerUa = userAgent.toLowerCase();
    if (lowerUa.includes('mobi')) deviceType = 'mobile';
    else if (lowerUa.includes('tablet') || lowerUa.includes('ipad')) deviceType = 'tablet';

    await recordProfileEvent({
      profileId: profile.id,
      referrer,
      country: req.headers.get('x-vercel-ip-country') || 'IN',
      deviceType,
      sessionHash,
      eventType: parseRes.data.eventType,
      metadata: parseRes.data.metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
