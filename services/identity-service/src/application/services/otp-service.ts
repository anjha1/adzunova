import crypto from 'crypto';
import { prisma } from '../../infrastructure/persistence/prisma-client';
import { emailService } from '../../infrastructure/email/email-service';
import { hashToken } from '../../infrastructure/security/crypto';

export class OtpService {
  /**
   * Generate and issue a 6-digit numeric OTP
   */
  async generateAndSendOtp(
    userId: string,
    targetEmail: string,
    purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH' | 'LOGIN_CONFIRMATION' = 'EMAIL_VERIFICATION'
  ): Promise<{ success: boolean; message: string }> {
    const normalizedEmail = targetEmail.trim().toLowerCase();

    // Check rate limit: max 5 requests per 10 minutes
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const recentOtpsCount = await prisma.otp.count({
        where: {
          userId,
          purpose,
          createdAt: { gte: tenMinutesAgo },
        },
      });

      if (recentOtpsCount >= 5) {
        throw new Error('Too many verification requests. Please wait a few minutes before trying again.');
      }
    } catch (countErr: any) {
      if (countErr.message?.includes('Too many verification requests')) {
        throw countErr;
      }
      console.warn('[OtpService] Prisma count bypassed:', countErr.message);
    }

    // Generate secure 6-digit code
    const randomInt = crypto.randomInt(100000, 999999);
    const codeStr = randomInt.toString();
    const codeHash = hashToken(codeStr);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save to database
    try {
      await prisma.otp.create({
        data: {
          userId,
          targetEmail: normalizedEmail,
          codeHash,
          purpose,
          expiresAt,
          attempts: 0,
        },
      });
    } catch (prismaErr: any) {
      console.warn('[OtpService] Prisma save fallback:', prismaErr.message);
    }

    // Send email via Brevo SMTP
    await emailService.sendOtpEmail(normalizedEmail, codeStr, purpose);

    // Surface prominently in server console ONLY in development
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

    const codeHash = hashToken(cleanCode);
    const now = new Date();

    // Find the latest valid OTP for this user and purpose
    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId,
        purpose,
        usedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new Error('Verification code has expired or was not requested. Please request a new code.');
    }

    if (otpRecord.attempts >= 5) {
      throw new Error('Too many failed attempts. This code is invalidated. Please request a new code.');
    }

    if (otpRecord.codeHash !== codeHash) {
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new Error('Incorrect verification code. Please check your inbox and try again.');
    }

    // Mark as used
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { usedAt: now },
    });

    // If it's email verification, update the User
    if (purpose === 'EMAIL_VERIFICATION') {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
    }

    return true;
  }
}

export const otpService = new OtpService();
