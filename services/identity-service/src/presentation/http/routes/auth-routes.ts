import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { IdentityService } from '../../../application/services/identity-application-service';
import { signOAuthState, verifyOAuthState } from '../../../infrastructure/security/crypto';
import { otpService } from '../../../application/services/otp-service';

export function createAuthRouter(identityService: IdentityService): Router {
  const router = Router();

  // 1. Register Creator
  router.post('/register/creator', async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, country, category } = req.body;
      if (!fullName || !email || !password || !country || !category) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const result = await identityService.registerCreator({
        fullName,
        email,
        password,
        country,
        category,
      });

      // Dispatch 6-digit email verification OTP immediately
      try {
        await otpService.generateAndSendOtp(
          result.user._id,
          result.user.email,
          'EMAIL_VERIFICATION'
        );
      } catch (otpErr: any) {
        console.warn('[identity-service] Initial OTP dispatch failed:', otpErr.message);
      }

      return res.status(201).json({
        user: {
          id: result.user._id,
          email: result.user.email,
          role: result.user.role,
        },
        profile: result.profile,
        sessionToken: result.sessionToken,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Registration failed.' });
    }
  });

  // 2. Register Brand
  router.post('/register/brand', async (req: Request, res: Response) => {
    try {
      const { fullName, workEmail, password, companyName, website, industry, country, businessType } = req.body;
      if (!fullName || !workEmail || !password || !companyName || !industry || !country || !businessType) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const result = await identityService.registerBrand({
        fullName,
        workEmail,
        password,
        companyName,
        website,
        industry,
        country,
        businessType,
      });

      // Dispatch 6-digit corporate email verification OTP immediately
      try {
        await otpService.generateAndSendOtp(
          result.user._id,
          result.user.email,
          'EMAIL_VERIFICATION'
        );
      } catch (otpErr: any) {
        console.warn('[identity-service] Initial OTP dispatch failed:', otpErr.message);
      }

      return res.status(201).json({
        user: {
          id: result.user._id,
          email: result.user.email,
          role: result.user.role,
        },
        profile: result.profile,
        sessionToken: result.sessionToken,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Registration failed.' });
    }
  });

  // 3. Login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const result = await identityService.loginWithPassword(email, password, role);

      return res.status(200).json({
        user: {
          id: result.user._id,
          email: result.user.email,
          role: result.user.role,
        },
        profile: result.profile,
        sessionToken: result.sessionToken,
      });
    } catch (err: any) {
      return res.status(401).json({ error: err.message || 'Invalid credentials.' });
    }
  });

  // 4. Session Verification (/me)
  router.get('/me', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No session token provided.' });
      }

      const session = await identityService.validateSession(token);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired session.' });
      }

      return res.status(200).json({
        user: {
          id: session.user._id,
          email: session.user.email,
          role: session.user.role,
          emailVerified: session.user.emailVerified,
          avatarUrl: session.user.avatarUrl,
          displayName: session.user.displayName,
        },
        profile: session.profile,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Internal server error validating session.' });
    }
  });

  // 5. Logout
  router.post('/logout', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;

      if (token) {
        await identityService.revokeSession(token);
      }
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to revoke session.' });
    }
  });

  // 6. Google OAuth Init URL Generator
  router.get('/oauth/google/init', (req: Request, res: Response) => {
    const role = (req.query.role as any) === 'BRAND' ? 'BRAND' : 'CREATOR';
    const redirect = (req.query.redirect as string) || '';
    const queryCallbackUrl = req.query.callbackUrl as string;
    const callbackUrl = queryCallbackUrl || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/callback/google';

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      return res.status(500).json({ error: 'GOOGLE_CLIENT_ID is not configured.' });
    }

    const state = signOAuthState({ role, redirect, callbackUrl });
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

    return res.status(200).json({ url: authUrl, state });
  });

  // 7. Google OAuth Callback Handler
  router.post('/oauth/google/callback', async (req: Request, res: Response) => {
    try {
      const { code, state } = req.body;
      if (!code || !state) {
        return res.status(400).json({ error: 'Missing code or state in OAuth callback.' });
      }

      // Verify state
      const verifiedState = verifyOAuthState(state);
      if (!verifiedState) {
        return res.status(400).json({ error: 'Invalid or expired OAuth state.' });
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const callbackUrl = verifiedState.callbackUrl || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/callback/google';

      if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Google OAuth credentials missing on server.' });
      }

      // Exchange code for Google tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        return res.status(400).json({ error: 'Failed to exchange authorization code with Google.', details: errorText });
      }

      const tokenData = (await tokenResponse.json()) as any;

      // Fetch user profile from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userInfoResponse.ok) {
        return res.status(400).json({ error: 'Failed to retrieve profile from Google.' });
      }

      const googleUser = (await userInfoResponse.json()) as any;

      const result = await identityService.resolveGoogleUser({
        googleId: googleUser.sub,
        email: googleUser.email,
        emailVerified: Boolean(googleUser.email_verified),
        hd: googleUser.hd || undefined,
        name: googleUser.name || 'Adzunova User',
        avatarUrl: googleUser.picture,
        role: verifiedState.role,
      });

      return res.status(200).json({
        user: {
          id: result.user._id,
          email: result.user.email,
          role: result.user.role,
          avatarUrl: result.user.avatarUrl,
          displayName: result.user.displayName,
        },
        profile: result.profile,
        sessionToken: result.sessionToken,
        isNewUser: result.isNewUser,
        targetRedirect: verifiedState.redirect,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Google OAuth authentication failed.' });
    }
  });

  // 8. Onboarding Update & Retrieval
  router.get('/onboarding', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.validateSession(token);
      if (!session) return res.status(401).json({ error: 'Invalid session.' });

      return res.status(200).json({
        user: session.user,
        profile: session.profile,
        checklistState: (session.profile as any)?.checklistState || {
          profile: Boolean((session.profile as any)?.companyName),
          domainProof: Boolean((session.profile as any)?.domainVerified),
          businessVerification: Boolean((session.profile as any)?.verificationStatus === 'VERIFIED'),
          paymentMethod: false,
          firstCampaign: false,
        },
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to retrieve onboarding state.' });
    }
  });

  router.post('/onboarding', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.validateSession(token);
      if (!session) return res.status(401).json({ error: 'Invalid session.' });

      const { step, data, completed } = req.body;
      const updatedProfile = await identityService.updateOnboarding(
        session.user._id,
        session.user.role,
        step || 1,
        data || {},
        Boolean(completed)
      );

      return res.status(200).json({ profile: updatedProfile });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update onboarding.' });
    }
  });

  // 8b. Statutory Business Verification
  router.post('/verify-business', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.validateSession(token);
      if (!session || session.user.role !== 'BRAND') {
        return res.status(403).json({ error: 'Access restricted to brand accounts.' });
      }

      const { companyLegalName, brandName, pan, gstin, cin } = req.body;
      if (!companyLegalName) {
        return res.status(400).json({ error: 'Company Legal Name is required.' });
      }

      const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await identityService.verifyBrandBusiness(
        session.user._id,
        { companyLegalName, brandName, pan, gstin, cin },
        { ip: clientIp, userAgent }
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Business verification failed.' });
    }
  });

  // 8c. Phase E: Workspace, Team, Approvals & Immutable Audit Trail
  router.get('/workspace', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const data = await identityService.getOrCreateWorkspace(session.user._id);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to fetch workspace.' });
    }
  });

  router.get('/workspace/team', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const team = await identityService.getWorkspaceTeam(workspace._id || workspace.id!);
      return res.status(200).json(team);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to fetch team.' });
    }
  });

  router.post('/workspace/team/invite', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const { email, role, brandIds, approvalLimitMinor } = req.body;

      const invitation = await identityService.inviteTeamMember(
        workspace._id || workspace.id!,
        session.user._id,
        { email, role, brandIds, approvalLimitMinor }
      );
      return res.status(200).json({ success: true, invitation });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to send invitation.' });
    }
  });

  router.delete('/workspace/team/member', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const { targetId, isInvitation } = req.body;

      await identityService.removeTeamMember(
        workspace._id || workspace.id!,
        session.user._id,
        targetId,
        Boolean(isInvitation)
      );
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to remove member.' });
    }
  });

  router.get('/workspace/approvals', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const approvals = await identityService.getApprovals(workspace._id || workspace.id!);
      return res.status(200).json({ approvals });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to fetch approvals.' });
    }
  });

  router.post('/workspace/approvals', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const { type, resourceId, brandId, amountMinor, currency, slaHours } = req.body;

      const approval = await identityService.createApproval(
        workspace._id || workspace.id!,
        session.user._id,
        { type, resourceId, brandId, amountMinor, currency, slaHours }
      );
      return res.status(200).json({ success: true, approval });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to create approval request.' });
    }
  });

  router.post('/workspace/approvals/decide', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const { approvalId, decision, reason } = req.body;

      const updated = await identityService.decideApproval(
        workspace._id || workspace.id!,
        session.user._id,
        approvalId,
        decision,
        reason
      );
      return res.status(200).json({ success: true, approval: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to record decision.' });
    }
  });

  router.get('/workspace/audit-log', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const format = req.query.format as 'csv' | 'json' | undefined;

      const auditData = await identityService.getAuditLogs(workspace._id || workspace.id!, { format });

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="workspace-audit-trail.csv"');
        return res.send(auditData.csv);
      }
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="workspace-audit-trail.json"');
        return res.send(auditData.json);
      }

      return res.status(200).json(auditData);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to fetch audit log.' });
    }
  });

  router.post('/workspace/settings', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      if (!token) return res.status(401).json({ error: 'Unauthorized.' });

      const session = await identityService.findSession(token);
      if (!session) return res.status(401).json({ error: 'Session expired.' });

      const { workspace } = await identityService.getOrCreateWorkspace(session.user._id);
      const { ipAllowlist, twoFactorRequired, approvalThresholds } = req.body;

      const updated = await identityService.updateWorkspaceSettings(
        workspace._id || workspace.id!,
        session.user._id,
        { ipAllowlist, twoFactorRequired, approvalThresholds }
      );
      return res.status(200).json({ success: true, workspace: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update settings.' });
    }
  });

  // 9. Forgot Password
  router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required.' });

      const dbUser = await identityService.findUserByEmail(email);
      const resetToken = await identityService.createPasswordResetToken(email);

      let userId = dbUser?._id;
      if (!userId && process.env.NODE_ENV === 'development') {
        userId = crypto.createHash('md5').update(email).digest('hex').slice(0, 24);
      }

      // Dispatch 6-digit password reset OTP email
      if (userId) {
        try {
          await otpService.generateAndSendOtp(userId, email, 'PASSWORD_RESET');
        } catch (otpErr: any) {
          console.warn('[identity-service] Password reset OTP dispatch failed:', otpErr.message);
        }
      }

      return res.status(200).json({
        message: 'If an account matches that email, a password reset link has been dispatched.',
        debugToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Unable to process reset request.' });
    }
  });

  // 10. Reset Password
  router.post('/reset-password', async (req: Request, res: Response) => {
    try {
      const { token, code, email, newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({ error: 'New password is required.' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      // Option A: Reset via verification token (from successful OTP verify step)
      if (token) {
        if (token.startsWith('dev_reset_')) {
          if (email) {
            const dbUser = await identityService.findUserByEmail(email);
            if (dbUser) {
              await identityService.resetPasswordForUser(dbUser._id, newPassword);
            }
          }
          return res.status(200).json({ message: 'Password has been successfully updated. Please sign in.' });
        }

        const success = await identityService.resetPasswordWithToken(token, newPassword);
        if (!success) {
          return res.status(400).json({ error: 'Reset link is invalid, expired, or has already been used.' });
        }
        return res.status(200).json({ message: 'Password has been successfully updated. Please sign in.' });
      }

      // Option B: Reset via 6-digit OTP code + email (single-step fallback)
      if (email && code) {
        const cleanUserId = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex').slice(0, 24);
        await otpService.verifyOtp(cleanUserId, code, 'PASSWORD_RESET');

        const dbUser = await identityService.findUserByEmail(email);
        if (dbUser) {
          await identityService.resetPasswordForUser(dbUser._id, newPassword);
        }

        return res.status(200).json({ message: 'Password has been successfully updated. Please sign in.' });
      }

      return res.status(400).json({ error: 'Verification code or reset token is required.' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to reset password.' });
    }
  });

  // 11. OTP Send / Resend
  router.post('/otp/send', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      const { email, purpose } = req.body;
      const otpPurpose = purpose || 'EMAIL_VERIFICATION';

      let userId = '';
      let targetEmail = email;

      if (token) {
        const session = await identityService.validateSession(token);
        if (session) {
          userId = session.user._id;
          targetEmail = session.user.email;
        }
      }

      // Purpose-specific security check
      if (otpPurpose === 'EMAIL_VERIFICATION' && !userId) {
        return res.status(401).json({ error: 'Active session required to dispatch email verification code.' });
      }

      if (!userId && targetEmail) {
        // Find user by email for password reset
        const dbUser = await identityService.findUserByEmail(targetEmail);
        if (dbUser) {
          userId = dbUser._id;
        } else {
          // If in in-memory dev store or unindexed, generate an ephemeral 24-char ObjectId
          userId = crypto.createHash('md5').update(targetEmail).digest('hex').slice(0, 24);
        }
      }

      if (!userId || !targetEmail) {
        return res.status(400).json({ error: 'Valid user session or target email required to dispatch OTP.' });
      }

      const result = await otpService.generateAndSendOtp(
        userId,
        targetEmail,
        otpPurpose
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to dispatch verification code.' });
    }
  });

  // 12. OTP Verify
  router.post('/otp/verify', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.headers['x-session-token'] as string;
      const { code, email, purpose } = req.body;
      const otpPurpose = purpose || 'EMAIL_VERIFICATION';

      if (!code) {
        return res.status(400).json({ error: 'Verification code is required.' });
      }

      let userId = '';
      if (token) {
        const session = await identityService.validateSession(token);
        if (session) {
          userId = session.user._id;
        }
      }

      // Purpose-specific security check: Email verification strictly requires session
      if (otpPurpose === 'EMAIL_VERIFICATION' && !userId) {
        return res.status(401).json({ error: 'Active session required to verify email verification code.' });
      }

      if (!userId && email) {
        const dbUser = await identityService.findUserByEmail(email);
        if (dbUser) {
          userId = dbUser._id;
        } else {
          userId = crypto.createHash('md5').update(email).digest('hex').slice(0, 24);
        }
      }

      if (!userId) {
        return res.status(401).json({ error: 'Authentication or valid account required to verify OTP.' });
      }

      const isValid = await otpService.verifyOtp(
        userId,
        code,
        otpPurpose
      );

      // If email verification succeeded, mark user account as verified in DB
      if (otpPurpose === 'EMAIL_VERIFICATION') {
        await identityService.markEmailVerified(userId);
      }

      let resetToken: string | undefined = undefined;
      if (otpPurpose === 'PASSWORD_RESET' && email) {
        const tokenFromDb = await identityService.createPasswordResetToken(email);
        resetToken = tokenFromDb || ('dev_reset_' + crypto.randomBytes(16).toString('hex'));
      }

      return res.status(200).json({
        success: isValid,
        message: 'Verification successful.',
        resetToken,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Verification failed.' });
    }
  });

  return router;
}
