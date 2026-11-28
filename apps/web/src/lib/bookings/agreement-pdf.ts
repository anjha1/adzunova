import crypto from 'node:crypto';
import type { BookingRecord } from '@adzunova/payments-db';
import { AGREEMENT_TEMPLATE_VERSION } from '@adzunova/payments-db';

export interface AgreementTermsSnapshot {
  bookingId: string;
  bookingVersion: number;
  agreementVersion: number;
  templateVersion: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  itemKind: 'RATE_CARD_ITEM' | 'PACKAGE';
  itemTitle: string;
  pricingType: 'FIXED' | 'NEGOTIABLE';
  quantity: number;
  selectedAddons: string[];
  deliveryDate: string;
  revisionLimit: number | null;
  usageRights: string;
  feeConfigVersion: string;
  rateCardItemVersion: number;
  quoteSnapshot: Record<string, unknown>;
  briefExcerpt: string;
  legalApprovalPendingClauses: string[];
}

export const LEGAL_APPROVAL_PENDING_CLAUSES = [
  'Governing law, arbitration seat, and dispute jurisdiction (pending legal counsel sign-off)',
  'Usage rights duration, territory, and paid-media whitelisting scope (pending owner/legal sign-off)',
  'Cancellation & kill-fee schedule after ACCEPTED/SIGNED (pending owner/legal sign-off)',
  'Approved E-Sign method: Aadhaar eSign vs OTP-based e-sign provider selection (pending owner approval)',
];

export function buildAgreementTermsSnapshot(
  booking: BookingRecord,
  agreementVersion: number,
  opts?: { revisionLimit?: number | null; usageRights?: string }
): AgreementTermsSnapshot {
  const addons = Array.isArray(booking.selectedAddons) ? booking.selectedAddons : [];
  const usageRights =
    opts?.usageRights ??
    (addons.includes('USAGE_RIGHTS') || addons.includes('PAID_ADS_LICENSE')
      ? 'Commercial usage & paid promotion rights as selected in add-ons (exact term pending legal sign-off)'
      : 'Organic brand reposting rights on owned channels (exact term pending legal sign-off)');

  return {
    bookingId: booking.bookingId,
    bookingVersion: booking.version,
    agreementVersion,
    templateVersion: AGREEMENT_TEMPLATE_VERSION,
    brandId: booking.brandId,
    brandName: booking.brandName,
    creatorId: booking.creatorId,
    creatorName: booking.creatorName,
    itemKind: booking.itemKind,
    itemTitle: booking.itemTitle,
    pricingType: booking.pricingType,
    quantity: booking.quantity,
    selectedAddons: addons,
    deliveryDate: booking.deliveryDate,
    revisionLimit: opts?.revisionLimit ?? null,
    usageRights,
    feeConfigVersion: booking.feeConfigVersion,
    rateCardItemVersion: booking.rateCardItemVersion,
    quoteSnapshot: booking.quoteSnapshot,
    briefExcerpt: (booking.brief || '').slice(0, 280),
    legalApprovalPendingClauses: [...LEGAL_APPROVAL_PENDING_CLAUSES],
  };
}

function escapePdfText(input: string): string {
  return input
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapLine(text: string, maxChars = 84): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if (cur.length + 1 + w.length <= maxChars) {
      cur += ` ${w}`;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length > 0 ? lines : [''];
}

function readQuoteField(snapshot: Record<string, unknown>, key: string): string {
  const breakdown = snapshot.breakdown as Record<string, unknown> | undefined;
  const val = breakdown?.[key] ?? snapshot[key];
  if (typeof val === 'number') return `INR ${val.toLocaleString('en-IN')}`;
  if (typeof val === 'string' && val.trim()) return val;
  return 'Not provided';
}

export function generateAgreementPdfBuffer(params: {
  agreementId: string;
  terms: AgreementTermsSnapshot;
  generatedAtIso: string;
}): { pdfBuffer: Buffer; sha256: string; sizeBytes: number } {
  const { agreementId, terms, generatedAtIso } = params;
  const rawLines: string[] = [
    'ADZUNOVA CREATOR-BRAND COLLABORATION AGREEMENT',
    `Agreement ID: ${agreementId} | Document Version: v${terms.agreementVersion} | Template: ${terms.templateVersion}`,
    `Booking ID: ${terms.bookingId} (Accepted Version: v${terms.bookingVersion}) | Generated: ${generatedAtIso}`,
    '------------------------------------------------------------------------------------',
    `BRAND PARTY: ${terms.brandName} (ID: ${terms.brandId})`,
    `CREATOR PARTY: ${terms.creatorName} (ID: ${terms.creatorId})`,
    '------------------------------------------------------------------------------------',
    '1. ACCEPTED DELIVERABLES & COMMERCIAL TERMS',
    `Deliverable / Package: ${terms.itemTitle} (${terms.itemKind}, ${terms.pricingType})`,
    `Quantity: ${terms.quantity} | Target Delivery Date: ${terms.deliveryDate}`,
    `Selected Add-ons: ${terms.selectedAddons.length > 0 ? terms.selectedAddons.join(', ') : 'None'}`,
    `Revision Limit: ${terms.revisionLimit !== null ? String(terms.revisionLimit) : 'Per rate-card / creator terms'}`,
    `Usage Rights: ${terms.usageRights}`,
    `Fee Config Version: ${terms.feeConfigVersion} | Rate Card Version: v${terms.rateCardItemVersion}`,
    '------------------------------------------------------------------------------------',
    '2. SNAPSHOT QUOTE BREAKDOWN (IMMUTABLE)',
    `Base Price: ${readQuoteField(terms.quoteSnapshot, 'basePrice')} | Add-ons: ${readQuoteField(terms.quoteSnapshot, 'addonsTotal')}`,
    `Brand Platform Fee: ${readQuoteField(terms.quoteSnapshot, 'brandFeeAmount')} | GST: ${readQuoteField(terms.quoteSnapshot, 'gstAmount')}`,
    `Total Brand Payable: ${readQuoteField(terms.quoteSnapshot, 'totalBrandPayable')} | Creator Net Payout: ${readQuoteField(terms.quoteSnapshot, 'creatorNetPayout')}`,
    '------------------------------------------------------------------------------------',
    '3. BRIEF SUMMARY',
    ...wrapLine(terms.briefExcerpt || 'Not provided'),
    '------------------------------------------------------------------------------------',
    '4. STANDARD CLAUSES & ITEMS PENDING LEGAL / OWNER SIGN-OFF',
    '- Both parties must e-sign this exact document version before payment or work start.',
    '- Any modification requires a replacement agreement version and fresh signatures from both.',
    ...terms.legalApprovalPendingClauses.flatMap((c) => wrapLine(`- [PENDING SIGN-OFF] ${c}`)),
  ];

  const streamOps: string[] = ['BT', '/F1 9 Tf', '42 756 Td', '13 TL'];
  for (const line of rawLines.slice(0, 52)) {
    streamOps.push(`(${escapePdfText(line)}) Tj T*`);
  }
  streamOps.push('ET');
  const contentStream = streamOps.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const pdfBuffer = Buffer.from(pdf, 'utf8');
  const sha256 = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
  return {
    pdfBuffer,
    sha256,
    sizeBytes: pdfBuffer.length,
  };
}
