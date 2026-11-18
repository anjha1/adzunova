/**
 * Regression Test: Email addresses must NEVER appear in verification page URLs.
 *
 * This test scans the source code for the actual patterns that caused the
 * vulnerability — query-parameter construction, useSearchParams consumption
 * of email, and emailParam references on verify-email pages — to ensure
 * they are never reintroduced.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const WEB_SRC = join(__dirname, '..', '..', '..', 'apps', 'web', 'src');

function readSource(relativePath: string): string {
  const fullPath = join(WEB_SRC, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Expected source file not found: ${fullPath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

describe('Email URL Privacy — Verification Pages', () => {
  const verifyPages = [
    'app/(marketing)/auth/brand/verify-email/page.tsx',
    'app/(marketing)/auth/creator/verify-email/page.tsx',
  ];

  const signUpPages = [
    'app/(marketing)/auth/brand/sign-up/page.tsx',
    'app/(marketing)/auth/creator/sign-up/page.tsx',
  ];

  describe('verify-email pages must not read email from URL', () => {
    for (const page of verifyPages) {
      it(`${page} does not use useSearchParams`, () => {
        const src = readSource(page);
        expect(src).not.toContain('useSearchParams');
      });

      it(`${page} does not reference emailParam`, () => {
        const src = readSource(page);
        expect(src).not.toContain('emailParam');
      });

      it(`${page} does not reference searchParams.get('email')`, () => {
        const src = readSource(page);
        expect(src).not.toMatch(/searchParams\.get\s*\(\s*['"]email['"]\s*\)/);
      });

      it(`${page} fetches email from /api/auth/me session`, () => {
        const src = readSource(page);
        expect(src).toContain('/api/auth/me');
      });

      it(`${page} masks the email before display`, () => {
        const src = readSource(page);
        expect(src).toContain('maskEmail');
      });

      it(`${page} does not send email in OTP verify request body`, () => {
        const src = readSource(page);
        // The verify-otp fetch body should NOT include an email field
        // Match the JSON.stringify block for verify-otp
        const verifyBlocks = src.split("action: 'verify-otp'");
        for (let i = 1; i < verifyBlocks.length; i++) {
          // Look at the next ~200 chars after action: 'verify-otp'
          const block = verifyBlocks[i].slice(0, 200);
          expect(block).not.toMatch(/email\s*:/);
        }
      });

      it(`${page} does not send email in OTP resend request body`, () => {
        const src = readSource(page);
        const resendBlocks = src.split("action: 'send-otp'");
        for (let i = 1; i < resendBlocks.length; i++) {
          const block = resendBlocks[i].slice(0, 200);
          expect(block).not.toMatch(/email\s*:/);
        }
      });
    }
  });

  describe('sign-up pages must not append email to verify-email URL', () => {
    for (const page of signUpPages) {
      it(`${page} navigates to verify-email without query parameters`, () => {
        const src = readSource(page);
        // Must contain the clean push
        expect(src).toMatch(/router\.push\s*\(\s*['"]\/auth\/(brand|creator)\/verify-email['"]\s*\)/);
        // Must NOT contain the old pattern with query params
        expect(src).not.toMatch(/verify-email\?email/);
        expect(src).not.toContain('encodeURIComponent');
      });
    }
  });

  describe('middleware does not inject email into verify-email redirects', () => {
    it('middleware.ts does not reference verify-email at all', () => {
      const src = readSource('../src/middleware.ts');
      expect(src).not.toContain('verify-email');
    });
  });

  describe('API route does not leak email into redirect URLs', () => {
    it('auth route.ts does not construct verify-email URLs', () => {
      const src = readSource('app/api/auth/route.ts');
      expect(src).not.toContain('verify-email');
    });
  });
});
