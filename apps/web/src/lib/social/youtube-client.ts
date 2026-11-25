import crypto from 'crypto';
import { maskId, scrubSensitiveData } from './security/log-scrubber';

export const YOUTUBE_READONLY_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';
export const YT_ANALYTICS_READONLY_SCOPE = 'https://www.googleapis.com/auth/yt-analytics.readonly';

export const YOUTUBE_SCOPES = [
  YOUTUBE_READONLY_SCOPE,
  YT_ANALYTICS_READONLY_SCOPE,
] as const;

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke';
const YOUTUBE_DATA_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_ANALYTICS_API_BASE = 'https://youtubeanalytics.googleapis.com/v2';

export interface PkcePair {
  codeVerifier: string;
  codeChallenge: string;
}

export function generatePkcePair(): PkcePair {
  const codeVerifier = crypto.randomBytes(48).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
}

export function getYouTubeOAuthUrl(params: {
  state: string;
  codeChallenge: string;
}): string {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error('YOUTUBE_CLIENT_ID and YOUTUBE_REDIRECT_URI are required');
  }

  const url = new URL(GOOGLE_AUTH_ENDPOINT);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', YOUTUBE_SCOPES.join(' '));
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('state', params.state);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}

export interface GoogleTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export async function exchangeYouTubeCode(params: {
  code: string;
  codeVerifier: string;
}): Promise<{
  status: number;
  keys: string[];
  data: GoogleTokenResponse;
}> {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('YouTube OAuth client credentials are not configured');
  }

  const body = new URLSearchParams({
    code: params.code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    code_verifier: params.codeVerifier,
  });

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = (await res.json()) as GoogleTokenResponse;
  return {
    status: res.status,
    keys: Object.keys(data || {}),
    data,
  };
}

export async function refreshYouTubeAccessToken(refreshToken: string): Promise<{
  status: number;
  keys: string[];
  data: GoogleTokenResponse;
}> {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('YouTube OAuth client credentials are not configured');
  }

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = (await res.json()) as GoogleTokenResponse;
  return {
    status: res.status,
    keys: Object.keys(data || {}),
    data,
  };
}

export async function revokeYouTubeToken(token: string): Promise<{ status: number }> {
  const body = new URLSearchParams({ token });
  const res = await fetch(GOOGLE_REVOKE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  return { status: res.status };
}

export function verifyGrantedYouTubeScopes(grantedScopeString?: string | null): {
  valid: boolean;
  grantedScopes: string[];
  missingScopes: string[];
} {
  const grantedScopes = (grantedScopeString || '')
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const missingScopes = YOUTUBE_SCOPES.filter((req) => !grantedScopes.includes(req));
  return {
    valid: missingScopes.length === 0,
    grantedScopes,
    missingScopes,
  };
}

export interface GoogleApiErrorShape {
  code?: number;
  message?: string;
  errors?: Array<{
    domain?: string;
    reason?: string;
    message?: string;
  }>;
}

export interface YouTubeChannelItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    customUrl?: string;
    publishedAt?: string;
    country?: string;
    thumbnails?: Record<string, { url?: string; width?: number; height?: number }>;
  };
  statistics?: {
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
  };
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string;
    };
  };
}

export async function fetchYouTubeChannelMine(accessToken: string): Promise<{
  status: number;
  items: YouTubeChannelItem[];
  error?: GoogleApiErrorShape;
  rawKeys: string[];
}> {
  const url = `${YOUTUBE_DATA_API_BASE}/channels?part=id,snippet,statistics,contentDetails&mine=true`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return {
    status: res.status,
    items: Array.isArray(data?.items) ? data.items : [],
    error: data?.error,
    rawKeys: Object.keys(data || {}),
  };
}

export interface YouTubeProbeEntry {
  probe: string;
  endpoint: string;
  httpStatus: number;
  errorCode?: number;
  errorReason?: string;
  errorMessage?: string;
  resultCount?: number;
  keys?: string[];
  notes: string;
  scrubbedSample?: unknown;
}

