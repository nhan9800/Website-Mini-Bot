const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/team-spotlights.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject });
const { TEAM_SPOTLIGHTS, partitionTeamMembers } = exportsObject;
const normalize = value => JSON.parse(JSON.stringify(value));

function member(id, overrides = {}) {
  return { id, name: 'Discord member', username: 'member', role: 'Quản trị', color: '#8bdbbd',
    avatar: null, status: 'unknown', description: 'Đồng bộ từ Discord', isDev: false,
    group: 'admin', ...overrides };
}

test('Vinh danh đúng hai Discord ID theo thứ tự Founder và Developer, không suy diễn từ role', () => {
  const owner = member('1143387904064888942', { role: 'Thành viên', group: 'community' });
  const developer = member('1138315103821889566', { role: 'Support' });
  const anotherFounder = member('111111111111111111', { role: 'Founder', group: 'core' });
  const result = partitionTeamMembers([developer, anotherFounder, owner]);
  assert.deepEqual(normalize(TEAM_SPOTLIGHTS.map(item => [item.key, item.id])), [
    ['founder', owner.id], ['developer', developer.id],
  ]);
  assert.deepEqual(normalize(result.featured.map(item => [item.kind, item.member.id])), [
    ['founder', owner.id], ['developer', developer.id],
  ]);
  assert.equal(result.featured[0].member, owner);
  assert.equal(result.featured[1].member, developer);
  assert.deepEqual(normalize(result.remaining.map(item => item.id)), [anotherFounder.id]);
});

test('Không tạo người giả hoặc dùng người khác khi ID được vinh danh vắng mặt', () => {
  assert.deepEqual(normalize(partitionTeamMembers([])), { featured: [], remaining: [] });
  const someone = member('111111111111111111', { role: 'Founder Developer', isDev: true, group: 'core' });
  const onlyOther = partitionTeamMembers([someone]);
  assert.equal(onlyOther.featured.length, 0);
  assert.equal(onlyOther.remaining[0], someone);
  const developer = member('1138315103821889566');
  const onlyDeveloper = partitionTeamMembers([developer]);
  assert.deepEqual(normalize(onlyDeveloper.featured.map(item => item.kind)), ['developer']);
  assert.equal(onlyDeveloper.featured[0].member, developer);
});

test('Loại bản ghi trùng và đối tác khỏi danh sách còn lại mà không sửa dữ liệu đầu vào', () => {
  const owner = member('1143387904064888942');
  const admin = member('222222222222222222');
  const partner = member('333333333333333333', { group: 'partner' });
  const input = Object.freeze([owner, { ...owner, name: 'Duplicate' }, admin, { ...admin }, partner]);
  const result = partitionTeamMembers(input);
  assert.equal(result.featured.length, 1);
  assert.equal(result.featured[0].member, owner);
  assert.equal(result.remaining.length, 1);
  assert.equal(result.remaining[0], admin);
  assert.equal(input.length, 5);
});
