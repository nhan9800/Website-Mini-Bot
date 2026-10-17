const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { clearRouteCache } = require('../scripts/clear-route-cache.cjs');
const FileSystemCache = require('next/dist/server/lib/incremental-cache/file-system-cache').default;
const { getRouteCacheKey } = require('next/dist/server/lib/route-cache-key');

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'mimi-route-cache-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, contents) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  };
  write('.next/BUILD_ID', 'build_new');
  return { root, write };
}

test('Passenger bỏ HTML/RSC cũ còn sót sau Git pull; Next thật đọc seed của build mới', async t => {
  const { root, write } = fixture(t);
  const owner = { kind: 'APP_PAGE', sourceRoute: '/page' };
  const key = getRouteCacheKey('/', owner);
  const meta = JSON.stringify({ routeCache: { key, owner, isFallback: false } });
  for (const [prefix, label] of [['.next/server/app/index', 'new'], ['.next/server' + key, 'old']]) {
    write(prefix + '.html', label + ' HTML');
    write(prefix + '.rsc', label + ' RSC');
    write(prefix + '.meta', meta);
  }
  write('.next/cache/fetch-cache/keep.json', 'fetch');
  write('.next/mimi_feedback_store.json', 'legacy reviews');
  write('data/reviews.json', 'current reviews');
  write('.env.local', 'fixture only');
  const open = () => new FileSystemCache({ fs: { ...fs.promises, existsSync: fs.existsSync, readFileSync: fs.readFileSync },
    serverDistDir: path.join(root, '.next/server'), revalidatedTags: [], maxMemoryCacheSize: 0, flushToDisk: false });
  const ctx = { kind: 'APP_PAGE', isFallback: false };
  const stale = await open().get(key, ctx);
  assert.equal(stale.value.html, 'old HTML');
  assert.equal(clearRouteCache(root), true);
  const fresh = await open().get(key, ctx);
  assert.equal(fresh.value.html, 'new HTML');
  assert.equal(fresh.value.rscData.toString(), 'new RSC');
  for (const file of ['.next/cache/fetch-cache/keep.json', '.next/mimi_feedback_store.json', 'data/reviews.json', '.env.local', '.next/BUILD_ID']) {
    assert.ok(fs.existsSync(path.join(root, file)), file + ' được giữ nguyên');
  }
  assert.equal(clearRouteCache(root), false);
});

test('Không đi theo symlink cache hoặc xóa cache khi thiếu BUILD_ID hợp lệ', t => {
  const { root, write } = fixture(t);
  write('outside/keep.txt', 'keep');
  fs.mkdirSync(path.join(root, '.next/server'), { recursive: true });
  fs.symlinkSync(path.join(root, 'outside'), path.join(root, '.next/server/route-cache'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => clearRouteCache(root), /không an toàn/);
  assert.equal(fs.readFileSync(path.join(root, 'outside/keep.txt'), 'utf8'), 'keep');
  fs.unlinkSync(path.join(root, '.next/server/route-cache'));
  write('.next/server/route-cache/keep.txt', 'keep');
  write('.next/BUILD_ID', '../invalid');
  assert.throws(() => clearRouteCache(root), /BUILD_ID/);
  assert.ok(fs.existsSync(path.join(root, '.next/server/route-cache/keep.txt')));
});

test('Hai startup Passenger giống nhau và clear cache trước Next.prepare', () => {
  const root = path.join(__dirname, '..');
  const cjs = fs.readFileSync(path.join(root, 'server.cjs'), 'utf8');
  assert.equal(cjs, fs.readFileSync(path.join(root, 'server.js'), 'utf8'));
  assert.ok(cjs.indexOf('clearRouteCache(__dirname)') < cjs.indexOf('app.prepare()'));
});
