import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/models';

function getJwtSecret(): string {
  if (process.env.AUTH_SESSION_SECRET) {
    return process.env.AUTH_SESSION_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: AUTH_SESSION_SECRET must be defined in production environment.');
  }
  return 'dev-insecure-session-key-for-local-testing-only-32c';
}

const JWT_SECRET = getJwtSecret();

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSessionJwt(payload: TokenPayload, expiresInSeconds: number = 7 * 24 * 3600): string {
  const options: SignOptions = { expiresIn: expiresInSeconds };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifySessionJwt(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function signOAuthState(data: { role: UserRole; redirect?: string }): string {
  const nonce = generateRandomToken(16);
  const payload = { ...data, nonce, exp: Math.floor(Date.now() / 1000) + 900 }; // 15 mins
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyOAuthState(state: string): { role: UserRole; redirect?: string; nonce: string } | null {
  try {
    return jwt.verify(state, JWT_SECRET) as { role: UserRole; redirect?: string; nonce: string };
  } catch {
    return null;
  }
}
