/**
 * Enterprise Name Matching & Fuzzy Verification Engine
 * Compares official registered legal name (e.g. from GSTIN / MCA) against
 * the user-entered company legal name.
 */

const CORPORATE_SUFFIXES = [
  'private limited',
  'pvt ltd',
  'pvt. ltd.',
  'pvt. limited',
  'limited liability partnership',
  'limited',
  'ltd',
  'ltd.',
  'llp',
  'inc',
  'corp',
  'corporation',
  'company',
  'co',
  'co.',
  'enterprises',
  'enterprise',
  'technologies',
  'technology',
  'tech',
  'services',
  'solutions',
  'holdings',
  'india',
  'global',
];

export interface NameMatchResult {
  score: number; // 0.0 to 1.0
  outcome: 'EXACT' | 'MATCH' | 'MANUAL_REVIEW_REQUIRED' | 'MISMATCH';
  normalizedEntered: string;
  normalizedRegistered: string;
  matchedTokens: string[];
  unmatchedTokens: string[];
  reason: string;
}

/**
 * Strips punctuation, whitespace, and corporate entity suffixes
 */
export function normalizeCompanyName(rawName: string | null | undefined): string {
  if (!rawName) return '';

  let normalized = rawName
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip corporate suffixes
  for (const suffix of CORPORATE_SUFFIXES) {
    const regex = new RegExp(`\\b${suffix.replace('.', '\\.')}\\b`, 'gi');
    normalized = normalized.replace(regex, ' ').replace(/\s+/g, ' ').trim();
  }

  return normalized;
}

/**
 * Standard Levenshtein edit distance computation
 */
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Computes combined token overlap, containment, and string similarity
 */
export function compareCompanyNames(
  enteredName: string,
  registeredName: string
): NameMatchResult {
  const normEntered = normalizeCompanyName(enteredName);
  const normRegistered = normalizeCompanyName(registeredName);

  // Exact match after normalization
  if (normEntered.length > 0 && normEntered === normRegistered) {
    return {
      score: 1.0,
      outcome: 'EXACT',
      normalizedEntered: normEntered,
      normalizedRegistered: normRegistered,
      matchedTokens: normEntered.split(' '),
      unmatchedTokens: [],
      reason: 'Normalized corporate legal names match exactly.',
    };
  }

  const enteredTokens = new Set(normEntered.split(' ').filter(Boolean));
  const registeredTokens = new Set(normRegistered.split(' ').filter(Boolean));

  const matchedTokens: string[] = [];
  const unmatchedTokens: string[] = [];
  const registeredTokenList = Array.from(registeredTokens);
  let fuzzyMatchCount = 0;

  enteredTokens.forEach((t) => {
    if (registeredTokens.has(t)) {
      matchedTokens.push(t);
      fuzzyMatchCount += 1.0;
    } else {
      // Check if there is a near match (e.g. singular/plural or single letter typo)
      const nearMatch = registeredTokenList.find((rt) => {
        const d = levenshteinDistance(t, rt);
        return d === 1 && Math.max(t.length, rt.length) >= 4;
      });
      if (nearMatch) {
        matchedTokens.push(t);
        fuzzyMatchCount += 0.9;
      } else {
        unmatchedTokens.push(t);
      }
    }
  });

  // Token metrics: Jaccard & Containment Overlap
  const unionSize = enteredTokens.size + registeredTokens.size - fuzzyMatchCount;
  const jaccardScore = unionSize > 0 ? fuzzyMatchCount / unionSize : 0;
  const minTokens = Math.min(enteredTokens.size, registeredTokens.size);
  const overlapScore = minTokens > 0 ? fuzzyMatchCount / minTokens : 0;

  // Edit distance similarity
  const maxLen = Math.max(normEntered.length, normRegistered.length);
  const distance = levenshteinDistance(normEntered, normRegistered);
  const editScore = maxLen > 0 ? Math.max(0, 1 - distance / maxLen) : 0;

  // Weighted score (35% Jaccard + 35% Overlap containment + 30% Edit Distance)
  let rawScore = 0.35 * jaccardScore + 0.35 * overlapScore + 0.30 * editScore;
  if (editScore >= 0.90) {
    rawScore = Math.max(rawScore, editScore * 0.95);
  }
  const score = Math.round(rawScore * 100) / 100;

  let outcome: NameMatchResult['outcome'];
  let reason: string;

  if (score >= 0.85) {
    outcome = 'MATCH';
    reason = `High corporate name similarity (${Math.round(score * 100)}%). Matches official registration.`;
  } else if (score >= 0.60) {
    outcome = 'MANUAL_REVIEW_REQUIRED';
    reason = `Moderate similarity (${Math.round(score * 100)}%). Flagged for manual compliance officer review.`;
  } else {
    outcome = 'MISMATCH';
    reason = `Name mismatch (${Math.round(score * 100)}%). Entered name deviates substantially from registered entity.`;
  }

  return {
    score,
    outcome,
    normalizedEntered: normEntered,
    normalizedRegistered: normRegistered,
    matchedTokens,
    unmatchedTokens,
    reason,
  };
}
