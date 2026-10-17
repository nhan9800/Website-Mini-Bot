const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { migrateFeedback } = require('../scripts/migrate-feedback.cjs');
const root = path.resolve(__dirname, '..');

// Nạp route cô lập: không khởi động Next.js, OAuth hoặc gửi request tới bot thật.
function loadTS(file, mocks = {}, env = {}, cwd = root) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const context = vm.createContext({
    module, exports: module.exports, Buffer, Request, Response, URL, console,
    process: { env, cwd: () => cwd },
    require(name) {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name === 'server-only') return {};
      if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
      if (name.startsWith('node:')) return require(name);
      throw new Error(`Thiếu mock cho ${name}`);
    },
  });
  vm.runInContext(code, context, { filename: file });
  return module.exports;
}

function request(body) {
  return new Request('http://offline.test/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

function temporaryStore(t) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'mimi-web-test-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  return { cwd, store: loadTS('src/lib/feedback-store.ts', {}, {}, cwd) };
}

test('Cấu hình guild từ chối JSON không phải đối tượng trước khi gọi bot', async () => {
  const calls = [];
  const route = loadTS('src/app/api/guilds/[guildId]/settings/route.ts', {
    '@/lib/mimi-api': {
      async callMimiApi(endpoint, init) { calls.push({ endpoint, init }); return { ok: true, data: { ok: true } }; },
      toRouteResponse(result) { return Response.json(result.data); },
    },
  });
  const context = { params: Promise.resolve({ guildId: '1517068246493429852' }) };
  for (const body of [null, [], 'prefix', 42, true]) {
    const req = new Request('http://offline.test/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-mimi-key': 'test-key' }, body: JSON.stringify(body) });
    assert.equal((await route.PATCH(req, context)).status, 400);
  }
  assert.equal(calls.length, 0);
  const req = new Request('http://offline.test/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-mimi-key': 'test-key' }, body: JSON.stringify({ prefix: 'mi', token: 'must-not-forward' }) });
  assert.equal((await route.PATCH(req, context)).status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.body.prefix, 'mi');
  assert.equal(Object.hasOwn(calls[0].init.body, 'token'), false);
});

test('Admin proxy từ chối mã tuỳ ý và không gửi credential client tới bot', async () => {
  const calls = [];
  const api = {
    async callMimiApi(endpoint, init) { calls.push({ endpoint, init }); return { ok: true, data: { ok: true } }; },
    toRouteResponse(result) { return Response.json(result.data); },
  };
  const noSecret = loadTS('src/app/api/license/admin/confirm/route.ts', { '@/lib/mimi-api': api });
  assert.equal((await noSecret.POST(request({ secret: 'anything' }))).status, 503);
  const configured = loadTS('src/app/api/license/admin/confirm/route.ts', { '@/lib/mimi-api': api }, { ADMIN_SECRET: 'test-admin-key' });
  for (const secret of ['anything', '', 'test-admin-kez']) {
    assert.equal((await configured.POST(request({ secret }))).status, 401);
  }
  assert.equal(calls.length, 0);
  assert.equal((await configured.POST(request({ secret: 'test-admin-key', guildId: '123', plan: 'pro', action: 'confirm' }))).status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.body.guildId, '123');
  assert.equal(Object.hasOwn(calls[0].init.body, 'secret'), false);
});

test('Đăng nhập Discord dừng khi thiếu khoá ký hoặc OAuth và không có khoá mặc định', async () => {
  let handled = 0;
  const mock = { 'next-auth': () => async () => { handled++; return Response.json({ ok: true }); }, '@/lib/auth-options': { authOptions: {} } };
  const incomplete = loadTS('src/app/api/auth/[...nextauth]/route.ts', mock, { DISCORD_CLIENT_ID: 'id', DISCORD_CLIENT_SECRET: 'secret' });
  assert.equal((await incomplete.GET(new Request('http://offline.test/auth'), { params: { nextauth: [] } })).status, 503);
  assert.equal(handled, 0);
  const complete = loadTS('src/app/api/auth/[...nextauth]/route.ts', mock, { NEXTAUTH_SECRET: 'signed-secret', DISCORD_CLIENT_ID: 'id', DISCORD_CLIENT_SECRET: 'secret' });
  assert.equal((await complete.POST(request({}), { params: { nextauth: [] } })).status, 200);
  assert.equal(handled, 1);
  const { authOptions } = loadTS('src/lib/auth-options.ts', { 'next-auth/providers/discord': options => options });
  assert.equal(authOptions.secret, undefined);
});

test('Xác minh user giữ verified false và trả lỗi trung lập khi bot mất kết nối', async () => {
  let result = { ok: false, status: 503, data: null };
  const route = loadTS('src/app/api/user/route.ts', { '@/lib/mimi-api': { callMimiApi: async () => result } });
  const req = { nextUrl: new URL('http://offline.test/user?q=tester') };
  let response = await route.GET(req);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).user, null);
  result = { ok: true, status: 200, data: { ok: true, user: { id: '123', verified: false, inServer: false } } };
  response = await route.GET(req);
  const data = await response.json();
  assert.equal(data.user.verified, false);
  assert.equal(data.user.inServer, false);
});

