import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCreatorMongoDb,
  closeCreatorMongoDb,
} from '../../apps/web/src/lib/creator/db.ts';
import {
  createCreatorPackage,
  listCreatorPackages,
  updateCreatorPackage,
  toggleCreatorPackageStatus,
  deleteCreatorPackage,
} from '../../apps/web/src/lib/creator/packages-repository.ts';
import {
  getCreatorAvailability,
  upsertCreatorAvailability,
  isCreatorDateBlackout,
} from '../../apps/web/src/lib/creator/availability-repository.ts';

const TEST_DB_NAME = `adzunova_creator_m2b_test_${process.pid}`;
process.env.CREATOR_MONGODB_DB_NAME = TEST_DB_NAME;

test.after(async () => {
  try {
    const db = await getCreatorMongoDb();
    await db.dropDatabase();
  } finally {
    await closeCreatorMongoDb();
  }
});

test('1. Creator Packages: CRUD, versioning, duplicate name conflict, and cross-creator isolation', async () => {
  const c1 = 'creator_pkg_1';
  const c2 = 'creator_pkg_2';

  const created = await createCreatorPackage(c1, {
    name: 'Reel + 2 Stories Combo',
    tagline: 'High-impact launch bundle',
    deliverables: ['1x IG Reel', '2x IG Stories with Link'],
    originalPricePaise: '3500000',
    discountedPricePaise: '3000000',
    turnaroundDays: 5,
    revisions: 2,
  });
  assert.equal(created.version, 1);
  assert.equal(created.isActive, true);
  assert.equal(created.discountedPricePaise, '3000000');

  // Duplicate name for same creator -> 409
  await assert.rejects(
    () =>
      createCreatorPackage(c1, {
        name: 'Reel + 2 Stories Combo',
        discountedPricePaise: '2500000',
      }),
    (err) => err?.name === 'AppProblemError' && err?.status === 409
  );

  // Update increments version
  const updated = await updateCreatorPackage(c1, created.id, {
    discountedPricePaise: '2800000',
  });
  assert.equal(updated?.version, 2);
  assert.equal(updated?.discountedPricePaise, '2800000');

  // Toggle status increments version
  const toggled = await toggleCreatorPackageStatus(c1, created.id, false);
  assert.equal(toggled?.version, 3);
  assert.equal(toggled?.isActive, false);

  // Isolation: creator 2 cannot see or delete creator 1's package
  const c2List = await listCreatorPackages(c2);
  assert.equal(c2List.length, 0);
  const c2Delete = await deleteCreatorPackage(c2, created.id);
  assert.equal(c2Delete, false);

  // Creator 1 deletes successfully
  const c1Delete = await deleteCreatorPackage(c1, created.id);
  assert.equal(c1Delete, true);
  const c1ListAfter = await listCreatorPackages(c1);
  assert.equal(c1ListAfter.length, 0);
});

test('2. Creator Availability: persists blackouts, timezone, and versions in MongoDB', async () => {
  const creatorId = 'creator_avail_1';
  const initial = await getCreatorAvailability(creatorId, 2026, 12);
  assert.equal(initial.version, 0);
  assert.equal(initial.timezone, 'Asia/Kolkata');
  assert.equal(initial.days.length, 31);

  const saved = await upsertCreatorAvailability(creatorId, {
    year: 2026,
    month: 12,
    timezone: 'Asia/Dubai',
    days: [
      { date: 10, status: 'blackout', note: 'Travel hold' },
      { date: 11, status: 'shoot', note: 'Brand shoot' },
    ],
  });
  assert.equal(saved.version, 1);
  assert.equal(saved.timezone, 'Asia/Dubai');

  const reloaded = await getCreatorAvailability(creatorId, 2026, 12);
  assert.equal(reloaded.version, 1);
  assert.equal(reloaded.timezone, 'Asia/Dubai');
  assert.equal(reloaded.days.find((d) => d.date === 10)?.status, 'blackout');
  assert.equal(reloaded.days.find((d) => d.date === 10)?.note, 'Travel hold');

  assert.equal(await isCreatorDateBlackout(creatorId, '2026-12-10'), true);
  assert.equal(await isCreatorDateBlackout(creatorId, '2026-12-12'), false);
});
