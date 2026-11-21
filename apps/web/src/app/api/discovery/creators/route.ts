import { NextRequest, NextResponse } from 'next/server';
import { creatorSearchEngine } from '@/lib/discovery/search-engine';
import { CreatorSearchQuery } from '@/lib/discovery/search-types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query: CreatorSearchQuery = {
      query: searchParams.get('q') || searchParams.get('query') || undefined,
      platform: (searchParams.get('platform') as any) || 'all',
      minFollowers: searchParams.get('min_followers') ? Number(searchParams.get('min_followers')) : undefined,
      maxFollowers: searchParams.get('max_followers') ? Number(searchParams.get('max_followers')) : undefined,
      minBudget: searchParams.get('min_budget') ? Number(searchParams.get('min_budget')) : undefined,
      maxBudget: searchParams.get('max_budget') ? Number(searchParams.get('max_budget')) : undefined,
      budgetAmount: searchParams.get('budget_amount') ? Number(searchParams.get('budget_amount')) : undefined,
      deliverableFormat: (searchParams.get('format') as any) || undefined,
      category: searchParams.get('category') || undefined,
      audienceCountry: searchParams.get('audience_country') || searchParams.get('country') || undefined,
      min18PlusShare: searchParams.get('min_18_plus_share') ? Number(searchParams.get('min_18_plus_share')) : undefined,
      max1317Share: searchParams.get('max_13_17_share') ? Number(searchParams.get('max_13_17_share')) : undefined,
      minEngagementRate: searchParams.get('min_engagement') ? Number(searchParams.get('min_engagement')) : undefined,
      sortBy: (searchParams.get('sort_by') as any) || 'best_match',
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    };

    const result = await creatorSearchEngine.search(query);

    return NextResponse.json({
      data: result.items,
      pagination: {
        hasMore: result.hasMore,
        nextCursor: result.nextCursor || null,
        totalCount: result.totalCount,
      },
      facets: result.facets,
      queryMeta: result.queryMeta,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error executing creator discovery query' },
      { status: 500 }
    );
  }
}
