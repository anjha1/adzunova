import { test, expect } from '@playwright/test';

function createMockCreatorToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId: 'creator-e2e-consistent-user',
      email: 'creator@adzunova.com',
      role: 'CREATOR',
      displayName: 'Adzunova Creator',
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  ).toString('base64url');
  const signature = Buffer.from('mock-e2e-signature').toString('base64url');
  return `${header}.${payload}.${signature}`;
}

const stubbedSocialLatest = {
  hasConnectedAccount: true,
  totalReach: 1240,
  totalViews24h: 11,
  audienceScore: null,
  audienceScoreDisplay: 'Not enough data',
  isScoreComplete: false,
  qualityEvaluation: {
    score: null,
    status: 'PARTIAL',
    missingFactors: ['Minimum 3 snapshots of follower progression history'],
    factors: [
      { name: 'Demographic Completeness', score: 85, weight: 40, description: 'Demographics verified' },
      { name: 'Active Impression Ratio', score: 80, weight: 40, description: '24h views verified' },
    ],
  },
  verificationLabel: 'Verified via Instagram API on Nov 20, 2026',
  verificationLevel: 'SOCIAL',
  unreadOffersCount: 0,
  unreadNotificationsCount: 0,
  account: {
    id: 'acc_stubbed_1240',
    username: 'a_n_jha1',
    provider: 'instagram',
    accountType: 'BUSINESS',
    profilePictureUrl: null,
    followersCount: 1240,
    mediaCount: 14,
    status: 'ACTIVE',
    scopes: ['instagram_basic', 'instagram_manage_insights'],
    capabilities: {
      basic_profile: true,
      views_insights: true,
      demographics_gender_age: true,
      demographics_country: true,
    },
    connectedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    nextSyncAt: new Date(Date.now() + 86400000).toISOString(),
    syncTier: 'HOT',
  },
  accounts: [
    {
      id: 'acc_stubbed_1240',
      username: 'a_n_jha1',
      provider: 'instagram',
      followersCount: 1240,
      mediaCount: 14,
      status: 'ACTIVE',
      profilePictureUrl: null,
      lastSyncedAt: new Date().toISOString(),
    },
  ],
  demographics: {
    hasCountryBreakdown: true,
    share18Plus: 0.92,
    share13To17: 0.08,
    topCountry: 'IN',
    topCountryName: 'India',
    genderKnownShare: 0.88,
    genderUnknownShare: 0.12,
    countries: [
      { countryCode: 'IN', countryName: 'India', percentage: 0.75, count: 930 },
      { countryCode: 'US', countryName: 'United States', percentage: 0.15, count: 186 },
      { countryCode: 'GB', countryName: 'United Kingdom', percentage: 0.10, count: 124 },
    ],
    genderDistribution: [
      { gender: 'M', label: 'Men', percentage: 0.65, count: 806 },
      { gender: 'F', label: 'Women', percentage: 0.35, count: 434 },
    ],
    ageDistribution: [
      { bucket: '18-24', percentage: 0.45, count: 558 },
      { bucket: '25-34', percentage: 0.35, count: 434 },
      { bucket: '35-44', percentage: 0.12, count: 149 },
      { bucket: '13-17', percentage: 0.08, count: 99 },
    ],
  },
  viewsSeries: [{ timestamp: new Date().toISOString(), value: 11 }],
  followersSeries: [{ timestamp: new Date().toISOString(), value: 1240 }],
};

