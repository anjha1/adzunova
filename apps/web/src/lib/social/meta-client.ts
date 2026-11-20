import { createAppSecretProof } from './security/meta-signature';
import { stripTokenFromPagingUrl, scrubSensitiveData, maskId } from './security/log-scrubber';

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || 'v27.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaDebugTokenData {
  app_id: string;
  type: string;
  application?: string;
  is_valid: boolean;
  expires_at?: number;
  data_access_expires_at?: number;
  scopes: string[];
  granular_scopes?: Array<{
    scope: string;
    target_ids?: string[];
  }>;
  user_id: string;
  error?: {
    code: number;
    message: string;
    subcode?: number;
  };
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

export interface DiscoveryResult {
  accounts: InstagramBusinessAccount[];
  discoveryMethod: 'assigned_instagram_accounts' | 'granular_scopes' | 'business_assets' | 'legacy_pages' | 'none';
  debugToken: {
    isValid: boolean;
    appId?: string;
    userId?: string;
    tokenType?: string;
    scopes: string[];
    granularScopeCount: number;
    targetIdCount: number;
  };
  errorReason?: 'user_denied' | 'no_instagram_account_granted' | 'account_not_professional' | 'meta_api_error' | 'server_error';
  errorCode?: number;
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
export async function exchangeCodeForShortLivedToken(code: string): Promise<{ data: MetaTokenResponse; status: number; keys: string[] }> {
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
  const keys = data && typeof data === 'object' ? Object.keys(data) : [];

  if (!res.ok || data.error) {
    const errorMsg = scrubSensitiveData(data.error?.message || 'Failed to exchange OAuth code for access token');
    const err = new Error(errorMsg) as Error & { code?: number };
    err.code = data.error?.code;
    throw err;
  }

  return { data: data as MetaTokenResponse, status: res.status, keys };
}

/**
 * Exchanges short-lived token for long-lived user token (valid for ~60 days)
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{ data: MetaTokenResponse; status: number; keys: string[] }> {
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
  const keys = data && typeof data === 'object' ? Object.keys(data) : [];

  if (!res.ok || data.error) {
    const errorMsg = scrubSensitiveData(data.error?.message || 'Failed to exchange for long-lived access token');
    const err = new Error(errorMsg) as Error & { code?: number };
    err.code = data.error?.code;
    throw err;
  }

  return { data: data as MetaTokenResponse, status: res.status, keys };
}

/**
 * Calls GET /debug_token to inspect token scopes and granular_scopes
 * Never returns or logs access tokens.
 */
export async function debugToken(inputToken: string): Promise<{ data: MetaDebugTokenData; status: number }> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error('META_APP_ID and META_APP_SECRET are required');

  const endpoint = `${GRAPH_BASE_URL}/debug_token`;
  const params = new URLSearchParams({
    input_token: inputToken,
    access_token: `${appId}|${appSecret}`,
  });

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = await res.json();
  if (!res.ok || !data.data) {
    const errorMsg = scrubSensitiveData(data?.error?.message || 'Failed to debug token');
    const err = new Error(errorMsg) as Error & { code?: number };
    err.code = data?.error?.code;
    throw err;
  }

  // Phase 1 Diagnosis: Under DEBUG_OAUTH=true, log full scrubbed JSON shape of debug_token
  if (process.env.DEBUG_OAUTH === 'true') {
    const d = data.data;
    console.log('[DEBUG_OAUTH] Raw debug_token data shape:', {
      all_keys: Object.keys(d),
      type: d.type,
      application: d.application,
      app_id: maskId(d.app_id),
      user_id: maskId(d.user_id),
      is_valid: d.is_valid,
      scopes: d.scopes,
      expires_at: d.expires_at,
      data_access_expires_at: d.data_access_expires_at,
      issued_at: d.issued_at,
      granular_scopes: Array.isArray(d.granular_scopes)
        ? d.granular_scopes.map((gs: any) => ({
            scope: gs.scope,
            keys_present: Object.keys(gs),
            target_ids_count: Array.isArray(gs.target_ids) ? gs.target_ids.length : 0,
            target_ids_masked: Array.isArray(gs.target_ids) ? gs.target_ids.map(maskId) : [],
          }))
        : [],
    });
  }

