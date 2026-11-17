/**
 * Request/correlation ID utilities for structured logging.
 * Generates a compact, URL-safe ID per request.
 */
import { randomBytes } from 'crypto';

/**
 * Generate a new 12-byte (24 hex char) request ID.
 * Short enough to include in every log line.
 */
export function generateRequestId(): string {
  return randomBytes(12).toString('hex');
}
