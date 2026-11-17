/**
 * Identity-service startup configuration validator.
 * Validates all required env vars at process start using Zod.
 * Fail-fast: logs a clear table of missing/invalid vars and exits with code 1.
 *
 * Usage: import './config' as the first import in main.ts
 */
import path from 'path';
import dotenv from 'dotenv';
import * as z from 'zod';

// Load .env from current directory or root monorepo directory
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const ENV_SCHEMA = z.object({
  // --- Server ---
  IDENTITY_SERVICE_PORT: z.string().optional(),

  // --- Database ---
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required (use mongodb+srv://... or mongodb://...)'),

  // --- Auth secrets ---
  AUTH_SESSION_SECRET: z.string().optional(), // Warn in dev if missing, error in prod

  // --- Google OAuth ---
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required for Google OAuth'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required for Google OAuth'),
  GOOGLE_CALLBACK_URL: z.string().min(1, 'GOOGLE_CALLBACK_URL is required (e.g. http://localhost:3000/api/auth/callback/google)'),

  // --- Email (optional for dev, required for prod) ---
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  OTP_FROM: z.string().optional(),

  // --- Node env ---
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

type Env = z.infer<typeof ENV_SCHEMA>;

function validateEnv(): Env {
  const result = ENV_SCHEMA.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ✗ ${i.path.join('.')}: ${i.message}`);
    console.error('\n╔══════════════════════════════════════════════════════════╗');
    console.error('║   [identity-service] FATAL: Invalid environment config   ║');
    console.error('╠══════════════════════════════════════════════════════════╣');
    issues.forEach((line) => console.error(`║ ${line.padEnd(57)}║`));
    console.error('╚══════════════════════════════════════════════════════════╝');
    console.error('\nSet the missing variables in services/identity-service/.env and restart.\n');
    process.exit(1);
  }

  const env = result.data;
  const isDev = env.NODE_ENV !== 'production';

  // Warn about missing AUTH_SESSION_SECRET in dev; error in prod
  if (!env.AUTH_SESSION_SECRET) {
    if (!isDev) {
      console.error('[identity-service] FATAL: AUTH_SESSION_SECRET must be set in production.');
      process.exit(1);
    }
    console.warn(
      '\n⚠️  [identity-service] WARNING: AUTH_SESSION_SECRET is not set.\n' +
      '   Using insecure dev default. Set AUTH_SESSION_SECRET in .env before deploying.\n'
    );
  }

  // Warn about SMTP missing in dev
  if (isDev && (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS)) {
    console.warn(
      '⚠️  [identity-service] WARNING: SMTP credentials incomplete.\n' +
      '   OTP codes will be printed to the console (dev fallback).\n'
    );
  }

  return env;
}

export const config = validateEnv();
export const isDevelopment = (config.NODE_ENV ?? 'development') !== 'production';
