const fs = require('node:fs');
const path = require('node:path');

function migrateFeedback(cwd = process.cwd(), configuredFile = process.env.MIMI_FEEDBACK_STORE) {
  const legacy = path.join(cwd, '.next', 'mimi_feedback_store.json');
  const target = configuredFile || path.join(cwd, 'data', 'mimi_feedback_store.json');
  if (fs.existsSync(target) || !fs.existsSync(legacy)) return false;
  const items = JSON.parse(fs.readFileSync(legacy, 'utf8'));
  if (!Array.isArray(items)) throw new Error('Kho đánh giá cũ không hợp lệ; dừng build để bảo toàn dữ liệu.');
  // Bản cũ dùng ID timestamp cho đánh giá thật, ID 1–4 là dữ liệu mẫu.
  // Cờ xác minh và avatar cũ do client tự khai nên không được coi là đã xác minh.
  const actual = items.filter(item => item && /^\d{10,}$/.test(item.id) &&
    typeof item.userName === 'string' && typeof item.comment === 'string' &&
    Number.isInteger(item.stars) && item.stars >= 1 && item.stars <= 5)
    .slice(0, 50).map(item => ({ ...item, isVerified: false, avatar: '' }));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target + '.tmp', JSON.stringify(actual, null, 2), 'utf8');
  fs.renameSync(target + '.tmp', target);
  return true;
}

if (require.main === module) {
  // Prebuild precedes Next startup: resolve the same .env.local files first.
  require('@next/env').loadEnvConfig(process.cwd());
  if (migrateFeedback()) console.log('Đã bảo toàn đánh giá thật trước khi rebuild .next.');
}
module.exports = { migrateFeedback };
