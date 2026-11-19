import { NextResponse } from 'next/server';

export interface PlanConfig {
  id: string;
  name: string;
  tagline: string;
  priceMinorUnits: number;
  currency: string;
  commissionBps: number;
  features: string[];
}

export interface PlatformConfigResponse {
  version: string;
  configured: boolean;
  commissionBps: number;
  rushBps: number;
  referralBps: number;
  taxPolicy: string;
  plans: PlanConfig[];
}

export async function GET() {
  // In production this resolves from platform_config DB table
  // If not configured, configured: false indicates pricing is not configured
  const isConfigured = Boolean(process.env.PLATFORM_PRICING_CONFIGURED === 'true');

  if (!isConfigured) {
    return NextResponse.json({
      version: 'v0.0.0-unconfigured',
      configured: false,
      commissionBps: 0,
      rushBps: 0,
      referralBps: 0,
      taxPolicy: 'NONE',
      plans: [],
    });
  }

  const config: PlatformConfigResponse = {
    version: 'cfg_2026_q4',
    configured: true,
    commissionBps: 1000, // 10.00%
    rushBps: 2500, // 25.00%
    referralBps: 200, // 2.00%
    taxPolicy: 'INDIA_GST_18',
    plans: [
      {
        id: 'plan_starter',
        name: 'Standard Creator',
        tagline: 'Standard marketplace access with verified escrow protection',
        priceMinorUnits: 0,
        currency: 'INR',
        commissionBps: 1000,
        features: ['Standard 10% platform fee', 'Direct brand messaging'],
      },
    ],
  };

  return NextResponse.json(config);
}
