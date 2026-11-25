import { NextResponse } from 'next/server';
import { getYouTubeConfigStatus } from '@/lib/config';

export interface ProviderCapability {
  configured: boolean;
  status: 'ACTIVE' | 'NOT_CONFIGURED';
  reason?: string;
}

export interface PlatformCapabilities {
  social: {
    googleYouTube: ProviderCapability;
    metaInstagram: ProviderCapability;
    tiktok: ProviderCapability;
    x: ProviderCapability;
    linkedin: ProviderCapability;
  };
  payments: {
    razorpay: ProviderCapability;
    stripeConnect: ProviderCapability;
  };
  kyc: ProviderCapability;
  llm: ProviderCapability;
  storage: ProviderCapability;
}

export async function GET() {
  const youtubeStatus = getYouTubeConfigStatus();
  const capabilities: PlatformCapabilities = {
    social: {
      googleYouTube: {
        configured: youtubeStatus.configured,
        status: youtubeStatus.status,
        reason: youtubeStatus.reason,
      },
      metaInstagram: {
        configured: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
        status: (process.env.META_APP_ID && process.env.META_APP_SECRET) ? 'ACTIVE' : 'NOT_CONFIGURED',
        reason: !(process.env.META_APP_ID && process.env.META_APP_SECRET) ? 'META_APP_ID or META_APP_SECRET not configured in server environment' : undefined,
      },
      tiktok: {
        configured: Boolean(process.env.TIKTOK_CLIENT_KEY),
        status: process.env.TIKTOK_CLIENT_KEY ? 'ACTIVE' : 'NOT_CONFIGURED',
        reason: 'TikTok Developer API credentials not supplied',
      },
      x: {
        configured: Boolean(process.env.X_CLIENT_ID),
        status: process.env.X_CLIENT_ID ? 'ACTIVE' : 'NOT_CONFIGURED',
        reason: 'X API v2 client credentials not configured',
      },
      linkedin: {
        configured: false,
        status: 'NOT_CONFIGURED',
        reason: 'LinkedIn Developer app not configured',
      },
    },
    payments: {
      razorpay: {
        configured: Boolean(process.env.RAZORPAY_KEY_ID),
        status: process.env.RAZORPAY_KEY_ID ? 'ACTIVE' : 'NOT_CONFIGURED',
        reason: 'Payment gateway API keys pending',
      },
      stripeConnect: {
        configured: false,
        status: 'NOT_CONFIGURED',
        reason: 'Stripe Connect merchant keys not supplied',
      },
    },
    kyc: {
      configured: false,
      status: 'NOT_CONFIGURED',
      reason: 'Automated government ID verification provider not configured',
    },
    llm: {
      configured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
      status: process.env.GEMINI_API_KEY ? 'ACTIVE' : 'NOT_CONFIGURED',
      reason: 'LLM provider API key not supplied',
    },
    storage: {
      configured: true,
      status: 'ACTIVE',
    },
  };

  return NextResponse.json(capabilities);
}
