import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | Adzunova',
  description: 'Adzunova Cookie Policy: Strictly essential session cookies, security tokens, and zero ad-tech tracking.',
};

export default function CookiePolicyPage() {
  const lastUpdated = 'November 25, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 desk:px-8 py-12 desk:py-16 text-foreground">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <span>Adzunova Compliance &amp; Trust</span>
        </div>
        <h1 className="text-3xl desk:text-5xl font-black tracking-tight text-foreground">
          Cookie Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last Updated: {lastUpdated} &bull; Effective Date: January 1, 2026
        </p>
      </div>

      <div className="space-y-8 text-sm desk:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            1. Overview
          </h2>
          <p className="text-muted-foreground">
            Adzunova uses only strictly necessary cookies and local browser preferences required to keep your creator or brand session authenticated, secure OAuth connections (CSRF protection), and remember your light/dark appearance preference. We do not use third-party advertising cookies, cross-site behavioral tracking, or ad-tech pixels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            2. Cookies &amp; Storage We Use
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-xs desk:text-sm">
              <thead className="border-b border-border bg-muted/40 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Purpose</th>
                  <th className="px-4 py-3 font-bold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="px-4 py-3 font-mono text-foreground">adzunova_session</td>
                  <td className="px-4 py-3">
                    Authenticates your signed-in Creator or Brand session and binds OAuth connect requests to your account.
                  </td>
                  <td className="px-4 py-3">Essential (HTTP-only, Secure)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-foreground">theme</td>
                  <td className="px-4 py-3">
                    Stores your selected UI theme (light, dark, or system) in local browser storage.
                  </td>
                  <td className="px-4 py-3">Functional (Local Storage)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            3. Third-Party OAuth Flows (Google &amp; Meta)
          </h2>
          <p className="text-muted-foreground">
            When you explicitly initiate a social connection (such as Connect YouTube or Connect Instagram) or Google Sign-In, Google or Meta may set their own authentication cookies on their respective domains while you complete consent. Adzunova never reads third-party cookies from those domains.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            4. Managing Cookies
          </h2>
          <p className="text-muted-foreground">
            You can clear or block cookies anytime through your browser settings. Note that blocking the strictly necessary <code className="text-foreground">adzunova_session</code> cookie will prevent signing in or connecting social accounts. For more details on how we handle personal data, see our{' '}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl desk:text-2xl font-bold text-foreground">
            5. Contact
          </h2>
          <p className="text-muted-foreground">
            Questions about this Cookie Policy can be sent to{' '}
            <a
              href="mailto:privacy@adzunova.com"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              privacy@adzunova.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
