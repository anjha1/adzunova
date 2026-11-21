import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeCompanyName,
  compareCompanyNames,
} from '../../services/identity-service/src/domain/services/name-matcher.ts';

test('Company Name Matcher: Normalization & Suffix Stripping', () => {
  assert.equal(
    normalizeCompanyName('Acme Consumer Goods Private Limited'),
    'acme consumer goods'
  );
  assert.equal(
    normalizeCompanyName('Tata CLiQ Technologies Pvt. Ltd.'),
    'tata cliq'
  );
  assert.equal(
    normalizeCompanyName('Reliance Retail Limited (India)'),
    'reliance retail'
  );
  assert.equal(
    normalizeCompanyName('Zomato Media Pvt Ltd'),
    'zomato media'
  );
  assert.equal(
    normalizeCompanyName('Swiggy Bundle Technologies LLP'),
    'swiggy bundle'
  );
});

test('Company Name Matcher: Fuzzy Matching & Compliance Thresholds', async (t) => {
  await t.test('detects EXACT match when legal suffixes differ but base names match', () => {
    const res = compareCompanyNames(
      'Acme Consumer Goods Private Limited',
      'Acme Consumer Goods Pvt Ltd'
    );
    assert.equal(res.outcome, 'EXACT');
    assert.equal(res.score, 1.0);
  });

  await t.test('approves MATCH when similarity >= 0.85', () => {
    // E.g. minor singular/plural or typo
    const res = compareCompanyNames(
      'Acme Consumer Goods',
      'Acme Consumer Good'
    );
    assert.ok(res.score >= 0.85);
    assert.equal(res.outcome, 'MATCH');
  });

  await t.test('flags for MANUAL_REVIEW_REQUIRED when similarity is between 0.60 and 0.85', () => {
    // E.g. Entered brand name "Swiggy Marketplace" vs registered legal "Swiggy"
    const res = compareCompanyNames(
      'Swiggy Marketplace Private Limited',
      'Swiggy Limited'
    );
    assert.ok(res.score >= 0.60 && res.score < 0.85);
    assert.equal(res.outcome, 'MANUAL_REVIEW_REQUIRED');

    // E.g. "Acme Lifestyle" vs "Acme Lifestyle Brands"
    const res2 = compareCompanyNames(
      'Acme Lifestyle',
      'Acme Lifestyle Brands'
    );
    assert.ok(res2.score >= 0.60 && res2.score < 0.85);
    assert.equal(res2.outcome, 'MANUAL_REVIEW_REQUIRED');
  });

  await t.test('detects MISMATCH when entered name completely deviates (< 0.60)', () => {
    const res = compareCompanyNames(
      'Zara Retail Store',
      'Acme Global Software Solutions Pvt Ltd'
    );
    assert.ok(res.score < 0.60);
    assert.equal(res.outcome, 'MISMATCH');
  });
});
