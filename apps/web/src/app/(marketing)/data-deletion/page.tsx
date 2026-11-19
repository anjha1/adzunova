import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Data Deletion Instructions | Adzunova',
  description: 'How to request deletion of your Instagram and social platform data from Adzunova.',
};

export default function DataDeletionInstructionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 desk:px-8 py-12 desk:py-16 text-foreground">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
          <span>Meta Platform Compliance</span>
        </div>
        <h1 className="text-3xl desk:text-5xl font-black tracking-tight text-foreground">
          User Data Deletion Instructions
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Adzunova provides multiple transparent mechanisms to permanently delete your connected Instagram and platform data.
        </p>
      </div>

      <div className="space-y-8 text-sm desk:text-base leading-relaxed">
        {/* Method 1: In-App Disconnect */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 font-bold text-base text-foreground mb-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
              1
            </span>
            <span>Method 1: Instant In-App Disconnect (Recommended)</span>
          </div>
          <p className="text-muted-foreground text-xs desk:text-sm">
            If you have access to your Adzunova Creator account, you can instantly revoke and delete credentials directly:
          </p>
          <ol className="list-decimal pl-5 space-y-1 mt-3 text-xs desk:text-sm text-muted-foreground">
            <li>Log in to your Adzunova Creator dashboard.</li>
            <li>Navigate to <strong>Preferences &gt; Connected Accounts</strong> (<code className="bg-muted px-1 rounded">/creator/accounts</code>).</li>
            <li>Locate the <strong>Instagram</strong> card and click <strong>Disconnect Account</strong>.</li>
            <li>Confirm the prompt. Your stored access tokens and credentials are deleted immediately from our database.</li>
          </ol>
        </div>

        {/* Method 2: Facebook Settings */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 font-bold text-base text-foreground mb-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
              2
            </span>
            <span>Method 2: Remove App via Facebook Settings (Automated Callback)</span>
          </div>
          <p className="text-muted-foreground text-xs desk:text-sm">
            You can remove Adzunova permissions directly from your Facebook / Meta account settings at any time:
          </p>
          <ol className="list-decimal pl-5 space-y-1 mt-3 text-xs desk:text-sm text-muted-foreground">
            <li>Go to your Facebook Profile &gt; <strong>Settings &amp; Privacy &gt; Settings</strong>.</li>
            <li>Look for <strong>Apps and Websites</strong>.</li>
            <li>Find <strong>Adzunova</strong> in the list of active applications.</li>
            <li>Click <strong>Remove</strong> and check the option to delete your data.</li>
            <li>
              Meta will automatically notify our server via the registered Data Deletion Callback URL. Our server immediately purges your tokens and logs a confirmation code.
            </li>
          </ol>
        </div>

        {/* Status Check Section */}
        <div className="p-6 rounded-2xl bg-muted/30 border border-border">
          <h2 className="text-base font-bold text-foreground mb-2">
            Checking Your Deletion Request Status
          </h2>
          <p className="text-xs desk:text-sm text-muted-foreground">
            If you received a data deletion confirmation code from Facebook, you can verify that your data has been successfully purged by visiting our status page:
          </p>
          <div className="mt-4">
            <Link
              href="/data-deletion-status"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs desk:text-sm shadow-xs transition"
            >
              Go to Data Deletion Status Page →
            </Link>
          </div>
        </div>

        {/* Method 3: Direct Email Request */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 font-bold text-base text-foreground mb-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
              3
            </span>
            <span>Method 3: Direct Email Request (DPDP Act / GDPR)</span>
          </div>
          <p className="text-muted-foreground text-xs desk:text-sm">
            To request a complete purge of all account records and historical communications, email our compliance team at{' '}
            <strong className="text-foreground">privacy@adzunova.com</strong> with your registered account email and Instagram handle. All requests are processed within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
