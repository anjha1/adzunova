/**
 * Instagram Demographics Normalization & Derived Audience Metrics Engine
 */

export const STANDARD_AGE_BUCKETS = [
  '13-17',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
] as const;

export type StandardAgeBucket = typeof STANDARD_AGE_BUCKETS[number];

export interface AgeDistributionItem {
  bucket: StandardAgeBucket;
  count: number;
  percentage: number;
}

export interface GenderDistributionItem {
  gender: 'F' | 'M' | 'U';
  label: string;
  count: number;
  percentage: number;
  note?: string;
}

export interface CountryDistributionItem {
  countryCode: string;
  count: number;
  percentage: number;
}

export interface DerivedAudienceMetrics {
  totalAudienceSampled: number;
  share_18_plus: number;      // e.g. 0.88 (88%)
  share_13_17: number;        // e.g. 0.12 (12%) - Note: "Meta estimate, may lag"
  share_18_34: number;        // e.g. 0.65 (65%) - Primary commercial demo
  dominant_age_bucket: StandardAgeBucket | null;
  gender_known_share: number; // e.g. 0.17 (17%) if U is 83%
  top_country: string | null; // e.g. "IN" or "US"
  ageDistribution: AgeDistributionItem[];
  genderDistribution: GenderDistributionItem[];
  countryDistribution: CountryDistributionItem[];
  hasCountryBreakdown: boolean;
  computedAt: string;
}

/**
 * Normalizes raw Meta Graph API breakdown response for gender and age
 * Sample Meta structure:
 * {
 *   "data": [{
 *     "name": "follower_demographics",
 *     "period": "lifetime",
 *     "total_value": {
 *       "breakdowns": [{
 *         "dimension_keys": ["gender", "age"],
 *         "results": [
 *           { "dimension_values": ["F", "18-24"], "value": 150 },
 *           { "dimension_values": ["M", "18-24"], "value": 200 },
 *           { "dimension_values": ["U", "18-24"], "value": 1200 },
 *           ...
 *         ]
 *       }]
 *     }
 *   }]
 * }
 */
