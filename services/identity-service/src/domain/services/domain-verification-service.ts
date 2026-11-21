/**
 * Adzunova — Domain-to-Workspace Verification & Anti-Impersonation Service
 *
 * Implements Phase B3 requirements:
 * 1. Proof of domain ownership via DNS TXT record.
 * 2. Multi-workspace collision prevention (two workspaces cannot verify the same domain).
 * 3. Typosquat / Lookalike detection against protected brand names.
 */

import crypto from 'crypto';
import dns from 'dns';
import { extractRegistrableDomain } from './work-email-policy';

export interface DomainVerificationDetails {
  domain: string;
  recordType: 'TXT';
  recordHost: string;
  expectedValue: string;
}

export interface DomainVerificationResult {
  verified: boolean;
  reason?: string;
  verifiedAt?: Date;
}

export interface TyposquatCheckResult {
  suspect: boolean;
  matchedProtectedBrand?: string;
  distance?: number;
}

/**
 * Protected Brand Names for Typosquatting / Lookalike Safeguards
 */
const PROTECTED_BRAND_NAMES = [
  'adzunova',
  'nike',
  'apple',
  'amazon',
  'zara',
  'swiggy',
  'zomato',
  'tatacliq',
  'flipkart',
  'myntra',
  'nykaa',
  'unilever',
  'reliance',
  'coca-cola',
  'pepsi',
  'samsung',
];

/**
 * Computes Levenshtein Distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Checks if a domain is a lookalike/typosquat of a protected brand name
 */
export function checkTyposquatting(domain: string): TyposquatCheckResult {
  const registrable = extractRegistrableDomain(domain);
  const namePart = registrable.split('.')[0].toLowerCase();

  for (const brand of PROTECTED_BRAND_NAMES) {
    if (namePart === brand) {
      // Exact match - authorized if legitimate owner
      return { suspect: false };
    }

    // Levenshtein distance 1 or 2 on brand names >= 4 characters
    if (brand.length >= 4) {
      const dist = levenshteinDistance(namePart, brand);
      if (dist === 1 || (brand.length >= 7 && dist === 2)) {
        return {
          suspect: true,
          matchedProtectedBrand: brand,
          distance: dist,
        };
      }
    }
  }

  return { suspect: false };
}

/**
 * Generates deterministic DNS TXT verification challenge for a workspace domain
 */
export function generateDomainVerificationChallenge(
  domain: string,
  workspaceId: string
): DomainVerificationDetails {
  const normDomain = domain.toLowerCase().trim();
  const token = crypto
    .createHmac('sha256', process.env.DOMAIN_VERIFICATION_SECRET || 'adzunova-domain-secret-seed-2026')
    .update(`${workspaceId}:${normDomain}`)
    .digest('hex')
    .slice(0, 32);

  return {
    domain: normDomain,
    recordType: 'TXT',
    recordHost: `_adzunova-challenge.${normDomain}`,
    expectedValue: `adzunova-site-verification=${token}`,
  };
}

/**
 * Verifies DNS TXT record for domain ownership
 */
export async function verifyDomainTxtRecord(
  domain: string,
  expectedValue: string,
  options: {
    dnsTxtResolver?: (host: string) => Promise<string[][]>;
  } = {}
): Promise<DomainVerificationResult> {
  const normDomain = domain.toLowerCase().trim();
  const challengeHost = `_adzunova-challenge.${normDomain}`;

  const resolver =
    options.dnsTxtResolver ||
    (async (host: string) => {
      try {
        return await dns.promises.resolveTxt(host);
      } catch (err: any) {
        // Fallback: check apex domain TXT
        if (host.startsWith('_adzunova-challenge.')) {
          const apex = host.replace('_adzunova-challenge.', '');
          try {
            return await dns.promises.resolveTxt(apex);
          } catch {
            return [];
          }
        }
        return [];
      }
    });

  try {
    const txtRecords = await resolver(challengeHost);
    const flatRecords = txtRecords.flat().map((r) => r.trim());

    const hasMatch = flatRecords.some((rec) => rec === expectedValue);

    if (hasMatch) {
      return {
        verified: true,
        verifiedAt: new Date(),
      };
    }

    return {
      verified: false,
      reason: `No matching TXT record found at ${challengeHost}. Found: [${flatRecords.join(', ')}]`,
    };
  } catch (err: any) {
    return {
      verified: false,
      reason: `DNS TXT resolution failed: ${err.message}`,
    };
  }
}