  return { data: data.data as MetaDebugTokenData, status: res.status };
}

/**
 * Fetches single Instagram account profile by ID
 */
export async function fetchInstagramAccountProfile(
  igAccountId: string,
  userAccessToken: string
): Promise<{ account: InstagramBusinessAccount | null; status: number; error?: string; errorCode?: number }> {
  const appSecret = process.env.META_APP_SECRET;
  const appsecretProof = appSecret ? createAppSecretProof(userAccessToken, appSecret) : '';

  const endpoint = `${GRAPH_BASE_URL}/${igAccountId}`;
  const params = new URLSearchParams({
    fields: 'id,username,name,profile_picture_url,followers_count,media_count',
    access_token: userAccessToken,
    appsecret_proof: appsecretProof,
  });

  try {
    const res = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();

    if (res.ok && data.id && (data.username || data.name)) {
      return {
        status: res.status,
        account: {
          id: data.id,
          username: data.username || data.name || 'instagram_user',
          name: data.name,
          profile_picture_url: data.profile_picture_url || null,
          followers_count: Number(data.followers_count || 0),
          media_count: Number(data.media_count || 0),
        },
      };
    }

    return {
      status: res.status,
      account: null,
      error: data?.error?.message ? scrubSensitiveData(data.error.message) : 'Account profile not accessible',
      errorCode: data?.error?.code,
    };
  } catch (err) {
    return {
      status: 500,
      account: null,
      error: err instanceof Error ? err.message : 'Network error fetching profile',
    };
  }
}

export interface DiagnosticProbeEntry {
  probe: string;
  endpointTemplate: string;
  httpStatus: number;
  resultCount?: number;
  errorCode?: number;
  errorType?: string;
  errorSubcode?: number;
  notes: string;
}

/**
 * Phase 1 Diagnostic Probes: runs probe matrix P1 to P6 to identify where
 * the granted Instagram account lives for this token type.
 * Only activated when DEBUG_OAUTH=true. Never logs tokens or raw secrets.
 */