function scrubChannelForFixture(ch: YouTubeChannelItem) {
  return {
    id: maskId(ch.id),
    snippetKeys: ch.snippet ? Object.keys(ch.snippet) : [],
    hasCustomUrl: Boolean(ch.snippet?.customUrl),
    thumbnailSizes: ch.snippet?.thumbnails ? Object.keys(ch.snippet.thumbnails) : [],
    statistics: ch.statistics
      ? {
          hiddenSubscriberCount: ch.statistics.hiddenSubscriberCount ?? false,
          hasSubscriberCount: typeof ch.statistics.subscriberCount === 'string',
          subscriberCountFormat: typeof ch.statistics.subscriberCount,
          hasViewCount: typeof ch.statistics.viewCount === 'string',
          hasVideoCount: typeof ch.statistics.videoCount === 'string',
        }
      : null,
    hasUploadsPlaylistId: Boolean(ch.contentDetails?.relatedPlaylists?.uploads),
    uploadsPlaylistIdMasked: maskId(ch.contentDetails?.relatedPlaylists?.uploads),
  };
}

function formatDateYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Phase 1 Diagnostic Probe Matrix:
 * Exercises Data API v3 (channels, playlistItems, videos) and Analytics API v2
 * (daily time-series, ageGroup/gender demographics, country views) using real traffic
 * and returns scrubbed results + scrubbed fixture summaries.
 */
