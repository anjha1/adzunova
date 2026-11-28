import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireStorageActor, problemResponse } from '@/lib/storage/http-auth';
import { issuePartUploadUrls } from '@/lib/storage/upload-service';

const PartsSchema = z.object({
  partNumbers: z.array(z.number().int().positive()).min(1).max(50),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStorageActor(req, 'uploads-parts', 60);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const parsed = PartsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          type: 'urn:adzunova:problems:validation-error',
          title: 'Invalid Part Request',
          status: 400,
          detail: 'partNumbers must be an array of 1 to 50 positive integers.',
          code: 'VALIDATION_ERROR',
          retryable: false,
        },
        { status: 400 }
      );
    }

    const res = await issuePartUploadUrls({
      actor: auth.actor,
      sessionId: id,
      partNumbers: parsed.data.partNumbers,
    });
    return NextResponse.json(res);
  } catch (err) {
    return problemResponse('POST /api/storage/uploads/:id/parts', err);
  }
}
