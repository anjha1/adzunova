/**
 * Enterprise Social Connect Error Taxonomy
 * Maps normalized error codes to user-friendly copy and actionable recovery steps.
 * Never exposes raw Meta tokens, client secrets, or internal stack traces.
 */

export type SocialConnectErrorCode =
  | 'consent_denied'
  | 'no_account_granted'
  | 'account_not_professional'
  | 'account_already_linked'
  | 'discovery_failed_server'
  | 'meta_api_error'
  | 'state_invalid_or_expired';

export interface SocialErrorDetails {
  code: SocialConnectErrorCode;
  title: string;
  message: string;
  actionText: string;
  actionHref: string;
  incidentId?: string;
  metaCode?: string;
  metaSubcode?: string;
}

/**
 * Normalizes any incoming query parameter code (including legacy codes)
 * into a canonical SocialConnectErrorCode.
 */
export function normalizeSocialErrorCode(rawCode: string | null | undefined): SocialConnectErrorCode {
  if (!rawCode) return 'discovery_failed_server';

  switch (rawCode) {
    case 'consent_denied':
    case 'user_denied':
    case 'access_denied':
      return 'consent_denied';

    case 'no_account_granted':
    case 'no_instagram_account_granted':
    case 'no_instagram_business_account':
      return 'no_account_granted';

    case 'account_not_professional':
      return 'account_not_professional';

    case 'account_already_linked':
    case 'conflict_duplicate_account':
      return 'account_already_linked';

    case 'meta_api_error':
    case 'meta_graph_error':
      return 'meta_api_error';

    case 'state_invalid_or_expired':
    case 'invalid_state':
    case 'state_mismatch':
      return 'state_invalid_or_expired';

    case 'discovery_failed_server':
    case 'server_error':
    default:
      return 'discovery_failed_server';
  }
}

/**
 * Maps a canonical error code and query params to structured, actionable UI copy.
 */
export function getSocialErrorDetails(
  rawCode: string | null | undefined,
  context: {
    message?: string | null;
    incidentId?: string | null;
    metaCode?: string | number | null;
    metaSubcode?: string | number | null;
  } = {}
): SocialErrorDetails {
  const code = normalizeSocialErrorCode(rawCode);
  const reconnectHref = '/creator/me/social-accounts/instagram/connect';

  const incidentId = context.incidentId || undefined;
  const metaCode = context.metaCode ? String(context.metaCode) : undefined;
  const metaSubcode = context.metaSubcode ? String(context.metaSubcode) : undefined;

  switch (code) {
    case 'consent_denied':
      return {
        code,
        title: 'Meta Consent Cancelled',
        message: 'Meta connection was cancelled or permission was denied. Adzunova needs read access to your public metrics to verify your sponsorship rate card.',
        actionText: 'Reconnect Instagram',
        actionHref: reconnectHref,
      };

    case 'no_account_granted':
      return {
        code,
        title: 'No Instagram Account Selected',
        message: 'No Instagram account was selected during Meta consent. In the Meta dialog, please check the box next to your Instagram account.',
        actionText: 'Select Account & Retry',
        actionHref: reconnectHref,
      };

    case 'account_not_professional':
      return {
        code,
        title: 'Professional Account Required',
        message: 'The selected Instagram account is not a Professional (Creator or Business) account. In your Instagram mobile app, navigate to Settings > Account type and switch to Professional, then try reconnecting.',
        actionText: 'Retry Connection',
        actionHref: reconnectHref,
      };

    case 'account_already_linked':
      return {
        code,
        title: 'Account Already Connected',
        message: 'This Instagram account is already connected to another creator profile on Adzunova. If this is unexpected, please contact support.',
        actionText: 'Contact Support',
        actionHref: 'mailto:support@adzunova.com?subject=Instagram%20Account%20Already%20Linked',
      };

    case 'meta_api_error': {
      const codeDetails = metaCode ? ` (Error ${metaCode}${metaSubcode ? `, Subcode ${metaSubcode}` : ''})` : '';
      return {
        code,
        title: 'Meta API Communication Error',
        message: `Meta Graph API returned an error${codeDetails}. Please wait a moment and try reconnecting.`,
        actionText: 'Retry Connection',
        actionHref: reconnectHref,
        metaCode,
        metaSubcode,
      };
    }

    case 'state_invalid_or_expired':
      return {
        code,
        title: 'Connection Session Expired',
        message: 'The OAuth authorization session has expired or is invalid (exceeded 10-minute validity window). Please initiate a new connection.',
        actionText: 'Start New Connection',
        actionHref: reconnectHref,
      };

    case 'discovery_failed_server':
    default: {
      const refNote = incidentId ? ` Reference Support Code: ${incidentId}.` : '';
      return {
        code: 'discovery_failed_server',
        title: 'Connection Server Error',
        message: `A server error occurred while discovering your account assets.${refNote} Our operations team has been notified.`,
        actionText: 'Try Again',
        actionHref: reconnectHref,
        incidentId,
      };
    }
  }
}
