import { NextRequest, NextResponse } from 'next/server';
import { requireStorageActor, problemResponse } from '@/lib/storage/http-auth';
import { abortUploadSession, getUploadSessionStatus } from '@/lib/storage/upload-service';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStorageActor(req, 'uploads-status', 60);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const status = await getUploadSessionStatus({ actor: auth.actor, sessionId: id });
    return NextResponse.json(status);
  } catch (err) {
    return problemResponse('GET /api/storage/uploads/:id', err);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStorageActor(req, 'uploads-abort', 30);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const res = await abortUploadSession({ actor: auth.actor, sessionId: id });
    return NextResponse.json(res);
  } catch (err) {
    return problemResponse('DELETE /api/storage/uploads/:id', err);
  }
}
