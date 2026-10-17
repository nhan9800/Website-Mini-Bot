const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const catalog = require('../src/lib/commands-fallback.json');

test('Danh mục dự phòng có tên và tùy chọn lệnh thật của Mimi 1.4.0', () => {
  assert.equal(catalog.length, 99);
  assert.equal(new Set(catalog.map(command => command.name)).size, 99);
  for (const name of ['play', 'queue', 'leave', 'setupverify', 'setupemoji', 'addemoji', 'help']) {
    assert.ok(catalog.some(command => command.name === name), `Có /${name}`);
  }
  assert.equal(catalog.find(command => command.name === 'play').options[0].name, 'từ_khóa');
  for (const name of ['pause', 'resume', 'skip', 'volume', 'loop', 'lyrics', 'attendance', 'config']) {
    assert.ok(!catalog.some(command => command.name === name), `Không tạo lệnh /${name}`);
  }
});

const botDir = path.resolve(__dirname, '../../D-n-MimiBot');
test('Bản chụp khớp phần đăng ký lệnh và phép ánh xạ Internal API', {
  skip: !fs.existsSync(path.join(botDir, 'node_modules/discord.js/package.json')),
}, () => {
  const result = spawnSync(process.execPath, [path.resolve(__dirname, '../scripts/snapshot-commands.cjs'), botDir, '--check'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
