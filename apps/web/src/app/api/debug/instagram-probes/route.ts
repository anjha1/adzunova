import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAppSecretProof } from '@/lib/social/security/meta-signature';
import { scrubSensitiveData } from '@/lib/social/security/log-scrubber';

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || 'v27.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Masks an ID to show only first 4 + last 4 characters.
 */
function maskId(id: string | undefined | null): string {
  if (!id) return '<none>';
  if (id.length <= 8) return '****';
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

/**
 * Phase 1 Diagnostic Probe: runs a comprehensive discovery matrix
 * against the Meta Graph API using a live token from an existing
 * connected account. Only available when DEBUG_OAUTH=true.
 *
 * GET /api/debug/instagram-probes
 */
export async function GET(req: NextRequest) {
  // Guard: only available behind DEBUG_OAUTH=true
  if (process.env.DEBUG_OAUTH !== 'true') {
    return NextResponse.json({ error: 'Debug probes disabled. Set DEBUG_OAUTH=true.' }, { status: 403 });
  }

  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'META_APP_ID and META_APP_SECRET required' }, { status: 500 });
  }

  // This endpoint requires a token to probe against.
  // In production we'd retrieve from the encrypted credential store,
  // but for diagnostics we accept a header (never logged).
  // The token MUST be from a live Render session — never committed.
  const probeToken = req.headers.get('x-debug-token');
  if (!probeToken) {
    return NextResponse.json({
      error: 'Provide x-debug-token header with a live Meta access token (never committed/logged)',
    }, { status: 400 });
  }

  const proof = createAppSecretProof(probeToken, appSecret);
  const appToken = `${appId}|${appSecret}`;

  const probeResults: Array<{
    probe: string;
    endpoint: string;
    httpStatus: number;
    errorCode?: number;
    errorSubcode?: number;
    errorType?: string;
    resultCount?: number;
    keys?: string[];
    notes: string;
  }> = [];

  // Helper: run a probe and capture results
  async function probe(
    name: string,
    endpointTemplate: string,
    url: string,
  ): Promise<any> {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const entry: (typeof probeResults)[0] = {
        probe: name,
        endpoint: endpointTemplate,
        httpStatus: res.status,
        notes: '',
      };

      if (data.error) {
        entry.errorCode = data.error.code;
        entry.errorSubcode = data.error.subcode;
        entry.errorType = data.error.type;
        entry.notes = scrubSensitiveData(data.error.message || '');
      } else if (data.data && Array.isArray(data.data)) {
        entry.resultCount = data.data.length;
        entry.keys = data.data.length > 0 ? Object.keys(data.data[0]) : [];
        if (data.data.length > 0) {
          entry.notes = `First item keys: ${entry.keys.join(', ')}; IDs: ${data.data.map((d: any) => maskId(d.id)).join(', ')}`;
        } else {
          entry.notes = 'Empty data array';
        }
      } else if (data.id) {
        entry.resultCount = 1;
        entry.keys = Object.keys(data);
        entry.notes = `Single node. id=${maskId(data.id)}, keys: ${entry.keys.join(', ')}`;
      } else {
        entry.keys = Object.keys(data);
        entry.notes = `Response keys: ${entry.keys.join(', ')}`;
      }

      probeResults.push(entry);
      return data;
    } catch (err: any) {
      probeResults.push({
        probe: name,
        endpoint: endpointTemplate,
        httpStatus: 0,
        notes: `Network error: ${err.message}`,
      });
      return null;
    }
  }

  // ===== P0: debug_token (full shape) =====
  const debugUrl = `${GRAPH_BASE_URL}/debug_token?input_token=${probeToken}&access_token=${appToken}`;
  const debugData = await probe('P0: debug_token', 'GET /debug_token', debugUrl);
  const debugTokenShape: Record<string, any> = {};

  if (debugData?.data) {
    const d = debugData.data;
    debugTokenShape.type = d.type;
    debugTokenShape.app_id = maskId(d.app_id);
    debugTokenShape.application = d.application;
    debugTokenShape.user_id = maskId(d.user_id);
    debugTokenShape.is_valid = d.is_valid;
    debugTokenShape.scopes = d.scopes;
    debugTokenShape.expires_at = d.expires_at;
    debugTokenShape.data_access_expires_at = d.data_access_expires_at;
    debugTokenShape.issued_at = d.issued_at;
    debugTokenShape.all_keys = Object.keys(d);

    // Granular scopes detailed shape
    if (Array.isArray(d.granular_scopes)) {
      debugTokenShape.granular_scopes = d.granular_scopes.map((gs: any) => ({
        scope: gs.scope,
        keys: Object.keys(gs),
        target_ids_count: Array.isArray(gs.target_ids) ? gs.target_ids.length : 0,
        target_ids_masked: Array.isArray(gs.target_ids) ? gs.target_ids.map(maskId) : [],
      }));
    }
  }

  // ===== P1: /me identity =====
  const systemUserId = debugData?.data?.user_id;
  const meUrl = `${GRAPH_BASE_URL}/me?fields=id,name,email,client_business_id&access_token=${probeToken}&appsecret_proof=${proof}`;
  const meData = await probe('P1: /me identity', 'GET /me?fields=id,name,email,client_business_id', meUrl);

  const clientBusinessId = meData?.client_business_id;

  // ===== P2: /me/assigned_instagram_accounts (THE KEY ENDPOINT for SYSTEM_USER) =====
  const assignedUrl = `${GRAPH_BASE_URL}/me/assigned_instagram_accounts?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${probeToken}&appsecret_proof=${proof}`;
  await probe('P2: /me/assigned_instagram_accounts', 'GET /me/assigned_instagram_accounts?fields=id,username,...', assignedUrl);

  // ===== P3: /{system_user_id}/assigned_instagram_accounts =====
  if (systemUserId) {
    const suAssignedUrl = `${GRAPH_BASE_URL}/${systemUserId}/assigned_instagram_accounts?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${probeToken}&appsecret_proof=${proof}`;
    await probe('P3: /{su_id}/assigned_instagram_accounts', `GET /${maskId(systemUserId)}/assigned_instagram_accounts`, suAssignedUrl);
  }

  // ===== P4: /{business_id}/owned_instagram_accounts (if business id available) =====
  if (clientBusinessId) {
    const ownedUrl = `${GRAPH_BASE_URL}/${clientBusinessId}/owned_instagram_accounts?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${probeToken}&appsecret_proof=${proof}`;
    await probe('P4: /{biz}/owned_instagram_accounts', `GET /${maskId(clientBusinessId)}/owned_instagram_accounts`, ownedUrl);

    const clientUrl = `${GRAPH_BASE_URL}/${clientBusinessId}/client_instagram_accounts?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${probeToken}&appsecret_proof=${proof}`;
    await probe('P4b: /{biz}/client_instagram_accounts', `GET /${maskId(clientBusinessId)}/client_instagram_accounts`, clientUrl);

    const igAccUrl = `${GRAPH_BASE_URL}/${clientBusinessId}/instagram_accounts?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${probeToken}&appsecret_proof=${proof}`;
    await probe('P4c: /{biz}/instagram_accounts', `GET /${maskId(clientBusinessId)}/instagram_accounts`, igAccUrl);
  }

  // ===== P5: /me/instagram_accounts (direct edge) =====
  const meIgUrl = `${GRAPH_BASE_URL}/me/instagram_accounts?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${probeToken}&appsecret_proof=${proof}`;
  await probe('P5: /me/instagram_accounts', 'GET /me/instagram_accounts', meIgUrl);

  // ===== P6a: /me/businesses (control — expected 400 for SYSTEM_USER) =====
  const bizUrl = `${GRAPH_BASE_URL}/me/businesses?fields=id,name&access_token=${probeToken}&appsecret_proof=${proof}`;
  await probe('P6a: /me/businesses (control)', 'GET /me/businesses', bizUrl);

  // ===== P6b: /me/accounts (control — expected 0 for no Facebook Pages) =====
  const pagesUrl = `${GRAPH_BASE_URL}/me/accounts?fields=id,name&access_token=${probeToken}&appsecret_proof=${proof}`;
  await probe('P6b: /me/accounts (control)', 'GET /me/accounts', pagesUrl);

  // ===== P7: If any probe found an IG account ID, verify profile fetch =====
  const discoveredIds: string[] = [];
  for (const result of probeResults) {
    if (result.resultCount && result.resultCount > 0 && result.notes.includes('id=')) {
      // Extract from notes
      const idMatches = result.notes.match(/id=(\d{4}\.\.\.\d{4})/g);
      if (idMatches) {
        // We can't use masked IDs to verify — we'd need the real IDs from the data
        // The probe function already logged the shape; we'll verify in the callback
      }
    }
  }

  // Build summary
  console.log('[DiagnosticProbe] Probe matrix complete:', JSON.stringify(probeResults, null, 2));
  console.log('[DiagnosticProbe] debug_token shape:', JSON.stringify(debugTokenShape, null, 2));

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    tokenType: debugTokenShape.type,
    debugTokenShape,
    probeMatrix: probeResults,
    recommendation: debugTokenShape.type === 'SYSTEM_USER'
      ? 'Token is SYSTEM_USER (Business Integration System User). Primary discovery: GET /me/assigned_instagram_accounts. See P2/P3 results.'
      : 'Token is USER type. Primary discovery: GET /debug_token granular_scopes target_ids, then /me/businesses assets.',
  });
}
