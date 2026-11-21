/**
 * Indian Statutory Identifier Rules & Checksums Engine (GSTIN, PAN, CIN)
 * Pure, browser & edge safe — zero external dependencies.
 */

// ---------------------------------------------------------------------------
// 1. Indian State Codes Mapping (GSTIN first 2 digits)
// ---------------------------------------------------------------------------
export const INDIAN_GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
  '99': 'Centre Jurisdiction',
};

// ---------------------------------------------------------------------------
// 2. PAN (Permanent Account Number) Validation
// ---------------------------------------------------------------------------
export const PAN_ENTITY_TYPES: Record<string, string> = {
  C: 'Company',
  P: 'Individual / Proprietorship',
  H: 'Hindu Undivided Family (HUF)',
  F: 'Firm / LLP',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government',
};

export interface PanValidationResult {
  valid: boolean;
  pan: string;
  entityType?: string;
  entityCode?: string;
  error?: string;
}

export function validatePan(rawPan: string | null | undefined): PanValidationResult {
  if (!rawPan) {
    return { valid: false, pan: '', error: 'PAN is required.' };
  }

  const pan = rawPan.trim().toUpperCase();

  // Pattern: 5 letters, 4 digits, 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan)) {
    return {
      valid: false,
      pan,
      error: 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).',
    };
  }

  const entityCode = pan[3];
  const entityType = PAN_ENTITY_TYPES[entityCode] || 'Unknown Entity';

  return {
    valid: true,
    pan,
    entityCode,
    entityType,
  };
}

// ---------------------------------------------------------------------------
// 3. GSTIN (Goods and Services Tax Identification Number) Validation
// ---------------------------------------------------------------------------
// Luhn mod 36 character map
const GST_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Calculates the 15th checksum character of a 14-character GSTIN prefix using
 * the official Luhn Modulo 36 algorithm specified by GSTN India.
 */
export function calculateGstinChecksum(gstin14: string): string {
  if (gstin14.length < 14) return '';

  let factor = 1;
  let sum = 0;
  const mod = 36;

  for (let i = 0; i < 14; i++) {
    const char = gstin14[i].toUpperCase();
    const codePoint = GST_CHARS.indexOf(char);
    if (codePoint === -1) return '';

    factor = (i % 2 === 0) ? 1 : 2;
    const product = codePoint * factor;
    const quotient = Math.floor(product / mod);
    const remainder = product % mod;
    sum += quotient + remainder;
  }

  const remainder = sum % mod;
  const checkCodePoint = (mod - remainder) % mod;
  return GST_CHARS[checkCodePoint];
}

export interface GstinValidationResult {
  valid: boolean;
  gstin: string;
  stateCode?: string;
  stateName?: string;
  extractedPan?: string;
  checksumValid?: boolean;
  expectedChecksum?: string;
  error?: string;
}

export function validateGstin(rawGstin: string | null | undefined): GstinValidationResult {
  if (!rawGstin) {
    return { valid: false, gstin: '', error: 'GSTIN is required.' };
  }

  const gstin = rawGstin.trim().toUpperCase();

  // Pattern: 2 digits, 10-char PAN, 1 alphanumeric entity num, 'Z', 1 checksum char
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(gstin)) {
    return {
      valid: false,
      gstin,
      error: 'Invalid GSTIN format. Must be 15 characters matching state code + PAN + entity + Z + checksum.',
    };
  }

  const stateCode = gstin.substring(0, 2);
  const stateName = INDIAN_GST_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      valid: false,
      gstin,
      error: `Invalid state code "${stateCode}". Must be a valid Indian state code (01-38, 97, 99).`,
    };
  }

  const extractedPan = gstin.substring(2, 12);
  const panValidation = validatePan(extractedPan);
  if (!panValidation.valid) {
    return {
      valid: false,
      gstin,
      error: `Invalid PAN embedded in GSTIN: ${panValidation.error}`,
    };
  }

  // Verify Luhn mod 36 checksum
  const expectedChecksum = calculateGstinChecksum(gstin.substring(0, 14));
  const actualChecksum = gstin[14];
  const checksumValid = expectedChecksum === actualChecksum;

  if (!checksumValid) {
    return {
      valid: false,
      gstin,
      stateCode,
      stateName,
      extractedPan,
      checksumValid: false,
      expectedChecksum,
      error: `GSTIN checksum mismatch. Calculated "${expectedChecksum}", found "${actualChecksum}".`,
    };
  }

  return {
    valid: true,
    gstin,
    stateCode,
    stateName,
    extractedPan,
    checksumValid: true,
    expectedChecksum,
  };
}

// ---------------------------------------------------------------------------
// 4. CIN (Corporate Identification Number) Validation
// ---------------------------------------------------------------------------
export interface CinValidationResult {
  valid: boolean;
  cin: string;
  listingStatus?: 'LISTED' | 'UNLISTED';
  industryCode?: string;
  stateCode?: string;
  incorporationYear?: number;
  companyClassification?: string;
  registrationNumber?: string;
  error?: string;
}

export function validateCin(rawCin: string | null | undefined): CinValidationResult {
  if (!rawCin) {
    return { valid: false, cin: '', error: 'CIN is required.' };
  }

  const cin = rawCin.trim().toUpperCase();

  // Pattern: [L|U] + 5-digit industry + 2-letter state + 4-digit year + 3-letter type + 6-digit number
  const cinRegex = /^([LU]{1})([0-9]{5})([A-Z]{2})([0-9]{4})([A-Z]{3})([0-9]{6})$/;
  const match = cin.match(cinRegex);

  if (!match) {
    return {
      valid: false,
      cin,
      error: 'Invalid CIN format. Must be 21 characters (e.g. U74999MH2018PTC123456).',
    };
  }

  const [, listingChar, industryCode, stateCode, yearStr, companyClassification, registrationNumber] = match;
  const incorporationYear = parseInt(yearStr, 10);
  const currentYear = new Date().getFullYear();

  if (incorporationYear < 1850 || incorporationYear > currentYear) {
    return {
      valid: false,
      cin,
      error: `Invalid incorporation year "${yearStr}" in CIN.`,
    };
  }

  return {
    valid: true,
    cin,
    listingStatus: listingChar === 'L' ? 'LISTED' : 'UNLISTED',
    industryCode,
    stateCode,
    incorporationYear,
    companyClassification,
    registrationNumber,
  };
}

// ---------------------------------------------------------------------------
// 5. Cross-Identifier Consistency Validation
// ---------------------------------------------------------------------------
export interface CrossIdentifierResult {
  consistent: boolean;
  error?: string;
  pan?: string;
  gstin?: string;
  cin?: string;
}

export function checkStatutoryConsistency({
  pan,
  gstin,
}: {
  pan?: string | null;
  gstin?: string | null;
}): CrossIdentifierResult {
  if (pan && gstin) {
    const cleanPan = pan.trim().toUpperCase();
    const cleanGstin = gstin.trim().toUpperCase();

    if (cleanGstin.length >= 12) {
      const gstinPan = cleanGstin.substring(2, 12);
      if (gstinPan !== cleanPan) {
        return {
          consistent: false,
          error: `GSTIN PAN (${gstinPan}) does not match the provided business PAN (${cleanPan}).`,
          pan: cleanPan,
          gstin: cleanGstin,
        };
      }
    }
  }

  return {
    consistent: true,
    pan: pan?.trim().toUpperCase(),
    gstin: gstin?.trim().toUpperCase(),
  };
}
