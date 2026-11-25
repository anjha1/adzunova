import { MongoClient } from '../node_modules/.pnpm/mongodb@7.9.0/node_modules/mongodb/lib/index.js';
import fs from 'fs';
import path from 'path';

// Parse .env directly
let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      uri = trimmed.slice('MONGODB_URI='.length).replace(/["']/g, '');
      break;
    }
  }
}

if (!uri) {
  console.error('[Dry Run] MONGODB_URI not found in environment or .env');
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('adzunova');
    console.log('[Dry Run] Connected to MongoDB Atlas DB:', db.databaseName);

    // 1. Audit public_profiles
    const allProfiles = await db.collection('public_profiles').find({}).toArray();
    console.log(`\n=== 1. PUBLIC PROFILES (Total: ${allProfiles.length}) ===`);

    const realProfiles = [];
    const syntheticProfiles = [];

    for (const p of allProfiles) {
      const isSynthetic =
        p.creatorId === 'creator_anjha1' ||
        p.slug === 'a_n_jha1' ||
        (p.avatarUrl && p.avatarUrl.includes('unsplash.com')) ||
        (p.coverUrl && p.coverUrl.includes('unsplash.com'));

      if (isSynthetic) {
        syntheticProfiles.push(p);
      } else {
        realProfiles.push(p);
      }
    }

    console.log(`- Authentic Profiles to KEEP: ${realProfiles.length}`);
    for (const p of realProfiles) {
      console.log(`  [KEEP] _id: ${p._id}, creatorId: ${p.creatorId}, slug: ${p.slug}, displayName: ${p.displayName}`);
    }

    console.log(`- Synthetic / Duplicate Profiles to PURGE: ${syntheticProfiles.length}`);
    for (const p of syntheticProfiles) {
      console.log(`  [PURGE] _id: ${p._id}, creatorId: ${p.creatorId}, slug: ${p.slug}, displayName: ${p.displayName}, avatar: ${p.avatarUrl?.slice(0, 45)}...`);
    }

    // 2. Audit rate_card_items
    const allRateItems = await db.collection('rate_card_items').find({ deletedAt: null }).toArray();
    console.log(`\n=== 2. RATE CARD ITEMS (Total Active: ${allRateItems.length}) ===`);

    const realRateItems = [];
    const syntheticRateItems = [];

    for (const item of allRateItems) {
      const isSynthetic =
        item.creatorId === 'creator_anjha1' ||
        item.creatorId.startsWith('creator_') ||
        item.creatorId.startsWith('seed_') ||
        item.creatorId.startsWith('demo_');

      if (isSynthetic) {
        syntheticRateItems.push(item);
      } else {
        realRateItems.push(item);
      }
    }

    console.log(`- Authentic Rate Card Items to KEEP: ${realRateItems.length}`);
    for (const item of realRateItems) {
      console.log(`  [KEEP] _id: ${item._id}, creatorId: ${item.creatorId}, title: ${item.title}, price: ${item.price}`);
    }

    console.log(`- Synthetic Seed Rate Card Items to PURGE: ${syntheticRateItems.length}`);
    for (const item of syntheticRateItems) {
      console.log(`  [PURGE] _id: ${item._id}, creatorId: ${item.creatorId}, title: "${item.title}", price: ₹${item.price}`);
    }

    // 3. Audit social_accounts
    const allSocialAccounts = await db.collection('social_accounts').find({}).toArray();
    console.log(`\n=== 3. SOCIAL ACCOUNTS (Total: ${allSocialAccounts.length}) ===`);

    const activeAccounts = allSocialAccounts.filter((a) => a.status === 'ACTIVE');
    const revokedTestAccounts = allSocialAccounts.filter((a) => a.status === 'REVOKED' || a.username.startsWith('test_handle_'));

    console.log(`- Active Connected Accounts to KEEP: ${activeAccounts.length}`);
    for (const a of activeAccounts) {
      console.log(`  [KEEP] _id: ${a._id}, creator_id: ${a.creator_id}, provider: ${a.provider}, username: @${a.username}, followers: ${a.followers_count}`);
    }

    console.log(`- Revoked / Obsolete Test Accounts to ARCHIVE/PURGE: ${revokedTestAccounts.length}`);
    for (const a of revokedTestAccounts) {
      console.log(`  [ARCHIVE/PURGE] _id: ${a._id}, creator_id: ${a.creator_id}, username: @${a.username}, status: ${a.status}`);
    }

    // 4. Create Pre-Purge Backup File
    const backupDir = path.resolve('docs/audit/backups');
    fs.mkdirSync(backupDir, { recursive: true });
    const backupFilePath = path.join(backupDir, 'pre-purge-backup-20261121.json');

    const backupPayload = {
      timestamp: new Date().toISOString(),
      database: db.databaseName,
      syntheticProfiles,
      syntheticRateItems,
      revokedTestAccounts,
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(backupPayload, null, 2), 'utf-8');
    console.log(`\n[Backup] Exported ${syntheticProfiles.length + syntheticRateItems.length + revokedTestAccounts.length} target records to:\n  ${backupFilePath}`);

    // 5. Summary Diff Table
    console.log('\n===============================================================');
    console.log('                 PURGE DRY-RUN SUMMARY DIFF                    ');
    console.log('===============================================================');
    console.log('| Collection         | Current Count | To Purge | After Count |');
    console.log('|--------------------|---------------|----------|-------------|');
    console.log(`| public_profiles    | ${String(allProfiles.length).padEnd(13)} | ${String(syntheticProfiles.length).padEnd(8)} | ${String(allProfiles.length - syntheticProfiles.length).padEnd(11)} |`);
    console.log(`| rate_card_items    | ${String(allRateItems.length).padEnd(13)} | ${String(syntheticRateItems.length).padEnd(8)} | ${String(allRateItems.length - syntheticRateItems.length).padEnd(11)} |`);
    console.log(`| social_accounts    | ${String(allSocialAccounts.length).padEnd(13)} | ${String(revokedTestAccounts.length).padEnd(8)} | ${String(allSocialAccounts.length - revokedTestAccounts.length).padEnd(11)} |`);
    console.log('===============================================================');
    console.log('STATUS: DRY RUN ONLY. ZERO RECORDS HAVE BEEN DELETED.');
    console.log('AWAITING OWNER APPROVAL BEFORE PROCEEDING TO EXECUTE PURGE.');

  } finally {
    await client.close();
  }
}

main().catch(console.error);
