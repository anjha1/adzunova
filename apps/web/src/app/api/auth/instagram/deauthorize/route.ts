import { NextRequest, NextResponse } from 'next/server';
import { verifyMetaSignedRequest } from '@/lib/social/security/meta-signature';
import { deauthorizeMetaUser } from '@/lib/social/social-repository';

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

    // 1. Verify signature with constant-time HMAC-SHA256 check & replay protection
    const verifyResult = verifyMetaSignedRequest(signedRequest, appSecret);
    if (!verifyResult.valid || !verifyResult.payload) {
      return NextResponse.json({ error: verifyResult.error || 'Invalid signature' }, { status: 401 });
    }

    const metaUserId = verifyResult.payload.user_id;
    if (!metaUserId) {
      return NextResponse.json({ error: 'Payload missing user_id' }, { status: 400 });
    }

    // 2. Perform deauthorization: remove credentials, mark REVOKED
    await deauthorizeMetaUser(metaUserId);

    return NextResponse.json({ success: true, user_id: metaUserId });
  } catch (err) {
    console.error('[MetaDeauthorize] Error processing deauthorization:', err);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }
}
