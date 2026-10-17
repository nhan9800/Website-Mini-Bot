const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const bash = process.platform === 'win32'
  ? ['C:/Program Files/Git/bin/bash.exe', 'C:/Program Files (x86)/Git/bin/bash.exe'].find(fs.existsSync)
  : 'bash';
const hasBash = Boolean(bash && spawnSync(bash, ['--version'], { encoding: 'utf8' }).status === 0);
const posix = value => process.platform === 'win32'
  ? value.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_, drive) => '/' + drive.toLowerCase())
  : value;
const quote = value => "'" + String(value).replaceAll("'", "'\\''") + "'";

function write(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

function fixture(t, { badRuntime = false, missingBuild = false, runtimeArtifact = false } = {}) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'mimi-host-pull-'));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const home = path.join(base, 'home');
  const seed = path.join(base, 'seed');
  const remote = path.join(base, 'remote.git');
  const app = path.join(home, 'website-mini-bot');
  fs.mkdirSync(seed, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  const git = (dir, ...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git(base, 'init', '--bare', remote);
  git(seed, 'init', '--initial-branch=deploy');
  git(seed, 'config', 'user.name', 'Fixture');
  git(seed, 'config', 'user.email', 'fixture@offline.invalid');
  write(path.join(seed, '.gitignore'), '.env*\n!.env.example\ndata/\ntmp/\nnode_modules/\n.next/mimi_feedback_store.json\n');
  write(path.join(seed, 'scripts/host-pull.sh'), fs.readFileSync(path.join(root, 'scripts/host-pull.sh'), 'utf8'));
  write(path.join(seed, 'scripts/install-runtime.sh'), fs.readFileSync(path.join(root, 'scripts/install-runtime.sh'), 'utf8'));
  write(path.join(seed, 'scripts/migrate-feedback.cjs'), fs.readFileSync(path.join(root, 'scripts/migrate-feedback.cjs'), 'utf8'));
  write(path.join(seed, 'package.json'), JSON.stringify({ name: 'website-mini-bot', dependencies: { 'mimi-fixture-runtime': '1.0.0' } }));
  write(path.join(seed, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: {
    '': { dependencies: { 'mimi-fixture-runtime': '1.0.0' } }, 'node_modules/mimi-fixture-runtime': { version: '1.0.0' },
  } }));
  write(path.join(seed, '.next/BUILD_ID'), 'build_old');
  write(path.join(seed, 'page.txt'), 'old');
  git(seed, 'add', '-A');
  git(seed, 'commit', '-m', 'old');
  git(seed, 'remote', 'add', 'origin', remote);
  git(seed, 'push', 'origin', 'deploy');
  git(base, 'clone', '--branch=deploy', remote, app);
  const oldHead = git(app, 'rev-parse', 'HEAD');
  if (missingBuild) fs.unlinkSync(path.join(seed, '.next/BUILD_ID'));
  else write(path.join(seed, '.next/BUILD_ID'), 'build_new');
  write(path.join(seed, 'page.txt'), 'new');
  if (runtimeArtifact) {
    write(path.join(seed, '.env.local'), 'NOT_A_REAL_SECRET=fixture\n');
    git(seed, 'add', '--force', '.env.local');
  }
  git(seed, 'add', '-A');
  git(seed, 'commit', '-m', 'new');
  git(seed, 'push', 'origin', 'deploy');
  const newHead = git(seed, 'rev-parse', 'HEAD');

  // Runtime chỉ là dữ liệu giả trong fixture; không dùng OAuth/token/hosting.
  const store = path.join(home, 'persistent', 'reviews.json');
  write(path.join(app, '.env.local'), `MIMI_FEEDBACK_STORE="${store.replaceAll('\\', '/')}"\n`);
  write(path.join(app, 'data', 'keep.txt'), 'runtime');
  write(path.join(app, '.next', 'mimi_feedback_store.json'), JSON.stringify([
    { id: '1760000000000', userName: 'Member', stars: 4, comment: 'Đánh giá thật', isVerified: true },
  ]));
  const bin = path.join(base, 'bin');
  const npmLog = path.join(home, 'npm-calls');
  const npmFail = path.join(home, 'npm-fail');
  write(path.join(bin, 'npm'), `#!/bin/bash
set -e
printf 'ci\\n' >> "$MIMI_FIXTURE_NPM_LOG"
test ! -f "$MIMI_FIXTURE_NPM_FAIL"
for ARG in "$@"; do case "$ARG" in --prefix=*) PREFIX="\${ARG#--prefix=}";; esac; done
test -n "$PREFIX"
cmp package-lock.json "$PREFIX/package-lock.json"
mkdir -p "$PREFIX/node_modules/mimi-fixture-runtime"
printf '%s' '{"version":"1.0.0"}' > "$PREFIX/node_modules/mimi-fixture-runtime/package.json"
`);
  fs.chmodSync(path.join(bin, 'npm'), 0o755);
  if (badRuntime) {
    write(path.join(bin, 'node'), '#!/bin/bash\nexit 1\n');
    fs.chmodSync(path.join(bin, 'node'), 0o755);
  }
  const activation = path.join(home, 'nodevenv', 'website-mini-bot', '22', 'bin', 'activate');
  write(activation, `export PATH=${quote(posix(bin) + ':' + posix(path.dirname(process.execPath)))}:"$PATH"\n`);
  const modules = path.join(home, 'nodevenv', 'website-mini-bot', '22', 'lib', 'node_modules');
  fs.mkdirSync(modules, { recursive: true });
  fs.symlinkSync(modules, path.join(app, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  const env = { ...process.env, HOME: posix(home), NODE_PATH: path.join(root, 'node_modules'), MIMI_FIXTURE_NPM_LOG: posix(npmLog), MIMI_FIXTURE_NPM_FAIL: posix(npmFail) };
  delete env.MIMI_FEEDBACK_STORE;
  delete env.MIMI_DEPLOY_BRANCH;
  const run = () => spawnSync(bash, [posix(path.join(app, 'scripts/host-pull.sh'))], { cwd: app, env, encoding: 'utf8', timeout: 30000 });
  const install = () => spawnSync(bash, [posix(path.join(app, 'scripts/install-runtime.sh'))], { cwd: app, env, encoding: 'utf8', timeout: 30000 });
  return { app, home, git, run, install, modules, oldHead, newHead, store, npmLog, npmFail, pending: path.join(home, '.mimi-deploy-website-mini-bot.pending') };
}

test('CloudLinux cài bằng lockfile ở đúng prefix, giữ symlink và bỏ qua runtime đã khớp', { skip: !hasBash }, t => {
  const f = fixture(t);
  const link = fs.readlinkSync(path.join(f.app, 'node_modules'));
  const result = f.install();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(fs.readlinkSync(path.join(f.app, 'node_modules')), link);
  assert.equal(fs.readFileSync(path.join(path.dirname(f.modules), 'package-lock.json'), 'utf8'), fs.readFileSync(path.join(f.app, 'package-lock.json'), 'utf8'));
  assert.equal(f.install().status, 0);
  assert.equal(fs.readFileSync(f.npmLog, 'utf8'), 'ci\n');
  write(path.join(f.modules, 'mimi-fixture-runtime/package.json'), '{"version":"0.9.0"}');
  assert.equal(f.install().status, 0);
  assert.equal(fs.readFileSync(f.npmLog, 'utf8'), 'ci\nci\n');
  assert.equal(f.git(f.app, 'diff', '--stat'), '');
});

test('CloudLinux giữ thư mục node_modules vật lý và từ chối symlink sai virtualenv', { skip: !hasBash }, t => {
  const f = fixture(t);
  fs.unlinkSync(path.join(f.app, 'node_modules'));
  write(path.join(f.app, 'node_modules/keep.txt'), 'keep');
  assert.equal(f.install().status, 1);
  assert.equal(fs.readFileSync(path.join(f.app, 'node_modules/keep.txt'), 'utf8'), 'keep');
  assert.equal(fs.existsSync(f.npmLog), false);
  fs.renameSync(path.join(f.app, 'node_modules'), path.join(f.app, 'physical-modules'));
  fs.symlinkSync(path.join(f.app, 'physical-modules'), path.join(f.app, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(f.install().status, 1);
  assert.equal(fs.existsSync(f.npmLog), false);
});

test('CloudLinux chấp nhận manifest và lockfile tại prefix cùng trỏ tới file của ứng dụng', { skip: !hasBash }, t => {
  const f = fixture(t);
  for (const name of ['package.json', 'package-lock.json']) {
    fs.linkSync(path.join(f.app, name), path.join(path.dirname(f.modules), name));
  }
  const result = f.install();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(f.git(f.app, 'diff', '--stat'), '');
  assert.equal(fs.readFileSync(f.npmLog, 'utf8'), 'ci\n');
});

test('CloudLinux không chạy npm khi một lượt cài runtime khác giữ khóa', { skip: !hasBash }, t => {
  const f = fixture(t);
  const lock = path.join(f.home, '.mimi-runtime-website-mini-bot.lock');
  fs.mkdirSync(lock);
  assert.equal(f.install().status, 1);
  assert.equal(fs.existsSync(f.npmLog), false);
  assert.ok(fs.existsSync(lock));
  assert.equal(f.git(f.app, 'diff', '--stat'), '');
});

test('Cron migration chạy trước khi thay artifact và giữ cấu hình/dữ liệu runtime', { skip: !hasBash }, t => {
  const f = fixture(t);
  const oldConfig = fs.readFileSync(path.join(f.app, '.env.local'), 'utf8');
  const result = f.run();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(f.git(f.app, 'rev-parse', 'HEAD'), f.newHead);
  assert.equal(fs.readFileSync(path.join(f.app, '.next/BUILD_ID'), 'utf8'), 'build_new');
  assert.equal(fs.readFileSync(path.join(f.app, '.env.local'), 'utf8'), oldConfig);
  assert.equal(fs.readFileSync(path.join(f.app, 'data/keep.txt'), 'utf8'), 'runtime');
  const items = JSON.parse(fs.readFileSync(f.store, 'utf8'));
  assert.equal(items.length, 1);
  assert.equal(items[0].comment, 'Đánh giá thật');
  assert.equal(items[0].isVerified, false);
  const backupRoot = path.join(f.home, 'mimi-deploy-backups/website-mini-bot');
  const backup = path.join(backupRoot, fs.readdirSync(backupRoot)[0], 'feedback-legacy.json');
  assert.equal(JSON.parse(fs.readFileSync(backup, 'utf8'))[0].isVerified, true);
  assert.ok(fs.existsSync(path.join(f.app, 'tmp/restart.txt')));
  assert.equal(fs.existsSync(f.pending), false);
  assert.equal(f.run().status, 0);
  assert.equal(fs.readFileSync(f.npmLog, 'utf8'), 'ci\n');
});

for (const [name, options] of [
  ['Node không đáp ứng', { badRuntime: true }],
  ['artifact thiếu BUILD_ID', { missingBuild: true }],
  ['artifact chứa .env.local', { runtimeArtifact: true }],
]) {
  test(`Cron từ chối ${name} trước migration và thay checkout`, { skip: !hasBash }, t => {
    const f = fixture(t, options);
    const result = f.run();
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.equal(f.git(f.app, 'rev-parse', 'HEAD'), f.oldHead);
    assert.equal(fs.existsSync(f.store), false);
    assert.equal(fs.existsSync(f.npmLog), false);
    assert.equal(fs.existsSync(path.join(f.app, 'tmp/restart.txt')), false);
  });
}

test('Cron giữ nguyên sửa tay và lịch sử phân nhánh trên host', { skip: !hasBash }, t => {
  const f = fixture(t);
  write(path.join(f.app, 'page.txt'), 'sửa tay');
  assert.equal(f.run().status, 1);
  assert.equal(fs.readFileSync(path.join(f.app, 'page.txt'), 'utf8'), 'sửa tay');
  f.git(f.app, 'config', 'user.name', 'Fixture');
  f.git(f.app, 'config', 'user.email', 'fixture@offline.invalid');
  f.git(f.app, 'add', 'page.txt');
  f.git(f.app, 'commit', '-m', 'host-change');
  const diverged = f.git(f.app, 'rev-parse', 'HEAD');
  assert.equal(f.run().status, 1);
  assert.equal(f.git(f.app, 'rev-parse', 'HEAD'), diverged);
  assert.equal(fs.existsSync(f.store), false);
});

test('Cron dừng trước checkout khi kho đánh giá cũ bị hỏng', { skip: !hasBash }, t => {
  const f = fixture(t);
  write(path.join(f.app, '.next/mimi_feedback_store.json'), '{invalid');
  assert.equal(f.run().status, 1);
  assert.equal(f.git(f.app, 'rev-parse', 'HEAD'), f.oldHead);
  assert.equal(fs.readFileSync(path.join(f.app, '.next/BUILD_ID'), 'utf8'), 'build_old');
  assert.equal(fs.existsSync(f.npmLog), false);
});

test('npm ci lỗi không restart; cron tiếp theo hoàn tất checkpoint cùng HEAD', { skip: !hasBash }, t => {
  const f = fixture(t);
  write(f.npmFail, 'fail');
  assert.equal(f.run().status, 1);
  assert.equal(f.git(f.app, 'rev-parse', 'HEAD'), f.newHead);
  assert.ok(fs.existsSync(f.pending));
  assert.equal(fs.existsSync(path.join(f.app, 'tmp/restart.txt')), false);
  fs.unlinkSync(f.npmFail);
  const resumed = f.run();
  assert.equal(resumed.status, 0, resumed.stdout + resumed.stderr);
  assert.equal(fs.existsSync(f.pending), false);
  assert.ok(fs.existsSync(path.join(f.app, 'tmp/restart.txt')));
  assert.equal(fs.readFileSync(f.npmLog, 'utf8'), 'ci\nci\n');
});
