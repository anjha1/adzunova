/**
 * Adzunova — Domain Policy Rules & Syntax Engine (Browser & Edge Safe)
 *
 * Pure validation logic without Node.js native dependencies.
 * Safe for Client Components, SSR, Server Components, and Edge Workers.
 */

export type WorkEmailReasonCode =
  | 'ALLOWED'
  | 'FREE_EMAIL_NOT_ALLOWED'
  | 'DISPOSABLE_EMAIL'
  | 'INVALID_DOMAIN'
  | 'NO_MX'
  | 'EMAIL_NOT_VERIFIED'
  | 'DOMAIN_BLOCKED';

export interface WorkEmailEvaluation {
  allowed: boolean;
  reason: WorkEmailReasonCode;
  errorMessage?: string;
  normalized: string;
  canonical: string;
  domain: string;
  registrableDomain: string;
}

/**
 * Standard Multi-part Public Suffixes (PSL subset for corporate registrable domain resolution)
 */
export const KNOWN_TWO_PART_SUFFIXES = new Set([
  'co.in',
  'net.in',
  'org.in',
  'gen.in',
  'firm.in',
  'ind.in',
  'ac.in',
  'edu.in',
  'res.in',
  'gov.in',
  'mil.in',
  'co.uk',
  'org.uk',
  'me.uk',
  'ltd.uk',
  'plc.uk',
  'net.uk',
  'sch.uk',
  'com.au',
  'net.au',
  'org.au',
  'edu.au',
  'gov.au',
  'co.nz',
  'net.nz',
  'org.nz',
  'govt.nz',
  'co.za',
  'org.za',
  'net.za',
  'com.br',
  'net.br',
  'org.br',
  'com.mx',
  'org.mx',
  'edu.mx',
  'com.sg',
  'edu.sg',
  'gov.sg',
  'com.my',
  'org.my',
  'edu.my',
  'com.ph',
  'org.ph',
  'edu.ph',
  'com.hk',
  'org.hk',
  'edu.hk',
  'com.tw',
  'org.tw',
  'co.jp',
  'ne.jp',
  'or.jp',
  'ac.jp',
  'co.kr',
  'ne.kr',
  'or.kr',
  're.kr',
  'com.cn',
  'net.cn',
  'org.cn',
  'gov.cn',
  'com.tr',
  'net.tr',
  'org.tr',
  'com.ar',
  'com.co',
  'com.pe',
  'com.ve',
  'com.pk',
  'com.bd',
  'com.ng',
  'com.eg',
  'co.id',
  'co.th',
  'co.il',
  'co.za',
]);

/**
 * Comprehensive Free Consumer Email Providers Blocklist
 */
export const FREE_EMAIL_DOMAINS = new Set([
  // Google
  'gmail.com',
  'googlemail.com',

  // Yahoo & Variants
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.com.au',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'yahoo.it',
  'yahoo.co.jp',
  'yahoo.com.br',
  'yahoo.com.mx',
  'yahoo.com.sg',
  'yahoo.com.hk',
  'yahoo.com.tw',
  'yahoo.com.ph',
  'yahoo.com.my',
  'yahoo.com.ar',
  'yahoo.com.co',
  'yahoo.co.nz',
  'yahoo.co.th',
  'yahoo.co.za',
  'ymail.com',
  'rocketmail.com',

  // Microsoft
  'outlook.com',
  'outlook.in',
  'outlook.co.uk',
  'outlook.fr',
  'outlook.de',
  'outlook.es',
  'outlook.it',
  'outlook.jp',
  'hotmail.com',
  'hotmail.co.in',
  'hotmail.co.uk',
  'hotmail.fr',
  'hotmail.de',
  'hotmail.es',
  'hotmail.it',
  'live.com',
  'live.co.in',
  'live.co.uk',
  'live.fr',
  'live.de',
  'live.com.au',
  'msn.com',
  'passport.com',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // AOL
  'aol.com',
  'aim.com',

  // Proton
  'proton.me',
  'protonmail.com',
  'pm.me',

  // Indian consumer portals
  'rediffmail.com',
  'rediff.com',

  // Mail.com & GMX
  'mail.com',
  'email.com',
  'usa.com',
  'post.com',
  'dr.com',
  'consultant.com',
  'myself.com',
  'europe.com',
  'asia.com',
  'gmx.com',
  'gmx.net',
  'gmx.de',
  'gmx.at',
  'gmx.ch',

  // Yandex
  'yandex.com',
  'yandex.ru',
  'yandex.by',
  'yandex.kz',
  'yandex.ua',
  'ya.ru',

  // Zoho consumer
  'zoho.com',
  'zohomail.com',

  // Tutanota / Tuta
  'tutanota.com',
  'tutanota.de',
  'tuta.com',
  'tuta.io',
  'keemail.me',

  // Fastmail consumer
  'fastmail.com',
  'fastmail.fm',
  'messagingengine.com',

  // International consumer webmail
  'web.de',
  'freenet.de',
  't-online.de',
  'laposte.net',
  'orange.fr',
  'wanadoo.fr',
  'sfr.fr',
  'free.fr',
  'libero.it',
  'virgilio.it',
  'tiscali.it',
  'bol.com.br',
  'uol.com.br',
  'ig.com.br',
  'terra.com.br',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'sohu.com',
  'inbox.com',
  'lycos.com',
  'excite.com',
]);

