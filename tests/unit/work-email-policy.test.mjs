import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateWorkEmail,
  extractRegistrableDomain,
  _resetDnsCache,
} from '../../services/identity-service/src/domain/services/work-email-policy.ts';

// Deterministic mock DNS resolver for unit testing
const mockDnsResolver = async (domain) => {
  if (domain === 'nonexistent-nxdomain-12345.com' || domain === 'no-mx-server.com') {
    return false;
  }
  return true;
};

test('Work Email Policy Engine: Layered Verification & Rule Checks', async (t) => {
  _resetDnsCache();

  await t.test('accepts valid corporate work emails across global and Indian TLDs', async () => {
    const validEmails = [
      'marketing@tatacliq.com',
      'growth@swiggy.in',
      'campaigns@nykaa.com',
      'brand.partnerships@zomato.com',
      'media.buyer@corp.unilever.co.uk',
      'adops@enterprise.acme.com.au',
      'contact@brand.co.in',
    ];

    for (const email of validEmails) {
      const res = await evaluateWorkEmail(email, { dnsResolver: mockDnsResolver });
      assert.equal(res.allowed, true, `Expected ${email} to be allowed`);
      assert.equal(res.reason, 'ALLOWED');
      assert.ok(res.registrableDomain.length > 0);
    }
  });

  await t.test('strictly rejects personal and free consumer email providers', async () => {
    const freeEmails = [
      'achhutanandj@gmail.com',
      'john.doe@googlemail.com',
      'marketer@yahoo.com',
      'lead@yahoo.co.in',
      'sales@yahoo.co.uk',
      'admin@ymail.com',
      'brand@rocketmail.com',
      'contact@outlook.com',
      'agency@hotmail.com',
      'team@live.com',
      'enterprise@msn.com',
      'founder@icloud.com',
      'creator@me.com',
      'buyer@proton.me',
      'sec@protonmail.com',
      'business@rediffmail.com',
      'manager@zoho.com',
      'partner@tutanota.com',
      'agency@fastmail.com',
      'test@mail.com',
      'user@gmx.com',
      'director@yandex.ru',
    ];

    for (const email of freeEmails) {
      const res = await evaluateWorkEmail(email, { checkDns: false });
      assert.equal(res.allowed, false, `Expected ${email} to be rejected`);
      assert.equal(res.reason, 'FREE_EMAIL_NOT_ALLOWED');
      assert.match(res.errorMessage, /Personal email providers are not supported/i);
    }
  });

  await t.test('catches free email providers on subdomains via registrable domain resolution', async () => {
    const subdomains = [
      'user@mail.gmail.com',
      'john@corp.yahoo.co.in',
      'sarah@vip.hotmail.com',
      'test@sub.proton.me',
    ];

    for (const email of subdomains) {
      const res = await evaluateWorkEmail(email, { checkDns: false });
      assert.equal(res.allowed, false, `Expected subdomain ${email} to be caught`);
      assert.equal(res.reason, 'FREE_EMAIL_NOT_ALLOWED');
    }
  });

  await t.test('strictly rejects disposable and temporary email addresses', async () => {
    const disposable = [
      'test@tempmail.com',
      'spammer@mailinator.com',
      'throwaway@10minutemail.com',
      'bot@guerrillamail.com',
      'temp@yopmail.com',
      'fake@sharklasers.com',
      'junk@trashmail.com',
    ];

    for (const email of disposable) {
      const res = await evaluateWorkEmail(email, { checkDns: false });
      assert.equal(res.allowed, false, `Expected disposable ${email} to be rejected`);
      assert.equal(res.reason, 'DISPOSABLE_EMAIL');
      assert.match(res.errorMessage, /Temporary and disposable/i);
    }
  });

  await t.test('handles plus-addressing: preserves normalized form and computes canonical form', async () => {
    const res = await evaluateWorkEmail('acme.corp+marketing_q4@nike.com', { dnsResolver: mockDnsResolver });
    assert.equal(res.allowed, true);
    assert.equal(res.normalized, 'acme.corp+marketing_q4@nike.com');
    assert.equal(res.canonical, 'acme.corp@nike.com');
    assert.equal(res.domain, 'nike.com');
    assert.equal(res.registrableDomain, 'nike.com');
  });

  await t.test('resolves multi-part Public Suffix List (PSL) domains accurately', async () => {
    assert.equal(extractRegistrableDomain('mail.corp.company.co.in'), 'company.co.in');
    assert.equal(extractRegistrableDomain('ads.agency.com.au'), 'agency.com.au');
    assert.equal(extractRegistrableDomain('sub.acme.co.uk'), 'acme.co.uk');
    assert.equal(extractRegistrableDomain('east.branch.business.org.nz'), 'business.org.nz');
    assert.equal(extractRegistrableDomain('staging.portal.acme.com'), 'acme.com');
    assert.equal(extractRegistrableDomain('startup.io'), 'startup.io');
  });

  await t.test('detects and rejects IDN homograph attacks and mixed-script spoofing', async () => {
    // Contains Cyrillic 'о' (U+043E) instead of Latin 'o'
    const spoofedEmail = 'admin@gооgle.com';
    const res = await evaluateWorkEmail(spoofedEmail, { checkDns: false });
    assert.equal(res.allowed, false);
    assert.equal(res.reason, 'INVALID_DOMAIN');
    assert.match(res.errorMessage, /Invalid domain script/i);

    // Punycode domain
    const punycodeEmail = 'ceo@xn--e1afmkfd.xn--p1ai';
    const resPuny = await evaluateWorkEmail(punycodeEmail, { checkDns: false });
    assert.equal(resPuny.allowed, false);
    assert.equal(resPuny.reason, 'INVALID_DOMAIN');
  });

  await t.test('rejects domains with missing MX / A records when DNS validation is active', async () => {
    const res = await evaluateWorkEmail('partner@no-mx-server.com', { dnsResolver: mockDnsResolver });
    assert.equal(res.allowed, false);
    assert.equal(res.reason, 'NO_MX');
    assert.match(res.errorMessage, /Unable to verify corporate email domain/i);
  });

  await t.test('respects documented admin-approved exceptions for partner/demo accounts', async () => {
    // Normal personal email is rejected
    const normal = await evaluateWorkEmail('demo.partner@gmail.com', { checkDns: false });
    assert.equal(normal.allowed, false);
    assert.equal(normal.reason, 'FREE_EMAIL_NOT_ALLOWED');

    // With explicit allowedExceptions
    const allowed = await evaluateWorkEmail('demo.partner@gmail.com', {
      checkDns: false,
      allowedExceptions: ['demo.partner@gmail.com'],
    });
    assert.equal(allowed.allowed, true);
    assert.equal(allowed.reason, 'ALLOWED');
  });

  await t.test('strips display names and normalizes whitespace and unicode NFKC', async () => {
    const raw = '  "Acme Corporation" <MARKETING@ACME.COM>  ';
    const res = await evaluateWorkEmail(raw, { dnsResolver: mockDnsResolver });
    assert.equal(res.allowed, true);
    assert.equal(res.normalized, 'marketing@acme.com');
    assert.equal(res.canonical, 'marketing@acme.com');
  });
});
