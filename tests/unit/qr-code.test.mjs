import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQrMatrix } from '../../apps/web/src/lib/qr/qr-generator.ts';

test('QR Code Matrix Generator: ISO/IEC 18004 Compliance', async (t) => {
  await t.test('generates valid matrix for standard profile URL', () => {
    const url = 'https://adzunova-web.onrender.com/c/anjha1';
    const qr = generateQrMatrix(url, 'Q');

    assert.ok(qr.matrix.length >= 21);
    assert.equal(qr.matrix.length, qr.size);
    assert.equal(qr.matrix[0].length, qr.size);

    // Verify top-left 7x7 Finder Pattern
    const tl = qr.matrix.slice(0, 7).map((r) => r.slice(0, 7));
    // Rows 0 and 6 should be all true (black)
    assert.deepEqual(tl[0], [true, true, true, true, true, true, true]);
    assert.deepEqual(tl[6], [true, true, true, true, true, true, true]);
    // Rows 1 and 5 should be true, false, false, false, false, false, true
    assert.deepEqual(tl[1], [true, false, false, false, false, false, true]);
    assert.deepEqual(tl[5], [true, false, false, false, false, false, true]);
    // Rows 2, 3, 4 should have inner 3x3 solid core
    assert.deepEqual(tl[2], [true, false, true, true, true, false, true]);
    assert.deepEqual(tl[3], [true, false, true, true, true, false, true]);
    assert.deepEqual(tl[4], [true, false, true, true, true, false, true]);
  });

  await t.test('generates top-right and bottom-left finder patterns', () => {
    const url = 'https://adzunova.com/c/creator';
    const qr = generateQrMatrix(url, 'M');
    const size = qr.size;

    // Top-right finder pattern
    assert.equal(qr.matrix[0][size - 7], true);
    assert.equal(qr.matrix[0][size - 1], true);
    assert.equal(qr.matrix[6][size - 7], true);
    assert.equal(qr.matrix[6][size - 1], true);

    // Bottom-left finder pattern
    assert.equal(qr.matrix[size - 7][0], true);
    assert.equal(qr.matrix[size - 1][0], true);
    assert.equal(qr.matrix[size - 7][6], true);
    assert.equal(qr.matrix[size - 1][6], true);
  });

  await t.test('handles longer vanity URLs within version capacity', () => {
    const longUrl = 'https://adzunova-web.onrender.com/c/very-long-creator-vanity-name-profile-2026';
    const qr = generateQrMatrix(longUrl, 'Q');
    assert.ok(qr.version >= 4);
    assert.ok(qr.size >= 33);
  });
});
