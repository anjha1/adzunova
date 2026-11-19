import { createAppSecretProof } from './security/meta-signature';
import { stripTokenFromPagingUrl, scrubSensitiveData } from './security/log-scrubber';

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || 'v27.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface InstagramBusinessAccount {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string | null;
  followers_count: number;
  media_count: number;
}

export interface CapabilityProbeResult {
  basic_profile: boolean;
  views_insights: boolean;
  demographics_gender_age: boolean;
  demographics_country: boolean;
  probed_at: string;
  views_sample?: number | null;
  gender_sample_found?: boolean;
  errors?: Record<string, string>;
}

/**
 * Builds the Meta Unified Login OAuth dialog URL
 */
export function getMetaUnifiedLoginUrl(state: string): string {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  const configId = process.env.META_LOGIN_CONFIG_ID || '2224745654773774';

  if (!appId || !redirectUri) {
    throw new Error('META_APP_ID and INSTAGRAM_REDIRECT_URI must be set in environment');
  }

  const url = new URL(`https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth`);
  url.searchParams.set('client_id', appId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('config_id', configId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);

  return url.toString();
}

/**
 * Exchanges OAuth authorization code for short-lived user access token
 */
export async function exchangeCodeForShortLivedToken(code: string): Promise<MetaTokenResponse> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    throw new Error('Missing Meta credentials for token exchange');
  }

  const endpoint = `${GRAPH_BASE_URL}/oauth/access_token`;
  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    const errorMsg = scrubSensitiveData(data.error?.message || 'Failed to exchange OAuth code for access token');
    throw new Error(errorMsg);
  }

  return data as MetaTokenResponse;
}

/**
 * Exchanges short-lived token for long-lived user token (valid for ~60 days)
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<MetaTokenResponse> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Missing Meta credentials for token exchange');
  }

  const endpoint = `${GRAPH_BASE_URL}/oauth/access_token`;
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    const errorMsg = scrubSensitiveData(data.error?.message || 'Failed to exchange for long-lived access token');
    throw new Error(errorMsg);
  }

  return data as MetaTokenResponse;
}

/**
 * Finds Instagram business accounts associated with the user's Facebook pages or Business Portfolio
 */
