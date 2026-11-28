import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireStorageActor, problemResponse } from '@/lib/storage/http-auth';
import { createUploadSession } from '@/lib/storage/upload-service';
import type { StoragePurpose } from '@/lib/storage/classification';

const CreateUploadSchema = z.object({
  purpose: z.enum([
    'creator_avatar',
    'creator_cover',
    'brand_logo',
    'public_media_kit_thumb',
    'creator_media_kit_pdf',
    'campaign_deliverable_draft',
    'contract_pdf',
    'invoice_pdf',
    'kyc_pan_document',
    'kyc_gst_document',
    'dispute_evidence',
    'async_export',
  ]),
  fileName: z.string().trim().min(1).max(255),
  declaredSize: z.number().int().positive(),
  declaredContentType: z.string().trim().min(3).max(128),
  sha256: z.string().trim().regex(/^[0-9a-fA-F]{64}$/).optional(),
  idempotencyKey: z.string().trim().min(8).max(128).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireStorageActor(req, 'uploads-create', 30);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const parsed = CreateUploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          type: 'urn:adzunova:problems:validation-error',
          title: 'Invalid Upload Request',
          status: 400,
          detail: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
          code: 'VALIDATION_ERROR',
          retryable: false,
        },
        { status: 400 }
      );
    }

    const headerIdemp = req.headers.get('idempotency-key')?.trim();
    const idempotencyKey = parsed.data.idempotencyKey || headerIdemp || crypto.randomUUID();

    const session = await createUploadSession({
      actor: auth.actor,
      purpose: parsed.data.purpose as StoragePurpose,
      fileName: parsed.data.fileName,
      declaredSize: parsed.data.declaredSize,
      declaredContentType: parsed.data.declaredContentType,
      expectedSha256: parsed.data.sha256,
      idempotencyKey,
    });

    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    return problemResponse('POST /api/storage/uploads', err);
  }
}
