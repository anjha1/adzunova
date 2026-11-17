import { describe, it, expect } from 'vitest';
import { signOAuthState, verifyOAuthState } from '../src/infrastructure/security/crypto';

describe('OAuth State Signing and Verification', () => {
  it('signs and verifies state with role and default callbackUrl', () => {
    const state = signOAuthState({ role: 'CREATOR' });
    expect(state).toBeDefined();

    const verified = verifyOAuthState(state);
    expect(verified).not.toBeNull();
    expect(verified?.role).toBe('CREATOR');
    expect(verified?.callbackUrl).toBeUndefined();
    expect(verified?.nonce).toBeDefined();
  });

  it('signs and verifies state with BRAND role and custom callbackUrl', () => {
    const customCallback = 'https://adzunova-web.onrender.com/api/auth/callback/google';
    const state = signOAuthState({
      role: 'BRAND',
      redirect: '/brand/dashboard',
      callbackUrl: customCallback,
    });

    const verified = verifyOAuthState(state);
    expect(verified).not.toBeNull();
    expect(verified?.role).toBe('BRAND');
    expect(verified?.redirect).toBe('/brand/dashboard');
    expect(verified?.callbackUrl).toBe(customCallback);
  });

  it('fails verification on tampered state', () => {
    const state = signOAuthState({ role: 'CREATOR' });
    const tampered = state.slice(0, -5) + 'xxxxx';
    const verified = verifyOAuthState(tampered);
    expect(verified).toBeNull();
  });
});
