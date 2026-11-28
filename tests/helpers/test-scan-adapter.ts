import type { ScanPort, ScanStreamInput, ScanVerdict } from '../../apps/web/src/lib/storage/scanner';

/**
 * Test-only ScanPort fake. Never imported by production code.
 */
export class TestScanAdapter implements ScanPort {
  public readonly providerName = 'TEST_SCAN_FAKE';
  public mode: 'CLEAN' | 'REJECTED' | 'SCAN_FAILED' = 'CLEAN';
  public maxBytes = 25 * 1024 * 1024;

  constructor(mode: 'CLEAN' | 'REJECTED' | 'SCAN_FAILED' = 'CLEAN') {
    this.mode = mode;
  }

  isConfigured(): boolean {
    return true;
  }

  getMaxScanBytes(): number {
    return this.maxBytes;
  }

  async scanStream(input: ScanStreamInput): Promise<ScanVerdict> {
    await new Promise<void>((resolve, reject) => {
      input.stream.on('data', () => {});
      input.stream.on('end', () => resolve());
      input.stream.on('error', reject);
    });

    if (input.sizeBytes > this.maxBytes) {
      return {
        status: 'REJECTED',
        reasonCode: 'SCAN_UNSUPPORTED_SIZE',
        detail: `File exceeds max scan size ${this.maxBytes}`,
        retryable: false,
        scannerProvider: this.providerName,
      };
    }

    if (this.mode === 'REJECTED') {
      return {
        status: 'REJECTED',
        reasonCode: 'MALWARE_DETECTED',
        detail: 'Test malware signature detected',
        signatureName: 'Test-Signature',
        retryable: false,
        scannerProvider: this.providerName,
      };
    }

    if (this.mode === 'SCAN_FAILED') {
      return {
        status: 'SCAN_FAILED',
        reasonCode: 'SCANNER_UNAVAILABLE',
        detail: 'Simulated scanner failure',
        retryable: true,
        scannerProvider: this.providerName,
      };
    }

    return {
      status: 'CLEAN',
      reasonCode: 'CLEAN',
      detail: 'Test scan passed',
      retryable: false,
      scannerProvider: this.providerName,
    };
  }
}
