import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as z from 'zod';

describe('Config Validator Unit Tests', () => {
  const TEST_SCHEMA = z.object({
    IDENTITY_SERVICE_PORT: z.string().optional(),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
    GOOGLE_CALLBACK_URL: z.string().min(1, 'GOOGLE_CALLBACK_URL is required'),
    AUTH_SESSION_SECRET: z.string().optional(),
  });

  it('fails validation when required variables are missing', () => {
    const invalidEnv = {
      MONGODB_URI: '',
    };
    const result = TEST_SCHEMA.safeParse(invalidEnv);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('MONGODB_URI');
      expect(paths).toContain('GOOGLE_CLIENT_ID');
      expect(paths).toContain('GOOGLE_CLIENT_SECRET');
      expect(paths).toContain('GOOGLE_CALLBACK_URL');
    }
  });

  it('passes validation when all required variables are supplied', () => {
    const validEnv = {
      MONGODB_URI: 'mongodb://localhost:27017/test_db',
      GOOGLE_CLIENT_ID: 'google-client-id-123.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'test-google-client-secret-mock',
      GOOGLE_CALLBACK_URL: 'http://localhost:3000/api/auth/callback/google',
      AUTH_SESSION_SECRET: 'custom-session-secret-32-chars-long',
    };
    const result = TEST_SCHEMA.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.GOOGLE_CLIENT_ID).toBe('google-client-id-123.apps.googleusercontent.com');
    }
  });
});
