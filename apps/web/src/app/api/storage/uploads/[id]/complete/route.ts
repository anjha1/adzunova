import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireStorageActor, problemResponse } from '@/lib/storage/http-auth';
import { completeUploadSession } from '@/lib/storage/upload-service';

const CompleteSchema = z.object({
  parts: z
    .array(
      z.object({
        partNumber: z.number().int().positive(),
        etag: z.string().trim().min(1).max(128),
      })
    )
    .optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStorageActor(req, 'uploads-complete', 30);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    let parts: Array<{ partNumber: number; etag: string }> | undefined;
    try {
      const text = await req.text();
      if (text.trim()) {
        const parsed = CompleteSchema.safeParse(JSON.parse(text));
        if (!parsed.success) {
          return NextResponse.json(
            {
              type: 'urn:adzunova:problems:validation-error',
              title: 'Invalid Complete Payload',
              status: 400,
              detail: 'parts must contain { partNumber, etag } items.',
              code: 'VALIDATION_ERROR',
              retryable: false,
            },
            { status: 400 }
          );
        }
        parts = parsed.data.parts;
      }
    } catch {
      return NextResponse.json(
        {
          type: 'urn:adzunova:problems:validation-error',
          title: 'Invalid JSON',
          status: 400,
          detail: 'Request body must be valid JSON.',
          code: 'INVALID_JSON',
          retryable: false,
        },
        { status: 400 }
      );
    }

    const result = await completeUploadSession({
      actor: auth.actor,
      sessionId: id,
      parts,
    });
    return NextResponse.json(result);
  } catch (err) {
    return problemResponse('POST /api/storage/uploads/:id/complete', err);
  }
}
