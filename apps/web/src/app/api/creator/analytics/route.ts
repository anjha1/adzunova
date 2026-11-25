import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSocialAccountLatest } from '@/lib/social/latest-state';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const creatorId = session?.user?.id;

    if (!creatorId) {
      return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
    }

    const { headers, url } = req;
    const acceptLanguage = headers.get('accept-language');
    const locale = acceptLanguage ? acceptLanguage.split(',')[0].split(';')[0].trim() : undefined;
    const reqUrl = new URL(url);
    const providerParam = reqUrl.searchParams.get('provider');
    const provider =
      providerParam === 'youtube' || providerParam === 'instagram' ? providerParam : undefined;

    const latest = await getSocialAccountLatest(creatorId, { locale, provider });

    return NextResponse.json({
      hasConnectedAccount: latest.hasConnectedAccount,
      account: latest.account,
      accounts: latest.accounts,
      totalReach: latest.totalReach,
      totalViews: latest.totalViews24h || 0,
      totalViews24h: latest.totalViews24h,
      audienceScore: latest.audienceScore,
      audienceScoreDisplay: latest.audienceScoreDisplay,
      isScoreComplete: latest.isScoreComplete,
      qualityEvaluation: latest.qualityEvaluation,
      followersSeries: latest.followersSeries,
      viewsSeries: latest.viewsSeries,
      demographics: latest.demographics?.raw || null,
      enrichedDemographics: latest.demographics,
      verificationLabel: latest.verificationLabel,
      youtubeSummary: latest.youtubeSummary || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error fetching creator analytics' },
      { status: 500 }
    );
  }
}
