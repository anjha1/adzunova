import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import sharp from 'sharp';
import type { StoragePurpose } from './classification';

export interface PurposeUploadRules {
  allowedMimeTypes: readonly string[];
  maxBytes: number;
  imageBounds?: {
    maxWidth: number;
    maxHeight: number;
    thumbWidth: number;
    thumbHeight: number;
    kind: string;
  };
}

export function getPurposeUploadRules(
  purpose: StoragePurpose,
  env: Record<string, string | undefined> = process.env
): PurposeUploadRules {
  const maxImg = Number.parseInt(env.MAX_IMAGE_SIZE_BYTES || String(10 * 1024 * 1024), 10);
  const maxPdf = Number.parseInt(env.MAX_PDF_SIZE_BYTES || String(25 * 1024 * 1024), 10);
  const maxVideo = Number.parseInt(env.MAX_VIDEO_SIZE_BYTES || String(500 * 1024 * 1024), 10);

  switch (purpose) {
    case 'creator_avatar':
      return {
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxBytes: maxImg,
        imageBounds: { maxWidth: 1024, maxHeight: 1024, thumbWidth: 256, thumbHeight: 256, kind: 'avatar' },
      };
    case 'creator_cover':
      return {
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxBytes: maxImg,
        imageBounds: { maxWidth: 1920, maxHeight: 640, thumbWidth: 640, thumbHeight: 214, kind: 'cover' },
      };
    case 'brand_logo':
      return {
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxBytes: maxImg,
        imageBounds: { maxWidth: 512, maxHeight: 512, thumbWidth: 128, thumbHeight: 128, kind: 'logo' },
      };
    case 'public_media_kit_thumb':
      return {
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxBytes: maxImg,
        imageBounds: { maxWidth: 1280, maxHeight: 720, thumbWidth: 400, thumbHeight: 225, kind: 'media_kit' },
      };
    case 'creator_media_kit_pdf':
    case 'contract_pdf':
    case 'invoice_pdf':
      return {
        allowedMimeTypes: ['application/pdf'],
        maxBytes: maxPdf,
      };
    case 'campaign_deliverable_draft':
      return {
        allowedMimeTypes: ['video/mp4', 'video/webm', 'application/pdf', 'application/octet-stream'],
        maxBytes: maxVideo,
      };
    case 'kyc_pan_document':
    case 'kyc_gst_document':
    case 'dispute_evidence':
      return {
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        maxBytes: maxPdf,
      };
    case 'async_export':
      return {
        allowedMimeTypes: ['application/json', 'text/csv', 'application/zip'],
        maxBytes: maxVideo,
      };
  }
}

export type SniffedMime =
  | { ok: true; mime: string; ext: string }
  | { ok: false; reasonCode: string; detail: string };

/**
 * Magic-byte inspection on the initial bytes of an uploaded object.
 * Never trusts client-declared Content-Type or filename extension.
 */
export function sniffMagicBytes(header: Buffer, allowedMimeTypes: readonly string[]): SniffedMime {
  if (header.length < 4) {
    return { ok: false, reasonCode: 'EMPTY_OR_TRUNCATED_FILE', detail: 'File is empty or too short to validate.' };
  }

  // Reject Windows PE/MZ executables, ELF binaries, Mach-O, and shebang scripts
  if (header[0] === 0x4d && header[1] === 0x5a) {
    return { ok: false, reasonCode: 'EXECUTABLE_REJECTED', detail: 'Executable files (PE/MZ) are strictly forbidden.' };
  }
  if (header[0] === 0x7f && header[1] === 0x45 && header[2] === 0x4c && header[3] === 0x46) {
    return { ok: false, reasonCode: 'EXECUTABLE_REJECTED', detail: 'Executable files (ELF) are strictly forbidden.' };
  }
  if (header[0] === 0x23 && header[1] === 0x21) {
    return { ok: false, reasonCode: 'SCRIPT_REJECTED', detail: 'Script files are strictly forbidden.' };
  }

  const headText = header.subarray(0, Math.min(header.length, 512)).toString('utf8').trimStart().toLowerCase();
  if (headText.startsWith('<svg') || headText.startsWith('<?xml') || headText.startsWith('<!doctype html') || headText.startsWith('<html') || headText.startsWith('<script')) {
    return { ok: false, reasonCode: 'ACTIVE_MARKUP_REJECTED', detail: 'SVG, HTML, and script markup files are rejected.' };
  }

  let detected: { mime: string; ext: string } | null = null;

  // JPEG: FF D8 FF
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    detected = { mime: 'image/jpeg', ext: 'jpg' };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  else if (
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a
  ) {
    detected = { mime: 'image/png', ext: 'png' };
  }
  // WebP: RIFF....WEBP
  else if (
    header.length >= 12 &&
    header.subarray(0, 4).toString('ascii') === 'RIFF' &&
    header.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    detected = { mime: 'image/webp', ext: 'webp' };
  }
  // PDF: %PDF-
  else if (header.subarray(0, 5).toString('ascii') === '%PDF-') {
    detected = { mime: 'application/pdf', ext: 'pdf' };
  }
  // MP4/ISO BMFF: ....ftyp
  else if (header.length >= 12 && header.subarray(4, 8).toString('ascii') === 'ftyp') {
    detected = { mime: 'video/mp4', ext: 'mp4' };
  }
  // WebM/Matroska: 1A 45 DF A3
  else if (header[0] === 0x1a && header[1] === 0x45 && header[2] === 0xdf && header[3] === 0xa3) {
    detected = { mime: 'video/webm', ext: 'webm' };
  }
  // Fallback for explicit binary deliverable tests when application/octet-stream is allowed
  else if (allowedMimeTypes.includes('application/octet-stream')) {
    detected = { mime: 'application/octet-stream', ext: 'bin' };
  }

  if (!detected) {
    return { ok: false, reasonCode: 'UNSUPPORTED_FILE_SIGNATURE', detail: 'File magic bytes do not match any supported format.' };
  }

  if (!allowedMimeTypes.includes(detected.mime)) {
    return {
      ok: false,
      reasonCode: 'MIME_NOT_ALLOWED_FOR_PURPOSE',
      detail: `Detected type "${detected.mime}" is not permitted for this upload purpose.`,
    };
  }

  return { ok: true, mime: detected.mime, ext: detected.ext };
}

