import crypto from 'crypto';
import { prisma } from '../../infrastructure/persistence/prisma-client';
import { emailService } from '../../infrastructure/email/email-service';
import { hashToken } from '../../infrastructure/security/crypto';

interface IEphemeralOtp {
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  userId: string;
  targetEmail: string;
  purpose: string;
  createdAt: Date;
}

export class OtpService {
  // Resilient in-memory store for fallback when database is operating in memory / disconnected
  private ephemeralOtps = new Map<string, IEphemeralOtp>();

  private toValidObjectId(id: string): string {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return id;
    }
    return crypto.createHash('md5').update(id).digest('hex').slice(0, 24);
  }

  /**
   * Generate and issue a 6-digit numeric OTP
   */
  async generateAndSendOtp(
    userId: string,
    targetEmail: string,
    purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH' | 'LOGIN_CONFIRMATION' = 'EMAIL_VERIFICATION'
  ): Promise<{ success: boolean; message: string }> {
    const normalizedEmail = targetEmail.trim().toLowerCase();
    const cleanUserId = this.toValidObjectId(userId);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
    const cooldownSeconds = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10);
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);

    // 1. Rate limiting check (cooldown & max requests)
    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const existingEphemeral = this.ephemeralOtps.get(`${normalizedEmail}_${purpose}`);
    if (existingEphemeral && existingEphemeral.createdAt >= cooldownAgo) {
      throw new Error(`Please wait ${cooldownSeconds} seconds before requesting a new code.`);
    }

    try {
      const recentOtp = await prisma.otp.findFirst({
        where: {
          userId: cleanUserId,
          purpose,
          createdAt: { gte: cooldownAgo },
        },
      });

      if (recentOtp) {
        throw new Error('USER_COOLDOWN_ACTIVE');
      }

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentOtpsCount = await prisma.otp.count({
        where: {
          userId: cleanUserId,
          purpose,
          createdAt: { gte: tenMinutesAgo },
        },
      });

      if (recentOtpsCount >= maxAttempts) {
        throw new Error('USER_RATE_LIMIT_EXCEEDED');
      }
    } catch (countErr: any) {
      if (countErr.message === 'USER_COOLDOWN_ACTIVE') {
        throw new Error(`Please wait ${cooldownSeconds} seconds before requesting a new code.`);
      }
      if (countErr.message === 'USER_RATE_LIMIT_EXCEEDED') {
        throw new Error('Too many verification requests. Please wait a few minutes before trying again.');
      }
      // Ignore Prisma/database connection errors in development
    }

    // 2. Generate secure 6-digit code
    const randomInt = crypto.randomInt(100000, 999999);
    const codeStr = randomInt.toString();
    const codeHash = hashToken(codeStr);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const now = new Date();

    // 3. Store in ephemeral in-memory fallback cache
    const otpRecord: IEphemeralOtp = {
      codeHash,
      expiresAt,
      attempts: 0,
      userId: cleanUserId,
      targetEmail: normalizedEmail,
      purpose,
      createdAt: now,
    };
    this.ephemeralOtps.set(`${normalizedEmail}_${purpose}`, otpRecord);
    this.ephemeralOtps.set(`${cleanUserId}_${purpose}`, otpRecord);

    // 4. Try saving to Prisma DB (silently fail if running in-memory dev mode without user relation)
    try {
      await prisma.otp.create({
        data: {
          userId: cleanUserId,
          targetEmail: normalizedEmail,
          codeHash,
          purpose,
          expiresAt,
          attempts: 0,
        },
      });
    } catch {
      // Prisma fallback bypassed
    }

    // 5. Send email via Brevo API / SMTP
    await emailService.sendOtpEmail(normalizedEmail, codeStr, purpose);

    // 6. Surface prominently in server console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n==================================================`);
      console.log(`🔑 ADZUNOVA VERIFICATION OTP FOR [${normalizedEmail}]: ${codeStr}`);
      console.log(`==================================================\n`);
    }

    return {
      success: true,
      message: 'Verification code sent successfully.',
    };
  }

  /**
   * Verify an entered 6-digit OTP
   */
  async verifyOtp(
    userId: string,
    code: string,
    purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH' | 'LOGIN_CONFIRMATION' = 'EMAIL_VERIFICATION'
  ): Promise<boolean> {
    const cleanCode = code.trim();
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      throw new Error('Invalid code format. Please provide a 6-digit numeric code.');
    }

    const cleanUserId = this.toValidObjectId(userId);
    const codeHash = hashToken(cleanCode);
    const now = new Date();
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);

    // Try finding in Prisma DB
    let otpRecord: { id?: string; codeHash: string; attempts: number; expiresAt: Date } | null = null;

    try {
      otpRecord = await prisma.otp.findFirst({
        where: {
          userId: cleanUserId,
          purpose,
          usedAt: null,
          expiresAt: { gt: now },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Database unavailable, fallback to ephemeral
    }

    // Fallback to ephemeral in-memory store
    if (!otpRecord) {
      const ephemeral = this.ephemeralOtps.get(`${cleanUserId}_${purpose}`);
      if (ephemeral && ephemeral.expiresAt > now) {
        otpRecord = ephemeral;
      }
    }

    if (!otpRecord) {
      throw new Error('Verification code has expired or was not requested. Please request a new code.');
    }

    if (otpRecord.attempts >= maxAttempts) {
      throw new Error('Too many failed attempts. This code is invalidated. Please request a new code.');
    }

    if (otpRecord.codeHash !== codeHash) {
      otpRecord.attempts += 1;
      if (otpRecord.id) {
        try {
          await prisma.otp.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
          });
        } catch {}
      }
      throw new Error('Incorrect verification code. Please check your inbox and try again.');
    }

    // Mark as used
    if (otpRecord.id) {
      try {
        await prisma.otp.update({
          where: { id: otpRecord.id },
          data: { usedAt: now },
        });
      } catch {}
    }
    this.ephemeralOtps.delete(`${cleanUserId}_${purpose}`);

    // If it's email verification, update the User
    if (purpose === 'EMAIL_VERIFICATION') {
      try {
        await prisma.user.update({
          where: { id: cleanUserId },
          data: { emailVerified: true },
        });
      } catch {}
    }

    return true;
  }
}

export const otpService = new OtpService();
