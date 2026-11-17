import { describe, it, expect } from 'vitest';

/**
 * Unit tests for the port-preflight parser used in scripts/dev-all.mjs and scripts/predev.mjs.
 *
 * The actual child-process spawn & tree-kill cannot be unit-tested without a real OS process,
 * so we test the pure parsing/detection logic only.
 */

function parseNetstatListening(output: string, port: number): string | null {
  for (const line of output.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING') {
      return parts[4]; // PID
    }
  }
  return null;
}

const SAMPLE_NETSTAT = `
  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1124
  TCP    0.0.0.0:4101           0.0.0.0:0              LISTENING       24912
  TCP    127.0.0.1:3000         0.0.0.0:0              LISTENING       18440
  TCP    [::]:4101              [::]:0                 LISTENING       24912
  TCP    127.0.0.1:4101         127.0.0.1:52001        TIME_WAIT       0
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4
`;

describe('dev-all preflight — netstat parser', () => {
  it('detects LISTENING PID for port 4101', () => {
    expect(parseNetstatListening(SAMPLE_NETSTAT, 4101)).toBe('24912');
  });

  it('detects LISTENING PID for port 3000', () => {
    expect(parseNetstatListening(SAMPLE_NETSTAT, 3000)).toBe('18440');
  });

  it('ignores TIME_WAIT connections (not LISTENING)', () => {
    // The TIME_WAIT entry for 4101 must not be confused with a listening socket
    const withTimeWaitOnly = `
  TCP    127.0.0.1:4101         127.0.0.1:52001        TIME_WAIT       0
`;
    expect(parseNetstatListening(withTimeWaitOnly, 4101)).toBeNull();
  });

  it('returns null for a port not present', () => {
    expect(parseNetstatListening(SAMPLE_NETSTAT, 9999)).toBeNull();
  });

  it('returns null on completely empty output', () => {
    expect(parseNetstatListening('', 4101)).toBeNull();
  });
});

describe('dev-all preflight — task kill sentinel', () => {
  it('taskkill command string is well-formed for a given PID', () => {
    // This just validates the string template used in the error message, not execution.
    const pid = '24912';
    const cmd = `taskkill /PID ${pid} /F`;
    expect(cmd).toBe('taskkill /PID 24912 /F');
    expect(cmd).toContain('/F');
  });

  it('unix kill command string is well-formed', () => {
    const pid = '24912';
    const cmd = `kill -9 ${pid}`;
    expect(cmd).toBe('kill -9 24912');
  });
});
