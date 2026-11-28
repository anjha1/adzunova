/**
 * Reusable Storage CI Guard Rules (S0–S12).
 * Audited against non-test source files and verified by unit tests with intentionally bad snippets.
 */

const R2_DEV_REGEX = /\.r2\.dev\b/i;
const CLIENT_SECRET_OR_PRIVATE_BUCKET_REGEX =
  /\b(R2_SECRET_ACCESS_KEY|R2_ACCESS_KEY_ID|private-vault|ingest-quarantine|exports-temp)\b/;
const PRIVATE_DATA_TO_PUBLIC_BUCKET_REGEX =
  /(public-assets|R2_PUBLIC_BUCKET_NAME)[^\n]*(kyc|pan\b|gst\b|invoice|contract)|(kyc|pan\b|gst\b|invoice|contract)[^\n]*(public-assets|R2_PUBLIC_BUCKET_NAME)/i;
const HARDCODED_BUCKET_OR_HOST_REGEX =
  /['"`](public-assets|private-vault|ingest-quarantine|exports-temp|https?:\/\/cdn\.adzunova\.tech)['"`]/i;
const FORBIDDEN_CLAIMS_REGEX = /\b(virus-free|100% secure|AES-256 encrypted)\b/i;
const LOGGING_PRESIGNED_OR_KEY_REGEX =
  /console\.(log|warn|error|info|debug)\([^\n]*(presignedUrl|signedUrl|R2_SECRET_ACCESS_KEY|R2_ACCESS_KEY_ID|X-Amz-Signature)/i;
const FLOAT_ARITHMETIC_STORAGE_REGEX =
  /(\b\w*(bytes|byteCount|sizeBytes|money|amount|cost|price)\w*\s*[*\/]\s*\d+\.\d+|\bparseFloat\([^\n]*(bytes|byteCount|sizeBytes|money|amount|cost))/i;
const IN_MEMORY_FAKE_IMPORT_REGEX = /from\s+['"][^'"]*testing\/in-memory-fake[^'"]*['"]/;
const STORAGE_LIST_CALL_REGEX = /\.\s*list\s*\(/;
const LITERAL_R2_SECRET_KEY_REGEX = /\b(R2_SECRET_ACCESS_KEY|R2_UPLOAD_SIGNER_SECRET_ACCESS_KEY)\s*=\s*['"][A-Za-z0-9+/=_-]{16,}['"]/;

export function checkStorageGuardRulesForFile(filePath, content) {
  const violations = [];
  const normalizedPath = filePath.replace(/\\/g, '/');
  const lines = content.split(/\r?\n/);
  const isClientFile = lines.slice(0, 5).some((l) => /['"]use client['"]/.test(l));
  const isStorageModule =
    normalizedPath.includes('/lib/storage/') || normalizedPath.includes('/storage/');
  const isEnvValidator = normalizedPath.endsWith('/lib/storage/env.ts');
  const isRequestPath =
    normalizedPath.includes('/app/api/') || /\/app\/[^/]+\/page\.tsx$/.test(normalizedPath);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    const lineNum = idx + 1;

    if (R2_DEV_REGEX.test(line)) {
      violations.push({ rule: 'r2_dev_url', file: normalizedPath, line: lineNum, snippet: trimmed });
    }

    if (isClientFile && CLIENT_SECRET_OR_PRIVATE_BUCKET_REGEX.test(line)) {
      violations.push({
        rule: 'client_bundle_secret_or_private_bucket',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (PRIVATE_DATA_TO_PUBLIC_BUCKET_REGEX.test(line)) {
      violations.push({
        rule: 'private_data_in_public_bucket',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (!isEnvValidator && HARDCODED_BUCKET_OR_HOST_REGEX.test(line)) {
      violations.push({
        rule: 'hardcoded_bucket_or_cdn_host',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (FORBIDDEN_CLAIMS_REGEX.test(line)) {
      violations.push({
        rule: 'forbidden_security_claim',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (LOGGING_PRESIGNED_OR_KEY_REGEX.test(line)) {
      violations.push({
        rule: 'logging_presigned_url_or_secret',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (isStorageModule && FLOAT_ARITHMETIC_STORAGE_REGEX.test(line)) {
      violations.push({
        rule: 'floating_point_bytes_or_money',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (IN_MEMORY_FAKE_IMPORT_REGEX.test(line)) {
      violations.push({
        rule: 'in_memory_fake_in_prod',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (isRequestPath && isStorageModule === false && STORAGE_LIST_CALL_REGEX.test(line) && line.includes('storage')) {
      violations.push({
        rule: 'storage_list_on_request_path',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }

    if (LITERAL_R2_SECRET_KEY_REGEX.test(line)) {
      violations.push({
        rule: 'literal_r2_secret_key',
        file: normalizedPath,
        line: lineNum,
        snippet: trimmed,
      });
    }
  });

  return violations;
}