test.describe('Single Source of Truth & Cross-Page Metric Consistency', () => {
  test.beforeEach(async ({ context, page }) => {
    const token = createMockCreatorToken();
    await context.addCookies([
      {
        name: 'adzunova_session',
        value: token,
        domain: '127.0.0.1',
        path: '/',
      },
    ]);

    // Route interceptor guaranteeing all pages read the exact same stubbed social state
    await page.route('**/api/creator/social-account-latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(stubbedSocialLatest),
      });
    });

    await page.route('**/api/creator/analytics*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          hasConnectedAccount: true,
          account: stubbedSocialLatest.account,
          accounts: stubbedSocialLatest.accounts,
          totalReach: 1240,
          totalViews: 11,
          totalViews24h: 11,
          audienceScore: null,
          audienceScoreDisplay: 'Not enough data',
          isScoreComplete: false,
          qualityEvaluation: stubbedSocialLatest.qualityEvaluation,
          demographics: stubbedSocialLatest.demographics,
          enrichedDemographics: {
            countries: stubbedSocialLatest.demographics.countries,
          },
          verificationLabel: stubbedSocialLatest.verificationLabel,
        }),
      });
    });

    await page.route('**/api/creator/social-accounts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accounts: [
            {
              id: 'acc_stubbed_1240',
              provider: 'instagram',
              username: 'a_n_jha1',
              account_type: 'BUSINESS',
              followers_count: 1240,
              media_count: 14,
              status: 'ACTIVE',
              scopes: ['instagram_basic', 'instagram_manage_insights'],
              capabilities: {
                basic_profile: true,
                views_insights: true,
                demographics_gender_age: true,
              },
              connected_at: new Date().toISOString(),
              last_synced_at: new Date().toISOString(),
              next_sync_at: new Date(Date.now() + 86400000).toISOString(),
              sync_tier: 'HOT',
            },
          ],
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

  test('Accounts page displays reconciled views capability and consistent reach', async ({ page }) => {
    await page.goto('/creator/accounts');
    await expect(page.locator('h1')).toContainText('Connected Social Accounts');

    // Reach must be 1,240 (present in stat card and account row)
    await expect(page.getByText('1,240').first()).toBeVisible();

    // Audience Quality Score must be 'Not enough data' (never partial score)
    await expect(page.locator('text=Not enough data')).toBeVisible();

    // Views Insights capability probe must be reconciled: 'Supported (11 views/24h)'
    await expect(page.locator('text=Supported (11 views/24h)')).toBeVisible();

    // Must NOT contain forbidden phrase 'Meta Verified'
    const bodyContent = await page.content();
    expect(bodyContent.includes('Meta Verified')).toBe(false);
  });

  test('Analytics page displays consistent 1,240 reach, 11 views, and country names', async ({ page }) => {
    await page.goto('/creator/analytics');
    await expect(page.locator('h1')).toContainText('Verified Audience Analytics');

    // Reach must be 1,240
    await expect(page.getByText('1,240').first()).toBeVisible();

    // 24h views must be 11 (exact text match)
    await expect(page.getByText('11', { exact: true })).toBeVisible();

    // Audience Quality Score must be 'Not enough data'
    await expect(page.locator('text=Not enough data')).toBeVisible();

    // Country breakdown must show full country name 'India (IN)'
    await expect(page.locator('text=India (IN)')).toBeVisible();

    // Must NOT contain forbidden phrase 'Meta Verified'
    const bodyContent = await page.content();
    expect(bodyContent.includes('Meta Verified')).toBe(false);
  });

  test('Growth page displays consistent Audience Quality Tier and verified checklist', async ({ page }) => {
    await page.goto('/creator/growth');
    await expect(page.locator('h1')).toContainText('Growth & Optimization');

    // Quality Tier should display 'Not enough data'
    await expect(page.locator('text=Not enough data')).toBeVisible();

    // Readiness checklist shows verified account
    await expect(page.locator('text=@a_n_jha1')).toBeVisible();

    // No hardcoded "Consumer Tech & Hardware" preselected
    const selectedNiche = await page.locator('select').inputValue();
    expect(selectedNiche).toBe('');
  });

  test('Media Kit page displays verified reach, truthful score, and no "Meta Verified"', async ({ page }) => {
    await page.goto('/creator/media-kit');
    await expect(page.locator('h1')).toContainText('Automated Media Kit');

    // Reach must be 1,240
    await expect(page.locator('text=1,240')).toBeVisible();

    // Must have verification label 'Verified via Instagram API'
    await expect(page.locator('text=Verified via Instagram API')).toBeVisible();

    // Score must be 'Not enough data'
    await expect(page.locator('text=Not enough data')).toBeVisible();

    // Must NOT contain forbidden phrase 'Meta Verified'
    const bodyContent = await page.content();
    expect(bodyContent.includes('Meta Verified')).toBe(false);
  });

  test('Public Profile page live preview displays verified reach 1,240 followers', async ({ page }) => {
    await page.goto('/creator/profile');
    await expect(page.locator('h1')).toContainText('Public Profile & Media Card');

    // Live preview must read verified reach: '1,240 followers'
    await expect(page.locator('text=Verified Reach: 1,240 followers')).toBeVisible();

    // Instagram URL is autofilled with @a_n_jha1 and marked verified
    await expect(page.locator('text=Verified via Instagram API')).toBeVisible();
    const igInputVal = await page.locator('input[placeholder="https://instagram.com/profile"]').inputValue();
    expect(igInputVal).toBe('https://instagram.com/a_n_jha1');
  });
});
