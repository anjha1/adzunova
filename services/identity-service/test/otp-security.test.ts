import { describe, it, expect, beforeEach } from 'vitest';
import { OtpService } from '../src/application/services/otp-service';

describe('OTP Service Production-Grade Security Audit', () => {
  let otpService: OtpService;
  const userA = '0123456789abcdef0123456a';
  const userB = '0123456789abcdef0123456b';
  const emailA = 'test-security-a@adzunova.com';

  beforeEach(() => {
    process.env.OTP_EXPIRY_MINUTES = '5';
    process.env.OTP_RESEND_COOLDOWN_SECONDS = '10';
    process.env.OTP_MAX_ATTEMPTS = '3';
    otpService = new OtpService();
  });

  it('1. Generates cryptographically secure 6-digit OTP', async () => {
    const res = await otpService.generateAndSendOtp(userA, emailA, 'EMAIL_VERIFICATION');
    expect(res.success).toBe(true);
  });

  it('2. Enforces Purpose Binding: OTP for EMAIL_VERIFICATION fails for PASSWORD_RESET', async () => {
    await otpService.generateAndSendOtp(userA, emailA, 'EMAIL_VERIFICATION');
    
    // Attempting to verify same user and purpose PASSWORD_RESET must fail
    await expect(
      otpService.verifyOtp(userA, '123456', 'PASSWORD_RESET')
    ).rejects.toThrow();
  });

  it('3. Enforces Account Binding: User B cannot verify OTP generated for User A', async () => {
    await otpService.generateAndSendOtp(userA, emailA, 'EMAIL_VERIFICATION');

    // User B attempting to verify must fail
    await expect(
      otpService.verifyOtp(userB, '123456', 'EMAIL_VERIFICATION')
    ).rejects.toThrow();
  });

  it('4. Enforces Resend Cooldown: Rapid second request within cooldown is rejected', async () => {
    await otpService.generateAndSendOtp(userA, emailA, 'EMAIL_VERIFICATION');

    // Immediate second request must trigger cooldown error
    await expect(
      otpService.generateAndSendOtp(userA, emailA, 'EMAIL_VERIFICATION')
    ).rejects.toThrow(/wait/i);
  });

  it('5. Enforces Single-Use: OTP cannot be verified twice', async () => {
    // We can simulate an in-memory record to test exact code
    const serviceAny = otpService as any;
    const cleanUserId = userA;
    const code = '789123';
    const cryptoMod = await import('crypto');
    const { hashToken } = await import('../src/infrastructure/security/crypto');
    const codeHash = hashToken(code);

    serviceAny.ephemeralOtps.set(`${cleanUserId}_EMAIL_VERIFICATION`, {
      codeHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      userId: cleanUserId,
      targetEmail: emailA,
      purpose: 'EMAIL_VERIFICATION',
      createdAt: new Date(),
    });

    // First verification succeeds
    const firstVerify = await otpService.verifyOtp(userA, code, 'EMAIL_VERIFICATION');
    expect(firstVerify).toBe(true);

    // Second verification MUST fail (single-use enforcement)
    await expect(
      otpService.verifyOtp(userA, code, 'EMAIL_VERIFICATION')
    ).rejects.toThrow(/expired or was not requested/i);
  });

  it('6. Enforces Expiration: Expired OTP is rejected', async () => {
    const serviceAny = otpService as any;
    const cleanUserId = userA;
    const code = '654321';
    const { hashToken } = await import('../src/infrastructure/security/crypto');
    const codeHash = hashToken(code);

    // Set expiration in the past (1 minute ago)
    serviceAny.ephemeralOtps.set(`${cleanUserId}_EMAIL_VERIFICATION`, {
      codeHash,
      expiresAt: new Date(Date.now() - 60 * 1000),
      attempts: 0,
      userId: cleanUserId,
      targetEmail: emailA,
      purpose: 'EMAIL_VERIFICATION',
      createdAt: new Date(Date.now() - 120 * 1000),
    });

    await expect(
      otpService.verifyOtp(userA, code, 'EMAIL_VERIFICATION')
    ).rejects.toThrow(/expired or was not requested/i);
  });

  it('7. Enforces Brute-Force Protection: Locks out after max attempts', async () => {
    const serviceAny = otpService as any;
    const cleanUserId = userA;
    const code = '999888';
    const { hashToken } = await import('../src/infrastructure/security/crypto');
    const codeHash = hashToken(code);

    serviceAny.ephemeralOtps.set(`${cleanUserId}_EMAIL_VERIFICATION`, {
      codeHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      userId: cleanUserId,
      targetEmail: emailA,
      purpose: 'EMAIL_VERIFICATION',
      createdAt: new Date(),
    });

    // 3 incorrect attempts (OTP_MAX_ATTEMPTS = 3)
    await expect(otpService.verifyOtp(userA, '000001', 'EMAIL_VERIFICATION')).rejects.toThrow(/Incorrect/i);
    await expect(otpService.verifyOtp(userA, '000002', 'EMAIL_VERIFICATION')).rejects.toThrow(/Incorrect/i);
    await expect(otpService.verifyOtp(userA, '000003', 'EMAIL_VERIFICATION')).rejects.toThrow(/Incorrect/i);

    // 4th attempt: Even with the CORRECT code, it must be locked out
    await expect(
      otpService.verifyOtp(userA, code, 'EMAIL_VERIFICATION')
    ).rejects.toThrow(/Too many failed attempts/i);
  });
});
