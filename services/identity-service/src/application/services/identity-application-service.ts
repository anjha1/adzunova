import { getDatabase } from '../../infrastructure/persistence/database';
import {
  UserEntity,
  CreatorProfileEntity,
  BrandProfileEntity,
  IdentityEntity,
  SessionEntity,
  VerificationTokenEntity,
  UserRole,
  WorkspaceEntity,
  BrandEntity,
  WorkspaceMemberEntity,
  WorkspaceInvitationEntity,
  ApprovalEntity,
  AuditLogEntity,
} from '../../domain/entities/models';
import {
  hashPassword,
  verifyPassword,
  hashToken,
  generateRandomToken,
  createSessionJwt,
} from '../../infrastructure/security/crypto';
import crypto from 'crypto';
import { evaluateWorkEmail } from '../../domain/services/work-email-policy';
import {
  getBusinessVerificationAdapter,
  computeBrandVerificationBadge,
  BusinessVerificationInput,
} from '../../domain/services/business-verification-service';
import {
  checkPermission,
  isIpAllowed,
  isTwoFactorCompliant,
} from '../../domain/services/workspace-rbac-service';
import {
  buildChainedAuditEntry,
  verifyAuditChain,
  exportAuditLogsToCsv,
  exportAuditLogsToJson,
} from '../../domain/services/audit-log-service';
import {
  createApprovalRequest,
  evaluateApprovalDecision,
  checkSlaStatus,
} from '../../domain/services/approval-workflow-service';

