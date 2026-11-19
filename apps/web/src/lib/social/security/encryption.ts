import crypto from 'crypto';

/**
 * Envelope encryption for social account credentials using AES-256-GCM.
 * Tokens are never stored in plaintext and never logged.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const DEFAULT_KEY_ID = 'v1';

function getEncryptionKey(): Buffer {
  const base64Key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!base64Key) {
    // Development fallback key (32 bytes zero-padded)
    return Buffer.from('01234567890123456789012345678901', 'utf8');
  }
  const keyBuffer = Buffer.from(base64Key, 'base64');
  if (keyBuffer.length !== 32) {
    throw new Error(`TOKEN_ENCRYPTION_KEY must be exactly 32 bytes (256 bits). Got ${keyBuffer.length} bytes.`);
  }
  return keyBuffer;
}

export interface EncryptedPayload {
  ciphertext: string; // Hex-encoded ciphertext + auth tag
  nonce: string;      // Hex-encoded initialization vector
  keyId: string;
}

/**
 * Encrypt a plaintext token using AES-256-GCM
 */
export function encryptToken(plaintext: string, keyId = DEFAULT_KEY_ID): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext: `${encrypted}:${authTag}`,
    nonce: iv.toString('hex'),
    keyId,
  };
}

/**
 * Decrypt a token using AES-256-GCM
 */
export function decryptToken(ciphertextWithTag: string, nonceHex: string, _keyId = DEFAULT_KEY_ID): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(nonceHex, 'hex');
  const [ciphertext, authTagHex] = ciphertextWithTag.split(':');

  if (!ciphertext || !authTagHex) {
    throw new Error('Invalid encrypted payload format. Expected ciphertext:authTag');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