export async function runYouTubeProbeMatrix(accessToken: string): Promise<{
  probedAt: string;
  probes: YouTubeProbeEntry[];
}> {
  const probes: YouTubeProbeEntry[] = [];

  // 1. channels.list?part=id,snippet,statistics,contentDetails&mine=true
  const chRes = await fetchYouTubeChannelMine(accessToken);
  const firstChannel = chRes.items[0];
  probes.push({
    probe: 'channels_list_mine',
    endpoint: 'GET /youtube/v3/channels?part=id,snippet,statistics,contentDetails&mine=true',
    httpStatus: chRes.status,
    errorCode: chRes.error?.code,
    errorReason: chRes.error?.errors?.[0]?.reason,
    errorMessage: chRes.error?.message ? scrubSensitiveData(chRes.error.message) : undefined,
    resultCount: chRes.items.length,
    keys: chRes.rawKeys,
    notes: firstChannel
      ? `Found ${chRes.items.length} channel(s). id=${maskId(firstChannel.id)}, hiddenSubscriberCount=${String(firstChannel.statistics?.hiddenSubscriberCount)}`
      : 'No channel found on Google account (items=[])',
    scrubbedSample: firstChannel ? scrubChannelForFixture(firstChannel) : null,
  });

  // 2. playlistItems.list (uploads playlist) + videos.list (batched ids)
  const uploadsPlaylistId = firstChannel?.contentDetails?.relatedPlaylists?.uploads;
  if (uploadsPlaylistId) {
    const plUrl = `${YOUTUBE_DATA_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=10`;
    const plRes = await fetch(plUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    const plData = await plRes.json();
    const plItems = Array.isArray(plData?.items) ? plData.items : [];
    const videoIds = plItems
      .map((it: any) => it?.contentDetails?.videoId)
      .filter((id: unknown): id is string => typeof id === 'string');

    probes.push({
      probe: 'playlist_items_uploads',
      endpoint: 'GET /youtube/v3/playlistItems?part=snippet,contentDetails&playlistId={uploads}&maxResults=10',
      httpStatus: plRes.status,
      errorCode: plData?.error?.code,
      errorReason: plData?.error?.errors?.[0]?.reason,
      errorMessage: plData?.error?.message ? scrubSensitiveData(plData.error.message) : undefined,
      resultCount: plItems.length,
      keys: Object.keys(plData || {}),
      notes: `Fetched ${plItems.length} upload item(s), extracted ${videoIds.length} video ID(s)`,
      scrubbedSample: plItems.slice(0, 2).map((it: any) => ({
        videoIdMasked: maskId(it?.contentDetails?.videoId),
        publishedAt: it?.contentDetails?.videoPublishedAt || it?.snippet?.publishedAt || null,
        snippetKeys: it?.snippet ? Object.keys(it.snippet) : [],
      })),
    });

    if (videoIds.length > 0) {
      const vidUrl = `${YOUTUBE_DATA_API_BASE}/videos?part=id,snippet,statistics,contentDetails&id=${encodeURIComponent(videoIds.slice(0, 10).join(','))}`;
      const vidRes = await fetch(vidUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
      const vidData = await vidRes.json();
      const vidItems = Array.isArray(vidData?.items) ? vidData.items : [];
      probes.push({
        probe: 'videos_list_batched',
        endpoint: 'GET /youtube/v3/videos?part=id,snippet,statistics,contentDetails&id={comma_separated}',
        httpStatus: vidRes.status,
        errorCode: vidData?.error?.code,
        errorReason: vidData?.error?.errors?.[0]?.reason,
        errorMessage: vidData?.error?.message ? scrubSensitiveData(vidData.error.message) : undefined,
        resultCount: vidItems.length,
        keys: Object.keys(vidData || {}),
        notes: `Batched ${videoIds.length} video IDs -> returned ${vidItems.length} items`,
        scrubbedSample: vidItems.slice(0, 2).map((v: any) => ({
          idMasked: maskId(v.id),
          statisticsKeys: v.statistics ? Object.keys(v.statistics) : [],
          duration: v.contentDetails?.duration || null,
        })),
      });
    }
  }

  // 3. YouTube Analytics API reports (last 30 days)
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startYmd = formatDateYmd(startDate);
  const endYmd = formatDateYmd(endDate);

  const analyticsSpecs = [
    {
      probe: 'analytics_daily_series',
      endpoint: 'GET /v2/reports?ids=channel==MINE&metrics=views,estimatedMinutesWatched,subscribersGained,subscribersLost&dimensions=day',
      params: {
        ids: 'channel==MINE',
        startDate: startYmd,
        endDate: endYmd,
        metrics: 'views,estimatedMinutesWatched,subscribersGained,subscribersLost',
        dimensions: 'day',
        sort: 'day',
      },
    },
    {
      probe: 'analytics_demographics_age_gender',
      endpoint: 'GET /v2/reports?ids=channel==MINE&metrics=viewerPercentage&dimensions=ageGroup,gender',
      params: {
        ids: 'channel==MINE',
        startDate: startYmd,
        endDate: endYmd,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup,gender',
      },
    },
    {
      probe: 'analytics_country_views',
      endpoint: 'GET /v2/reports?ids=channel==MINE&metrics=views&dimensions=country&sort=-views&maxResults=25',
      params: {
        ids: 'channel==MINE',
        startDate: startYmd,
        endDate: endYmd,
        metrics: 'views',
        dimensions: 'country',
        sort: '-views',
        maxResults: '25',
      },
    },
  ];

  for (const spec of analyticsSpecs) {
    const url = new URL(`${YOUTUBE_ANALYTICS_API_BASE}/reports`);
    for (const [k, v] of Object.entries(spec.params)) {
      url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    const rows = Array.isArray(data?.rows) ? data.rows : [];
    probes.push({
      probe: spec.probe,
      endpoint: spec.endpoint,
      httpStatus: res.status,
      errorCode: data?.error?.code,
      errorReason: data?.error?.errors?.[0]?.reason,
      errorMessage: data?.error?.message ? scrubSensitiveData(data.error.message) : undefined,
      resultCount: rows.length,
      keys: Object.keys(data || {}),
      notes: data?.error
        ? `Error reason=${data.error.errors?.[0]?.reason || 'unknown'}`
        : `Returned ${rows.length} row(s), columnHeaders=${(data?.columnHeaders || []).map((c: any) => c.name).join(',')}`,
      scrubbedSample: {
        kind: data?.kind,
        columnHeaders: data?.columnHeaders,
        rowCount: rows.length,
        sampleRows: rows.slice(0, 3),
      },
    });
  }

  return {
    probedAt: new Date().toISOString(),
    probes,
  };
}
