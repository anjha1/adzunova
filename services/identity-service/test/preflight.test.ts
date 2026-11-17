import { describe, it, expect } from 'vitest';

/**
 * Netstat parser logic extracted from dev-all preflight
 */
function parseNetstatOutput(output: string, port: number): string | null {
  for (const line of output.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING') {
      return parts[4]; // PID
    }
  }
  return null;
}

describe('Port Preflight Detection Logic', () => {
  it('correctly extracts PID when Windows netstat reports port is listening', () => {
    const sampleNetstat = `
  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1124
  TCP    0.0.0.0:4101           0.0.0.0:0              LISTENING       24912
  TCP    127.0.0.1:3000         0.0.0.0:0              LISTENING       18440
  TCP    [::]:4101              [::]:0                 LISTENING       24912
`;

    const pid4101 = parseNetstatOutput(sampleNetstat, 4101);
    expect(pid4101).toBe('24912');

    const pid3000 = parseNetstatOutput(sampleNetstat, 3000);
    expect(pid3000).toBe('18440');
  });

  it('returns null when the port is not in the listening state', () => {
    const sampleNetstat = `
  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1124
  TCP    127.0.0.1:4101         127.0.0.1:51234        TIME_WAIT       0
`;

    const pid4101 = parseNetstatOutput(sampleNetstat, 4101);
    expect(pid4101).toBeNull();

    const pid9999 = parseNetstatOutput(sampleNetstat, 9999);
    expect(pid9999).toBeNull();
  });
});
