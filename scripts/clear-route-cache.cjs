const fs = require('node:fs');
const path = require('node:path');

// Git fast-forward replaces build seeds, but leaves Next's untracked response
// cache behind. Its keys identify routes, not BUILD_ID, so a fresh process can
// otherwise prefer HTML/RSC from the previous deployment over the new seeds.
// Run before Next.prepare() in each Passenger worker. Fetch cache, feedback,
// configuration and compiled build files are deliberately outside this path.
function clearRouteCache(appRoot) {
  const root = fs.realpathSync(appRoot);
  const cache = path.join(root, '.next', 'server', 'route-cache');
  if (!fs.existsSync(cache)) return false;
  const build = fs.readFileSync(path.join(root, '.next', 'BUILD_ID'), 'utf8').trim();
  if (!/^[A-Za-z0-9_-]+$/.test(build)) throw new Error('BUILD_ID không hợp lệ; giữ nguyên cache.');
  for (const relative of ['.next', '.next/server', '.next/server/route-cache']) {
    const target = path.join(root, relative);
    const stat = fs.lstatSync(target);
    if (!stat.isDirectory() || stat.isSymbolicLink() || fs.realpathSync(target) !== target) {
      throw new Error('Đường dẫn cache không an toàn; giữ nguyên để kiểm tra.');
    }
  }
  fs.rmSync(cache, { recursive: true });
  return true;
}

module.exports = { clearRouteCache };