/**
 * Known Disposable / Temporary Email Domains
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'mailinator.com',
  'throwawaymail.com',
  'yopmail.com',
  'dispostable.com',
  'getairmail.com',
  'sharklasers.com',
  'grr.la',
  'inboxkitten.com',
  'trashmail.com',
  'trashmail.net',
  'crazymailing.com',
  'fakemailgenerator.com',
  'dropmail.me',
  'mohmal.com',
  'nada.ltd',
  'temp-mail.org',
  'burnermail.io',
  'generator.email',
  'emailondeck.com',
  'mytemp.email',
  'tempail.com',
  'trashmail.me',
  'anonymbox.com',
  'spambog.com',
  'mailnesia.com',
  'fakemail.net',
  'disposablemail.com',
  'temp-mail.io',
]);

/**
 * Extracts registrable domain from full domain using Public Suffix logic
 * e.g., "mail.corp.company.co.in" -> "company.co.in"
 *       "sub.acme.com" -> "acme.com"
 */
export function extractRegistrableDomain(domain: string): string {
  const parts = domain.toLowerCase().trim().split('.');
  if (parts.length <= 2) {
    return domain.toLowerCase().trim();
  }

  // Check two-part suffix (e.g. co.in, com.au)
  const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  if (KNOWN_TWO_PART_SUFFIXES.has(lastTwo)) {
    if (parts.length >= 3) {
      return `${parts[parts.length - 3]}.${lastTwo}`;
    }
    return domain;
  }

  // Standard single TLD (e.g. .com, .org, .io)
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

/**
 * Validates domain against IDN homograph attacks and punycode spoofing.
 */
export function hasHomographSpoofing(domain: string): boolean {
  if (domain.startsWith('xn--') || domain.includes('.xn--')) {
    return true;
  }

  const cyrillicPattern = /[\u0400-\u04FF]/;
  const greekPattern = /[\u0370-\u03FF]/;
  const latinPattern = /[a-zA-Z]/;

  const hasCyrillic = cyrillicPattern.test(domain);
  const hasGreek = greekPattern.test(domain);
  const hasLatin = latinPattern.test(domain);

  if ((hasCyrillic && hasLatin) || (hasGreek && hasLatin)) {
    return true;
  }

  const nonAscii = /[^\x20-\x7E]/;
  if (nonAscii.test(domain)) {
    return true;
  }

  return false;
}

/**
 * Evaluates work email rules synchronously/purely without native DNS
 */
export function evaluateWorkEmailRules(
  rawEmail: string,
  options: { allowedExceptions?: string[] } = {}
): WorkEmailEvaluation {
  const { allowedExceptions = [] } = options;

  if (!rawEmail || typeof rawEmail !== 'string') {
    return {
      allowed: false,
      reason: 'INVALID_DOMAIN',
      errorMessage: 'Please enter a valid company email address.',
      normalized: '',
      canonical: '',
      domain: '',
      registrableDomain: '',
    };
  }

  let email = rawEmail.trim().normalize('NFKC');

  const angleMatch = email.match(/<([^>]+)>/);
  if (angleMatch) {
    email = angleMatch[1].trim();
  }

  email = email.toLowerCase();

  const atCount = (email.match(/@/g) || []).length;
  if (atCount !== 1) {
    return {
      allowed: false,
      reason: 'INVALID_DOMAIN',
      errorMessage: 'Invalid email format. Please provide a single valid email address.',
      normalized: email,
      canonical: email,
      domain: '',
      registrableDomain: '',
    };
  }

  const [localPart, domain] = email.split('@');

  if (!localPart || !domain || domain.length < 3 || !domain.includes('.')) {
    return {
      allowed: false,
      reason: 'INVALID_DOMAIN',
      errorMessage: 'Please enter a valid company email address with a corporate domain.',
      normalized: email,
      canonical: email,
      domain: domain || '',
      registrableDomain: '',
    };
  }

  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localPartRegex.test(localPart)) {
    return {
      allowed: false,
      reason: 'INVALID_DOMAIN',
      errorMessage: 'Email username contains invalid characters.',
      normalized: email,
      canonical: email,
      domain,
      registrableDomain: '',
    };
  }

  const baseLocal = localPart.split('+')[0];
  const canonical = `${baseLocal}@${domain}`;
  const normalized = `${localPart}@${domain}`;

  if (hasHomographSpoofing(domain)) {
    return {
      allowed: false,
      reason: 'INVALID_DOMAIN',
      errorMessage: 'Invalid domain script or unauthorized internationalized characters detected.',
      normalized,
      canonical,
      domain,
      registrableDomain: '',
    };
  }

  const registrableDomain = extractRegistrableDomain(domain);

  if (allowedExceptions.length > 0) {
    const isException =
      allowedExceptions.includes(normalized) ||
      allowedExceptions.includes(canonical) ||
      allowedExceptions.includes(domain) ||
      allowedExceptions.includes(registrableDomain);

    if (isException) {
      return {
        allowed: true,
        reason: 'ALLOWED',
        normalized,
        canonical,
        domain,
        registrableDomain,
      };
    }
  }

  if (FREE_EMAIL_DOMAINS.has(domain) || FREE_EMAIL_DOMAINS.has(registrableDomain)) {
    return {
      allowed: false,
      reason: 'FREE_EMAIL_NOT_ALLOWED',
      errorMessage:
        'Please use your company email address (for example name@yourcompany.com). Personal email providers are not supported for brand accounts.',
      normalized,
      canonical,
      domain,
      registrableDomain,
    };
  }

  if (
    domain.startsWith('yahoo.') ||
    registrableDomain.startsWith('yahoo.') ||
    domain.startsWith('hotmail.') ||
    registrableDomain.startsWith('hotmail.') ||
    domain.startsWith('live.') ||
    registrableDomain.startsWith('live.') ||
    domain.startsWith('outlook.') ||
    registrableDomain.startsWith('outlook.')
  ) {
    return {
      allowed: false,
      reason: 'FREE_EMAIL_NOT_ALLOWED',
      errorMessage:
        'Please use your company email address (for example name@yourcompany.com). Personal email providers are not supported for brand accounts.',
      normalized,
      canonical,
      domain,
      registrableDomain,
    };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain) || DISPOSABLE_EMAIL_DOMAINS.has(registrableDomain)) {
    return {
      allowed: false,
      reason: 'DISPOSABLE_EMAIL',
      errorMessage:
        'Temporary and disposable email addresses are not permitted. Please use your official corporate email address.',
      normalized,
      canonical,
      domain,
      registrableDomain,
    };
  }

  return {
    allowed: true,
    reason: 'ALLOWED',
    normalized,
    canonical,
    domain,
    registrableDomain,
  };
}
