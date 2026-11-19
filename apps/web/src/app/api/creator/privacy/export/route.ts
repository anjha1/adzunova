import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSocialAccountsByCreatorId, getSocialAuditLogs } from '@/lib/social/social-repository';
import { getLatestAudienceSnapshot, getMetricSeries } from '@/lib/social/metrics-store';

export async function GET() {
  try {
    const session = await getSession();
    const creatorId = session?.user?.id;

    if (!creatorId) {
      return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
    }

    const accounts = await getSocialAccountsByCreatorId(creatorId);
    const auditLogs = await getSocialAuditLogs(creatorId);

    const accountSnapshots = await Promise.all(
      accounts.map(async (acc) => {
        const snapshot = await getLatestAudienceSnapshot(acc.id);
        const viewsSeries = await getMetricSeries(
          acc.id,
          'views',
          new Date(Date.now() - 30 * 86400 * 1000),
          new Date()
        );

        return {
          id: acc.id,
          provider: acc.provider,
          username: acc.username,
          accountType: acc.account_type,
          followersCount: acc.followers_count,
          mediaCount: acc.media_count,
          status: acc.status,
          capabilities: acc.capabilities,
          connectedAt: acc.connected_at,
          lastSyncedAt: acc.last_synced_at,
          audienceSnapshot: snapshot,
          recentViewsSeries: viewsSeries.points,
        };
      })
    );

    const exportPackage = {
      exportMetadata: {
        creatorId,
        generatedAt: new Date().toISOString(),
        regulationCompliance: ['DPDP Act 2023 (India)', 'GDPR Article 20', 'CCPA'],
        dataController: 'Adzunova Marketplace',
      },
      creatorProfile: {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
      },
      connectedPlatforms: accountSnapshots,
      complianceAuditTrail: auditLogs,
    };

    return NextResponse.json(exportPackage, {
      headers: {
        'Content-Disposition': `attachment; filename="adzunova-privacy-export-${creatorId}.json"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to export creator privacy data' },
      { status: 500 }
    );
  }
}
