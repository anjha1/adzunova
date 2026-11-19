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
    throw new Error('Missing Meta OAuth configuration parameters');
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

  // 1. Query Facebook Pages (/me/accounts) - checking both instagram_business_account and connected_instagram_account
  try {
    const endpoint = `${GRAPH_BASE_URL}/me/accounts`;
    const params = new URLSearchParams({
      fields: 'id,name,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count},connected_instagram_account{id,username,name,profile_picture_url,followers_count,media_count}',
      access_token: userAccessToken,
      appsecret_proof: appsecretProof,
    });

    const res = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const data = await res.json();
    if (res.ok && Array.isArray(data.data)) {
      for (const page of data.data) {
        if (page.instagram_business_account) {
          addAccount(page.instagram_business_account);
        }
        if (page.connected_instagram_account) {
          addAccount(page.connected_instagram_account);
        }
      }
    }
  } catch (err) {
    console.warn('[fetchInstagramAccounts] /me/accounts check error:', err);
  }

  // 2. Query Business Portfolio assets (/me/businesses -> instagram_accounts)
  if (accounts.length === 0) {
    try {
      const bizEndpoint = `${GRAPH_BASE_URL}/me/businesses`;
      const bizParams = new URLSearchParams({
        fields: 'id,name,instagram_accounts{id,username,name,profile_picture_url,followers_count,media_count}',
        access_token: userAccessToken,
        appsecret_proof: appsecretProof,
      });

      const bizRes = await fetch(`${bizEndpoint}?${bizParams.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (bizRes.ok) {
        const bizData = await bizRes.json();
        if (Array.isArray(bizData.data)) {
          for (const biz of bizData.data) {
            const igAccounts = biz.instagram_accounts?.data;
            if (Array.isArray(igAccounts)) {
              for (const ig of igAccounts) {
                addAccount(ig);
              }
            }
          }
        }
      }
    } catch (bizErr) {
      console.warn('[fetchInstagramAccounts] /me/businesses check error:', bizErr);
    }
  }

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

  const result: CapabilityProbeResult = {
    basic_profile: false,
    views_insights: false,
    demographics_gender_age: false,
    demographics_country: false,
    probed_at: new Date().toISOString(),
    errors: {},
  };

  // 1. Basic Profile Probe
  try {
    const profileUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}`);
    profileUrl.searchParams.set('fields', 'username,followers_count,media_count');
    profileUrl.searchParams.set('access_token', accessToken);
    if (appsecretProof) profileUrl.searchParams.set('appsecret_proof', appsecretProof);

    const res = await fetch(profileUrl.toString());
    const data = await res.json();
    if (res.ok && data.username) {
      result.basic_profile = true;
    } else {
      result.errors!.basic_profile = scrubSensitiveData(data.error?.message || 'Profile check failed');
    }
  } catch (err) {
    result.errors!.basic_profile = err instanceof Error ? err.message : 'Network error';
  }

  // 2. Views Insight Probe
  try {
    const viewsUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}/insights`);
    viewsUrl.searchParams.set('metric', 'views');
    viewsUrl.searchParams.set('metric_type', 'total_value');
    viewsUrl.searchParams.set('period', 'day');
    viewsUrl.searchParams.set('access_token', accessToken);
    if (appsecretProof) viewsUrl.searchParams.set('appsecret_proof', appsecretProof);

    const res = await fetch(viewsUrl.toString());
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      result.views_insights = true;
      result.views_sample = data.data[0]?.total_value?.value ?? null;
    } else {
      result.errors!.views_insights = scrubSensitiveData(data.error?.message || 'Views insight unavailable');
    }
  } catch (err) {
    result.errors!.views_insights = err instanceof Error ? err.message : 'Network error';
  }

  // 3. Demographics: Gender & Age Probe
  try {
    const demoUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}/insights`);
    demoUrl.searchParams.set('metric', 'follower_demographics');
    demoUrl.searchParams.set('period', 'lifetime');
    demoUrl.searchParams.set('metric_type', 'total_value');
    demoUrl.searchParams.set('breakdown', 'gender,age');
    demoUrl.searchParams.set('access_token', accessToken);
    if (appsecretProof) demoUrl.searchParams.set('appsecret_proof', appsecretProof);

    const res = await fetch(demoUrl.toString());
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      result.demographics_gender_age = true;
      result.gender_sample_found = Boolean(data.data[0]?.total_value?.breakdowns?.length > 0);
    } else {
      result.errors!.demographics_gender_age = scrubSensitiveData(
        data.error?.message || 'Demographics (gender/age) unavailable'
      );
    }
  } catch (err) {
    result.errors!.demographics_gender_age = err instanceof Error ? err.message : 'Network error';
  }

  // 4. Demographics: Country Probe (graceful fallback)
  try {
    const geoUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}/insights`);
    geoUrl.searchParams.set('metric', 'follower_demographics');
    geoUrl.searchParams.set('period', 'lifetime');
    geoUrl.searchParams.set('metric_type', 'total_value');
    geoUrl.searchParams.set('breakdown', 'country');
    geoUrl.searchParams.set('access_token', accessToken);
    if (appsecretProof) geoUrl.searchParams.set('appsecret_proof', appsecretProof);

    const res = await fetch(geoUrl.toString());
    const data = await res.json();
    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      result.demographics_country = true;
    } else {
      result.errors!.demographics_country = scrubSensitiveData(
        data.error?.message || 'Demographics (country) not exposed'
      );
    }
  } catch (err) {
    result.errors!.demographics_country = err instanceof Error ? err.message : 'Network error';
  }

  return result;
}
