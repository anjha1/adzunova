import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getRateCardItems,
  getRateCardItemById,
  createRateCardItem,
  updateRateCardItem,
  duplicateRateCardItem,
  softDeleteRateCardItem,
  reorderRateCardItems,
} from '../../apps/web/src/lib/rate-card/rate-card-repository.ts';

test('Rate Card Repository & Business Lifecycle', async (t) => {
  const testCreatorId = `test-creator-${Date.now()}`;
  let seededItems = [];

  await t.test('auto-seeds 2 default deliverables for new creator on first fetch', async () => {
    seededItems = await getRateCardItems(testCreatorId);
    assert.equal(seededItems.length, 2);

    const reel = seededItems.find((i) => i.platform === 'INSTAGRAM');
    const youtube = seededItems.find((i) => i.platform === 'YOUTUBE');

    assert.ok(reel);
    assert.equal(reel.title, '1 Min Dedicated Instagram Reel');
    assert.equal(reel.price, 25000);
    assert.equal(reel.status, 'ACTIVE');

    assert.ok(youtube);
    assert.equal(youtube.title, 'YouTube Dedicated Video');
    assert.equal(youtube.price, 40000);
    assert.equal(youtube.status, 'ACTIVE');
  });

  await t.test('enforces row-level isolation between different creators', async () => {
    const otherCreatorId = `other-creator-${Date.now()}`;
    const otherItems = await getRateCardItems(otherCreatorId);
    assert.equal(otherItems.length, 2);

    // Seeded item from testCreatorId should not be accessible by otherCreatorId
    const crossAccess = await getRateCardItemById(otherCreatorId, seededItems[0].id);
    assert.equal(crossAccess, null);
  });

  await t.test('creates a new custom deliverable', async () => {
    const created = await createRateCardItem(testCreatorId, {
      platform: 'LINKEDIN',
      contentFormat: 'POST',
      deliverableType: 'BRAND_INTEGRATION',
      durationSeconds: null,
      price: 18000,
      currency: 'INR',
      priceType: 'FIXED',
      minimumBookingAmount: null,
      title: 'LinkedIn Thought Leadership Brand Post',
      description: 'Long-form editorial post discussing brand value proposition.',
      deliveryDays: 4,
      freeRevisions: 1,
      publishOnMyChannel: true,
      scriptApprovalRequired: true,
      status: 'ACTIVE',
      visibleToBrands: true,
      sortOrder: 2,
      addons: [],
    });

    assert.ok(created.id);
    assert.equal(created.version, 1);
    assert.equal(created.price, 18000);

    const all = await getRateCardItems(testCreatorId);
    assert.equal(all.length, 3);
  });

  await t.test('duplicates an existing deliverable into a DRAFT copy with - Copy title', async () => {
    const original = seededItems[0];
    const duplicated = await duplicateRateCardItem(testCreatorId, original.id);

    assert.notEqual(duplicated.id, original.id);
    assert.equal(duplicated.title, `${original.title} - Copy`);
    assert.equal(duplicated.status, 'DRAFT');
    assert.equal(duplicated.version, 1);
    assert.equal(duplicated.price, original.price);
  });

  await t.test('updates deliverable with optimistic concurrency check', async () => {
    const target = seededItems[0];
    const currentVersion = target.version;

    // Successful update with matching version
    const updated = await updateRateCardItem(
      testCreatorId,
      target.id,
      { price: 28000 },
      currentVersion
    );

    assert.equal(updated.price, 28000);
    assert.equal(updated.version, currentVersion + 1);

    // Attempt update with stale version must fail with 409 Conflict
    await assert.rejects(
      async () => {
        await updateRateCardItem(
          testCreatorId,
          target.id,
          { price: 30000 },
          currentVersion // Stale version!
        );
      },
      (err) => {
        assert.equal(err.status, 409);
        assert.match(err.message, /Concurrency conflict/);
        return true;
      }
    );
  });

  await t.test('strictly blocks updating an active item to ₹0 price', async () => {
    const target = seededItems[0];
    await assert.rejects(
      async () => {
        await updateRateCardItem(testCreatorId, target.id, { price: 0, status: 'ACTIVE' });
      },
      (err) => {
        assert.equal(err.status, 400);
        assert.match(err.message, /greater than ₹0/);
        return true;
      }
    );
  });

  await t.test('reorders deliverables correctly', async () => {
    const items = await getRateCardItems(testCreatorId);
    const reversedIds = items.map((i) => i.id).reverse();

    await reorderRateCardItems(testCreatorId, reversedIds);
    const reordered = await getRateCardItems(testCreatorId, { sortBy: 'custom' });

    assert.equal(reordered[0].id, reversedIds[0]);
    assert.equal(reordered[reordered.length - 1].id, reversedIds[reversedIds.length - 1]);
  });

  await t.test('soft deletes a deliverable and excludes it from future queries', async () => {
    const target = seededItems[1];
    const deleted = await softDeleteRateCardItem(testCreatorId, target.id);
    assert.equal(deleted, true);

    const afterDelete = await getRateCardItemById(testCreatorId, target.id);
    assert.equal(afterDelete, null);

    const remaining = await getRateCardItems(testCreatorId);
    assert.ok(!remaining.some((i) => i.id === target.id));
  });
});
