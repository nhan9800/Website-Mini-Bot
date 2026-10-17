const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

// Chỉ đọc phần khai báo lệnh, không nạp index.js có login, lịch chạy và ghi dữ liệu.
const botPath = process.argv.slice(2).find(argument => argument !== '--check');
const botDir = botPath ? path.resolve(process.cwd(), botPath) : path.resolve(__dirname, '../../D-n-MimiBot');
const source = fs.readFileSync(path.join(botDir, 'index.js'), 'utf8');
const start = source.indexOf('    const commands = [');
const end = source.indexOf('    const botId =', start);
assert.ok(start >= 0 && end > start, 'Không tìm thấy vùng đăng ký slash command.');
const discord = createRequire(path.join(botDir, 'package.json'))('discord.js');
const registered = Array.from(vm.runInNewContext(`(() => { ${source.slice(start, end)} return commands; })()`, {
  SlashCommandBuilder: discord.SlashCommandBuilder,
  PermissionFlagsBits: discord.PermissionFlagsBits,
  ChannelType: discord.ChannelType,
}), command => command.toJSON());

// Giữ cùng cấu trúc với getCommandCatalog() trong internalApi.js.
const catalog = registered.map(command => ({
  name: command.name,
  description: command.description || '',
  options: (command.options || []).map(option => ({
    name: option.name,
    description: option.description || '',
    type: option.type,
    required: !!option.required,
  })),
  defaultMemberPermissions: command.default_member_permissions == null ? null : String(command.default_member_permissions),
})).sort((a, b) => a.name.localeCompare(b.name));
assert.ok(catalog.length > 0 && catalog.length <= 100);
assert.equal(new Set(catalog.map(command => command.name)).size, catalog.length);
const file = path.resolve(__dirname, '../src/lib/commands-fallback.json');
if (process.argv.includes('--check')) {
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), catalog, 'Danh mục dự phòng cần được chụp lại từ đăng ký lệnh.');
  console.log(`Danh mục ${catalog.length} lệnh khớp phần đăng ký thật của Mimi.`);
} else {
  fs.writeFileSync(file, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log(`Đã chụp ${catalog.length} lệnh từ phần đăng ký thật của Mimi.`);
}
