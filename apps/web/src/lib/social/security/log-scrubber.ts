/**
 * Security log scrubber and URL sanitizer for Meta / Instagram integration.
 * Prevents access tokens and client secrets from appearing in logs, error traces, and stores.
 */

const TOKEN_PATTERNS = [
  /EA[A-Za-z0-9_=-]{30,}/g,                        // Meta user/page access tokens (start with EA...)
  /(access_token=)([^&]+)/gi,                       // Query parameter access_token
  /(client_secret=)([^&]+)/gi,                      // Query parameter client_secret
  /(["']?access_token["']?\s*[:=]\s*["'])([^"']+)(["'])/gi, // JSON access_token field
  /(["']?client_secret["']?\s*[:=]\s*["'])([^"']+)(["'])/gi, // JSON client_secret field
];

/**
 * Scrub sensitive tokens and secrets from strings before logging or serializing
 */
export function scrubSensitiveData(input: string): string {
  if (!input) return '';
  let sanitized = input;

  // Redact Meta tokens
  sanitized = sanitized.replace(/EA[A-Za-z0-9_=-]{30,}/g, '[REDACTED_META_TOKEN]');

  // Redact query parameter credentials
  sanitized = sanitized.replace(/(access_token=)([^&]+)/gi, '$1[REDACTED]');
  sanitized = sanitized.replace(/(client_secret=)([^&]+)/gi, '$1[REDACTED]');

  // Redact JSON credentials
  sanitized = sanitized.replace(
    /(["']?access_token["']?\s*[:=]\s*["'])([^"']+)(["'])/gi,
    '$1[REDACTED]$3'
  );
  sanitized = sanitized.replace(
    /(["']?client_secret["']?\s*[:=]\s*["'])([^"']+)(["'])/gi,
    '$1[REDACTED]$3'
  );

  return sanitized;
}

/**
 * Strips access tokens from Meta Graph API paging URLs.
 * Meta includes access_token in paging.next and paging.previous,
 * which must NEVER be stored, returned, or logged.
 */
export function stripTokenFromPagingUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete('access_token');
    parsed.searchParams.delete('appsecret_proof');
    return parsed.toString();
  } catch {
    // If not a valid absolute URL, sanitize via regex
    return url.replace(/([?&]access_token=)[^&]+/i, '').replace(/([?&]appsecret_proof=)[^&]+/i, '');
  }
}

/**
 * Masks an asset or user ID showing only first 4 and last 4 characters.
 */
export function maskId(id?: string | null): string {
  if (!id) return '<none>';
  if (id.length <= 8) return '****';
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

