const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('vinyl thương hiệu vẫn chuyển động khi desktop bật reduced-motion', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reducedMotion, /\.vinyl-disc\s*\{\s*animation:\s*vinylSpin\s+7s\s+linear\s+infinite\s*!important;/);
});
