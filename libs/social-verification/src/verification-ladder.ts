/**
 * Social Account Verification & Ladder System
 * Ladder levels: EMAIL -> PHONE -> IDENTITY -> SOCIAL -> AUDIENCE -> PAYMENT -> BUSINESS
 */

export type VerificationTier =
  | 'EMAIL'
  | 'PHONE'
  | 'IDENTITY'
  | 'SOCIAL'
  | 'AUDIENCE'
  | 'PAYMENT'
  | 'BUSINESS';

export interface VerificationLadderState {
  currentTier: VerificationTier;
  completedTiers: VerificationTier[];
  audienceQualityScore: number; // 0 - 100
  factors: {
    growthConsistency: number; // 0-25
    engagementRatio: number; // 0-25
    geoConsistency: number; // 0-25
    botProbabilityInverse: number; // 0-25 (25 = 0% bots)
  };
}

export class VerificationLadderEngine {
  public static readonly TIER_ORDER: VerificationTier[] = [
    'EMAIL',
    'PHONE',
    'IDENTITY',
    'SOCIAL',
    'AUDIENCE',
    'PAYMENT',
    'BUSINESS',
  ];

  /**
   * Determine whether a creator can advance to next tier
   */
  public static canAdvanceTo(currentCompleted: VerificationTier[], targetTier: VerificationTier): boolean {
    const targetIdx = this.TIER_ORDER.indexOf(targetTier);
    if (targetIdx === 0) return true; // Email is first

    // All preceding tiers must be completed
    for (let i = 0; i < targetIdx; i++) {
      if (!currentCompleted.includes(this.TIER_ORDER[i])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculate explainable Audience Quality Score (0–100)
   */
  public static calculateAudienceQualityScore(factors: {
    growthConsistency: number;
    engagementRatio: number;
    geoConsistency: number;
    botProbabilityInverse: number;
  }): number {
    const raw =
      factors.growthConsistency +
      factors.engagementRatio +
      factors.geoConsistency +
      factors.botProbabilityInverse;
    return Math.min(100, Math.max(0, Math.round(raw)));
  }
}
