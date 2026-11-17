import nodemailer, { Transporter } from 'nodemailer';

export interface ISmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private fromAddress: string;

  constructor() {
    const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';
    this.fromAddress = process.env.OTP_FROM || 'Adzunova Security <otp@fluenzyai.app>';

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
    } else {
      console.warn('[EmailService] SMTP credentials not fully configured. Operating in mock email mode.');
    }
  }

  async sendOtpEmail(toEmail: string, otpCode: string, purpose: string): Promise<boolean> {
    const subject = purpose === 'PASSWORD_RESET' 
      ? 'Adzunova Security: Your Password Reset Code' 
      : 'Adzunova Verification Code';

    const actionText = purpose === 'PASSWORD_RESET'
      ? 'reset your account password'
      : 'complete your email verification';

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 28px;">
          <h1 style="color: #4f46e5; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">ADZUNOVA</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Creator-Commerce Infrastructure</p>
        </div>
        <div style="background: #f8fafc; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #334155; font-size: 15px; margin-top: 0; margin-bottom: 16px;">
            Use the following 6-digit one-time code to ${actionText}:
          </p>
          <div style="display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #1e1b4b; background: #ffffff; padding: 12px 24px; border-radius: 8px; border: 2px dashed #6366f1;">
            ${otpCode}
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 16px; margin-bottom: 0;">
            This code will expire in <strong>10 minutes</strong>. Never share this code with anyone.
          </p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center; margin: 0;">
          If you did not request this security verification, please disregard this email or report to security@adzunova.com.
        </p>
      </div>
    `;

    if (!this.transporter) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[MOCK EMAIL] To: ${toEmail} | OTP: ${otpCode} | Purpose: ${purpose}`);
      }
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: toEmail,
        subject,
        html: htmlBody,
      });
      return true;
    } catch (err: any) {
      console.error('[EmailService] Failed to send email via SMTP:', err.message);
      // Fallback log ONLY in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV OTP FALLBACK] Code for ${toEmail} is: ${otpCode}`);
      }
      return false;
    }
  }
}

export const emailService = new EmailService();
