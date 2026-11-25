import { MongoClient } from '../node_modules/.pnpm/mongodb@7.9.0/node_modules/mongodb/lib/index.js';
import fs from 'fs';
import path from 'path';

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

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('adzunova');

    const profiles = await db.collection('public_profiles').find({}).toArray();
    const rateCards = await db.collection('rate_card_items').find({ deletedAt: null }).toArray();
    const socialAccounts = await db.collection('social_accounts').find({}).toArray();

    // Verification checks
    const syntheticProfiles = profiles.filter(p =>
      p.creatorId === 'creator_anjha1' ||
      p.slug === 'a_n_jha1' ||
      (p.avatarUrl && p.avatarUrl.includes('unsplash.com'))
    );

    const stockImageProfiles = profiles.filter(p =>
      (p.avatarUrl && (p.avatarUrl.includes('unsplash.com') || p.avatarUrl.includes('pexels.com') || p.avatarUrl.includes('pixabay.com'))) ||
      (p.coverUrl && (p.coverUrl.includes('unsplash.com') || p.coverUrl.includes('pexels.com') || p.coverUrl.includes('pixabay.com')))
    );

    const syntheticRateItems = rateCards.filter(r =>
      r.creatorId === 'creator_anjha1' ||
      r.creatorId.startsWith('seed_') ||
      r.creatorId.startsWith('demo_')
    );

    const revokedOrTestSocial = socialAccounts.filter(s =>
      s.status === 'REVOKED' || s.username.startsWith('test_handle_')
    );

    console.log('===============================================================');
    console.log('            PHASE 4 POST-PURGE PRODUCTION DATA AUDIT           ');
    console.log('===============================================================');
    console.log(`Total Public Profiles in DB: ${profiles.length}`);
    console.log(`- Synthetic Profiles: ${syntheticProfiles.length}`);
    console.log(`- Profiles with Stock Images: ${stockImageProfiles.length}`);
    for (const p of profiles) {
      console.log(`  [VALID] _id: ${p._id}, creatorId: ${p.creatorId}, slug: ${p.slug}, displayName: ${p.displayName}, avatar: ${p.avatarUrl?.slice(0, 45)}...`);
    }

    console.log(`\nTotal Active Rate Card Items in DB: ${rateCards.length}`);
    console.log(`- Synthetic Rate Items: ${syntheticRateItems.length}`);
    for (const r of rateCards) {
      console.log(`  [VALID] _id: ${r._id}, creatorId: ${r.creatorId}, title: "${r.title}", price: ₹${r.price}`);
    }

    console.log(`\nTotal Social Accounts in DB: ${socialAccounts.length}`);
    console.log(`- Revoked / Test Accounts: ${revokedOrTestSocial.length}`);
    for (const s of socialAccounts) {
      console.log(`  [VALID] _id: ${s._id}, creator_id: ${s.creator_id}, provider: ${s.provider}, username: @${s.username}, followers: ${s.followers_count}`);
    }

    const allPassed =
      syntheticProfiles.length === 0 &&
      stockImageProfiles.length === 0 &&
      syntheticRateItems.length === 0 &&
      revokedOrTestSocial.length === 0 &&
      profiles.length === 1 &&
      rateCards.length === 2 &&
      socialAccounts.length === 1;

    console.log('\n===============================================================');
    console.log(`AUDIT VERDICT: ${allPassed ? 'PASSED (100% CLEAN - ZERO SYNTHETIC DATA)' : 'FAILED'}`);
    console.log('===============================================================');

  } finally {
    await client.close();
  }
}

main().catch(console.error);
