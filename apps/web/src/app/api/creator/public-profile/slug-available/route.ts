import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isSlugAvailable } from '@/lib/public-profile/public-profile-repository';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const creatorId = session?.user?.id;

    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') || '';

    const res = await isSlugAvailable(slug, creatorId);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ available: false, reason: 'Error checking slug availability' }, { status: 500 });
  }
}