export function normalizeDemographics(
  genderAgeRaw: any,
  countryRaw?: any
): DerivedAudienceMetrics {
  const ageTotals: Record<string, number> = {
    '13-17': 0,
    '18-24': 0,
    '25-34': 0,
    '35-44': 0,
    '45-54': 0,
    '55-64': 0,
    '65+': 0,
  };

  const genderTotals: Record<'F' | 'M' | 'U', number> = {
    F: 0,
    M: 0,
    U: 0,
  };

  let totalSampled = 0;

  // 1. Process Gender & Age Breakdowns
  const breakdowns = genderAgeRaw?.data?.[0]?.total_value?.breakdowns || [];
  for (const b of breakdowns) {
    const dimKeys: string[] = b.dimension_keys || [];
    const genderIdx = dimKeys.indexOf('gender');
    const ageIdx = dimKeys.indexOf('age');

    if (Array.isArray(b.results)) {
      for (const r of b.results) {
        const val = Number(r.value || 0);
        totalSampled += val;

        if (genderIdx !== -1 && r.dimension_values?.[genderIdx]) {
          const g = r.dimension_values[genderIdx].toUpperCase();
          if (g === 'F' || g === 'FEMALE') genderTotals.F += val;
          else if (g === 'M' || g === 'MALE') genderTotals.M += val;
          else genderTotals.U += val;
        }

        if (ageIdx !== -1 && r.dimension_values?.[ageIdx]) {
          const rawAge = String(r.dimension_values[ageIdx]).trim();
          if (rawAge in ageTotals) {
            ageTotals[rawAge] += val;
          } else {
            // Map edge cases or combined formats
            if (rawAge.includes('13-17')) ageTotals['13-17'] += val;
            else if (rawAge.includes('18-24')) ageTotals['18-24'] += val;
            else if (rawAge.includes('25-34')) ageTotals['25-34'] += val;
            else if (rawAge.includes('35-44')) ageTotals['35-44'] += val;
            else if (rawAge.includes('45-54')) ageTotals['45-54'] += val;
            else if (rawAge.includes('55-64')) ageTotals['55-64'] += val;
            else if (rawAge.includes('65')) ageTotals['65+'] += val;
          }
        }
      }
    }
  }

  // 2. Process Country Breakdown (if available)
  const countryDistribution: CountryDistributionItem[] = [];
  const countryBreakdowns = countryRaw?.data?.[0]?.total_value?.breakdowns || [];
  let countryTotal = 0;

  for (const b of countryBreakdowns) {
    const dimKeys: string[] = b.dimension_keys || [];
    const countryIdx = dimKeys.indexOf('country');

    if (countryIdx !== -1 && Array.isArray(b.results)) {
      for (const r of b.results) {
        const cCode = String(r.dimension_values?.[countryIdx] || '').toUpperCase();
        const val = Number(r.value || 0);
        if (cCode && val > 0) {
          countryDistribution.push({ countryCode: cCode, count: val, percentage: 0 });
          countryTotal += val;
        }
      }
    }
  }

  countryDistribution.sort((a, b) => b.count - a.count);
  for (const c of countryDistribution) {
    c.percentage = countryTotal > 0 ? Number((c.count / countryTotal).toFixed(4)) : 0;
  }

  // 3. Compute Age Percentages & Dominant Bucket
  const totalAgeCount = Object.values(ageTotals).reduce((a, b) => a + b, 0);
  let dominantBucket: StandardAgeBucket | null = null;
  let maxAgeCount = -1;

  const ageDistribution: AgeDistributionItem[] = STANDARD_AGE_BUCKETS.map((b) => {
    const count = ageTotals[b] || 0;
    if (count > maxAgeCount && count > 0) {
      maxAgeCount = count;
      dominantBucket = b;
    }
    const percentage = totalAgeCount > 0 ? Number((count / totalAgeCount).toFixed(4)) : 0;
    return { bucket: b, count, percentage };
  });

  // 4. Compute Gender Percentages
  const totalGenderCount = genderTotals.F + genderTotals.M + genderTotals.U;
  const genderDistribution: GenderDistributionItem[] = [
    {
      gender: 'F',
      label: 'Female',
      count: genderTotals.F,
      percentage: totalGenderCount > 0 ? Number((genderTotals.F / totalGenderCount).toFixed(4)) : 0,
    },
    {
      gender: 'M',
      label: 'Male',
      count: genderTotals.M,
      percentage: totalGenderCount > 0 ? Number((genderTotals.M / totalGenderCount).toFixed(4)) : 0,
    },
    {
      gender: 'U',
      label: 'Unknown',
      count: genderTotals.U,
      percentage: totalGenderCount > 0 ? Number((genderTotals.U / totalGenderCount).toFixed(4)) : 0,
      note: 'Meta estimate, may lag or default for private profiles',
    },
  ];

  // 5. Calculate Derived Strategic Ratios
  const share_13_17 = totalAgeCount > 0 ? Number(((ageTotals['13-17'] || 0) / totalAgeCount).toFixed(4)) : 0;
  const share_18_plus = Number((1 - share_13_17).toFixed(4));
  const share_18_34 =
    totalAgeCount > 0
      ? Number((((ageTotals['18-24'] || 0) + (ageTotals['25-34'] || 0)) / totalAgeCount).toFixed(4))
      : 0;

  const knownGenderCount = genderTotals.F + genderTotals.M;
  const gender_known_share =
    totalGenderCount > 0 ? Number((knownGenderCount / totalGenderCount).toFixed(4)) : 0;

  const top_country = countryDistribution.length > 0 ? countryDistribution[0]!.countryCode : null;

  return {
    totalAudienceSampled: totalSampled,
    share_18_plus,
    share_13_17,
    share_18_34,
    dominant_age_bucket: dominantBucket,
    gender_known_share,
    top_country,
    ageDistribution,
    genderDistribution,
    countryDistribution: countryDistribution.slice(0, 10), // Top 10
    hasCountryBreakdown: countryDistribution.length > 0,
    computedAt: new Date().toISOString(),
  };
}
