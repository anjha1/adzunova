import { test } from '@playwright/test';
import path from 'path';

function createMockCreatorToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      userId: 'creator-e2e-screenshot-user',
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

const PAGES = [
  { name: 'accounts', path: '/creator/accounts' },
  { name: 'analytics', path: '/creator/analytics' },
  { name: 'growth', path: '/creator/growth' },
  { name: 'media-kit', path: '/creator/media-kit' },
  { name: 'profile', path: '/creator/profile' },
  { name: 'overview', path: '/creator/dashboard' },
];

const ARTIFACT_DIR = 'C:/Users/Achhuta/.gemini/antigravity/brain/ea41888f-0815-4f98-9536-20b88e9fffb5';

test.describe('Truth & Consistency Visual Verification Screenshots', () => {
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
              lastSyncedAt: new Date().toISOString(),
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

  for (const p of PAGES) {
    test(`Capture ${p.name} desktop & mobile screenshots`, async ({ page }) => {
      // 1. Desktop Light (1280px)
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(p.path);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `${p.name}-desktop-light.png`),
        fullPage: true,
      });

      // 2. Desktop Dark (1280px)
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `${p.name}-desktop-dark.png`),
        fullPage: true,
      });

      // 3. Mobile Light (390px)
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ colorScheme: 'light' });
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `${p.name}-mobile-light.png`),
        fullPage: true,
      });

      // 4. Mobile Dark (390px)
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `${p.name}-mobile-dark.png`),
        fullPage: true,
      });
    });
  }
});
