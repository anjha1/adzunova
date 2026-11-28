export type DataClass = 'public' | 'internal' | 'confidential' | 'restricted';
export type BucketType = 'public' | 'private' | 'quarantine' | 'exports';
export type AuditLevel = 'NONE' | 'STANDARD' | 'STRICT_IMMUTABLE';
export type ScanPolicy = 'REQUIRED_IMAGE_REENCODE' | 'REQUIRED_MALWARE_SCAN' | 'NONE_INTERNAL_EXPORT';

export type StoragePurpose =
  | 'creator_avatar'
  | 'creator_cover'
  | 'brand_logo'
  | 'public_media_kit_thumb'
  | 'creator_media_kit_pdf'
  | 'campaign_deliverable_draft'
  | 'contract_pdf'
  | 'invoice_pdf'
  | 'kyc_pan_document'
  | 'kyc_gst_document'
  | 'dispute_evidence'
  | 'async_export';

export interface ClassificationPolicy {
  purpose: StoragePurpose;
  dataClass: DataClass;
  targetBucket: BucketType;
  encryption: 'R2_AES256_GCM';
  retentionDays: number | null; // null = retained while linked
  maxAccessTtlSeconds: number;  // 0 = public CDN (no presign)
  auditLevel: AuditLevel;
  scanPolicy: ScanPolicy;
}

export const DATA_CLASSIFICATION_REGISTRY: Record<StoragePurpose, ClassificationPolicy> = {
  creator_avatar: {
    purpose: 'creator_avatar',
    dataClass: 'public',
    targetBucket: 'public',
    encryption: 'R2_AES256_GCM',
    retentionDays: null,
    maxAccessTtlSeconds: 0,
    auditLevel: 'STANDARD',
    scanPolicy: 'REQUIRED_IMAGE_REENCODE',
  },
  creator_cover: {
    purpose: 'creator_cover',
    dataClass: 'public',
    targetBucket: 'public',
    encryption: 'R2_AES256_GCM',
    retentionDays: null,
    maxAccessTtlSeconds: 0,
    auditLevel: 'STANDARD',
    scanPolicy: 'REQUIRED_IMAGE_REENCODE',
  },
  brand_logo: {
    purpose: 'brand_logo',
    dataClass: 'public',
    targetBucket: 'public',
    encryption: 'R2_AES256_GCM',
    retentionDays: null,
    maxAccessTtlSeconds: 0,
    auditLevel: 'STANDARD',
    scanPolicy: 'REQUIRED_IMAGE_REENCODE',
  },
  public_media_kit_thumb: {
    purpose: 'public_media_kit_thumb',
    dataClass: 'public',
    targetBucket: 'public',
    encryption: 'R2_AES256_GCM',
    retentionDays: null,
    maxAccessTtlSeconds: 0,
    auditLevel: 'STANDARD',
    scanPolicy: 'REQUIRED_IMAGE_REENCODE',
  },
  creator_media_kit_pdf: {
    purpose: 'creator_media_kit_pdf',
    dataClass: 'internal',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 365,
    maxAccessTtlSeconds: 300,
    auditLevel: 'STANDARD',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  campaign_deliverable_draft: {
    purpose: 'campaign_deliverable_draft',
    dataClass: 'internal',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 365,
    maxAccessTtlSeconds: 300,
    auditLevel: 'STANDARD',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  contract_pdf: {
    purpose: 'contract_pdf',
    dataClass: 'confidential',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 2555, // 7 years statutory
    maxAccessTtlSeconds: 180,
    auditLevel: 'STRICT_IMMUTABLE',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  invoice_pdf: {
    purpose: 'invoice_pdf',
    dataClass: 'confidential',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 2920, // 8 years tax retention
    maxAccessTtlSeconds: 180,
    auditLevel: 'STRICT_IMMUTABLE',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  kyc_pan_document: {
    purpose: 'kyc_pan_document',
    dataClass: 'restricted',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 2555,
    maxAccessTtlSeconds: 60,
    auditLevel: 'STRICT_IMMUTABLE',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  kyc_gst_document: {
    purpose: 'kyc_gst_document',
    dataClass: 'restricted',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 2555,
    maxAccessTtlSeconds: 60,
    auditLevel: 'STRICT_IMMUTABLE',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  dispute_evidence: {
    purpose: 'dispute_evidence',
    dataClass: 'confidential',
    targetBucket: 'private',
    encryption: 'R2_AES256_GCM',
    retentionDays: 1825,
    maxAccessTtlSeconds: 180,
    auditLevel: 'STRICT_IMMUTABLE',
    scanPolicy: 'REQUIRED_MALWARE_SCAN',
  },
  async_export: {
    purpose: 'async_export',
    dataClass: 'confidential',
    targetBucket: 'exports',
    encryption: 'R2_AES256_GCM',
    retentionDays: 7,
    maxAccessTtlSeconds: 300,
    auditLevel: 'STANDARD',
    scanPolicy: 'NONE_INTERNAL_EXPORT',
  },
};

export function getClassificationPolicy(purpose: StoragePurpose): ClassificationPolicy {
  const policy = DATA_CLASSIFICATION_REGISTRY[purpose];
  if (!policy) {
    throw new Error(`Unmapped storage purpose: ${String(purpose)}`);
  }
  return policy;
}

export function assertValidClassificationRegistry(
  registry: Record<string, ClassificationPolicy> = DATA_CLASSIFICATION_REGISTRY
): void {
  for (const [key, policy] of Object.entries(registry)) {
    if (policy.purpose !== key) {
      throw new Error(`Registry mismatch for key ${key}`);
    }
    if ((policy.dataClass === 'confidential' || policy.dataClass === 'restricted') && policy.targetBucket === 'public') {
      throw new Error(`SECURITY VIOLATION: ${policy.dataClass} purpose "${key}" cannot map to public bucket`);
    }
    if (policy.dataClass === 'public' && policy.targetBucket !== 'public') {
      throw new Error(`Invalid public purpose "${key}" bucket: ${policy.targetBucket}`);
    }
  }
}
