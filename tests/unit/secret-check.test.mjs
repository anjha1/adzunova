import test from 'node:test';
import assert from 'node:assert/strict';
import { scanContentForSecrets, runSecretCheck } from '../../scripts/pre-commit-secret-check.mjs';

test('Secret Check: catches planted fake Razorpay test/live keys and Mongo URIs with credentials', () => {
  const fakeRazorpayTest = `const k = "rzp_test_FakeUnitTestKey12345";`;
  const res1 = scanContentForSecrets(fakeRazorpayTest, 'src/fake.ts');
  assert.equal(res1.length, 1);
  assert.equal(res1[0].rule, 'RAZORPAY_TEST_KEY');

  const fakeRazorpayLive = `const k = "rzp_live_FakeUnitLiveKey12345";`;
  const res2 = scanContentForSecrets(fakeRazorpayLive, 'src/fake2.ts');
  assert.equal(res2.length, 1);
  assert.equal(res2[0].rule, 'RAZORPAY_LIVE_KEY');

  const fakeMongoUri = `const u = "mongodb+srv://user:supersecret@cluster.example.com/db";`;
  const res3 = scanContentForSecrets(fakeMongoUri, 'src/db.ts');
  assert.equal(res3.length, 1);
  assert.equal(res3[0].rule, 'MONGODB_URI_CREDENTIALS');
});

test('Secret Check: repository currently passes secret-check cleanly', () => {
  const res = runSecretCheck(process.cwd());
  assert.equal(res.ok, true, `Unexpected secret-check violations: ${JSON.stringify(res.violations)}`);
});