export class IdentityService {
  /**
   * Register a Creator Account
   */
  async registerCreator(input: {
    fullName: string;
    email: string;
    password: string;
    country: string;
    category: any;
  }): Promise<{ user: UserEntity; profile: CreatorProfileEntity; sessionToken: string }> {
    const db = await getDatabase();
    const normalizedEmail = input.email.trim().toLowerCase();

    // Check existing
    const existing = await db.collection<UserEntity>('users').findOne({ normalizedEmail });
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = crypto.randomBytes(12).toString('hex');
    const passwordHash = await hashPassword(input.password);
    const now = new Date();

    const user: UserEntity = {
      _id: userId,
      email: input.email.trim(),
      normalizedEmail,
      passwordHash,
      role: 'CREATOR',
      emailVerified: false,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    const profile: CreatorProfileEntity = {
      userId,
      displayName: input.fullName.trim(),
      category: input.category,
      country: input.country,
      onboardingCompleted: false,
      onboardingStep: 1,
      profileStatus: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection<UserEntity>('users').insertOne(user as any);
    await db.collection<CreatorProfileEntity>('creator_profiles').insertOne(profile as any);

    // Create session
    const sessionToken = await this.createSession(userId, 'CREATOR');

    return { user, profile, sessionToken };
  }

  /**
   * Find User By Email
   */
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const db = await getDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    return db.collection<UserEntity>('users').findOne({ normalizedEmail });
  }

  /**
   * Register a Brand / Company Account
   */
  async registerBrand(input: {
    fullName: string;
    workEmail: string;
    password: string;
    companyName: string;
    website?: string;
    industry: string;
    country: string;
    businessType: any;
  }): Promise<{ user: UserEntity; profile: BrandProfileEntity; sessionToken: string }> {
    const db = await getDatabase();

    // Strict Domain Policy Engine check for Brand registration
    const rawEmail = input.workEmail || (input as any).email;
    const evalResult = await evaluateWorkEmail(rawEmail);
    if (!evalResult.allowed) {
      const err = new Error(
        evalResult.errorMessage ||
          'Please use your company email address (for example name@yourcompany.com). Personal email providers are not supported for brand accounts.'
      );
      (err as any).code = evalResult.reason;
      throw err;
    }

    const normalizedEmail = evalResult.normalized;

    const existing = await db.collection<UserEntity>('users').findOne({ normalizedEmail });
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = crypto.randomBytes(12).toString('hex');
    const passwordHash = await hashPassword(input.password);
    const now = new Date();

    const user: UserEntity = {
      _id: userId,
      email: input.workEmail.trim(),
      normalizedEmail,
      passwordHash,
      role: 'BRAND',
      emailVerified: false,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    const profile: BrandProfileEntity = {
      userId,
      contactName: input.fullName.trim(),
      companyName: input.companyName.trim(),
      website: input.website?.trim(),
      industry: input.industry.trim(),
      businessType: input.businessType,
      country: input.country,
      onboardingCompleted: false,
      onboardingStep: 1,
      profileStatus: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection<UserEntity>('users').insertOne(user as any);
    await db.collection<BrandProfileEntity>('brand_profiles').insertOne(profile as any);

    const sessionToken = await this.createSession(userId, 'BRAND');

    return { user, profile, sessionToken };
  }

  /**
   * Standard Password Login
   */
  async loginWithPassword(
    email: string,
    password: string,
    expectedRole?: UserRole
  ): Promise<{ user: UserEntity; profile: any; sessionToken: string }> {
    const db = await getDatabase();
    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.collection<UserEntity>('users').findOne({ normalizedEmail });
    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password credentials.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('This account has been suspended. Please contact support.');
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password credentials.');
    }

    // Role validation
    if (expectedRole && user.role !== expectedRole) {
      throw new Error(
        `This account is registered as a ${user.role}. Please sign in via the ${user.role.toLowerCase()} portal.`
      );
    }

    // Fetch profile
    let profile: any = null;
    if (user.role === 'CREATOR') {
      profile = await db.collection('creator_profiles').findOne({ userId: user._id });
    } else if (user.role === 'BRAND') {
      // Re-check work-email policy on every login for BRAND accounts (Phase B1.8 & B4)
      const evalResult = await evaluateWorkEmail(user.email);
      if (!evalResult.allowed) {
        if (user.status !== 'RESTRICTED_WORK_EMAIL_REQUIRED') {
          await db.collection('users').updateOne(
            { _id: user._id as any },
            { $set: { status: 'RESTRICTED_WORK_EMAIL_REQUIRED', updatedAt: new Date() } }
          );
          user.status = 'RESTRICTED_WORK_EMAIL_REQUIRED' as any;
        }
      }
      profile = await db.collection('brand_profiles').findOne({ userId: user._id });
    }

    // Update lastLoginAt
    await db.collection('users').updateOne({ _id: user._id as any }, { $set: { lastLoginAt: new Date() } });

    const sessionToken = await this.createSession(user._id, user.role);

    return { user, profile, sessionToken };
  }

  /**
   * Google OAuth Callback Resolution
   */
  async resolveGoogleUser(input: {
    googleId: string;
    email: string;
    emailVerified?: boolean;
    hd?: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
  }): Promise<{ user: UserEntity; profile: any; sessionToken: string; isNewUser: boolean }> {
    // Strict Google Workspace hosted domain validation for Brand logins (Phase B2)
    if (input.role === 'BRAND') {
      const emailDomain = input.email.split('@')[1]?.toLowerCase().trim();
      if (!input.hd) {
        const err = new Error(
          'Please use your company email address (for example name@yourcompany.com). Personal email providers are not supported for brand accounts.'
        );
        (err as any).code = 'FREE_EMAIL_NOT_ALLOWED';
        throw err;
      }

      if (input.hd.toLowerCase().trim() !== emailDomain) {
        const err = new Error('Google Workspace hosted domain does not match email address.');
        (err as any).code = 'INVALID_DOMAIN';
        throw err;
      }

      const evalResult = await evaluateWorkEmail(input.email);
      if (!evalResult.allowed) {
        const err = new Error(
          evalResult.errorMessage ||
            'Please use your company email address (for example name@yourcompany.com). Personal email providers are not supported for brand accounts.'
        );
        (err as any).code = evalResult.reason;
        throw err;
      }
    }

    const db = await getDatabase();
    const normalizedEmail = input.email.trim().toLowerCase();

    // 1. Check if identity exists
    const identity = await db.collection<IdentityEntity>('identities').findOne({
      provider: 'google',
      providerUserId: input.googleId,
    });

    if (identity) {
      const user = await db.collection<any>('users').findOne({ _id: identity.userId });
      if (!user) {
        throw new Error('Account linkage corrupted. Please contact support.');
      }

      // Refresh avatar and displayName on every Google login
      const updates: any = { lastLoginAt: new Date() };
      if (input.avatarUrl) updates.avatarUrl = input.avatarUrl;
      if (input.name) updates.displayName = input.name;

      await db.collection('users').updateOne({ _id: user._id }, { $set: updates });
      user.avatarUrl = input.avatarUrl || user.avatarUrl;
      user.displayName = input.name || user.displayName;

      let profile: any = null;
      if (user.role === 'CREATOR') {
        profile = await db.collection('creator_profiles').findOne({ userId: user._id });
      } else {
        profile = await db.collection('brand_profiles').findOne({ userId: user._id });
      }

      const sessionToken = await this.createSession(user._id, user.role);
      return { user, profile, sessionToken, isNewUser: false };
    }

    // 2. Check if user with this email already exists
    const existingUser = await db.collection<UserEntity>('users').findOne({ normalizedEmail });
    if (existingUser) {
      if (input.role && existingUser.role !== input.role) {
        throw new Error(
          `This email is associated with a ${existingUser.role} account. Cannot convert to ${input.role}.`
        );
      }

      await db.collection<IdentityEntity>('identities').insertOne({
        userId: existingUser._id,
        provider: 'google',
        providerUserId: input.googleId,
        providerEmail: input.email,
        createdAt: new Date(),
      } as any);

      const updates: any = { emailVerified: true, lastLoginAt: new Date() };
      if (input.avatarUrl) updates.avatarUrl = input.avatarUrl;
      if (input.name) updates.displayName = input.name;

      await db.collection('users').updateOne({ _id: existingUser._id as any }, { $set: updates });
      existingUser.avatarUrl = input.avatarUrl || existingUser.avatarUrl;
      existingUser.displayName = input.name || existingUser.displayName;

      let profile: any = null;
      if (existingUser.role === 'CREATOR') {
        profile = await db.collection('creator_profiles').findOne({ userId: existingUser._id });
      } else {
        profile = await db.collection('brand_profiles').findOne({ userId: existingUser._id });
      }

      const sessionToken = await this.createSession(existingUser._id, existingUser.role);
      return { user: existingUser, profile, sessionToken, isNewUser: false };
    }

    // 3. Create fresh Google User
    const userId = crypto.randomBytes(12).toString('hex');
    const now = new Date();

    const newUser: UserEntity = {
      _id: userId,
      email: input.email.trim(),
      normalizedEmail,
      role: input.role,
      emailVerified: true,
      avatarUrl: input.avatarUrl,
      displayName: input.name,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    await db.collection<UserEntity>('users').insertOne(newUser as any);
    await db.collection<IdentityEntity>('identities').insertOne({
      userId,
      provider: 'google',
      providerUserId: input.googleId,
      providerEmail: input.email,
      createdAt: now,
    } as any);

    let profile: any = null;
    if (input.role === 'CREATOR') {
      profile = {
        userId,
        displayName: input.name,
        category: 'Influencer',
        country: 'Global',
        onboardingCompleted: false,
        onboardingStep: 1,
        profileStatus: 'DRAFT',
        createdAt: now,
        updatedAt: now,
      };
      await db.collection('creator_profiles').insertOne(profile);
    } else {
      profile = {
        userId,
        contactName: input.name,
        companyName: '',
        industry: 'General',
        businessType: 'Startup',
        country: 'Global',
        onboardingCompleted: false,
        onboardingStep: 1,
        profileStatus: 'DRAFT',
        createdAt: now,
        updatedAt: now,
      };
      await db.collection('brand_profiles').insertOne(profile);
    }

    const sessionToken = await this.createSession(userId, input.role);
    return { user: newUser, profile, sessionToken, isNewUser: true };
  }

  /**
   * Session Management
   */
  async createSession(userId: string, role: UserRole): Promise<string> {
    const db = await getDatabase();
    const sessionId = crypto.randomUUID();
    const rawToken = generateRandomToken(32);
    const sessionTokenHash = hashToken(rawToken);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session: SessionEntity = {
      userId,
      role,
      sessionTokenHash,
      createdAt: now,
      expiresAt,
      lastUsedAt: now,
    };

    await db.collection<SessionEntity>('sessions').insertOne(session as any);

    const jwtToken = createSessionJwt({
      userId,
      email: '',
      role,
      sessionId,
    });

    return `${rawToken}.${jwtToken}`;
  }

  async validateSession(tokenStr: string): Promise<{ user: UserEntity; profile: any } | null> {
    if (!tokenStr) return null;
    const [rawToken] = tokenStr.split('.');
    if (!rawToken) return null;

    const db = await getDatabase();
    const sessionTokenHash = hashToken(rawToken);

    const session = await db.collection<any>('sessions').findOne({
      sessionTokenHash,
      expiresAt: { $gt: new Date() },
      revokedAt: { $exists: false },
    });

    if (!session) return null;

    const user = await db.collection<any>('users').findOne({ _id: session.userId });
    if (!user || user.status === 'SUSPENDED') return null;

    let profile: any = null;
    if (user.role === 'CREATOR') {
      profile = await db.collection('creator_profiles').findOne({ userId: user._id });
    } else {
      profile = await db.collection('brand_profiles').findOne({ userId: user._id });
    }

    // Touch lastUsedAt asynchronously
    db.collection('sessions').updateOne({ _id: session._id }, { $set: { lastUsedAt: new Date() } }).catch(() => {});

    return { user, profile };
  }

  async revokeSession(tokenStr: string): Promise<void> {
    if (!tokenStr) return;
    const [rawToken] = tokenStr.split('.');
    if (!rawToken) return;

    const db = await getDatabase();
    const sessionTokenHash = hashToken(rawToken);
    await db.collection('sessions').updateOne(
      { sessionTokenHash },
      { $set: { revokedAt: new Date() } }
    );
  }

  /**
   * Onboarding Update
   */
  async updateOnboarding(
    userId: string,
    role: UserRole,
    step: number,
    data: Record<string, any>,
    completed: boolean = false
  ): Promise<any> {
    const db = await getDatabase();
    const now = new Date();

    if (role === 'CREATOR') {
      const updateData: any = {
        ...data,
        onboardingStep: step,
        updatedAt: now,
      };
      if (completed) {
        updateData.onboardingCompleted = true;
        updateData.profileStatus = 'COMPLETED';
      }

      await db.collection('creator_profiles').updateOne(
        { userId },
        { $set: updateData }
      );
      return db.collection('creator_profiles').findOne({ userId });
    } else {
      const currentProfile = await db.collection<BrandProfileEntity>('brand_profiles').findOne({ userId });
      const updateData: any = {
        ...data,
        onboardingStep: step,
        updatedAt: now,
      };

      // If statutory details provided, evaluate business verification
      if (data.pan || data.gstin || data.cin) {
        const adapter = getBusinessVerificationAdapter();
        const vResult = await adapter.verify({
          companyLegalName: data.companyName || currentProfile?.companyName || '',
          brandName: data.brandName || currentProfile?.brandName,
          pan: data.pan,
          gstin: data.gstin,
          cin: data.cin,
        });

        updateData.verificationStatus = vResult.verificationStatus;
        updateData.verificationDetails = vResult.details;
        if (vResult.verificationStatus === 'VERIFIED') {
          updateData.verifiedAt = now;
        }

        // Record verification audit log on submission / update
        await db.collection('verification_audit_logs').insertOne({
          _id: crypto.randomBytes(12).toString('hex'),
          brandProfileId: currentProfile?._id || userId,
          actorId: userId,
          previousState: currentProfile?.verificationStatus || 'PENDING',
          newState: vResult.verificationStatus,
          reason: vResult.details || 'Statutory KYC documents submitted during onboarding',
          metadata: { pan: data.pan, gstin: data.gstin, cin: data.cin },
          createdAt: now,
        });
      }

      // Log DPDP consent if submitted
      if (data.dpdpConsent) {
        updateData.dpdpConsent = {
          version: data.dpdpConsent.version || '2026.1',
          timestamp: data.dpdpConsent.timestamp || now.toISOString(),
          ip: data.dpdpConsent.ip,
          userAgent: data.dpdpConsent.userAgent,
          purposes: data.dpdpConsent.purposes || [
            'CREATOR_DISCOVERY',
            'PAYMENT_ESCROW',
            'TAX_INVOICING',
            'COMMUNICATION',
          ],
        };
      }

      // Compute setup checklist state
      const merged = { ...currentProfile, ...updateData };
      const checklistState = {
        profile: Boolean(merged.companyName && merged.industry && merged.website),
        domainProof: Boolean(merged.domainVerified),
        businessVerification: Boolean(
          merged.verificationStatus === 'VERIFIED' ||
          (merged.verificationStatus === 'PENDING' && (merged.pan || merged.gstin))
        ),
        paymentMethod: Boolean(merged.checklistState?.paymentMethod),
        firstCampaign: Boolean(merged.checklistState?.firstCampaign),
      };
      updateData.checklistState = checklistState;

      if (completed) {
        updateData.onboardingCompleted = true;
        updateData.profileStatus = 'COMPLETED';
      }

      await db.collection('brand_profiles').updateOne(
        { userId },
        { $set: updateData }
      );
      return db.collection('brand_profiles').findOne({ userId });
    }
  }

  /**
   * Statutory Business Verification Service
   */
  async verifyBrandBusiness(
    userId: string,
    input: { companyLegalName: string; brandName?: string; pan?: string; gstin?: string; cin?: string },
    auditContext?: { ip?: string; userAgent?: string }
  ): Promise<any> {
    const db = await getDatabase();
    const adapter = getBusinessVerificationAdapter();
    const result = await adapter.verify(input);
    const now = new Date();

    const current = await db.collection<BrandProfileEntity>('brand_profiles').findOne({ userId });

    const updateFields: any = {
      pan: input.pan?.trim().toUpperCase(),
      gstin: input.gstin?.trim().toUpperCase(),
      cin: input.cin?.trim().toUpperCase(),
      companyName: input.companyLegalName.trim(),
      brandName: input.brandName?.trim(),
      verificationStatus: result.verificationStatus,
      verificationDetails: result.details,
      updatedAt: now,
    };

    if (result.verificationStatus === 'VERIFIED') {
      updateFields.verifiedAt = now;
    }

    await db.collection('brand_profiles').updateOne(
      { userId },
      { $set: updateFields }
    );

    // Record audit log
    await db.collection('verification_audit_logs').insertOne({
      _id: crypto.randomBytes(12).toString('hex'),
      brandProfileId: current?._id || userId,
      actorId: userId,
      previousState: current?.verificationStatus || 'PENDING',
      newState: result.verificationStatus,
      reason: result.details,
      metadata: { input, result, auditContext },
      createdAt: now,
    });

    return {
      result,
      profile: await db.collection('brand_profiles').findOne({ userId }),
    };
  }

  /**
   * Password Reset Flow
   */
  async createPasswordResetToken(email: string): Promise<string | null> {
    const db = await getDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.collection<UserEntity>('users').findOne({ normalizedEmail });
    if (!user) return null; // generic handling

    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour

    await db.collection<VerificationTokenEntity>('verification_tokens').insertOne({
      userId: user._id,
      tokenHash,
      purpose: 'PASSWORD_RESET',
      expiresAt,
      createdAt: now,
    } as any);

    return rawToken;
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    const db = await getDatabase();
    const tokenHash = hashToken(token);

    const tokenDoc = await db.collection<VerificationTokenEntity>('verification_tokens').findOne({
      tokenHash,
      purpose: 'PASSWORD_RESET',
      expiresAt: { $gt: new Date() },
      usedAt: { $exists: false },
    });

    if (!tokenDoc) return false;

    const passwordHash = await hashPassword(newPassword);
    const now = new Date();

    // Update user password
    await db.collection('users').updateOne(
      { _id: tokenDoc.userId as any },
      { $set: { passwordHash, updatedAt: now } }
    );

    // Mark token used
    await db.collection('verification_tokens').updateOne(
      { _id: tokenDoc._id },
      { $set: { usedAt: now } }
    );

    // Revoke all existing sessions for this user (security rule)
    await db.collection('sessions').updateMany(
      { userId: tokenDoc.userId, revokedAt: { $exists: false } },
      { $set: { revokedAt: now } }
    );

    return true;
  }

  async resetPasswordForUser(userId: string, newPassword: string): Promise<boolean> {
    const db = await getDatabase();
    const passwordHash = await hashPassword(newPassword);
    const now = new Date();

    await db.collection('users').updateOne(
      { _id: userId as any },
      { $set: { passwordHash, updatedAt: now } }
    );

    await db.collection('sessions').updateMany(
      { userId, revokedAt: { $exists: false } },
      { $set: { revokedAt: now } }
    );

    return true;
  }

  async markEmailVerified(userId: string): Promise<boolean> {
    const db = await getDatabase();
    await db.collection('users').updateOne(
      { _id: userId as any },
      { $set: { emailVerified: true, updatedAt: new Date() } }
    );
    return true;
  }

  /**
   * Phase E: Workspace, Team, Roles, Approvals & Immutable Audit Trail
   */

  async getOrCreateWorkspace(userId: string): Promise<{
    workspace: WorkspaceEntity;
    member: WorkspaceMemberEntity;
  }> {
    const db = await getDatabase();
    let member = await db.collection<WorkspaceMemberEntity>('members').findOne({ userId });

    let workspace: WorkspaceEntity | null = null;
    if (member) {
      workspace = await db.collection<WorkspaceEntity>('workspaces').findOne({ _id: member.workspaceId });
    }

    if (!workspace) {
      // Find or create workspace where user is owner
      workspace = await db.collection<WorkspaceEntity>('workspaces').findOne({ ownerId: userId });
      if (!workspace) {
        const brandProfile = await db.collection<BrandProfileEntity>('brand_profiles').findOne({ userId });
        const now = new Date();
        const wsId = crypto.randomBytes(12).toString('hex');

        workspace = {
          _id: wsId,
          id: wsId,
          name: brandProfile?.companyName || brandProfile?.brandName || 'Corporate Workspace',
          slug: `ws_${userId.slice(0, 8)}_${Date.now().toString(36)}`,
          type: (brandProfile?.accountType as any) || 'BRAND',
          ownerId: userId,
          billingCurrency: (brandProfile as any)?.currency || 'INR',
          ipAllowlist: [],
          twoFactorRequired: false,
          approvalThresholds: {
            bookingThresholdMinor: 10000000, // ₹1,00,000
            campaignThresholdMinor: 50000000, // ₹5,00,000
            paymentThresholdMinor: 25000000, // ₹2,50,000
          },
          createdAt: now,
          updatedAt: now,
        };

        await db.collection('workspaces').insertOne(workspace);

        // Record genesis audit entry
        const genesisEntry = buildChainedAuditEntry({
          workspaceId: wsId,
          actorId: userId,
          action: 'workspace:create',
          resourceType: 'WORKSPACE',
          resourceId: wsId,
          payload: { name: workspace.name, type: workspace.type },
          createdAt: now,
        });
        await db.collection('audit_log').insertOne(genesisEntry);
      }

      if (!member) {
        const user = await db.collection<UserEntity>('users').findOne({ _id: userId as any });
        const now = new Date();
        const memId = crypto.randomBytes(12).toString('hex');
        member = {
          _id: memId,
          id: memId,
          workspaceId: workspace._id || workspace.id!,
          userId,
          email: user?.email || '',
          name: user?.displayName,
          role: 'OWNER',
          brandIds: [],
          status: 'ACTIVE',
          joinedAt: now,
          updatedAt: now,
        };
        await db.collection('members').insertOne(member);
      }
    }

    return { workspace: workspace!, member: member! };
  }

  async getWorkspaceTeam(workspaceId: string): Promise<{
    members: WorkspaceMemberEntity[];
    invitations: WorkspaceInvitationEntity[];
    brands: BrandEntity[];
  }> {
    const db = await getDatabase();
    const members = await db.collection<WorkspaceMemberEntity>('members').find({ workspaceId }).toArray();
    const invitations = await db.collection<WorkspaceInvitationEntity>('invitations').find({ workspaceId }).toArray();
    const brands = await db.collection<BrandEntity>('brands').find({ workspaceId }).toArray();

    return {
      members,
      invitations: invitations.filter((inv) => inv.status === 'PENDING'),
      brands,
    };
  }

  async inviteTeamMember(
    workspaceId: string,
    invitedByUserId: string,
    input: {
      email: string;
      role: string;
      brandIds?: string[];
      approvalLimitMinor?: number;
    }
  ): Promise<WorkspaceInvitationEntity> {
    const db = await getDatabase();

    // Strict Domain Policy Engine check (Phase B)
    const evalResult = await evaluateWorkEmail(input.email);
    if (!evalResult.allowed) {
      const err = new Error(
        evalResult.errorMessage ||
          'Please use a company work email address. Personal email providers are not supported for workspace invitations.'
      );
      (err as any).code = evalResult.reason;
      throw err;
    }

    const normalizedEmail = evalResult.normalized;

    // Check existing active member
    const existingMember = await db.collection<WorkspaceMemberEntity>('members').findOne({
      workspaceId,
      email: normalizedEmail,
    });
    if (existingMember && existingMember.status === 'ACTIVE') {
      throw new Error('A team member with this work email already exists in this workspace.');
    }

    // Check pending invite
    const existingInvite = await db.collection<WorkspaceInvitationEntity>('invitations').findOne({
      workspaceId,
      email: normalizedEmail,
      status: 'PENDING',
    });
    if (existingInvite) {
      throw new Error('An active invitation has already been sent to this work email address.');
    }

    const now = new Date();
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(now.getTime() + 7 * 24 * 3600 * 1000); // 7 days

    const invitation: WorkspaceInvitationEntity = {
      _id: crypto.randomBytes(12).toString('hex'),
      workspaceId,
      email: normalizedEmail,
      role: input.role,
      brandIds: input.brandIds || [],
      invitedByUserId,
      token,
      status: 'PENDING',
      expiresAt,
      createdAt: now,
    };

    await db.collection('invitations').insertOne(invitation);

    // Chained audit log
    const lastLogs = await db.collection<AuditLogEntity>('audit_log').find({ workspaceId }).toArray();
    const lastHash = lastLogs.length > 0 ? lastLogs[lastLogs.length - 1].hash : undefined;
    const auditEntry = buildChainedAuditEntry(
      {
        workspaceId,
        actorId: invitedByUserId,
        action: 'team:invite',
        resourceType: 'INVITATION',
        resourceId: invitation._id,
        payload: { email: normalizedEmail, role: input.role, brandIds: input.brandIds },
        createdAt: now,
      },
      lastHash
    );
    await db.collection('audit_log').insertOne(auditEntry);

    return invitation;
  }

  async removeTeamMember(
    workspaceId: string,
    actorId: string,
    targetId: string,
    isInvitation = false
  ): Promise<boolean> {
    const db = await getDatabase();
    const now = new Date();

    if (isInvitation) {
      await db.collection('invitations').updateOne(
        { _id: targetId as any, workspaceId },
        { $set: { status: 'REVOKED', updatedAt: now } }
      );
    } else {
      const targetMember = await db.collection<WorkspaceMemberEntity>('members').findOne({
        _id: targetId as any,
        workspaceId,
      });
      if (targetMember?.role === 'OWNER') {
        throw new Error('Cannot remove the workspace Owner.');
      }
      await db.collection('members').updateOne(
        { _id: targetId as any, workspaceId },
        { $set: { status: 'SUSPENDED', updatedAt: now } }
      );
    }

    // Chained audit log
    const lastLogs = await db.collection<AuditLogEntity>('audit_log').find({ workspaceId }).toArray();
    const lastHash = lastLogs.length > 0 ? lastLogs[lastLogs.length - 1].hash : undefined;
    const auditEntry = buildChainedAuditEntry(
      {
        workspaceId,
        actorId,
        action: isInvitation ? 'team:invite_revoked' : 'team:member_removed',
        resourceType: isInvitation ? 'INVITATION' : 'MEMBER',
        resourceId: targetId,
        payload: { targetId, isInvitation },
        createdAt: now,
      },
      lastHash
    );
    await db.collection('audit_log').insertOne(auditEntry);

    return true;
  }

  async getApprovals(workspaceId: string): Promise<ApprovalEntity[]> {
    const db = await getDatabase();
    return db.collection<ApprovalEntity>('approvals').find({ workspaceId }).toArray();
  }

  async createApproval(
    workspaceId: string,
    requesterId: string,
    input: {
      type: 'BOOKING_CREATION' | 'CAMPAIGN_LAUNCH' | 'PAYMENT_RELEASE';
      resourceId: string;
      brandId?: string;
      amountMinor?: number;
      currency?: string;
      slaHours?: number;
    }
  ): Promise<ApprovalEntity> {
    const db = await getDatabase();
    const approval = createApprovalRequest({
      workspaceId,
      brandId: input.brandId,
      type: input.type,
      resourceId: input.resourceId,
      requesterId,
      amountMinor: input.amountMinor,
      currency: input.currency,
      slaHours: input.slaHours,
    });

    await db.collection('approvals').insertOne(approval);

    // Chained audit log
    const lastLogs = await db.collection<AuditLogEntity>('audit_log').find({ workspaceId }).toArray();
    const lastHash = lastLogs.length > 0 ? lastLogs[lastLogs.length - 1].hash : undefined;
    const auditEntry = buildChainedAuditEntry(
      {
        workspaceId,
        actorId: requesterId,
        action: 'approval:request_created',
        resourceType: 'APPROVAL',
        resourceId: approval._id,
        payload: { type: input.type, resourceId: input.resourceId, amountMinor: input.amountMinor },
        createdAt: new Date(),
      },
      lastHash
    );
    await db.collection('audit_log').insertOne(auditEntry);

    return approval;
  }

  async decideApproval(
    workspaceId: string,
    approverUserId: string,
    approvalId: string,
    decision: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<ApprovalEntity> {
    const db = await getDatabase();
    const approval = await db.collection<ApprovalEntity>('approvals').findOne({
      _id: approvalId as any,
      workspaceId,
    });
    if (!approval) {
      throw new Error('Approval request not found.');
    }

    const approverMember = await db.collection<WorkspaceMemberEntity>('members').findOne({
      workspaceId,
      userId: approverUserId,
    });
    if (!approverMember) {
      throw new Error('Approver is not an authorized member of this workspace.');
    }

    const { updatedApproval, auditPayload } = evaluateApprovalDecision(approval, {
      approvalId,
      approver: approverMember,
      decision,
      reason,
    });

    await db.collection('approvals').updateOne(
      { _id: approvalId as any, workspaceId },
      { $set: updatedApproval }
    );

    // Chained audit log
    const lastLogs = await db.collection<AuditLogEntity>('audit_log').find({ workspaceId }).toArray();
    const lastHash = lastLogs.length > 0 ? lastLogs[lastLogs.length - 1].hash : undefined;
    const auditEntry = buildChainedAuditEntry(
      {
        workspaceId,
        actorId: approverUserId,
        action: `approval:${decision.toLowerCase()}`,
        resourceType: 'APPROVAL',
        resourceId: approvalId,
        payload: auditPayload,
        createdAt: new Date(),
      },
      lastHash
    );
    await db.collection('audit_log').insertOne(auditEntry);

    return updatedApproval;
  }

  async getAuditLogs(
    workspaceId: string,
    options?: { verify?: boolean; format?: 'csv' | 'json' }
  ): Promise<{
    logs: AuditLogEntity[];
    verification: { valid: boolean; totalEntries: number; error?: string };
    csv?: string;
    json?: string;
  }> {
    const db = await getDatabase();
    const logs = await db.collection<AuditLogEntity>('audit_log').find({ workspaceId }).toArray();

    // Sort ascending by creation time
    logs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const verification = verifyAuditChain(logs);

    let csv: string | undefined;
    let json: string | undefined;

    if (options?.format === 'csv') {
      csv = exportAuditLogsToCsv(logs);
    } else if (options?.format === 'json') {
      json = exportAuditLogsToJson(logs);
    }

    return {
      logs,
      verification: {
        valid: verification.valid,
        totalEntries: verification.totalEntries,
        error: verification.error,
      },
      csv,
      json,
    };
  }

  async updateWorkspaceSettings(
    workspaceId: string,
    actorId: string,
    settings: {
      ipAllowlist?: string[];
      twoFactorRequired?: boolean;
      approvalThresholds?: any;
    }
  ): Promise<WorkspaceEntity> {
    const db = await getDatabase();
    const now = new Date();

    const patch: any = { updatedAt: now };
    if (settings.ipAllowlist !== undefined) patch.ipAllowlist = settings.ipAllowlist;
    if (settings.twoFactorRequired !== undefined) patch.twoFactorRequired = settings.twoFactorRequired;
    if (settings.approvalThresholds !== undefined) patch.approvalThresholds = settings.approvalThresholds;

    await db.collection('workspaces').updateOne(
      { _id: workspaceId as any },
      { $set: patch }
    );

    // Chained audit log
    const lastLogs = await db.collection<AuditLogEntity>('audit_log').find({ workspaceId }).toArray();
    const lastHash = lastLogs.length > 0 ? lastLogs[lastLogs.length - 1].hash : undefined;
    const auditEntry = buildChainedAuditEntry(
      {
        workspaceId,
        actorId,
        action: 'settings:update',
        resourceType: 'WORKSPACE',
        resourceId: workspaceId,
        payload: settings,
        createdAt: now,
      },
      lastHash
    );
    await db.collection('audit_log').insertOne(auditEntry);

    return (await db.collection<WorkspaceEntity>('workspaces').findOne({ _id: workspaceId as any }))!;
  }
}
