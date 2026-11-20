import { test, expect } from '@playwright/test';
import path from 'path';

function createMockCreatorToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId: 'creator-contrast-test-user',
      email: 'creator@adzunova.com',
      role: 'CREATOR',
      displayName: 'Achhuta Nand Jha',
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  ).toString('base64url');
  const signature = Buffer.from('mock-contrast-signature').toString('base64url');
  return `${header}.${payload}.${signature}`;
}

const ARTIFACT_DIR = path.resolve('C:/Users/Achhuta/.gemini/antigravity/brain/ea41888f-0815-4f98-9536-20b88e9fffb5');

test.describe('Light Theme Visibility & Contrast Suite', () => {
  test.beforeEach(async ({ page, context }) => {
    const token = createMockCreatorToken();
    await context.addCookies([
      {
        name: 'adzunova_session',
        value: token,
        domain: '127.0.0.1',
        path: '/',
      },
      {
        name: 'adzunova_session',
        value: token,
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authenticated: true,
          user: {
            id: 'creator-contrast-test-user',
            email: 'creator@adzunova.com',
            role: 'CREATOR',
            displayName: 'Achhuta Nand Jha',
          },
          profile: {
            displayName: 'Achhuta Nand Jha',
            onboardingCompleted: true,
          },
        }),
      });
    });

    await page.route('**/api/creator/social-account-latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          hasConnectedAccount: true,
          totalReach: 1240,
          totalViews24h: 11,
          audienceScore: null,
          audienceScoreDisplay: 'Not enough data',
          isScoreComplete: false,
          verificationLabel: 'Verified via Instagram API',
          verificationLevel: 'SOCIAL',
          unreadOffersCount: 0,
          unreadNotificationsCount: 2,
          account: {
            id: 'acc_stubbed_1240',
            username: 'a_n_jha1',
            provider: 'instagram',
            followersCount: 1240,
            status: 'ACTIVE',
            capabilities: {
              basic_profile: true,
              views_insights: true,
            },
          },
        }),
      });
    });

    await page.route('**/api/capabilities', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          social: {
            metaInstagram: { configured: true, status: 'CONFIGURED' },
          },
        }),
      });
    });
  });

  test('1. Marketing Homepage Light Theme: Nav items, Theme Toggle & Sign In are crisp and visible', async ({ page, context }) => {
    // Clear cookies so we view public marketing homepage without being redirected to /creator/dashboard
    await context.clearCookies();
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    // Force light theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('adzunova_theme', 'light');
    });
    await page.waitForTimeout(300);

    // Verify "Product", "Solutions", "Resources" nav items are visible
    const productBtn = page.getByRole('button', { name: 'Product' });
    const solutionsBtn = page.getByRole('button', { name: 'Solutions' });
    const resourcesBtn = page.getByRole('button', { name: 'Resources' });

    await expect(productBtn).toBeVisible();
    await expect(solutionsBtn).toBeVisible();
    await expect(resourcesBtn).toBeVisible();

    // Verify Sign In button is visible (exact match to avoid submit button match)
    const signInBtn = page.getByRole('button', { name: 'Sign In', exact: true });
    await expect(signInBtn).toBeVisible();

    // Verify Theme Toggle button is visible
    const themeBtn = page.getByLabel(/Switch to dark mode|Switch to system theme|Switch to light mode/).first();
    await expect(themeBtn).toBeVisible();

    // Assert computed text colors are dark (NOT white rgb(255, 255, 255))
    const productColor = await productBtn.evaluate((el) => window.getComputedStyle(el).color);
    const signInColor = await signInBtn.evaluate((el) => window.getComputedStyle(el).color);

    expect(productColor).not.toBe('rgb(255, 255, 255)');
    expect(signInColor).not.toBe('rgb(255, 255, 255)');

    // Capture light theme homepage screenshot
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'homepage-light-theme-fixed.png'),
      fullPage: false,
    });
  });

  test('2. Creator Header Light Theme: Notification bell and theme toggle buttons are clearly visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/creator/dashboard');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('adzunova_theme', 'light');
    });
    await page.waitForTimeout(400);

    const bellBtn = page.getByLabel('View notifications');
    const themeBtn = page.getByLabel(/Switch to dark mode|Switch to system theme|Switch to light mode/);

    await expect(bellBtn).toBeVisible();
    await expect(themeBtn).toBeVisible();

    const bellColor = await bellBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(bellColor).not.toBe('rgb(255, 255, 255)');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'creator-header-light-theme-fixed.png'),
    });
  });

  test('3. Availability Page Light Theme: Status buttons and calendar numbers are high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/creator/availability');

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('adzunova_theme', 'light');
    });
    await page.waitForTimeout(400);

    // Verify all 4 availability status buttons
    const availableBtn = page.getByRole('button', { name: 'Available' });
    const shootBtn = page.getByRole('button', { name: 'Shoot Day' });
    const busyBtn = page.getByRole('button', { name: 'Busy' });
    const blackoutBtn = page.getByRole('button', { name: 'Blackout / Hold' });

    await expect(availableBtn).toBeVisible();
    await expect(shootBtn).toBeVisible();
    await expect(busyBtn).toBeVisible();
    await expect(blackoutBtn).toBeVisible();

    // Verify text colors are NOT white (not rgb(255, 255, 255))
    const shootColor = await shootBtn.evaluate((el) => window.getComputedStyle(el).color);
    const busyColor = await busyBtn.evaluate((el) => window.getComputedStyle(el).color);
    const blackoutColor = await blackoutBtn.evaluate((el) => window.getComputedStyle(el).color);

    expect(shootColor).not.toBe('rgb(255, 255, 255)');
    expect(busyColor).not.toBe('rgb(255, 255, 255)');
    expect(blackoutColor).not.toBe('rgb(255, 255, 255)');

    // Verify calendar grid day numbers are visible and dark
    const dayOne = page.getByRole('button', { name: '1', exact: true }).first();
    await expect(dayOne).toBeVisible();
    const dayOneColor = await dayOne.evaluate((el) => window.getComputedStyle(el).color);
    expect(dayOneColor).not.toBe('rgb(255, 255, 255)');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'availability-light-theme-fixed.png'),
      fullPage: true,
    });
  });
});
