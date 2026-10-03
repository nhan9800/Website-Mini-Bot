// Kiểm tra artifact sau khi bỏ dependency build. Không dùng token hoặc OAuth thật.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const port = 4319;
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ['server.cjs'], {
  cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port),
    MIMI_API_BASE: 'http://127.0.0.1:9', MIMI_API_TOKEN: '',
    DISCORD_CLIENT_SECRET: '', NEXTAUTH_SECRET: '', ADMIN_SECRET: '' },
});
let log = '';
child.stdout.on('data', chunk => { log = (log + chunk).slice(-12000); });
child.stderr.on('data', chunk => { log = (log + chunk).slice(-12000); });
let spawnError;
child.on('error', error => { spawnError = error; });
async function request(route) {
  return fetch(origin + route, { signal: AbortSignal.timeout(10000), redirect: 'manual' });
}
(async () => {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (spawnError) throw spawnError;
    if (child.exitCode !== null) throw new Error('Website dừng trước khi sẵn sàng.');
    try { ready = (await request('/api/version')).ok; } catch { /* Đợi server lắng nghe. */ }
    if (ready) break;
    await delay(1000);
  }
  assert.ok(ready, 'Website phải khởi động được khi không cài công cụ build.');
  const version = await (await request('/api/version')).json();
  assert.equal(version.version, '2.5.0');
  if (process.env.MIMI_EXPECTED_COMMIT) assert.equal(version.commit, process.env.MIMI_EXPECTED_COMMIT);
  for (const route of ['/', '/changelog', '/commands', '/partners', '/status', '/support', '/pricing', '/dashboard']) {
    const response = await request(route);
    assert.equal(response.status, 200, `${route} phải tải được.`);
    assert.ok((await response.text()).length > 100, `${route} phải có HTML.`);
  }
  console.log('Artifact khởi động và phục vụ 8 trang cùng API version với dependency production.');
})().catch(error => {
  console.error(error.message);
  console.error(log);
  process.exitCode = 1;
}).finally(() => { child.kill(); });
