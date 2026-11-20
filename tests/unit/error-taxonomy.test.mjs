import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase 5: Enterprise Error Taxonomy & Mapping', async () => {
  const { normalizeSocialErrorCode, getSocialErrorDetails } = await import(
    '../../apps/web/src/lib/social/error-taxonomy.ts'
  );

  it('normalizes legacy and canonical error codes', () => {
    assert.strictEqual(normalizeSocialErrorCode('consent_denied'), 'consent_denied');
    assert.strictEqual(normalizeSocialErrorCode('user_denied'), 'consent_denied');
    assert.strictEqual(normalizeSocialErrorCode('access_denied'), 'consent_denied');

    assert.strictEqual(normalizeSocialErrorCode('no_account_granted'), 'no_account_granted');
    assert.strictEqual(normalizeSocialErrorCode('no_instagram_account_granted'), 'no_account_granted');

    assert.strictEqual(normalizeSocialErrorCode('account_not_professional'), 'account_not_professional');

    assert.strictEqual(normalizeSocialErrorCode('account_already_linked'), 'account_already_linked');
    assert.strictEqual(normalizeSocialErrorCode('conflict_duplicate_account'), 'account_already_linked');

    assert.strictEqual(normalizeSocialErrorCode('meta_api_error'), 'meta_api_error');

    assert.strictEqual(normalizeSocialErrorCode('state_invalid_or_expired'), 'state_invalid_or_expired');
    assert.strictEqual(normalizeSocialErrorCode('invalid_state'), 'state_invalid_or_expired');

    assert.strictEqual(normalizeSocialErrorCode('discovery_failed_server'), 'discovery_failed_server');
    assert.strictEqual(normalizeSocialErrorCode('server_error'), 'discovery_failed_server');
    assert.strictEqual(normalizeSocialErrorCode(null), 'discovery_failed_server');
    assert.strictEqual(normalizeSocialErrorCode('unknown_arbitrary_string'), 'discovery_failed_server');
  });

  it('generates accurate, user-friendly details for consent_denied', () => {
    const details = getSocialErrorDetails('consent_denied');
    assert.strictEqual(details.code, 'consent_denied');
    assert.strictEqual(details.title, 'Meta Consent Cancelled');
    assert.ok(details.message.includes('Meta connection was cancelled or permission was denied.'));
    assert.strictEqual(details.actionText, 'Reconnect Instagram');
    assert.strictEqual(details.actionHref, '/creator/me/social-accounts/instagram/connect');
  });

  it('generates accurate details for no_account_granted', () => {
    const details = getSocialErrorDetails('no_account_granted');
    assert.strictEqual(details.code, 'no_account_granted');
    assert.strictEqual(details.title, 'No Instagram Account Selected');
    assert.ok(details.message.includes('No Instagram account was selected during Meta consent.'));
    assert.strictEqual(details.actionText, 'Select Account & Retry');
  });

  it('generates guidance for account_not_professional', () => {
    const details = getSocialErrorDetails('account_not_professional');
    assert.strictEqual(details.code, 'account_not_professional');
    assert.strictEqual(details.title, 'Professional Account Required');
    assert.ok(details.message.includes('The selected Instagram account is not a Professional (Creator or Business) account.'));
    assert.ok(details.message.includes('Settings > Account type'));
  });

  it('generates 409 conflict details for account_already_linked', () => {
    const details = getSocialErrorDetails('account_already_linked');
    assert.strictEqual(details.code, 'account_already_linked');
    assert.strictEqual(details.title, 'Account Already Connected');
    assert.ok(details.message.includes('already connected to another creator profile'));
    assert.strictEqual(details.actionText, 'Contact Support');
    assert.ok(details.actionHref.startsWith('mailto:support@adzunova.com'));
  });

  it('formats discovery_failed_server with incident support code', () => {
    const details = getSocialErrorDetails('discovery_failed_server', {
      incidentId: 'srv_a1b2c3d4',
    });
    assert.strictEqual(details.code, 'discovery_failed_server');
    assert.strictEqual(details.incidentId, 'srv_a1b2c3d4');
    assert.ok(details.message.includes('Reference Support Code: srv_a1b2c3d4'));
    assert.strictEqual(details.actionText, 'Try Again');
  });

  it('formats meta_api_error with sanitized code and subcode only (no tokens/secrets)', () => {
    const details = getSocialErrorDetails('meta_api_error', {
      metaCode: 190,
      metaSubcode: 463,
    });
    assert.strictEqual(details.code, 'meta_api_error');
    assert.strictEqual(details.metaCode, '190');
    assert.strictEqual(details.metaSubcode, '463');
    assert.ok(details.message.includes('Error 190, Subcode 463'));
    assert.strictEqual(details.actionText, 'Retry Connection');
  });

  it('formats state_invalid_or_expired with 10-minute validity explanation', () => {
    const details = getSocialErrorDetails('state_invalid_or_expired');
    assert.strictEqual(details.code, 'state_invalid_or_expired');
    assert.strictEqual(details.title, 'Connection Session Expired');
    assert.ok(details.message.includes('10-minute validity window'));
    assert.strictEqual(details.actionText, 'Start New Connection');
  });
});
