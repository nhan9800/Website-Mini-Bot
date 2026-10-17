#!/bin/bash
# CloudLinux npm_wrapper đổi --prefix sang nodevenv/lib và chỉ chép package.json.
# Chép cả lockfile tới prefix trước npm ci; giữ symlink tại Application Root.
set -eu
APP="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPNAME="$(basename "$APP")"
fail() { echo "HUỶ: $*" >&2; exit 1; }
cd "$APP"
test -f package-lock.json || fail "Thiếu package-lock.json."
VENV=""
for CANDIDATE in "$HOME"/nodevenv/"$APPNAME"/*/bin/activate; do
    test -f "$CANDIDATE" || continue
    if ( set +u; . "$CANDIDATE" && node -e 'const [a,b]=process.versions.node.split(".").map(Number);if(a<22||(a===22&&b<12))process.exit(1)' ); then
        VENV="$CANDIDATE"; break
    fi
done
test -n "$VENV" || fail "Cần nodevenv Node.js 22.12 trở lên."
set +u
. "$VENV"
set -u
PREFIX="$(dirname "$(dirname "$VENV")")/lib"
LOCK_DIR="$HOME/.mimi-runtime-$APPNAME.lock"
mkdir -- "$LOCK_DIR" 2>/dev/null || fail "Đang có lượt cài runtime khác; không chạy song song."
trap 'rmdir -- "$LOCK_DIR" 2>/dev/null || true' EXIT
mkdir -p "$PREFIX/node_modules"
if [ -e node_modules ] || [ -L node_modules ]; then
    test -L node_modules || fail "node_modules phải là symlink của CloudLinux; giữ nguyên thư mục hiện có."
    node -e 'const fs=require("node:fs");if(fs.realpathSync("node_modules")!==fs.realpathSync(process.argv[1]))process.exit(1)' "$PREFIX/node_modules" || fail "Symlink node_modules không trỏ tới nodevenv được chọn; kiểm tra Node.js App."
else
    ln -s "$PREFIX/node_modules" node_modules
fi
LOCK_HASH="$(sha256sum package-lock.json | cut -d ' ' -f 1)"
MARKER="$PREFIX/.mimi-runtime-lock.sha256"
verify_runtime() {
    node - "$APP" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const app = process.argv[2];
const lock = JSON.parse(fs.readFileSync(path.join(app, 'package-lock.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8'));
const req = createRequire(path.join(app, 'package.json'));
for (const name of Object.keys(manifest.dependencies || {})) {
    const expected = lock.packages?.['node_modules/' + name]?.version;
    const actual = JSON.parse(fs.readFileSync(path.join(app, 'node_modules', name, 'package.json'), 'utf8')).version;
    if (!expected || actual !== expected) throw new Error(`Dependency ${name} không khớp lockfile.`);
}
for (const name of ['next', 'next-auth', '@next/env']) {
    if (manifest.dependencies?.[name]) req.resolve(name);
}
NODE
}
if [ -f "$MARKER" ] && [ "$(cat "$MARKER")" = "$LOCK_HASH" ] && verify_runtime; then
    echo "Dependencies đã khớp lockfile; giữ nguyên runtime."
else
    # Không thay manifest/lockfile của checkout. Không dùng npm install để tự giải
    # lại version, không bỏ peer validation bằng --force/--legacy-peer-deps.
    [ package.json -ef "$PREFIX/package.json" ] || cp package.json "$PREFIX/package.json"
    [ package-lock.json -ef "$PREFIX/package-lock.json" ] || cp package-lock.json "$PREFIX/package-lock.json"
    npm ci --prefix="$PREFIX" --omit=dev --no-audit --no-fund --prefer-online --registry=https://registry.npmjs.org || fail "Cài runtime lỗi; chưa restart."
    test -L node_modules || fail "Mất symlink CloudLinux sau cài đặt."
    verify_runtime || fail "Runtime không khớp lockfile; chưa restart."
    printf '%s\n' "$LOCK_HASH" > "$MARKER"
fi
node scripts/migrate-feedback.cjs
echo "Runtime và kho đánh giá đã sẵn sàng."
