import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { getPublicProfileBySlug, seedDemoProfile } from '@/lib/public-profile/public-profile-repository';
import { getSocialAccountLatest } from '@/lib/social/latest-state';
import { formatCompactCount } from '@/lib/public-profile/formatters';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    let { profile } = await getPublicProfileBySlug(slug);

    if (!profile && (slug === 'a_n_jha1' || slug === 'anjha1')) {
      profile = await seedDemoProfile('creator_anjha1', slug);
    }

    const displayName = profile?.displayName || 'Creator';
    const handle = `@${profile?.slug || slug}`;
    const bio = profile?.bio ? profile.bio.slice(0, 100) + '...' : 'Verified Media Kit & Rate Card on Adzunova';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#090A0F',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1A1830 2%, transparent 0%), radial-gradient(circle at 75px 75px, #161528 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 80px',
            color: '#FFFFFF',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Brand Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#6366F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '22px',
                }}
              >
                A
              </div>
              <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                ADZUNOVA
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              <span>● Verified on Adzunova</span>
            </div>
          </div>

          {/* Middle: Profile Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {displayName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px', color: '#A5B4FC', fontWeight: 600 }}>
                {handle}
              </span>
              <span style={{ color: '#4B5563' }}>•</span>
              <span style={{ fontSize: '20px', color: '#9CA3AF' }}>
                Verified Reach &amp; Rate Card
              </span>
            </div>
            <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '850px', lineHeight: 1.4, margin: 0 }}>
              {bio}
            </p>
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #1F2437',
              paddingTop: '24px',
            }}
          >
            <span style={{ fontSize: '18px', color: '#6B7280' }}>
              https://adzunova.com/c/{profile?.slug || slug}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '18px',
                color: '#818CF8',
                fontWeight: 700,
              }}
            >
              First-Party Meta Graph Verified
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
