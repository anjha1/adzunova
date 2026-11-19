import { describe, it, expect, vi } from 'vitest';

// Simulating the session check contract in apps/web/src/app/creator/layout.tsx
interface MockUser {
  id: string;
  email: string;
  role: 'CREATOR' | 'BRAND' | 'ADMIN';
  emailVerified: boolean;
}

interface MockSession {
  user: MockUser;
  profile?: { displayName?: string };
}

function evaluateLayoutGuard(session: MockSession | null): { action: 'RENDER' | 'REDIRECT'; target?: string } {
  if (!session || !session.user) {
    return { action: 'REDIRECT', target: '/api/auth/logout?redirect=/auth/creator/sign-in' };
  }

  if (session.user.role !== 'CREATOR') {
    return { action: 'REDIRECT', target: '/brand/dashboard' };
  }

  return { action: 'RENDER' };
}

describe('Creator Layout Auth & RBAC Guard', () => {
  it('redirects to sign-in when no session cookie is present', () => {
    const outcome = evaluateLayoutGuard(null);
    expect(outcome.action).toBe('REDIRECT');
    expect(outcome.target).toBe('/api/auth/logout?redirect=/auth/creator/sign-in');
  });

  it('redirects to /brand/dashboard when user has BRAND role instead of CREATOR', () => {
    const brandSession: MockSession = {
      user: {
        id: 'u-brand-1',
        email: 'brand@corporate.com',
        role: 'BRAND',
        emailVerified: true,
      },
    };

    const outcome = evaluateLayoutGuard(brandSession);
    expect(outcome.action).toBe('REDIRECT');
    expect(outcome.target).toBe('/brand/dashboard');
  });

  it('renders successfully when user has active CREATOR role', () => {
    const creatorSession: MockSession = {
      user: {
        id: 'u-creator-1',
        email: 'creator@adzunova.com',
        role: 'CREATOR',
        emailVerified: true,
      },
      profile: { displayName: 'Verified Tech Creator' },
    };

    const outcome = evaluateLayoutGuard(creatorSession);
    expect(outcome.action).toBe('RENDER');
  });
});
