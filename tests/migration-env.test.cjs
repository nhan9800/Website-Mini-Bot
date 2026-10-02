const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// CLI prebuild runs before Next.js: .env.local must determine the durable store.
test('Prebuild migration loads .env.local without changing exported function tests', t => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'mimi-feedback-env-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const target = path.join(cwd, 'persistent', 'reviews.json');
  fs.mkdirSync(path.join(cwd, '.next'));
  fs.writeFileSync(path.join(cwd, '.next', 'mimi_feedback_store.json'), JSON.stringify([
    { id: '1760000000000', userName: 'Member', comment: 'Review', stars: 5, isVerified: true },
  ]));
  fs.writeFileSync(path.join(cwd, '.env.local'), `MIMI_FEEDBACK_STORE="${target.replaceAll('\\', '/')}"\n`);
  const env = { ...process.env };
  delete env.MIMI_FEEDBACK_STORE;
  const result = spawnSync(process.execPath, [path.resolve(__dirname, '../scripts/migrate-feedback.cjs')], {
    cwd, env, encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(cwd, 'data', 'mimi_feedback_store.json')), false);
  const migrated = JSON.parse(fs.readFileSync(target, 'utf8'));
  assert.equal(migrated.length, 1);
  assert.equal(migrated[0].isVerified, false);
  assert.equal(migrated[0].avatar, '');
});
