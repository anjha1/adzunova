import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePan,
  validateGstin,
  validateCin,
  calculateGstinChecksum,
  checkStatutoryConsistency,
  INDIAN_GST_STATE_CODES,
} from '../../services/identity-service/src/domain/services/statutory-rules.ts';

test('Indian Statutory Rules: PAN Validation Engine', async (t) => {
  await t.test('accepts valid corporate PANs and identifies entity type', () => {
    // Company PAN (4th char is C)
    const companyPan = validatePan('AABCB1234C');
    assert.equal(companyPan.valid, true);
    assert.equal(companyPan.entityCode, 'C');
    assert.equal(companyPan.entityType, 'Company');

    // Firm / LLP PAN (4th char is F)
    const firmPan = validatePan('AABFB5678F');
    assert.equal(firmPan.valid, true);
    assert.equal(firmPan.entityCode, 'F');
    assert.equal(firmPan.entityType, 'Firm / LLP');

    // Individual / Proprietor PAN (4th char is P)
    const indPan = validatePan('AABPB1234P');
    assert.equal(indPan.valid, true);
    assert.equal(indPan.entityCode, 'P');
    assert.equal(indPan.entityType, 'Individual / Proprietorship');
  });

  await t.test('strictly rejects invalid PAN formats', () => {
    const invalidPans = [
      '',
      'ABC12345',      // Too short
      'ABCDE12345',    // Digits where letter expected
      '12345ABCDE',    // Inverted pattern
      'ABCDEF1234F',   // Too long (11 chars)
      'abcde1234f!',   // Special chars
    ];

    invalidPans.forEach((pan) => {
      const res = validatePan(pan);
      assert.equal(res.valid, false, `Expected ${pan} to be invalid`);
      assert.ok(res.error);
    });
  });
});

test('Indian Statutory Rules: GSTIN Luhn Modulo 36 Validation', async (t) => {
  await t.test('computes exact Luhn Modulo 36 checksum character', () => {
    // 27AAPFU0939F1Z -> V
    const check1 = calculateGstinChecksum('27AAPFU0939F1Z');
    assert.equal(check1, 'V');

    // 07AAACG0503B1Z -> K
    const check2 = calculateGstinChecksum('07AAACG0503B1Z');
    assert.equal(check2, 'K');

    // 29AABCU9603R1Z -> J
    const check3 = calculateGstinChecksum('29AABCU9603R1Z');
    assert.equal(check3, 'J');
  });

  await t.test('accepts valid GSTINs and extracts state & PAN', () => {
    const validGstins = [
      { gstin: '27AAPFU0939F1ZV', stateCode: '27', stateName: 'Maharashtra', pan: 'AAPFU0939F' },
      { gstin: '07AAACG0503B1ZK', stateCode: '07', stateName: 'Delhi', pan: 'AAACG0503B' },
      { gstin: '29AABCU9603R1ZJ', stateCode: '29', stateName: 'Karnataka', pan: 'AABCU9603R' },
    ];

    validGstins.forEach(({ gstin, stateCode, stateName, pan }) => {
      const res = validateGstin(gstin);
      assert.equal(res.valid, true, `Expected ${gstin} to be valid`);
      assert.equal(res.stateCode, stateCode);
      assert.equal(res.stateName, stateName);
      assert.equal(res.extractedPan, pan);
      assert.equal(res.checksumValid, true);
    });
  });

  await t.test('strictly rejects corrupted or tampered GSTIN checksums', () => {
    // Correct is 27AAPFU0939F1ZV, corrupted with 'A'
    const corrupted = validateGstin('27AAPFU0939F1ZA');
    assert.equal(corrupted.valid, false);
    assert.equal(corrupted.checksumValid, false);
    assert.ok(corrupted.error?.includes('checksum mismatch'));
  });

  await t.test('rejects invalid state codes', () => {
    // State code 00 or 95 does not exist in GSTN mapping
    const invalidState = validateGstin('95AAPFU0939F1ZV');
    assert.equal(invalidState.valid, false);
    assert.ok(invalidState.error?.includes('Invalid state code'));
  });
});

test('Indian Statutory Rules: CIN (Corporate Identification Number) Validation', async (t) => {
  await t.test('accepts valid 21-digit CIN and extracts corporate details', () => {
    const res = validateCin('U74999MH2018PTC123456');
    assert.equal(res.valid, true);
    assert.equal(res.listingStatus, 'UNLISTED');
    assert.equal(res.stateCode, 'MH');
    assert.equal(res.incorporationYear, 2018);
    assert.equal(res.companyClassification, 'PTC');
    assert.equal(res.registrationNumber, '123456');

    // Listed company
    const listed = validateCin('L17110MH1973PLC019786');
    assert.equal(listed.valid, true);
    assert.equal(listed.listingStatus, 'LISTED');
    assert.equal(listed.incorporationYear, 1973);
  });

  await t.test('rejects malformed CIN formats', () => {
    const invalidCins = [
      '',
      'U74999MH2018PTC12345',  // Too short (20 chars)
      'X74999MH2018PTC123456',  // First char neither L nor U
      'U74999MH1820PTC123456',  // Improbable incorporation year 1820
    ];

    invalidCins.forEach((cin) => {
      const res = validateCin(cin);
      assert.equal(res.valid, false);
      assert.ok(res.error);
    });
  });
});

test('Indian Statutory Rules: Cross-Identifier Consistency', async (t) => {
  await t.test('confirms match when GSTIN embedded PAN matches separate PAN', () => {
    const res = checkStatutoryConsistency({
      pan: 'AAPFU0939F',
      gstin: '27AAPFU0939F1ZV',
    });
    assert.equal(res.consistent, true);
  });

  await t.test('detects mismatch when GSTIN embeds a different PAN', () => {
    const res = checkStatutoryConsistency({
      pan: 'AABCB1234C', // Different PAN
      gstin: '27AAPFU0939F1ZV', // Embeds AAPFU0939F
    });
    assert.equal(res.consistent, false);
    assert.ok(res.error?.includes('does not match'));
  });
});
