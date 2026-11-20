import { NextResponse } from 'next/server';
import { CURRENT_PLATFORM_FEE_CONFIG } from '@/lib/rate-card/quote-calculator';

export async function GET() {
  return NextResponse.json(CURRENT_PLATFORM_FEE_CONFIG);
}
