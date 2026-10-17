const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

for (const entry of ['server.cjs', 'server.js']) {
  test(`${entry}: lỗi request trả 500 trung lập, chi tiết chỉ ở log server`, async () => {
    const privateMessage = 'ECONNREFUSED internal-host:1234 /private/app/config';
    let handleRequest;
    const logged = [];
    const startup = [];
    const code = fs.readFileSync(path.join(__dirname, '..', entry), 'utf8');
    vm.runInNewContext(code, {
      __dirname: path.join(__dirname, '..'),
      process: { env: {}, exit: () => assert.fail('Không được thoát server') },
      console: { log() {}, error: (...args) => logged.push(args) },
      require(name) {
        if (name === 'node:http') return { createServer(handler) { handleRequest = handler; return { listen() {} }; } };
        if (name === './scripts/clear-route-cache.cjs') return { clearRouteCache() { startup.push('clear'); return true; } };
        if (name === 'next') return () => ({ prepare: async () => { startup.push('prepare'); }, getRequestHandler: () => async () => { throw new Error(privateMessage); } });
        throw new Error(`Thiếu mock: ${name}`);
      },
    }, { filename: entry });
    await new Promise(setImmediate);
    assert.deepEqual(startup, ['clear', 'prepare']);
    const response = { headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(body) { this.body = body; } };
    handleRequest({}, response);
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(response.statusCode, 500);
    assert.equal(response.headers['Content-Type'], 'application/json; charset=utf-8');
    assert.equal(typeof JSON.parse(response.body).error, 'string');
    assert.equal(response.body.includes('internal-host'), false);
    assert.equal(response.body.includes('/private/app/config'), false);
    assert.equal(logged.length, 1);
    assert.equal(logged[0][1].message, privateMessage);
  });
}
