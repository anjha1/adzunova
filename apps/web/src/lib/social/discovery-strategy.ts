/**
 * Instagram Asset Discovery Strategy Pattern
 * Provides token-type based strategy dispatching between SYSTEM_USER (Unified Login)
 * and USER (standard Facebook Login for Business), with explicit ordered fallback chains.
 */

import { MetaDebugTokenData } from './meta-client';
import { createAppSecretProof } from './security/meta-signature';
import { scrubSensitiveData, maskId } from './security/log-scrubber';
import crypto from 'crypto';

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || 'v27.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export interface DiscoveredAccount {
  igId: string;
  username?: string;
  name?: string;
  source: 'assigned_instagram_accounts' | 'system_user_edge' | 'granular_scopes' | 'business_assets' | 'legacy_pages';
}

export interface InstagramAssetDiscovery {
  readonly tokenType: 'SYSTEM_USER' | 'USER';
  discover(ctx: {
    accessToken: string;
    debug: MetaDebugTokenData;
    appSecret: string;
  }): Promise<DiscoveredAccount[]>;
}

/**
 * SystemUserDiscovery: implements discovery for Business Integration System User tokens (Unified Login).
 * Endpoint 1: GET /me/assigned_instagram_accounts?fields=id,username,name
 * Endpoint 2: GET /{system_user_id}/assigned_instagram_accounts?fields=id,username,name
 * Ref: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login
 */
export class SystemUserDiscovery implements InstagramAssetDiscovery {
  readonly tokenType = 'SYSTEM_USER' as const;

  async discover(ctx: {
    accessToken: string;
    debug: MetaDebugTokenData;
    appSecret: string;
  }): Promise<DiscoveredAccount[]> {
    const proof = createAppSecretProof(ctx.accessToken, ctx.appSecret);
    const discovered: DiscoveredAccount[] = [];
    const seenIds = new Set<string>();

    // 1. Primary endpoint: GET /me/assigned_instagram_accounts
    try {
      const endpoint = `${GRAPH_BASE_URL}/me/assigned_instagram_accounts?fields=id,username,name&access_token=${ctx.accessToken}&appsecret_proof=${proof}`;
      const res = await fetch(endpoint);
      const data = await res.json();

      console.log(`[SystemUserDiscovery] /me/assigned_instagram_accounts HTTP ${res.status}:`, {
        count: Array.isArray(data.data) ? data.data.length : 0,
        errorCode: data.error?.code,
      });

      if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
        for (const item of data.data) {
          if (item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            discovered.push({
              igId: item.id,
              username: item.username || item.name,
              name: item.name,
              source: 'assigned_instagram_accounts',
            });
          }
        }
        if (discovered.length > 0) {
          return discovered;
        }
      }
    } catch (err: any) {
      console.warn('[SystemUserDiscovery] /me/assigned_instagram_accounts error:', err.message);
    }

