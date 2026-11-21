import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FallbackUnconfiguredKycAdapter,
  LicensedKycProviderAdapter,
  computeBrandVerificationBadge,
} from '../../services/identity-service/src/domain/services/business-verification-service.ts';
import { IdentityService } from '../../services/identity-service/src/application/services/identity-application-service.ts';
import { getDatabase } from '../../services/identity-service/src/infrastructure/persistence/database.ts';

test('Business Verification Port: Fallback Unconfigured Adapter Compliance', async (t) => {
  const adapter = new FallbackUnconfiguredKycAdapter();

  await t.test('accepts valid PAN and Luhn-checksummed GSTIN and outputs honest notice', async () => {
    const res = await adapter.verify({
      companyLegalName: 'Acme Lifestyle Brands Pvt Ltd',
      brandName: 'Acme Lifestyle',
      pan: 'AAPFU0939F',
      gstin: '27AAPFU0939F1ZV', // Real valid Luhn checksum
      cin: 'U74999MH2018PTC123456',
    });

    assert.equal(res.valid, true);
    assert.equal(res.verificationStatus, 'PENDING');
    assert.equal(res.providerStatus, 'NOT_CONFIGURED');
    // Standing platform rule: Must explicitly state format valid, not verified against gov
    assert.equal(res.details, 'Format valid — not verified against a government source');
    assert.equal(res.gstinResult?.checksumValid, true);
    assert.equal(res.consistencyResult?.consistent, true);
  });

  await t.test('strictly rejects corrupted GSTIN checksum or mismatched PAN', async () => {
    // Mismatched PAN
    const resMismatch = await adapter.verify({
      companyLegalName: 'Acme Lifestyle Brands Pvt Ltd',
      pan: 'AABCB1234C', // Different PAN
      gstin: '27AAPFU0939F1ZV', // Embeds AAPFU0939F
    });

    assert.equal(resMismatch.valid, false);
    assert.equal(resMismatch.verificationStatus, 'RESTRICTED');
    assert.ok(resMismatch.details.includes('does not match'));
  });
});

test('Business Verification: Combined Verified Business Badge Logic', async (t) => {
  await t.test('awards Verified Business badge ONLY when BOTH domain and business are verified', () => {
    const verifiedBoth = computeBrandVerificationBadge({
      domainVerified: true,
      businessVerificationStatus: 'VERIFIED',
      businessVerifiedAt: '2026-11-21T10:00:00Z',
    });
    assert.equal(verifiedBoth.badge, 'VERIFIED_BUSINESS');
    assert.equal(verifiedBoth.label, 'Verified Business');
    assert.equal(verifiedBoth.badgeTone, 'success');
  });

  await t.test('awards Verification Pending when domain verified but business KYC is pending', () => {
    const domainOnly = computeBrandVerificationBadge({
      domainVerified: true,
      businessVerificationStatus: 'PENDING',
    });
    assert.equal(domainOnly.badge, 'VERIFICATION_PENDING');
    assert.equal(domainOnly.label, 'Verification Pending');
    assert.ok(domainOnly.subtext.includes('Corporate domain verified'));
  });

  await t.test('awards Verification Pending when statutory format valid but domain unverified', () => {
    const formatOnly = computeBrandVerificationBadge({
      domainVerified: false,
      businessVerificationStatus: 'PENDING',
    });
    assert.equal(formatOnly.badge, 'VERIFICATION_PENDING');
    assert.ok(formatOnly.subtext.includes('domain DNS TXT verification pending'));
  });

  await t.test('returns Account Suspended if compliance review is active', () => {
    const suspended = computeBrandVerificationBadge({
      domainVerified: true,
      businessVerificationStatus: 'SUSPENDED',
    });
    assert.equal(suspended.badge, 'SUSPENDED');
    assert.equal(suspended.badgeTone, 'destructive');
  });
});

test('Identity Service: Onboarding Persistence, DPDP Consent & Audit Trail', async (t) => {
  const service = new IdentityService();
  const db = await getDatabase();

  const brandUser = await service.registerBrand({
    fullName: 'Compliance Officer',
    workEmail: `compliance_${Date.now()}@tatacliq.com`,
    password: 'SecureEnterprisePass123!',
    companyName: 'Acme Lifestyle Brands Pvt Ltd',
    website: 'https://acmelifestyle.co.in',
    industry: 'Fashion & Apparel',
  });

  const userId = brandUser.user._id;

  await t.test('persists statutory draft and records DPDP Act 2023 consent', async () => {
    const updated = await service.updateOnboarding(
      userId,
      'BRAND',
      3,
      {
        pan: 'AAPFU0939F',
        gstin: '27AAPFU0939F1ZV',
        cin: 'U74999MH2018PTC123456',
        dpdpConsent: {
          version: '2026.1',
          timestamp: new Date().toISOString(),
          ip: '198.51.100.42',
          userAgent: 'Mozilla/5.0 Enterprise-Agent',
          purposes: ['CREATOR_DISCOVERY', 'PAYMENT_ESCROW', 'TAX_INVOICING'],
        },
      },
      false
    );

    assert.equal(updated.pan, 'AAPFU0939F');
    assert.equal(updated.gstin, '27AAPFU0939F1ZV');
    assert.equal(updated.verificationStatus, 'PENDING');
    assert.equal(updated.dpdpConsent?.version, '2026.1');
    assert.ok(updated.checklistState);
    assert.equal(updated.checklistState.profile, true);
    assert.equal(updated.checklistState.businessVerification, true);
  });

  await t.test('records immutable audit log in verification_audit_logs', async () => {
    const auditLogs = await db
      .collection('verification_audit_logs')
      .find({ actorId: userId })
      .toArray();

    assert.ok(auditLogs.length > 0);
    const latest = auditLogs[auditLogs.length - 1];
    assert.equal(latest.actorId, userId);
    assert.ok(latest.reason);
    assert.ok(latest.createdAt);
  });
});
