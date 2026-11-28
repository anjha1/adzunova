import { NextRequest, NextResponse } from 'next/server';
import { assertDevBucketPrefix } from '@/lib/storage/env';
import { getStorageAdapterForRole } from '@/lib/storage/runtime';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || '';
  if (!key.startsWith('public/') || key.includes('..')) {
    return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
  }

  const reader = getStorageAdapterForRole('reader');
  if (!reader.ok || !reader.runtime.isDevTarget) {
    return NextResponse.json({ error: 'Dev public reader not active' }, { status: 404 });
  }

  assertDevBucketPrefix(reader.runtime.buckets.public);

  try {
    const obj = await reader.port.get(reader.runtime.buckets.public, key);
    const chunks: Buffer[] = [];
    for await (const chunk of obj.body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const body = Buffer.concat(chunks);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': obj.contentType || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
