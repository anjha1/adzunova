import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOOKING_STATUSES,
  BOOKING_TRANSITIONS,
  isValidBookingTransition,
  assertValidBookingTransition,
  maskContactInfo,
} from '../../packages/payments-db/src/bookings.ts';

test('Booking State Machine: allows valid transitions and rejects illegal ones with 409', () => {
  assert.equal(BOOKING_STATUSES.includes('REQUESTED'), true);
  assert.equal(isValidBookingTransition('REQUESTED', 'ACCEPTED'), true);
  assert.equal(isValidBookingTransition('REQUESTED', 'COUNTERED'), true);
  assert.equal(isValidBookingTransition('REQUESTED', 'REJECTED'), true);
  assert.equal(isValidBookingTransition('REQUESTED', 'EXPIRED'), true);
  assert.equal(isValidBookingTransition('COUNTERED', 'ACCEPTED'), true);

  // Terminal states cannot transition
  for (const terminal of ['REJECTED', 'EXPIRED', 'CANCELLED']) {
    assert.deepEqual(BOOKING_TRANSITIONS[terminal], []);
    assert.throws(
      () => assertValidBookingTransition(terminal, 'ACCEPTED'),
      (err) =>
        err?.name === 'AppProblemError' &&
        err?.status === 409 &&
        err?.code === 'ILLEGAL_BOOKING_TRANSITION'
    );
  }

  // Cannot jump from REQUESTED to AGREEMENT_PENDING
  assert.throws(
    () => assertValidBookingTransition('REQUESTED', 'AGREEMENT_PENDING'),
    (err) => err?.status === 409 && err?.code === 'ILLEGAL_BOOKING_TRANSITION'
  );
});

test('Contact Masking: redacts emails, phone numbers, @handles, and WhatsApp/Telegram links', () => {
  const dirty =
    'Reach out at brand@example.com or +91 9876543210 or @brand_handle or https://wa.me/919876543210';
  const res = maskContactInfo(dirty);
  assert.equal(res.maskedCount, 4);
  assert.equal(res.sanitized.includes('brand@example.com'), false);
  assert.equal(res.sanitized.includes('9876543210'), false);
  assert.equal(res.sanitized.includes('@brand_handle'), false);
  assert.equal(res.sanitized.includes('wa.me'), false);
  assert.equal(res.sanitized.includes('[EMAIL_MASKED]'), true);
  assert.equal(res.sanitized.includes('[PHONE_MASKED]'), true);
  assert.equal(res.sanitized.includes('[HANDLE_MASKED]'), true);
  assert.equal(res.sanitized.includes('[CONTACT_LINK_MASKED]'), true);
});