export async function runDiagnosticProbes(
  userAccessToken: string,
  tokenInfo: MetaDebugTokenData
): Promise<DiagnosticProbeEntry[]> {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return [];

  const appsecretProof = createAppSecretProof(userAccessToken, appSecret);
  const results: DiagnosticProbeEntry[] = [];

  const doProbe = async (name: string, template: string, url: string) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const entry: DiagnosticProbeEntry = {
        probe: name,
        endpointTemplate: template,
        httpStatus: res.status,
        notes: '',
      };

      if (data.error) {
        entry.errorCode = data.error.code;
        entry.errorType = data.error.type;
        entry.errorSubcode = data.error.error_subcode;
        entry.notes = scrubSensitiveData(data.error.message || '');
      } else if (Array.isArray(data.data)) {
        entry.resultCount = data.data.length;
        if (data.data.length > 0) {
          const ids = data.data.map((d: any) => maskId(d.id)).join(', ');
          entry.notes = `Found ${data.data.length} item(s): [${ids}]`;
        } else {
          entry.notes = 'Returned empty data array []';
        }
      } else if (data.id) {
        entry.resultCount = 1;
        entry.notes = `Single node: id=${maskId(data.id)}, name=${data.name || '<none>'}`;
      } else {
        entry.notes = `Keys: [${Object.keys(data).join(', ')}]`;
      }

      results.push(entry);
      return data;
    } catch (err: any) {
      results.push({
        probe: name,
        endpointTemplate: template,
        httpStatus: 0,
        notes: `Network failure: ${err.message}`,
      });
      return null;
    }
  };

  console.log('[DEBUG_OAUTH] === Running Phase 1 Diagnostic Probe Matrix ===');

  // P1: /me identity & business binding
  const meData = await doProbe(
    'P1: Token Subject Identity',
    'GET /me?fields=id,name,client_business_id',
    `${GRAPH_BASE_URL}/me?fields=id,name,client_business_id&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
  );
  const clientBizId = meData?.client_business_id;
  const systemUserId = tokenInfo.user_id || meData?.id;

  // P2: System-user asset edges: /me/assigned_instagram_accounts
  await doProbe(
    'P2a: System-User Assigned IG Accounts',
    'GET /me/assigned_instagram_accounts?fields=id,username,name',
    `${GRAPH_BASE_URL}/me/assigned_instagram_accounts?fields=id,username,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
  );

  if (systemUserId) {
    await doProbe(
      'P2b: Assigned IG Accounts via System User ID',
      `GET /{system_user_id}/assigned_instagram_accounts`,
      `${GRAPH_BASE_URL}/${systemUserId}/assigned_instagram_accounts?fields=id,username,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
    );
  }

  // P3: Business-level Instagram edges
  if (clientBizId) {
    await doProbe(
      'P3a: Business Owned Instagram Accounts',
      `GET /{client_business_id}/owned_instagram_accounts`,
      `${GRAPH_BASE_URL}/${clientBizId}/owned_instagram_accounts?fields=id,username,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
    );
    await doProbe(
      'P3b: Business Client Instagram Accounts',
      `GET /{client_business_id}/client_instagram_accounts`,
      `${GRAPH_BASE_URL}/${clientBizId}/client_instagram_accounts?fields=id,username,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
    );
    await doProbe(
      'P3c: Business Instagram Accounts',
      `GET /{client_business_id}/instagram_accounts`,
      `${GRAPH_BASE_URL}/${clientBizId}/instagram_accounts?fields=id,username,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
    );
  }

  // P4: Direct instagram_accounts fields on subject
  await doProbe(
    'P4: /me/instagram_accounts',
    'GET /me/instagram_accounts?fields=id,username',
    `${GRAPH_BASE_URL}/me/instagram_accounts?fields=id,username&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
  );

  // P5: Granular scopes check
  const igGranular = (tokenInfo.granular_scopes || []).filter((g) => g.scope.startsWith('instagram_'));
  const targetIds = Array.from(new Set(igGranular.flatMap((g) => g.target_ids || [])));
  results.push({
    probe: 'P5: debug_token granular_scopes target_ids',
    endpointTemplate: 'GET /debug_token -> granular_scopes[].target_ids',
    httpStatus: 200,
    resultCount: targetIds.length,
    notes: targetIds.length > 0 ? `Found target IDs: [${targetIds.map(maskId).join(', ')}]` : 'target_ids array is empty',
  });

  // P6: Known controls
  await doProbe(
    'P6a: /me/businesses (Known Control)',
    'GET /me/businesses?fields=id,name',
    `${GRAPH_BASE_URL}/me/businesses?fields=id,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
  );
  await doProbe(
    'P6b: /me/accounts (Known Control)',
    'GET /me/accounts?fields=id,name',
    `${GRAPH_BASE_URL}/me/accounts?fields=id,name&access_token=${userAccessToken}&appsecret_proof=${appsecretProof}`
  );

  console.log('[DEBUG_OAUTH] Probe matrix summary table:\n' +
    results.map((r) => `  | ${r.probe.padEnd(42)} | HTTP ${String(r.httpStatus).padEnd(3)} | Count: ${String(r.resultCount ?? '-').padEnd(3)} | ${r.notes}`).join('\n')
  );

  return results;
}

