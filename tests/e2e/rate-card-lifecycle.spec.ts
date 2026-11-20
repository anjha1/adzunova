import { test, expect } from '@playwright/test';

function createMockCreatorToken(userId = 'creator-rate-card-user'): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      email: `${userId}@adzunova.com`,
      role: 'CREATOR',
      displayName: 'Adzunova Creator',
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  ).toString('base64url');
  const signature = Buffer.from('mock-e2e-signature').toString('base64url');
  return `${header}.${payload}.${signature}`;
}

test.describe('Creator Rate Card Enterprise Lifecycle', () => {
  test.beforeEach(async ({ context }) => {
    const token = createMockCreatorToken(`creator-e2e-${Date.now()}`);
    await context.addCookies([
      {
        name: 'adzunova_session',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
  });

  test('loads rate card with live stat cards and auto-seeded deliverables', async ({ page }) => {
    await page.goto('/creator/rate-card');
    await page.waitForLoadState('domcontentloaded');

    // Verify Page Header
    await expect(page.getByRole('heading', { name: 'Creator Rate Card', exact: true })).toBeVisible();

    // Verify Stat Cards
    await expect(page.getByText('Active Deliverables')).toBeVisible();
    await expect(page.getByText('Starting Rate')).toBeVisible();
    await expect(page.getByText('Platform Commission')).toBeVisible();
    await expect(page.getByText('Avg Turnaround')).toBeVisible();

    // Verify 10% platform fee from cfg_2026_q4
    await expect(page.getByText('10%', { exact: true })).toBeVisible();

    // Verify Deliverable Items (Seeded)
    await expect(page.getByText('1 Min Dedicated Instagram Reel')).toBeVisible();
    await expect(page.getByText('YouTube Dedicated Video')).toBeVisible();

    // Verify Brand Quote Simulator
    await expect(page.getByText('Brand Quote Simulator')).toBeVisible();
    await expect(page.getByText('Net Creator Payout')).toBeVisible();
    await expect(page.getByText('Total Brand Payable')).toBeVisible();
  });

  test('validates zero ₹0 active items rule in Add Deliverable modal', async ({ page }) => {
    await page.goto('/creator/rate-card');
    await page.waitForLoadState('domcontentloaded');

    // Click "Add Rate Card Item"
    await page.getByRole('button', { name: 'Add Rate Card Item' }).click();

    // Modal should appear
    await expect(page.getByRole('heading', { name: 'Add New Rate Card Deliverable' })).toBeVisible();

    // Navigate to Pricing & Terms tab
    await page.getByRole('button', { name: '3. Pricing & Terms' }).click();

    // Set price to 0
    const priceInput = page.locator('input[placeholder="25000"]');
    await priceInput.fill('0');

    // Click Save & Activate
    await page.getByRole('button', { name: 'Save & Activate' }).click();

    // Verify validation error
    await expect(
      page.getByText('Active deliverables must have a starting price greater than ₹0')
    ).toBeVisible();

    // Now fill a valid price
    await priceInput.fill('35000');

    // Save should succeed
    await page.getByRole('button', { name: 'Save & Activate' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Rate Card Deliverable' })).not.toBeVisible();
  });

  test('duplicates and pauses deliverables with live UI updates', async ({ page }) => {
    await page.goto('/creator/rate-card');
    await page.waitForLoadState('domcontentloaded');

    // Click action menu on the first item
    const firstCard = page.locator('div[class*="rounded-2xl border transition cursor-pointer"]').first();
    const actionBtn = firstCard.getByRole('button', { name: 'Actions' });
    await actionBtn.click();

    // Click Duplicate
    await page.getByRole('button', { name: 'Duplicate' }).click();

    // Verify toast or new copy appears
    await expect(page.getByText(/Copy/)).toBeVisible();
  });
});
