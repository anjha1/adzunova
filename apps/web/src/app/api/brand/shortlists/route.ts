import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkspaceShortlists,
  createShortlist,
  toggleCreatorInShortlist,
} from '@/lib/discovery/shortlist-service';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const workspaceId = session?.user?.id || 'ws_default';

    const shortlists = await getWorkspaceShortlists(workspaceId);
    return NextResponse.json({ shortlists });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch shortlists' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const workspaceId = session?.user?.id || 'ws_default';

    const body = await req.json();

    if (body.action === 'create') {
      const list = await createShortlist(workspaceId, body.name);
      return NextResponse.json({ success: true, shortlist: list });
    }

    if (body.action === 'toggle') {
      const res = await toggleCreatorInShortlist(
        workspaceId,
        body.shortlistId,
        body.creatorId
      );
      return NextResponse.json({ success: true, ...res });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Shortlist operation failed' },
      { status: 500 }
    );
  }
}