/**
 * Resolves Instagram accounts in the exact required priority order:
 * (a) debug_token granular_scopes -> target_ids for instagram_basic / instagram_manage_insights
 * (b) Documented business-asset listing for this token type (/me/businesses -> owned/client instagram assets)
 * (c) Legacy fallback: Facebook Page -> instagram_business_account
 *
 * Emits token-scrubbed structured logs at each step.
 */
export async function resolveInstagramAccountsUnified(
  userAccessToken: string,
  debugTokenData?: MetaDebugTokenData
): Promise<DiscoveryResult> {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) throw new Error('META_APP_SECRET is required');

  const appsecretProof = createAppSecretProof(userAccessToken, appSecret);

  // 1. Obtain debug_token if not passed in
  let tokenInfo = debugTokenData;
  if (!tokenInfo) {
    try {
      const debugRes = await debugToken(userAccessToken);
      tokenInfo = debugRes.data;
    } catch (err: any) {
      console.error('[OAuthDiscovery] GET /debug_token failed:', {
        message: err.message,
        code: err.code,
      });
      return {
        accounts: [],
        discoveryMethod: 'none',
        debugToken: { isValid: false, scopes: [], granularScopeCount: 0, targetIdCount: 0 },
        errorReason: 'meta_api_error',
        errorCode: err.code || 500,
      };
    }
  }

  const scopes = tokenInfo.scopes || [];
  const granularScopes = tokenInfo.granular_scopes || [];

  // Extract all target_ids from instagram granular scopes
  const igGranularScopes = granularScopes.filter((g) =>
    g.scope.startsWith('instagram_') || g.scope.includes('instagram')
  );
  const targetIds = Array.from(
    new Set(igGranularScopes.flatMap((g) => g.target_ids || []))
  );

  console.log('[OAuthDiscovery] GET /debug_token summary:', {
    isValid: tokenInfo.is_valid,
    type: tokenInfo.type,
    appId: tokenInfo.app_id,
    userId: tokenInfo.user_id,
    scopes,
    granularScopeCount: granularScopes.length,
    targetIdsFound: targetIds.length,
  });

  const debugSummary = {
    isValid: tokenInfo.is_valid,
    appId: tokenInfo.app_id,
    userId: tokenInfo.user_id,
    tokenType: tokenInfo.type,
    scopes,
    granularScopeCount: granularScopes.length,
    targetIdCount: targetIds.length,
  };

  if (!tokenInfo.is_valid) {
    return {
      accounts: [],
      discoveryMethod: 'none',
      debugToken: debugSummary,
      errorReason: 'meta_api_error',
      errorCode: tokenInfo.error?.code || 190,
    };
  }

  // Phase 1 Diagnosis: Run probe matrix when DEBUG_OAUTH=true
  if (process.env.DEBUG_OAUTH === 'true') {
    try {
      await runDiagnosticProbes(userAccessToken, tokenInfo);
    } catch (err: any) {
      console.warn('[DEBUG_OAUTH] Error executing diagnostic probes:', err.message);
    }
  }

  // Check if any Instagram scopes were granted at all
  const hasInstagramScopes = scopes.some((s) => s.startsWith('instagram_'));
  if (!hasInstagramScopes && targetIds.length === 0) {
    console.log('[OAuthDiscovery] No Instagram scopes or target_ids granted in token');
    return {
      accounts: [],
      discoveryMethod: 'none',
      debugToken: debugSummary,
      errorReason: 'no_instagram_account_granted',
    };
  }

  // --------------------------------------------------------------------------
  // Discovery (SU): For SYSTEM_USER tokens (Unified Login / Facebook Login for Business)
  // The documented endpoint is GET /me/assigned_instagram_accounts
  // Ref: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login
  // --------------------------------------------------------------------------
  if (tokenInfo.type === 'SYSTEM_USER') {
    console.log('[OAuthDiscovery] (SU) Token type is SYSTEM_USER — trying GET /me/assigned_instagram_accounts');
    try {
      const assignedEndpoint = `${GRAPH_BASE_URL}/me/assigned_instagram_accounts`;
      const assignedParams = new URLSearchParams({
        fields: 'id,username,name,profile_picture_url,followers_count,media_count',
        access_token: userAccessToken,
        appsecret_proof: appsecretProof,
      });

      const assignedRes = await fetch(`${assignedEndpoint}?${assignedParams.toString()}`);
      const assignedData = await assignedRes.json();

      console.log(`[OAuthDiscovery] (SU) /me/assigned_instagram_accounts status: ${assignedRes.status}`, {
        hasData: !!(assignedData.data),
        count: Array.isArray(assignedData.data) ? assignedData.data.length : 0,
        errorCode: assignedData.error?.code,
        errorType: assignedData.error?.type,
      });

      if (assignedRes.ok && Array.isArray(assignedData.data) && assignedData.data.length > 0) {
        const suAccounts: InstagramBusinessAccount[] = assignedData.data
          .filter((item: any) => item.id)
          .map((item: any) => ({
            id: item.id,
            username: item.username || item.name || 'instagram_user',
            name: item.name,
            profile_picture_url: item.profile_picture_url || null,
            followers_count: Number(item.followers_count || 0),
            media_count: Number(item.media_count || 0),
          }));

        if (suAccounts.length > 0) {
          console.log('[OAuthDiscovery] (SU) SUCCESS: Resolved accounts via assigned_instagram_accounts:', {
            count: suAccounts.length,
            usernames: suAccounts.map((a) => a.username),
          });
          return {
            accounts: suAccounts,
            discoveryMethod: 'assigned_instagram_accounts',
            debugToken: debugSummary,
          };
        }
      }

      // If endpoint is valid but returned empty, also try /{system_user_id}/assigned_instagram_accounts
      if (tokenInfo.user_id) {
        console.log(`[OAuthDiscovery] (SU) Trying /{system_user_id}/assigned_instagram_accounts`);
        const suIdEndpoint = `${GRAPH_BASE_URL}/${tokenInfo.user_id}/assigned_instagram_accounts`;
        const suIdParams = new URLSearchParams({
          fields: 'id,username,name,profile_picture_url,followers_count,media_count',
          access_token: userAccessToken,
          appsecret_proof: appsecretProof,
        });

        const suIdRes = await fetch(`${suIdEndpoint}?${suIdParams.toString()}`);
        const suIdData = await suIdRes.json();

        console.log(`[OAuthDiscovery] (SU) /{su_id}/assigned_instagram_accounts status: ${suIdRes.status}`, {
          hasData: !!(suIdData.data),
          count: Array.isArray(suIdData.data) ? suIdData.data.length : 0,
        });

        if (suIdRes.ok && Array.isArray(suIdData.data) && suIdData.data.length > 0) {
          const suIdAccounts: InstagramBusinessAccount[] = suIdData.data
            .filter((item: any) => item.id)
            .map((item: any) => ({
              id: item.id,
              username: item.username || item.name || 'instagram_user',
              name: item.name,
              profile_picture_url: item.profile_picture_url || null,
              followers_count: Number(item.followers_count || 0),
              media_count: Number(item.media_count || 0),
            }));

          if (suIdAccounts.length > 0) {
            console.log('[OAuthDiscovery] (SU) SUCCESS: Resolved via /{su_id}/assigned_instagram_accounts:', {
              count: suIdAccounts.length,
              usernames: suIdAccounts.map((a) => a.username),
            });
            return {
              accounts: suIdAccounts,
              discoveryMethod: 'assigned_instagram_accounts',
              debugToken: debugSummary,
            };
          }
        }
      }

      console.log('[OAuthDiscovery] (SU) assigned_instagram_accounts returned 0 results — falling through to other discovery methods');
    } catch (err: any) {
      console.warn('[OAuthDiscovery] (SU) assigned_instagram_accounts error:', err.message);
    }
  }

  // --------------------------------------------------------------------------
  // Discovery (a): debug_token granular_scopes -> target_ids
  // --------------------------------------------------------------------------
  console.log('[OAuthDiscovery] (a) Attempting granular_scopes target_ids discovery:', {
    targetIdsCount: targetIds.length,
  });

  if (targetIds.length > 0) {
    const resolvedAccounts: InstagramBusinessAccount[] = [];
    let hadProfessionalError = false;
    let lastErrorCode: number | undefined;

    for (const id of targetIds) {
      const profile = await fetchInstagramAccountProfile(id, userAccessToken);
      console.log(`[OAuthDiscovery] (a) Target ID ${id} profile fetch status: ${profile.status}`, {
        found: !!profile.account,
        error: profile.error,
        errorCode: profile.errorCode,
      });

      if (profile.account) {
        resolvedAccounts.push(profile.account);
      } else {
        lastErrorCode = profile.errorCode;
        if (profile.errorCode === 100 || profile.error?.includes('business') || profile.error?.includes('professional')) {
          hadProfessionalError = true;
        }
      }
    }

    if (resolvedAccounts.length > 0) {
      console.log('[OAuthDiscovery] (a) SUCCESS: Resolved accounts via granular_scopes:', {
        count: resolvedAccounts.length,
        usernames: resolvedAccounts.map((a) => a.username),
      });
      return {
        accounts: resolvedAccounts,
        discoveryMethod: 'granular_scopes',
        debugToken: debugSummary,
      };
    }

    if (hadProfessionalError) {
      return {
        accounts: [],
        discoveryMethod: 'none',
        debugToken: debugSummary,
        errorReason: 'account_not_professional',
        errorCode: lastErrorCode,
      };
    }
  }

  // --------------------------------------------------------------------------
  // Discovery (b): Documented business-asset / Instagram account listing
  // --------------------------------------------------------------------------
  console.log('[OAuthDiscovery] (b) Attempting Business Portfolio assets discovery...');
  try {
    const bizEndpoint = `${GRAPH_BASE_URL}/me/businesses`;
    const bizParams = new URLSearchParams({
      fields: 'id,name',
      access_token: userAccessToken,
      appsecret_proof: appsecretProof,
    });

    const bizRes = await fetch(`${bizEndpoint}?${bizParams.toString()}`);
    const bizData = await bizRes.json();
    const businesses = Array.isArray(bizData.data) ? bizData.data : [];

    console.log(`[OAuthDiscovery] (b) /me/businesses status: ${bizRes.status}, count: ${businesses.length}`);

    if (bizRes.ok && businesses.length > 0) {
      const bizAccounts: InstagramBusinessAccount[] = [];
      const seenBizIds = new Set<string>();

      for (const biz of businesses) {
        for (const edge of ['owned_instagram_accounts', 'client_instagram_accounts', 'instagram_accounts']) {
          try {
            const edgeEndpoint = `${GRAPH_BASE_URL}/${biz.id}/${edge}`;
            const edgeParams = new URLSearchParams({
              fields: 'id,username,name,profile_picture_url,followers_count,media_count',
              access_token: userAccessToken,
              appsecret_proof: appsecretProof,
            });

            const edgeRes = await fetch(`${edgeEndpoint}?${edgeParams.toString()}`);
            const edgeData = await edgeRes.json();

            if (edgeRes.ok && Array.isArray(edgeData.data)) {
              for (const item of edgeData.data) {
                if (item.id && !seenBizIds.has(item.id)) {
                  seenBizIds.add(item.id);
                  bizAccounts.push({
                    id: item.id,
                    username: item.username || item.name || 'instagram_user',
                    name: item.name,
                    profile_picture_url: item.profile_picture_url || null,
                    followers_count: Number(item.followers_count || 0),
                    media_count: Number(item.media_count || 0),
                  });
                }
              }
            }
          } catch {
            // Ignore edge unsupported
          }
        }
      }

      if (bizAccounts.length > 0) {
        console.log('[OAuthDiscovery] (b) SUCCESS: Resolved accounts via Business Portfolio:', {
          count: bizAccounts.length,
          usernames: bizAccounts.map((a) => a.username),
        });
        return {
          accounts: bizAccounts,
          discoveryMethod: 'business_assets',
          debugToken: debugSummary,
        };
      }
    }
  } catch (err: any) {
    console.warn('[OAuthDiscovery] (b) Business discovery error:', err.message);
  }

  // --------------------------------------------------------------------------
  // Discovery (c): Legacy fallback: Facebook Page -> instagram_business_account
  // --------------------------------------------------------------------------
  console.log('[OAuthDiscovery] (c) Attempting legacy Pages discovery...');
  try {
    const pageEndpoint = `${GRAPH_BASE_URL}/me/accounts`;
    const pageParams = new URLSearchParams({
      fields: 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}',
      access_token: userAccessToken,
      appsecret_proof: appsecretProof,
    });

    const pageRes = await fetch(`${pageEndpoint}?${pageParams.toString()}`);
    const pageData = await pageRes.json();
    const pages = Array.isArray(pageData.data) ? pageData.data : [];

    console.log(`[OAuthDiscovery] (c) /me/accounts status: ${pageRes.status}, count: ${pages.length}`);

    if (pageRes.ok && pages.length > 0) {
      const pageAccounts: InstagramBusinessAccount[] = [];

      for (const p of pages) {
        if (p.instagram_business_account) {
          const ig = p.instagram_business_account;
          pageAccounts.push({
            id: ig.id,
            username: ig.username || ig.name || 'instagram_user',
            name: ig.name,
            profile_picture_url: ig.profile_picture_url || null,
            followers_count: Number(ig.followers_count || 0),
            media_count: Number(ig.media_count || 0),
          });
        } else if (p.id && p.access_token) {
          // Page access token deep inspect
          try {
            const pageProof = createAppSecretProof(p.access_token, appSecret);
            const deepRes = await fetch(
              `${GRAPH_BASE_URL}/${p.id}?fields=instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}&access_token=${p.access_token}&appsecret_proof=${pageProof}`
            );
            if (deepRes.ok) {
              const deepData = await deepRes.json();
              if (deepData.instagram_business_account) {
                const ig = deepData.instagram_business_account;
                pageAccounts.push({
                  id: ig.id,
                  username: ig.username || ig.name || 'instagram_user',
                  name: ig.name,
                  profile_picture_url: ig.profile_picture_url || null,
                  followers_count: Number(ig.followers_count || 0),
                  media_count: Number(ig.media_count || 0),
                });
              }
            }
          } catch {
            // Ignore
          }
        }
      }

      if (pageAccounts.length > 0) {
        console.log('[OAuthDiscovery] (c) SUCCESS: Resolved accounts via legacy Pages:', {
          count: pageAccounts.length,
          usernames: pageAccounts.map((a) => a.username),
        });
        return {
          accounts: pageAccounts,
          discoveryMethod: 'legacy_pages',
          debugToken: debugSummary,
        };
      }
    }
  } catch (err: any) {
    console.warn('[OAuthDiscovery] (c) Legacy Pages discovery error:', err.message);
  }

  // Nothing found across all 3 discovery methods
  console.log('[OAuthDiscovery] No accounts found across discovery methods (a), (b), (c)');
  return {
    accounts: [],
    discoveryMethod: 'none',
    debugToken: debugSummary,
    errorReason: 'no_instagram_account_granted',
  };
}

/**
 * Backward compatibility wrapper for existing tests
 */
export async function fetchInstagramAccounts(userAccessToken: string): Promise<InstagramBusinessAccount[]> {
  const result = await resolveInstagramAccountsUnified(userAccessToken);
  return result.accounts;
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
