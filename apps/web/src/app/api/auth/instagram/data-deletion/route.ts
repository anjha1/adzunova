import { NextRequest, NextResponse } from 'next/server';
import { verifyMetaSignedRequest } from '@/lib/social/security/meta-signature';
import { recordDataDeletionRequest } from '@/lib/social/social-repository';

export async function POST(req: NextRequest) {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    let signedRequest = '';
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      signedRequest = (formData.get('signed_request') as string) || '';
    } else {
      const body = await req.json().catch(() => ({}));
      signedRequest = body.signed_request || '';
    }

    if (!signedRequest) {
      return NextResponse.json({ error: 'Missing signed_request' }, { status: 400 });
    }

    // 1. Verify Meta signature & replay check
    const verifyResult = verifyMetaSignedRequest(signedRequest, appSecret);
    if (!verifyResult.valid || !verifyResult.payload) {
      return NextResponse.json({ error: verifyResult.error || 'Invalid signature' }, { status: 401 });
    }

    const metaUserId = verifyResult.payload.user_id;
    if (!metaUserId) {
      return NextResponse.json({ error: 'Payload missing user_id' }, { status: 400 });
    }

    // 2. Perform deletion and generate confirmation code
    const deletionRecord = await recordDataDeletionRequest(metaUserId, 'instagram');

    // 3. Construct public confirmation URL from env (no hard-coded hostname)
    const appUrl = (
      process.env.APP_BASE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      ''
    ).replace(/\/$/, '');
    const statusUrl = appUrl
      ? `${appUrl}/data-deletion-status?code=${deletionRecord.confirmation_code}`
      : `/data-deletion-status?code=${deletionRecord.confirmation_code}`;

    // 4. Return Meta-mandated JSON response format
    return NextResponse.json({
      url: statusUrl,
      confirmation_code: deletionRecord.confirmation_code,
    });
  } catch (err) {
    console.error('[MetaDataDeletion] Error processing data deletion:', err);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }
}
