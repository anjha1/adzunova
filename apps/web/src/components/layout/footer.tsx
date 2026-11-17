import Link from 'next/link';
import { Logo } from './logo';

// ---------------------------------------------------------------------------
// Footer link columns
// ---------------------------------------------------------------------------
interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Platform',
    links: [
      { label: 'Product Tour', href: '/product' },
      { label: 'For Creators', href: '/for-creators' },
      { label: 'For Brands', href: '/for-brands' },
      { label: 'Trust & Verification', href: '/trust' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Ecosystem',
    links: [
      { label: 'YouTube Creators', href: '/for-creators' },
      { label: 'Instagram & TikTok', href: '/for-creators' },
      { label: 'Actors & Voice Artists', href: '/for-creators' },
      { label: 'D2C & Brands', href: '/for-brands' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Early Access', href: '/#join' },
      { label: 'Platform FAQ', href: '/faq' },
      { label: 'Trust & Safety', href: '/trust' },
      { label: 'Support', href: 'mailto:support@adzunova.com' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security Overview', href: '/trust' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Footer — Server Component
// ---------------------------------------------------------------------------

// Year is a module-level constant — evaluated once at build time, not inside
// the render function. Next.js 16 prerendering guard does not flag module-level
// expressions, only render-phase calls to unstable APIs like new Date().
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-subtle)',
        marginTop: 'auto',
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '3.5rem 1.5rem 2.5rem',
        }}
      >
        {/* Top row: Logo + tagline | Columns */}
        <div
          style={{
            display: 'grid',
            gap: '3rem',
            gridTemplateColumns: '1fr',
          }}
          className="sm:grid-cols-2 lg:grid-cols-5"
        >
          {/* Brand column */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            className="lg:col-span-1"
          >
            <Logo />
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-fg-secondary)',
                lineHeight: 1.6,
                maxWidth: '16rem',
              }}
            >
              The global marketplace where creators, influencers, and brands
              build lasting partnerships.
            </p>
          </div>

          {/* Link columns */}
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
            className="sm:col-span-1 lg:col-span-4 md:grid-cols-4"
          >
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: 'var(--color-fg-muted)',
                    marginBottom: '1rem',
                  }}
                >
                  {col.heading}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-fg-secondary)',
                          textDecoration: 'none',
                          transition: 'color 100ms ease',
                        }}
                        className="hover:text-[var(--color-fg-primary)] focus-visible:outline-none focus-visible:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-fg-muted)',
            }}
          >
            &copy; {CURRENT_YEAR} Adzunova. All rights reserved.
          </p>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-fg-muted)',
            }}
          >
            Global Creator &amp; Brand Collaboration Marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
