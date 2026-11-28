import net from 'node:net';
import type { Readable } from 'node:stream';

export type ScanVerdictStatus = 'CLEAN' | 'REJECTED' | 'SCAN_FAILED';

export interface ScanVerdict {
  status: ScanVerdictStatus;
  reasonCode: string;
  detail: string;
  signatureName?: string | null;
  retryable: boolean;
  scannerProvider: string;
}

export interface ScanStreamInput {
  stream: Readable;
  sizeBytes: number;
  sha256Hex: string;
  contentType: string;
  assetId: string;
  versionNumber: number;
}

export interface ScanPort {
  readonly providerName: string;
  isConfigured(): boolean;
  getMaxScanBytes(): number;
  scanStream(input: ScanStreamInput): Promise<ScanVerdict>;
}

export class UnconfiguredScanAdapter implements ScanPort {
  public readonly providerName = 'UNCONFIGURED';

  isConfigured(): boolean {
    return false;
  }

  getMaxScanBytes(): number {
    return 0;
  }

  async scanStream(input: ScanStreamInput): Promise<ScanVerdict> {
    input.stream.resume();
    return {
      status: 'SCAN_FAILED',
      reasonCode: 'SCANNER_NOT_CONFIGURED',
      detail: 'Malware scanner not configured (FEATURE_STORAGE_S4_SCANNER / CLAMAV_HOST missing).',
      retryable: true,
      scannerProvider: this.providerName,
    };
  }
}

export class ClamAVStreamAdapter implements ScanPort {
  public readonly providerName = 'CLAMAV_INSTREAM';

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly timeoutMs: number,
    private readonly maxStreamBytes: number
  ) {}

  isConfigured(): boolean {
    return Boolean(this.host && this.port > 0);
  }

  getMaxScanBytes(): number {
    return this.maxStreamBytes;
  }

  async scanStream(input: ScanStreamInput): Promise<ScanVerdict> {
    if (input.sizeBytes > this.maxStreamBytes) {
      input.stream.resume();
      return {
        status: 'REJECTED',
        reasonCode: 'SCAN_UNSUPPORTED_SIZE',
        detail: `File size ${input.sizeBytes} bytes exceeds ClamAV StreamMaxLength (${this.maxStreamBytes} bytes).`,
        retryable: false,
        scannerProvider: this.providerName,
      };
    }

    return new Promise<ScanVerdict>((resolve) => {
      let settled = false;
      let totalSent = 0;
      const chunks: Buffer[] = [];
      const socket = net.createConnection({ host: this.host, port: this.port });
      socket.setTimeout(this.timeoutMs);

      const finish = (verdict: ScanVerdict) => {
        if (settled) return;
        settled = true;
        socket.destroy();
        input.stream.destroy();
        resolve(verdict);
      };

      socket.on('timeout', () => {
        finish({
          status: 'SCAN_FAILED',
          reasonCode: 'SCANNER_TIMEOUT',
          detail: `ClamAV scan timed out after ${this.timeoutMs}ms.`,
          retryable: true,
          scannerProvider: this.providerName,
        });
      });

      socket.on('error', (err) => {
        finish({
          status: 'SCAN_FAILED',
          reasonCode: 'SCANNER_UNAVAILABLE',
          detail: `ClamAV connection error: ${err.message}`,
          retryable: true,
          scannerProvider: this.providerName,
        });
      });

      socket.on('data', (buf) => {
        chunks.push(buf);
      });

      socket.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8').replace(/\0+$/, '').trim();
        if (raw === 'stream: OK') {
          finish({
            status: 'CLEAN',
            reasonCode: 'CLEAN',
            detail: 'ClamAV zINSTREAM scan passed.',
            retryable: false,
            scannerProvider: this.providerName,
          });
          return;
        }
        const foundMatch = raw.match(/^stream:\s*(.+?)\s+FOUND$/i);
        if (foundMatch) {
          finish({
            status: 'REJECTED',
            reasonCode: 'MALWARE_DETECTED',
            detail: `Malware signature detected: ${foundMatch[1]}`,
            signatureName: foundMatch[1],
            retryable: false,
            scannerProvider: this.providerName,
          });
          return;
        }
        if (/size limit exceeded/i.test(raw)) {
          finish({
            status: 'REJECTED',
            reasonCode: 'SCAN_UNSUPPORTED_SIZE',
            detail: 'ClamAV reported INSTREAM size limit exceeded.',
            retryable: false,
            scannerProvider: this.providerName,
          });
          return;
        }
        finish({
          status: 'SCAN_FAILED',
          reasonCode: 'SCANNER_INCONCLUSIVE',
          detail: `Inconclusive ClamAV response: ${raw || 'empty response'}`,
          retryable: true,
          scannerProvider: this.providerName,
        });
      });

      socket.on('connect', () => {
        socket.write(Buffer.from('zINSTREAM\0', 'ascii'));
        input.stream.on('data', (chunk: Buffer | string) => {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          totalSent += buf.length;
          if (totalSent > this.maxStreamBytes) {
            finish({
              status: 'REJECTED',
              reasonCode: 'SCAN_UNSUPPORTED_SIZE',
              detail: `Streamed bytes exceeded ClamAV StreamMaxLength (${this.maxStreamBytes}).`,
              retryable: false,
              scannerProvider: this.providerName,
            });
            return;
          }
          const header = Buffer.allocUnsafe(4);
          header.writeUInt32BE(buf.length, 0);
          socket.write(header);
          socket.write(buf);
        });
        input.stream.on('end', () => {
          const terminator = Buffer.alloc(4, 0);
          socket.write(terminator);
        });
        input.stream.on('error', (err) => {
          finish({
            status: 'SCAN_FAILED',
            reasonCode: 'STREAM_READ_ERROR',
            detail: `Failed reading quarantine stream: ${err.message}`,
            retryable: true,
            scannerProvider: this.providerName,
          });
        });
      });
    });
  }
}

export function getScanAdapter(
  env: Record<string, string | undefined> = process.env
): ScanPort {
  const enabled = env.FEATURE_STORAGE_S4_SCANNER === 'true';
  const host = (env.CLAMAV_HOST || '').trim();
  const port = Number.parseInt(env.CLAMAV_PORT || '3310', 10);
  const timeoutMs = Number.parseInt(env.CLAMAV_TIMEOUT_MS || '15000', 10);
  const maxStreamBytes = Number.parseInt(env.CLAMAV_MAX_STREAM_BYTES || String(25 * 1024 * 1024), 10);

  if (!enabled || !host || !Number.isFinite(port) || port <= 0) {
    return new UnconfiguredScanAdapter();
  }
  return new ClamAVStreamAdapter(
    host,
    port,
    Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15_000,
    Number.isFinite(maxStreamBytes) && maxStreamBytes > 0 ? maxStreamBytes : 25 * 1024 * 1024
  );
}
