import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GENESIS_HASH,
  computeAuditEntryHash,
  buildChainedAuditEntry,
  verifyAuditChain,
  exportAuditLogsToCsv,
  exportAuditLogsToJson,
} from '../../services/identity-service/src/domain/services/audit-log-service.ts';

test('Audit Log: Cryptographic Hash Chaining & Genesis Block', () => {
  assert.equal(GENESIS_HASH.length, 64);
  assert.equal(GENESIS_HASH, '0000000000000000000000000000000000000000000000000000000000000000');

  const entry1 = buildChainedAuditEntry({
    workspaceId: 'ws_audit_test',
    actorId: 'user_owner_1',
    actorEmail: 'owner@corporate.co.in',
    action: 'workspace:create',
    resourceType: 'WORKSPACE',
    resourceId: 'ws_audit_test',
    payload: { name: 'Acme Enterprise' },
    createdAt: new Date('2026-11-21T10:00:00.000Z'),
  });

  assert.equal(entry1.previousHash, GENESIS_HASH);
  assert.ok(entry1.hash && entry1.hash.length === 64);

  const entry2 = buildChainedAuditEntry(
    {
      workspaceId: 'ws_audit_test',
      actorId: 'user_admin_1',
      actorEmail: 'admin@corporate.co.in',
      action: 'team:invite',
      resourceType: 'MEMBER',
      resourceId: 'member_inv_1',
      payload: { email: 'marketer@corporate.co.in', role: 'CAMPAIGN_MANAGER' },
      createdAt: new Date('2026-11-21T10:05:00.000Z'),
    },
    entry1.hash
  );

  assert.equal(entry2.previousHash, entry1.hash);
  assert.notEqual(entry2.hash, entry1.hash);
});

test('Audit Log: Continuous Chain Verification & Tamper Detection', async (t) => {
  const d1 = new Date('2026-11-21T10:00:00.000Z');
  const d2 = new Date('2026-11-21T10:05:00.000Z');
  const d3 = new Date('2026-11-21T10:10:00.000Z');

  const e1 = buildChainedAuditEntry({
    workspaceId: 'ws_chain_1',
    actorId: 'user_1',
    action: 'booking:create',
    resourceType: 'BOOKING',
    resourceId: 'b_100',
    payload: { amountMinor: 2500000 },
    createdAt: d1,
  });

  const e2 = buildChainedAuditEntry(
    {
      workspaceId: 'ws_chain_1',
      actorId: 'user_fin',
      action: 'booking:approve',
      resourceType: 'APPROVAL',
      resourceId: 'appr_200',
      payload: { decision: 'APPROVED' },
      createdAt: d2,
    },
    e1.hash
  );

  const e3 = buildChainedAuditEntry(
    {
      workspaceId: 'ws_chain_1',
      actorId: 'user_fin',
      action: 'payment:release',
      resourceType: 'PAYMENT',
      resourceId: 'pay_300',
      payload: { releaseAmountMinor: 2500000 },
      createdAt: d3,
    },
    e2.hash
  );

  await t.test('verifies an authentic, untampered audit chain', () => {
    const chain = [e1, e2, e3];
    const verification = verifyAuditChain(chain);
    assert.equal(verification.valid, true);
    assert.equal(verification.totalEntries, 3);
    assert.equal(verification.brokenAtIndex, undefined);
  });

  await t.test('detects tamper if an attacker alters payload content', () => {
    // Malicious modification of entry 2's payload without re-hashing
    const tamperedE2 = {
      ...e2,
      payload: { decision: 'REJECTED' }, // Altered payload
    };

    const verification = verifyAuditChain([e1, tamperedE2, e3]);
    assert.equal(verification.valid, false);
    assert.equal(verification.brokenAtIndex, 1);
    assert.match(verification.error || '', /Tamper detected/i);
  });

  await t.test('detects broken chain if an entry is removed or inserted out-of-order', () => {
    // Missing intermediate block e2
    const verification = verifyAuditChain([e1, e3]);
    assert.equal(verification.valid, false);
    assert.equal(verification.brokenAtIndex, 1);
    assert.match(verification.error || '', /Chain broken/i);
  });
});

test('Audit Log: RFC 4180 CSV & Integrity JSON Export', () => {
  const e1 = buildChainedAuditEntry({
    workspaceId: 'ws_exp',
    actorId: 'user_exp',
    actorEmail: 'admin@acme.com',
    actorIp: '198.51.100.10',
    action: 'settings:update',
    resourceType: 'WORKSPACE',
    resourceId: 'ws_exp',
    payload: { twoFactorRequired: true },
    createdAt: new Date('2026-11-21T11:00:00.000Z'),
  });

  const csv = exportAuditLogsToCsv([e1]);
  assert.match(csv, /Timestamp,Action,Actor ID/);
  assert.match(csv, /"settings:update"/);
  assert.match(csv, /"admin@acme.com"/);

  const jsonStr = exportAuditLogsToJson([e1]);
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.integrity.isChainIntact, true);
  assert.equal(parsed.entries.length, 1);
});
