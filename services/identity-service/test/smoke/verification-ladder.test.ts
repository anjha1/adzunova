import { describe, it, expect } from 'vitest';
import {
  VerificationLadderEngine,
  VerificationTier,
} from '../../../../libs/social-verification/src/verification-ladder';

describe('Verification Ladder & Tier Progression State Engine', () => {
  it('allows advancing to EMAIL tier initially', () => {
    expect(VerificationLadderEngine.canAdvanceTo([], 'EMAIL')).toBe(true);
  });

  it('blocks advancing to SOCIAL or AUDIENCE without preceding tiers', () => {
    // Only EMAIL completed -> cannot jump to AUDIENCE or SOCIAL
    const completed: VerificationTier[] = ['EMAIL'];
    expect(VerificationLadderEngine.canAdvanceTo(completed, 'PHONE')).toBe(true);
    expect(VerificationLadderEngine.canAdvanceTo(completed, 'IDENTITY')).toBe(false);
    expect(VerificationLadderEngine.canAdvanceTo(completed, 'SOCIAL')).toBe(false);
    expect(VerificationLadderEngine.canAdvanceTo(completed, 'AUDIENCE')).toBe(false);
  });

  it('allows advancing sequentially through the full ladder', () => {
    const completed: VerificationTier[] = [
      'EMAIL',
      'PHONE',
      'IDENTITY',
      'SOCIAL',
    ];
    expect(VerificationLadderEngine.canAdvanceTo(completed, 'AUDIENCE')).toBe(true);
  });

  it('calculates explainable Audience Quality Score accurately', () => {
    const score = VerificationLadderEngine.calculateAudienceQualityScore({
      growthConsistency: 24,
      engagementRatio: 23,
      geoConsistency: 24,
      botProbabilityInverse: 23,
    });

    expect(score).toBe(94);
  });
});
