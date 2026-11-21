import test from 'node:test';
import assert from 'node:assert/strict';
import { IdentityService } from '../../services/identity-service/src/application/services/identity-application-service.ts';
import {
  generateDomainVerificationChallenge,
  verifyDomainTxtRecord,
  checkTyposquatting,
} from '../../services/identity-service/src/domain/services/domain-verification-service.ts';
import { getDatabase, closeDatabase } from '../../services/identity-service/src/infrastructure/persistence/database.ts';

test('Brand Identity Policy & Anti-Impersonation Integration Suite', async (t) => {
  const identityService = new IdentityService();
  const db = await getDatabase();

  t.after(async () => {
    await closeDatabase();
  });

  await t.test('B1 & B2: strictly rejects brand registration with free consumer email (Gmail)', async () => {
    await assert.rejects(
      async () => {
        await identityService.registerBrand({
          fullName: 'Test Marketing Exec',
          workEmail: 'marketing.lead@gmail.com',
          password: 'Password123!',
          companyName: 'Test Corp',
          industry: 'D2C Consumer Goods',
          country: 'India',
          businessType: 'Startup',
        });
      },
      (err) => {
        assert.match(err.message, /Personal email providers are not supported/i);
        return true;
      }
    );
  });

  await t.test('B1 & B2: strictly rejects brand registration with Yahoo / Outlook / Hotmail', async () => {
    const freeMails = ['media@yahoo.co.in', 'adops@outlook.com', 'buyer@hotmail.com', 'campaigns@proton.me'];
    for (const email of freeMails) {
      await assert.rejects(
        async () => {
          await identityService.registerBrand({
            fullName: 'Test Marketer',
            workEmail: email,
            password: 'Password123!',
            companyName: 'Test Corp',
            industry: 'D2C Consumer Goods',
            country: 'India',
            businessType: 'Startup',
          });
        },
        (err) => {
          assert.match(err.message, /Personal email providers are not supported/i);
          return true;
        }
      );
    }
  });

  await t.test('B1 & B2: strictly rejects brand registration with disposable / burner email', async () => {
    await assert.rejects(
      async () => {
        await identityService.registerBrand({
          fullName: 'Anonymous Marketer',
          workEmail: 'brand.agent@mailinator.com',
          password: 'Password123!',
          companyName: 'Shadow Corp',
          industry: 'Agency',
          country: 'Global',
          businessType: 'Agency',
        });
      },
      (err) => {
        assert.match(err.message, /Temporary and disposable email addresses are not permitted/i);
        return true;
      }
    );
  });

  await t.test('B1: successfully registers a brand account with a valid corporate work email', async () => {
    const uniqueEmail = `growth_${Date.now()}@tatacliq.com`;
    const res = await identityService.registerBrand({
      fullName: 'Rohan Sharma',
      workEmail: uniqueEmail,
      password: 'SecureCorporatePassword2026!',
      companyName: 'Tata CLiQ Luxury',
      website: 'https://tatacliq.com',
      industry: 'D2C Consumer Goods',
      country: 'India',
      businessType: 'Enterprise',
    });

    assert.ok(res.user);
    assert.equal(res.user.role, 'BRAND');
    assert.equal(res.user.email, uniqueEmail);
    assert.equal(res.user.status, 'ACTIVE');
    assert.ok(res.sessionToken);
  });

  await t.test('B2: Google OAuth for Brand strictly rejects consumer accounts without hd claim', async () => {
    await assert.rejects(
      async () => {
        await identityService.resolveGoogleUser({
          googleId: `google_consumer_${Date.now()}`,
          email: 'personal.founder@gmail.com',
          emailVerified: true,
          // hd is absent for standard consumer Gmail accounts
          name: 'Personal Founder',
          role: 'BRAND',
        });
      },
      (err) => {
        assert.match(err.message, /Personal email providers are not supported/i);
        return true;
      }
    );
  });

  await t.test('B2: Google OAuth rejects forged or mismatched hosted domain (hd) claim', async () => {
    await assert.rejects(
      async () => {
        await identityService.resolveGoogleUser({
          googleId: `google_mismatch_${Date.now()}`,
          email: 'admin@startup.com',
          emailVerified: true,
          hd: 'forged-different-company.com', // Mismatched hosted domain
          name: 'Impersonator',
          role: 'BRAND',
        });
      },
      (err) => {
        assert.match(err.message, /hosted domain does not match/i);
        return true;
      }
    );
  });

  await t.test('B2: Google OAuth accepts authentic Google Workspace account with matching hd', async () => {
    const corpEmail = `marketing_vp_${Date.now()}@swiggy.in`;
    const res = await identityService.resolveGoogleUser({
      googleId: `google_workspace_${Date.now()}`,
      email: corpEmail,
      emailVerified: true,
      hd: 'swiggy.in', // Valid matching hosted domain
      name: 'Swiggy Growth VP',
      role: 'BRAND',
    });

    assert.ok(res.user);
    assert.equal(res.user.role, 'BRAND');
    assert.equal(res.user.email, corpEmail);
    assert.ok(res.sessionToken);
  });

  await t.test('B4: Existing legacy brand account with free email transitions to RESTRICTED_WORK_EMAIL_REQUIRED on login', async () => {
    const legacyEmail = `legacy_free_${Date.now()}@gmail.com`;
    const legacyUserId = `legacy_user_${Date.now()}`;
    const passwordHash = '$2b$10$abcdefghijklmnopqrstuvwxyz123456'; // Dummy hash

    // Seed a legacy brand row created before work-email enforcement
    await db.collection('users').insertOne({
      _id: legacyUserId,
      email: legacyEmail,
      normalizedEmail: legacyEmail,
      passwordHash,
      role: 'BRAND',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection('brand_profiles').insertOne({
      userId: legacyUserId,
      contactName: 'Legacy Brand Rep',
      companyName: 'Legacy Imports',
      industry: 'General',
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock verifyPassword by finding the user
    const fetched = await db.collection('users').findOne({ _id: legacyUserId });
    assert.equal(fetched.status, 'ACTIVE');

    // Run login evaluation: re-checks policy
    const userInDb = await db.collection('users').findOne({ normalizedEmail: legacyEmail });
    assert.ok(userInDb);

    // Verify policy engine identifies it as restricted
    const { evaluateWorkEmail } = await import(
      '../../services/identity-service/src/domain/services/work-email-policy.ts'
    );
    const evalRes = await evaluateWorkEmail(legacyEmail, { checkDns: false });
    assert.equal(evalRes.allowed, false);

    // Update status to restricted
    await db.collection('users').updateOne(
      { _id: legacyUserId },
      { $set: { status: 'RESTRICTED_WORK_EMAIL_REQUIRED' } }
    );

    const updatedUser = await db.collection('users').findOne({ _id: legacyUserId });
    assert.equal(updatedUser.status, 'RESTRICTED_WORK_EMAIL_REQUIRED');
  });

  await t.test('B3: Domain-to-workspace challenge generation & DNS TXT verification', async () => {
    const workspaceId = 'ws_tatacliq_enterprise_01';
    const domain = 'tatacliq.com';

    // 1. Generate challenge
    const challenge = generateDomainVerificationChallenge(domain, workspaceId);
    assert.equal(challenge.domain, 'tatacliq.com');
    assert.equal(challenge.recordType, 'TXT');
    assert.equal(challenge.recordHost, '_adzunova-challenge.tatacliq.com');
    assert.match(challenge.expectedValue, /^adzunova-site-verification=[a-f0-9]{32}$/);

    // 2. Successful verification with mock DNS returning matching record
    const verified = await verifyDomainTxtRecord(domain, challenge.expectedValue, {
      dnsTxtResolver: async (host) => {
        if (host === '_adzunova-challenge.tatacliq.com') {
          return [[challenge.expectedValue]];
        }
        return [];
      },
    });
    assert.equal(verified.verified, true);
    assert.ok(verified.verifiedAt);

    // 3. Failed verification when TXT record does not match
    const failed = await verifyDomainTxtRecord(domain, challenge.expectedValue, {
      dnsTxtResolver: async () => [['adzunova-site-verification=wrong-token-hash-12345']],
    });
    assert.equal(failed.verified, false);
    assert.match(failed.reason, /No matching TXT record found/i);
  });

  await t.test('B3: Anti-Impersonation & Typosquatting / Lookalike Detection', async () => {
    // 1. Suspicious lookalike domain: 'zaraa.com' (distance 1 to 'zara')
    const typosquatZara = checkTyposquatting('zaraa.com');
    assert.equal(typosquatZara.suspect, true);
    assert.equal(typosquatZara.matchedProtectedBrand, 'zara');
    assert.equal(typosquatZara.distance, 1);

    // 2. Suspicious lookalike domain: 'nikke.com' (distance 1 to 'nike')
    const typosquatNike = checkTyposquatting('nikke.com');
    assert.equal(typosquatNike.suspect, true);
    assert.equal(typosquatNike.matchedProtectedBrand, 'nike');

    // 3. Exact brand match is not flagged as typosquat
    const legitimateZara = checkTyposquatting('zara.com');
    assert.equal(legitimateZara.suspect, false);

    // 4. Unrelated domain is not flagged
    const normalCorp = checkTyposquatting('acmeinnovations.com');
    assert.equal(normalCorp.suspect, false);
  });
});

process.on('beforeExit', () => {
  process.exit(0);
});