    // 2. Secondary endpoint: GET /{system_user_id}/assigned_instagram_accounts
    const suId = ctx.debug.user_id;
    if (suId) {
      try {
        const endpoint = `${GRAPH_BASE_URL}/${suId}/assigned_instagram_accounts?fields=id,username,name&access_token=${ctx.accessToken}&appsecret_proof=${proof}`;
        const res = await fetch(endpoint);
        const data = await res.json();

        console.log(`[SystemUserDiscovery] /{su_id}/assigned_instagram_accounts HTTP ${res.status}:`, {
          count: Array.isArray(data.data) ? data.data.length : 0,
        });

        if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
          for (const item of data.data) {
            if (item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              discovered.push({
                igId: item.id,
                username: item.username || item.name,
                name: item.name,
                source: 'system_user_edge',
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('[SystemUserDiscovery] /{su_id}/assigned_instagram_accounts error:', err.message);
      }
    }

    return discovered;
  }
}

/**
 * UserTokenDiscovery: implements discovery for standard User access tokens (Facebook Login for Business).
 * Step 1: debug_token -> granular_scopes -> target_ids
 * Step 2: GET /me/businesses -> owned/client/instagram_accounts
 * Ref: https://developers.facebook.com/docs/graph-api/reference/v22.0/debug_token
 */
export class UserTokenDiscovery implements InstagramAssetDiscovery {
  readonly tokenType = 'USER' as const;

  async discover(ctx: {
    accessToken: string;
    debug: MetaDebugTokenData;
    appSecret: string;
  }): Promise<DiscoveredAccount[]> {
    const proof = createAppSecretProof(ctx.accessToken, ctx.appSecret);
    const discovered: DiscoveredAccount[] = [];
    const seenIds = new Set<string>();

    // 1. Primary: debug_token granular_scopes target_ids
    const granularScopes = ctx.debug.granular_scopes || [];
    const igScopes = granularScopes.filter((g) => g.scope.startsWith('instagram_'));
    const targetIds = Array.from(new Set(igScopes.flatMap((g) => g.target_ids || [])));

    if (targetIds.length > 0) {
      console.log(`[UserTokenDiscovery] Found ${targetIds.length} target_ids in granular_scopes`);
      for (const id of targetIds) {
        if (!seenIds.has(id)) {
          seenIds.add(id);
          discovered.push({
            igId: id,
            source: 'granular_scopes',
          });
        }
      }
      return discovered;
    }

    // 2. Secondary: Business Portfolio assets listing (/me/businesses)
    try {
      const bizRes = await fetch(`${GRAPH_BASE_URL}/me/businesses?fields=id,name&access_token=${ctx.accessToken}&appsecret_proof=${proof}`);
      const bizData = await bizRes.json();
      const businesses = Array.isArray(bizData.data) ? bizData.data : [];

      console.log(`[UserTokenDiscovery] /me/businesses HTTP ${bizRes.status}, count: ${businesses.length}`);

      if (bizRes.ok && businesses.length > 0) {
        for (const biz of businesses) {
          for (const edge of ['owned_instagram_accounts', 'client_instagram_accounts', 'instagram_accounts']) {
            try {
              const edgeRes = await fetch(`${GRAPH_BASE_URL}/${biz.id}/${edge}?fields=id,username,name&access_token=${ctx.accessToken}&appsecret_proof=${proof}`);
              const edgeData = await edgeRes.json();
              if (edgeRes.ok && Array.isArray(edgeData.data)) {
                for (const item of edgeData.data) {
                  if (item.id && !seenIds.has(item.id)) {
                    seenIds.add(item.id);
                    discovered.push({
                      igId: item.id,
                      username: item.username || item.name,
                      name: item.name,
                      source: 'business_assets',
                    });
                  }
                }
              }
            } catch {
              // Ignore edge errors
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('[UserTokenDiscovery] /me/businesses error:', err.message);
    }

    return discovered;
  }
}

/**
 * LegacyPagesDiscovery: final fallback for legacy Page-based Instagram account connections.
 */
export async function discoverLegacyPageAccounts(
  accessToken: string,
  appSecret: string
): Promise<DiscoveredAccount[]> {
  const proof = createAppSecretProof(accessToken, appSecret);
  const discovered: DiscoveredAccount[] = [];
  const seenIds = new Set<string>();

  try {
    const endpoint = `${GRAPH_BASE_URL}/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${accessToken}&appsecret_proof=${proof}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    const pages = Array.isArray(data.data) ? data.data : [];

    console.log(`[LegacyPagesDiscovery] /me/accounts HTTP ${res.status}, count: ${pages.length}`);

    if (res.ok && pages.length > 0) {
      for (const page of pages) {
        const ig = page.instagram_business_account;
        if (ig && ig.id && !seenIds.has(ig.id)) {
          seenIds.add(ig.id);
          discovered.push({
            igId: ig.id,
            username: ig.username || ig.name,
            name: ig.name,
            source: 'legacy_pages',
          });
        }
      }
    }
  } catch (err: any) {
    console.warn('[LegacyPagesDiscovery] /me/accounts error:', err.message);
  }

  return discovered;
}

/**
 * Strategy Selector: chooses the appropriate discovery strategy based on token type
 * or environment override (META_DISCOVERY_STRATEGY).
 */
export function getDiscoveryStrategy(tokenType: string): InstagramAssetDiscovery {
  const override = process.env.META_DISCOVERY_STRATEGY;
  if (override === 'SYSTEM_USER') return new SystemUserDiscovery();
  if (override === 'USER') return new UserTokenDiscovery();

  if (tokenType === 'SYSTEM_USER') {
    return new SystemUserDiscovery();
  }
  return new UserTokenDiscovery();
}

/**
 * Server-Side Signed Account Selection Token (HMAC-SHA256)
 * Used when multiple Instagram accounts are discovered during OAuth consent.
 * Guarantees the client cannot submit arbitrary or foreign account IDs.
 */
export interface AccountSelectionPayload {
  creatorId: string;
  allowedIgIds: string[];
  accountsMeta: Array<{ igId: string; username?: string }>;
  encryptedTokenPayload: {
    ciphertext: string;
    nonce: string;
    keyId: string;
  };
  expiresAt: number; // Unix timestamp
}

export function createAccountSelectionToken(
  payload: Omit<AccountSelectionPayload, 'expiresAt'>,
  appSecret: string,
  ttlSeconds = 600 // 10 minutes
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const fullPayload: AccountSelectionPayload = {
    ...payload,
    expiresAt,
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', appSecret).update(payloadB64).digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifyAccountSelectionToken(
  token: string,
  creatorId: string,
  appSecret: string
): { valid: boolean; payload?: AccountSelectionPayload; error?: string } {
  if (!token) return { valid: false, error: 'Missing selection token' };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, error: 'Malformed selection token' };

  const [payloadB64, signature] = parts;

  // 1. Verify HMAC signature using constant-time comparison
  const expectedSig = crypto.createHmac('sha256', appSecret).update(payloadB64).digest('base64url');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: 'Invalid selection token signature' };
  }

  // 2. Decode payload
  try {
    const payload: AccountSelectionPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    );

    // 3. Check expiration
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < nowSec) {
      return { valid: false, error: 'Selection token has expired. Please reconnect.' };
    }

    // 4. Check creator binding
    if (payload.creatorId !== creatorId) {
      return { valid: false, error: 'Selection token not authorized for this creator' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: `Invalid token JSON: ${err.message}` };
  }
}
