import { NextRequest, NextResponse } from 'next/server';
import { requireStorageActor, problemResponse } from '@/lib/storage/http-auth';
import { issueAuthorizedDownloadUrl } from '@/lib/storage/upload-service';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStorageActor(req, 'assets-download', 60);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const res = await issueAuthorizedDownloadUrl({ actor: auth.actor, assetId: id });
    return NextResponse.json(res);
  } catch (err) {
    return problemResponse('GET /api/storage/assets/:id/download-url', err);
  }
}