test('Đội ngũ rỗng được giữ rỗng, lỗi API không dựng thành viên và trạng thái lạ là unknown', async () => {
  let result = { ok: true, status: 200, data: { ok: true, team: [] } };
  const route = loadTS('src/app/api/team/route.ts', { '@/lib/mimi-api': { callMimiApi: async () => result } });
  let response = await route.GET();
  assert.deepEqual((await response.json()).team, []);
  result = { ok: false, status: 503, data: null };
  response = await route.GET();
  assert.equal(response.status, 503);
  assert.deepEqual((await response.json()).team, []);
  result = { ok: true, data: { ok: true, team: [{ id: '123', name: 'Staff', role: 'Moderator', status: 'missing' }] } };
  response = await route.GET();
  const data = await response.json();
  assert.equal(data.team.length, 1);
  assert.equal(data.team[0].status, 'unknown');
  assert.equal(data.team[0].group, 'admin');
});

test('Đánh giá chỉ tính dữ liệu thật, ghi bền vững ngoài .next và không nhận xác minh từ client', async t => {
  const { cwd, store } = temporaryStore(t);
  assert.equal(store.feedbackStats(store.loadFeedback()).averageStars, null);
  assert.equal(store.feedbackStats(store.loadFeedback()).totalReviews, 0);
  let session = null;
  const route = loadTS('src/app/api/feedback/route.ts', {
    '@/lib/feedback-store': store, '@/lib/auth-options': { authOptions: {} }, 'next-auth': { getServerSession: async () => session },
  }, { NEXTAUTH_SECRET: 'test-session-key' });
  let response = await route.POST(request({ stars: 2, comment: 'Cần cải thiện', userName: 'Guest', avatar: 'https://fake.test/avatar', isVerified: true }));
  assert.equal(response.status, 200);
  let data = await response.json();
  assert.equal(data.averageStars, 2);
  assert.equal(data.totalReviews, 1);
  assert.equal(data.recentFeedbacks[0].isVerified, false);
  assert.equal(data.recentFeedbacks[0].avatar, '');
  assert.ok(fs.existsSync(path.join(cwd, 'data', 'mimi_feedback_store.json')));
  assert.equal(fs.existsSync(path.join(cwd, '.next')), false);
  session = { user: { id: '123', name: 'Discord Member', image: 'https://cdn.discordapp.com/avatar.png' } };
  response = await route.POST(request({ stars: 4, comment: 'Ổn', userName: 'Spoof' }));
  data = await response.json();
  assert.equal(data.totalReviews, 2);
  assert.equal(data.averageStars, 3);
  assert.equal(data.recentFeedbacks[0].isVerified, true);
  assert.equal(data.recentFeedbacks[0].userName, 'Discord Member');
});

test('Đánh giá không báo lưu thành công nếu kho dữ liệu lỗi và không tạo nội dung mặc định', async t => {
  const { cwd, store } = temporaryStore(t);
  const route = loadTS('src/app/api/feedback/route.ts', {
    '@/lib/feedback-store': store, '@/lib/auth-options': { authOptions: {} }, 'next-auth': { getServerSession: async () => null },
  });
  for (const body of [{ stars: 5, comment: '' }, { stars: 0, comment: 'test' }, { stars: 2.5, comment: 'test' }, { stars: 5, comment: 'x'.repeat(301) }]) {
    assert.equal((await route.POST(request(body))).status, 400);
  }
  fs.mkdirSync(path.join(cwd, 'data'));
  fs.writeFileSync(path.join(cwd, 'data', 'mimi_feedback_store.json'), '{invalid-json');
  const failedRead = await route.GET();
  assert.equal(failedRead.status, 503);
  assert.equal((await failedRead.json()).averageStars, null);
  assert.equal((await route.POST(request({ stars: 5, comment: 'Đánh giá thật' }))).status, 503);
  assert.equal(fs.readFileSync(path.join(cwd, 'data', 'mimi_feedback_store.json'), 'utf8'), '{invalid-json');
});

test('Rebuild bảo toàn đánh giá cũ thật, bỏ dữ liệu mẫu và giữ kho mới nếu đã tồn tại', t => {
  const { cwd } = temporaryStore(t);
  fs.mkdirSync(path.join(cwd, '.next'));
  const legacy = path.join(cwd, '.next', 'mimi_feedback_store.json');
  const real = { id: '1728000000000', userName: 'Guest', stars: 3, comment: 'Thật', isVerified: true, avatar: 'client-avatar' };
  fs.writeFileSync(legacy, JSON.stringify([{ ...real, id: '1' }, real]));
  assert.equal(migrateFeedback(cwd), true);
  const target = path.join(cwd, 'data', 'mimi_feedback_store.json');
  const data = JSON.parse(fs.readFileSync(target, 'utf8'));
  assert.equal(data.length, 1);
  assert.equal(data[0].isVerified, false);
  assert.equal(data[0].avatar, '');
  assert.equal(migrateFeedback(cwd), false);
  assert.ok(fs.existsSync(legacy));
});
