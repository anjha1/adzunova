import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSelfDealing } from '../../apps/web/src/lib/discovery/self-dealing.ts';

test('Anti-Conflict-of-Interest & Self-Dealing Guard', async (t) => {
  const brandOwnerUserId = 'user_brand_owner_123';
  const teamMemberUserId = 'user_agency_reviewer_456';
  const independentCreatorId = 'user_creator_789';

  await t.test('strictly blocks brand user from hiring or discovering their own creator profile', async () => {
    const res = await checkSelfDealing({
      requestingUserId: brandOwnerUserId,
      creatorId: brandOwnerUserId, // Self
    });

    assert.equal(res.allowed, false);
    assert.equal(res.code, 'SELF_DEALING_SAME_USER');
    assert.match(res.reason, /Self-dealing forbidden/i);
  });

  await t.test('strictly blocks brand workspace members from hiring colleagues', async () => {
    const res = await checkSelfDealing({
      requestingUserId: brandOwnerUserId,
      creatorId: teamMemberUserId,
      workspaceMemberUserIds: [brandOwnerUserId, teamMemberUserId],
    });

    assert.equal(res.allowed, false);
    assert.equal(res.code, 'SELF_DEALING_WORKSPACE_MEMBER');
    assert.match(res.reason, /Conflict of interest/i);
  });

  await t.test('permits independent creators who have no affiliation with the brand workspace', async () => {
    const res = await checkSelfDealing({
      requestingUserId: brandOwnerUserId,
      creatorId: independentCreatorId,
      workspaceMemberUserIds: [brandOwnerUserId, teamMemberUserId],
    });

    assert.equal(res.allowed, true);
    assert.equal(res.code, 'ALLOWED');
  });

  await t.test('permits unauthenticated public discovery queries', async () => {
    const res = await checkSelfDealing({
      requestingUserId: undefined,
      creatorId: independentCreatorId,
    });

    assert.equal(res.allowed, true);
    assert.equal(res.code, 'ALLOWED');
  });

  await t.test('permits explicit super admin emergency exceptions', async () => {
    const res = await checkSelfDealing({
      requestingUserId: brandOwnerUserId,
      creatorId: brandOwnerUserId,
      isSuperAdminException: true,
    });

    assert.equal(res.allowed, true);
    assert.equal(res.code, 'ALLOWED');
  });
});
