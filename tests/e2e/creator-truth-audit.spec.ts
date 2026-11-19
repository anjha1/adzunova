import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CREATOR_ROUTES = [
  '/creator/dashboard',
  '/creator/offers',
  '/creator/campaigns',
  '/creator/messages',
  '/creator/rate-card',
  '/creator/packages',
  '/creator/availability',
  '/creator/contracts',
  '/creator/content',
  '/creator/earnings',
  '/creator/affiliate',
  '/creator/analytics',
  '/creator/analytics/trends',
  '/creator/growth',
  '/creator/trust',
  '/creator/media-kit',
  '/creator/profile',
  '/creator/accounts',
  '/creator/settings',
  '/creator/referrals',
  '/creator/subscription',
  '/creator/support',
];

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

test.describe('Creator Dashboard - Truth Audit & Responsive E2E Tests', () => {

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

  test('Breakpoint behavior across 320, 390, 640, 641, 1280', async ({ page }) => {
    // 320px (Small Mobile)
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/creator/dashboard');
    await expect(page.locator('aside')).toBeHidden();
    await expect(page.locator('nav.desk\\:hidden')).toBeVisible();

    // 390px (Standard Mobile)
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('aside')).toBeHidden();
    await expect(page.locator('nav.desk\\:hidden')).toBeVisible();

    // 640px (Boundary Mobile: <= 640px)
    await page.setViewportSize({ width: 640, height: 900 });
    await expect(page.locator('aside')).toBeHidden();
    await expect(page.locator('nav.desk\\:hidden')).toBeVisible();

    // 641px (Boundary Desktop: >= 641px)
    await page.setViewportSize({ width: 641, height: 900 });
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('nav.desk\\:hidden')).toBeHidden();

    // 1280px (Standard Desktop)
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('nav.desk\\:hidden')).toBeHidden();
  });

  test('Theme toggle changes data-theme and computed background', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/creator/dashboard');

    // Default or initial theme
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme') || 'light';

    // Toggle button in header
    const toggleBtn = page.getByRole('button', { name: /toggle theme|switch theme/i });
    if (await toggleBtn.isVisible()) {
      const initialBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      await toggleBtn.click();
      
      const newTheme = await html.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);

      const newBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      expect(newBg).not.toBe(initialBg);
    }
  });

  test('No horizontal scroll and no 404s across all creator routes', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    for (const route of CREATOR_ROUTES) {
      // Test mobile width 390
      await page.setViewportSize({ width: 390, height: 844 });
      const res = await page.goto(route);
      if (res && res.status() >= 400) {
        console.error(`FAILED ROUTE: ${route} returned HTTP ${res.status()}`);
      }
      expect(res?.status()).toBeLessThan(400);

      // Assert no horizontal scroll
      const hasHorizontalScrollMobile = await page.evaluate(() => {
        return document.scrollingElement ? document.scrollingElement.scrollWidth > window.innerWidth : false;
      });
      expect(hasHorizontalScrollMobile).toBe(false);

      // Test desktop width 1280
      await page.setViewportSize({ width: 1280, height: 800 });
      const hasHorizontalScrollDesktop = await page.evaluate(() => {
        return document.scrollingElement ? document.scrollingElement.scrollWidth > window.innerWidth : false;
      });
      expect(hasHorizontalScrollDesktop).toBe(false);
    }

    // Filter benign dev warnings and Next.js prerender notices
    const realErrors = consoleErrors.filter(
      (err) =>
        !err.includes('Fast Refresh') &&
        !err.includes('favicon') &&
        !err.includes('uncached data during prerendering') &&
        !err.includes('blocking-prerender-dynamic')
    );
    if (realErrors.length > 0) {
      console.log('CAPTURED BROWSER CONSOLE ERRORS:', realErrors);
    }
    expect(realErrors.length).toBe(0);
  });

  test('Accessibility: Zero serious or critical axe violations on Dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/creator/dashboard');

    // Run axe in light mode
    const lightResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const lightViolations = lightResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(lightViolations).toEqual([]);

    // Run axe in dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    // Allow CSS transition-all (300ms) on shell and sidebar to settle before axe snapshot
    await page.waitForTimeout(500);
    const darkResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const darkViolations = darkResults.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(darkViolations).toEqual([]);
  });

});
