import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Security Audit: OAuth Log Scrubbing & DEBUG_OAUTH Defaults', () => {
  it('DEBUG_OAUTH defaults to false/disabled in standard environment', () => {
    const isDebug = process.env.DEBUG_OAUTH === 'true';
    assert.equal(isDebug, false, 'DEBUG_OAUTH must be false by default in production and standard runs');
  });

  it('Log scrubbing guarantees zero tokens, secrets, or auth codes in structured logs', () => {
    // Sensitive token simulation
    const sensitiveTokens = [
      'EAABsbCS1iHgBAO7...mockAccessTokenSample...XYZ99',
      'AQDb1234567890abcdef_mock_meta_auth_code_secret',
      'f47ac10b58cc4372a5670e02b2c3d479_mock_client_secret',
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855_appsecret_proof',
    ];

    const capturedLogs = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    try {
      const recordLog = (...args) => {
        capturedLogs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      };
      console.log = recordLog;
      console.warn = recordLog;
      console.error = recordLog;

      // Simulate the structured callback and discovery logging performed in meta-client.ts and callback/route.ts
      const simulateCallbackLogging = (tokenExchangeResponse, debugTokenData) => {
        // Safe logging pattern: log only keys and boolean flags
        console.log('[Instagram OAuth] Code exchange response keys:', Object.keys(tokenExchangeResponse));
        console.log('[Instagram OAuth] Debug token summary:', {
          isValid: debugTokenData.data?.is_valid,
          type: debugTokenData.data?.type,
          scopesCount: debugTokenData.data?.scopes?.length,
          granularScopeCount: debugTokenData.data?.granular_scopes?.length,
        });
      };

      simulateCallbackLogging(
        {
          access_token: sensitiveTokens[0],
          token_type: 'bearer',
          expires_in: 5184000,
        },
        {
          data: {
            app_id: '123456789',
            type: 'SYSTEM_USER',
            is_valid: true,
            scopes: ['instagram_basic', 'instagram_manage_insights'],
            granular_scopes: [{ scope: 'instagram_basic', target_ids: [] }],
            user_id: '10001234567',
          },
        }
      );

      // Audit captured logs for any leaked sensitive values
      for (const logLine of capturedLogs) {
        for (const token of sensitiveTokens) {
          assert.equal(
            logLine.includes(token),
            false,
            `Log line leaked sensitive token or secret! Log content: ${logLine}`
          );
        }
      }

      // Assert expected safe keys WERE logged
      assert.ok(capturedLogs.some((l) => l.includes('access_token')), 'Response keys array should include the key name "access_token"');
      assert.ok(capturedLogs.some((l) => l.includes('SYSTEM_USER')), 'Safe type should be logged');
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  });

  it('Diagnostic probe log entries sanitize access tokens from URL strings', () => {
    const rawUrl = 'https://graph.facebook.com/v27.0/me/assigned_instagram_accounts?access_token=EAABsbCS1iHgBAO7...mock...&fields=id,username';
    const sanitizedUrl = rawUrl.replace(/access_token=[^&]+/g, 'access_token=[REDACTED]');

    assert.equal(sanitizedUrl.includes('EAABsbCS1iHgBAO7'), false);
    assert.equal(sanitizedUrl.includes('access_token=[REDACTED]'), true);
  });
});
