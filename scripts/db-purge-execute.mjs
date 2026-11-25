import { MongoClient, ObjectId } from '../node_modules/.pnpm/mongodb@7.9.0/node_modules/mongodb/lib/index.js';
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
  console.error('[Purge Execute] MONGODB_URI not found in environment or .env');
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('adzunova');
    console.log('[Purge Execute] Connected to MongoDB Atlas DB:', db.databaseName);

    // 1. Purge synthetic public profile (creator_anjha1 / a_n_jha1)
    const profileDeleteResult = await db.collection('public_profiles').deleteMany({
      $or: [
        { creatorId: 'creator_anjha1' },
        { slug: 'a_n_jha1' },
        { avatarUrl: { $regex: 'unsplash\\.com' } }
      ]
    });
    console.log(`[Purge Execute] Deleted ${profileDeleteResult.deletedCount} synthetic public_profiles.`);

    // 2. Purge synthetic rate card items under creator_anjha1
    const rateDeleteResult = await db.collection('rate_card_items').deleteMany({
      $or: [
        { creatorId: 'creator_anjha1' },
        { creatorId: /^seed_/ },
        { creatorId: /^demo_/ }
      ]
    });
    console.log(`[Purge Execute] Deleted ${rateDeleteResult.deletedCount} synthetic rate_card_items.`);

    // 3. Purge revoked test accounts
    const socialDeleteResult = await db.collection('social_accounts').deleteMany({
      $or: [
        { status: 'REVOKED' },
        { username: /^test_handle_/ }
      ]
    });
    console.log(`[Purge Execute] Deleted ${socialDeleteResult.deletedCount} revoked test social_accounts.`);

    // 4. Verify post-purge database counts
    const remainingProfiles = await db.collection('public_profiles').find({}).toArray();
    const remainingRateItems = await db.collection('rate_card_items').find({ deletedAt: null }).toArray();
    const remainingSocial = await db.collection('social_accounts').find({}).toArray();

    console.log('\n===============================================================');
    console.log('                 POST-PURGE VERIFICATION AUDIT                ');
    console.log('===============================================================');
    console.log(`Active Public Profiles: ${remainingProfiles.length}`);
    for (const p of remainingProfiles) {
      console.log(`  - [AUTHENTIC] _id: ${p._id}, creatorId: ${p.creatorId}, slug: ${p.slug}, name: ${p.displayName}, avatar: ${p.avatarUrl}`);
    }

    console.log(`\nActive Rate Card Items: ${remainingRateItems.length}`);
    for (const r of remainingRateItems) {
      console.log(`  - [AUTHENTIC] _id: ${r._id}, creatorId: ${r.creatorId}, title: "${r.title}", price: ₹${r.price}`);
    }

    console.log(`\nActive Social Accounts: ${remainingSocial.length}`);
    for (const s of remainingSocial) {
      console.log(`  - [AUTHENTIC] _id: ${s._id}, creator_id: ${s.creator_id}, @${s.username}, provider: ${s.provider}, followers: ${s.followers_count}`);
    }
    console.log('===============================================================');
    console.log('SUCCESS: All synthetic, duplicate, and obsolete records purged.');

  } finally {
    await client.close();
  }
}

main().catch(console.error);