export async function fetchInstagramAccounts(userAccessToken: string): Promise<InstagramBusinessAccount[]> {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) throw new Error('META_APP_SECRET is required');

  const appsecretProof = createAppSecretProof(userAccessToken, appSecret);
  const accounts: InstagramBusinessAccount[] = [];
  const seenIds = new Set<string>();

  function addAccount(ig: any) {
    if (!ig || !ig.id || seenIds.has(ig.id)) return;
    seenIds.add(ig.id);
    accounts.push({
      id: ig.id,
      username: ig.username || 'instagram_creator',
      name: ig.name,
      profile_picture_url: ig.profile_picture_url || null,
      followers_count: Number(ig.followers_count || 0),
      media_count: Number(ig.media_count || 0),
    });
  }

  // Path A: Check /me/accounts (Facebook Pages) with Page Access Token resolution
  try {
    const endpoint = `${GRAPH_BASE_URL}/me/accounts`;
    const params = new URLSearchParams({
      fields: 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}',
      access_token: userAccessToken,
      appsecret_proof: appsecretProof,
    });

    const res = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const data = await res.json();
    console.log('[fetchInstagramAccounts] /me/accounts status:', res.status, 'pages count:', data.data?.length ?? 0);

    if (res.ok && Array.isArray(data.data)) {
      for (const page of data.data) {
        if (page.instagram_business_account) {
          addAccount(page.instagram_business_account);
        } else if (page.id && page.access_token) {
          // Attempt deep resolution using the Page Access Token
          try {
            const pageProof = createAppSecretProof(page.access_token, appSecret);
            const pageEndpoint = `${GRAPH_BASE_URL}/${page.id}`;
            const pageParams = new URLSearchParams({
              fields: 'instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}',
              access_token: page.access_token,
              appsecret_proof: pageProof,
            });
            const pageRes = await fetch(`${pageEndpoint}?${pageParams.toString()}`);
            if (pageRes.ok) {
              const pageData = await pageRes.json();
              if (pageData.instagram_business_account) {
                addAccount(pageData.instagram_business_account);
              }
            }
          } catch (pageErr) {
            console.warn('[fetchInstagramAccounts] Page token inspection failed for', page.id, pageErr);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[fetchInstagramAccounts] /me/accounts query error:', err);
  }

  // Path B: Check Meta Business Portfolio assets (/me/businesses -> owned/client instagram accounts)
  if (accounts.length === 0) {
    try {
      const bizEndpoint = `${GRAPH_BASE_URL}/me/businesses`;
      const bizParams = new URLSearchParams({
        fields: 'id,name',
        access_token: userAccessToken,
        appsecret_proof: appsecretProof,
      });

      const bizRes = await fetch(`${bizEndpoint}?${bizParams.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      const bizData = await bizRes.json();
      console.log('[fetchInstagramAccounts] /me/businesses status:', bizRes.status, 'biz count:', bizData.data?.length ?? 0);

      if (bizRes.ok && Array.isArray(bizData.data)) {
        for (const biz of bizData.data) {
          // Check owned Instagram accounts
          for (const edge of ['owned_instagram_accounts', 'client_instagram_accounts', 'instagram_accounts']) {
            try {
              const igEndpoint = `${GRAPH_BASE_URL}/${biz.id}/${edge}`;
              const igParams = new URLSearchParams({
                fields: 'id,username,name,profile_picture_url,followers_count,media_count',
                access_token: userAccessToken,
                appsecret_proof: appsecretProof,
              });
              const igRes = await fetch(`${igEndpoint}?${igParams.toString()}`);
              if (igRes.ok) {
                const igData = await igRes.json();
                if (Array.isArray(igData.data)) {
                  for (const item of igData.data) {
                    addAccount(item);
                  }
                }
              }
            } catch {
              // Ignore non-applicable edge
            }
          }
        }
      }
    } catch (bizErr) {
      console.warn('[fetchInstagramAccounts] /me/businesses query error:', bizErr);
    }
  }

  console.log('[fetchInstagramAccounts] Total resolved Instagram business accounts:', accounts.length);
  return accounts;
}

/**
 * Runs a capability probe against the Instagram Business Account
 * to test which metrics (profile, views, gender/age demographics, geo) are supported.
 */
export async function probeAccountCapabilities(
  igAccountId: string,
  accessToken: string
): Promise<CapabilityProbeResult> {
  const appSecret = process.env.META_APP_SECRET;
  const appsecretProof = appSecret ? createAppSecretProof(accessToken, appSecret) : '';
  const errors: Record<string, string> = {};

  const result: CapabilityProbeResult = {
    basic_profile: false,
    views_insights: false,
    demographics_gender_age: false,
    demographics_country: false,
    probed_at: new Date().toISOString(),
    errors,
  };

  // 1. Probe basic profile fields
  try {
    const profileUrl = `${GRAPH_BASE_URL}/${igAccountId}?fields=id,username,followers_count,media_count&access_token=${accessToken}&appsecret_proof=${appsecretProof}`;
    const res = await fetch(profileUrl);
    const data = await res.json();
    if (res.ok && data.username) {
      result.basic_profile = true;
    } else if (data.error) {
      errors.basic_profile = scrubSensitiveData(data.error.message || 'Profile check failed');
    }
  } catch (err) {
    errors.basic_profile = 'Network error during basic_profile probe';
  }

  // 2. Probe views insights
  try {
    const viewsUrl = `${GRAPH_BASE_URL}/${igAccountId}/insights?metric=views&period=day&access_token=${accessToken}&appsecret_proof=${appsecretProof}`;
    const res = await fetch(viewsUrl);
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      result.views_insights = true;
      result.views_sample = data.data[0]?.total_value?.value ?? null;
    } else if (data.error) {
      errors.views_insights = scrubSensitiveData(data.error.message || 'Views insights failed');
    }
  } catch (err) {
    errors.views_insights = 'Network error during views_insights probe';
  }

  // 3. Probe gender and age demographics
  try {
    const demoUrl = `${GRAPH_BASE_URL}/${igAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=gender,age&access_token=${accessToken}&appsecret_proof=${appsecretProof}`;
    const res = await fetch(demoUrl);
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      result.demographics_gender_age = true;
      result.gender_sample_found = true;
    } else if (data.error) {
      errors.demographics_gender_age = scrubSensitiveData(data.error.message || 'Demographics gender_age failed');
    }
  } catch (err) {
    errors.demographics_gender_age = 'Network error during demographics_gender_age probe';
  }

  // 4. Probe country demographics
  try {
    const countryUrl = `${GRAPH_BASE_URL}/${igAccountId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&breakdown=country&access_token=${accessToken}&appsecret_proof=${appsecretProof}`;
    const res = await fetch(countryUrl);
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      result.demographics_country = true;
    } else if (data.error) {
      errors.demographics_country = scrubSensitiveData(data.error.message || 'Demographics country failed');
    }
  } catch (err) {
    errors.demographics_country = 'Network error during demographics_country probe';
  }

  return result;
}

/**
 * Fetches time-series views and engagement metrics for the specified account
 */
export async function fetchTimeRangeMetrics(
  igAccountId: string,
  accessToken: string,
  since: Date,
  until: Date
): Promise<Array<{ timestamp: string; views: number; reach: number }>> {
  const appSecret = process.env.META_APP_SECRET;
  const appsecretProof = appSecret ? createAppSecretProof(accessToken, appSecret) : '';

  const sinceUnix = Math.floor(since.getTime() / 1000);
  const untilUnix = Math.floor(until.getTime() / 1000);

  const url = `${GRAPH_BASE_URL}/${igAccountId}/insights?metric=views,reach&period=day&since=${sinceUnix}&until=${untilUnix}&access_token=${accessToken}&appsecret_proof=${appsecretProof}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(scrubSensitiveData(data.error?.message || 'Failed to fetch time-range metrics'));
  }

  // Build daily series
  const results: Array<{ timestamp: string; views: number; reach: number }> = [];
  const viewsData = data.data?.find((m: any) => m.name === 'views')?.values || [];
  const reachData = data.data?.find((m: any) => m.name === 'reach')?.values || [];

  for (let i = 0; i < viewsData.length; i++) {
    const v = viewsData[i];
    const r = reachData[i];
    results.push({
      timestamp: v.end_time,
      views: Number(v.value || 0),
      reach: Number(r?.value || 0),
    });
  }

  return results;
}