/**
 * Conservative PDF active-content scanner over a stream.
 * Rejects /JavaScript, /JS, /EmbeddedFile(s), /Launch, /RichMedia, /OpenAction, /AA.
 */
const PDF_ACTIVE_TOKENS = [
  /\/JavaScript\b/i,
  /\/JS\b/,
  /\/EmbeddedFiles?\b/i,
  /\/Launch\b/i,
  /\/RichMedia\b/i,
  /\/OpenAction\b/i,
  /\/AA\b/,
];

export async function streamAndValidateObject(params: {
  body: Readable;
  allowedMimeTypes: readonly string[];
  maxBytes: number;
  checkPdfActiveContent?: boolean;
}): Promise<{
  ok: true;
  sha256Hex: string;
  byteLength: number;
  detectedMime: string;
  detectedExt: string;
  bufferedIfSmall?: Buffer;
} | {
  ok: false;
  reasonCode: string;
  detail: string;
}> {
  const hash = crypto.createHash('sha256');
  let byteLength = 0;
  let headerChunks: Buffer[] = [];
  let headerBytes = 0;
  let sniffResult: SniffedMime | null = null;
  let tailWindow = '';
  const smallChunks: Buffer[] = [];
  const SMALL_BUFFER_LIMIT = 26 * 1024 * 1024; // Only buffer <= 26MB for sharp/PDF; larger streams never buffer

  for await (const raw of params.body) {
    const chunk = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    byteLength += chunk.length;
    if (byteLength > params.maxBytes) {
      return { ok: false, reasonCode: 'FILE_TOO_LARGE', detail: `File exceeds maximum allowed size (${params.maxBytes} bytes).` };
    }
    hash.update(chunk);

    if (byteLength <= SMALL_BUFFER_LIMIT) {
      smallChunks.push(chunk);
    } else if (smallChunks.length > 0) {
      smallChunks.length = 0;
    }

    if (!sniffResult) {
      headerChunks.push(chunk);
      headerBytes += chunk.length;
      if (headerBytes >= 512) {
        const hdr = Buffer.concat(headerChunks);
        headerChunks = [];
        sniffResult = sniffMagicBytes(hdr, params.allowedMimeTypes);
        if (!sniffResult.ok) return sniffResult;
      }
    }

    if (params.checkPdfActiveContent) {
      const combined = tailWindow + chunk.toString('latin1');
      for (const rx of PDF_ACTIVE_TOKENS) {
        if (rx.test(combined)) {
          return {
            ok: false,
            reasonCode: 'PDF_ACTIVE_CONTENT_REJECTED',
            detail: 'PDF contains disallowed active content (JavaScript, embedded files, or auto-actions).',
          };
        }
      }
      tailWindow = combined.slice(-64);
    }
  }

  if (!sniffResult) {
    const hdr = Buffer.concat(headerChunks);
    sniffResult = sniffMagicBytes(hdr, params.allowedMimeTypes);
    if (!sniffResult.ok) return sniffResult;
  }

  return {
    ok: true,
    sha256Hex: hash.digest('hex'),
    byteLength,
    detectedMime: sniffResult.mime,
    detectedExt: sniffResult.ext,
    bufferedIfSmall: smallChunks.length > 0 ? Buffer.concat(smallChunks) : undefined,
  };
}

/**
 * Re-encodes public images via sharp to strip EXIF/metadata & polyglot payloads,
 * enforce max dimensions, and generate a WebP main + WebP thumbnail.
 */
export async function reencodePublicImage(
  inputBuffer: Buffer,
  bounds: NonNullable<PurposeUploadRules['imageBounds']>
): Promise<{
  mainBuffer: Buffer;
  mainSha256Hex: string;
  thumbBuffer: Buffer;
  thumbSha256Hex: string;
  width: number;
  height: number;
}> {
  const mainPipeline = sharp(inputBuffer, { limitInputPixels: 40_000_000 })
    .rotate() // auto-orient based on EXIF before stripping
    .resize({
      width: bounds.maxWidth,
      height: bounds.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 84 });

  const { data: mainBuffer, info } = await mainPipeline.toBuffer({ resolveWithObject: true });
  const thumbBuffer = await sharp(mainBuffer)
    .resize({
      width: bounds.thumbWidth,
      height: bounds.thumbHeight,
      fit: 'cover',
    })
    .webp({ quality: 78 })
    .toBuffer();

  return {
    mainBuffer,
    mainSha256Hex: crypto.createHash('sha256').update(mainBuffer).digest('hex'),
    thumbBuffer,
    thumbSha256Hex: crypto.createHash('sha256').update(thumbBuffer).digest('hex'),
    width: info.width,
    height: info.height,
  };
}

export function sanitizeDownloadFilename(name: string): string {
  const base = name.replace(/[/\\]/g, '_').replace(/[\x00-\x1f\x7f"<>|:*?]/g, '').trim();
  return (base || 'document.pdf').slice(0, 120);
}
