import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function createMockCreatorToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId: 'creator-e2e-user',
      email: 'creator@adzunova.com',
      role: 'CREATOR',
      displayName: 'Adzunova Creator',
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  ).toString('base64url');
  const signature = Buffer.from('mock-e2e-signature').toString('base64url');
  return `${header}.${payload}.${signature}`;
}

test.describe('Phase B: Instagram Connect & Compliance Flow', () => {

  test.beforeEach(async ({ context }) => {
    const token = createMockCreatorToken();
    await context.addCookies([
      {
        name: 'adzunova_session',
        value: token,
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('Connected Accounts page displays Instagram card with real capability state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const res = await page.goto('/creator/accounts');
    expect(res?.status()).toBeLessThan(400);

    // Instagram heading
    await expect(page.getByRole('heading', { name: 'Instagram', exact: true })).toBeVisible();

    // Check connect button or ready state
    const connectLink = page.getByRole('link', { name: 'Connect Instagram' });
    await expect(connectLink).toBeVisible();
    await expect(connectLink).toHaveAttribute('href', '/creator/me/social-accounts/instagram/connect');
  });

  test('Data Deletion Status public page loads and satisfies accessibility standards', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const res = await page.goto('/data-deletion-status');
    expect(res?.status()).toBeLessThan(400);

    await expect(page.getByRole('heading', { name: /User Data Deletion Status/i })).toBeVisible();

    // Test with a sample confirmation code query parameter
    await page.goto('/data-deletion-status?code=del_sample_code_123');
    await expect(page.getByText('del_sample_code_123')).toBeVisible();

    // Axe accessibility scan on public compliance page
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const seriousViolations = axeResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(seriousViolations).toEqual([]);
  });

  test('Meta Compliance Webhooks enforce signature validation', async ({ request }) => {
    // 1. Deauthorize without signed_request -> 400 Bad Request
    const deauthRes = await request.post('/api/auth/instagram/deauthorize', {
      data: {},
    });
    expect(deauthRes.status()).toBe(400);

    // 2. Data Deletion with forged signature -> 401 Unauthorized
    const deletionRes = await request.post('/api/auth/instagram/data-deletion', {
      data: { signed_request: 'forged_signature.eyJ1c2VyX2lkIjoiMTIzIn0' },
    });
    expect(deletionRes.status()).toBe(401);
  });

});
