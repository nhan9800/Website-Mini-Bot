const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('vinyl thương hiệu vẫn chuyển động khi desktop bật reduced-motion', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  const trending = fs.readFileSync(path.resolve(__dirname, '../src/components/trending-chart.tsx'), 'utf8');
  const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reducedMotion, /\.vinyl-disc\s*\{\s*animation:\s*vinylSpin\s+7s\s+linear\s+infinite\s*!important;/);
  assert.match(reducedMotion, /\.animate-soundwave\s*\{\s*animation:\s*soundwave\s+1\.1s\s+ease-in-out\s+infinite\s*!important;/);
  assert.match(css, /@keyframes\s+trendingEqualizer[\s\S]*?50%\s*\{\s*transform:\s*scaleY\(1\)/);
  assert.match(trending, /className=\"trending-equalizer\b/);
});

test('equalizer BXH dùng nhịp riêng để không đứng hình trên desktop', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  assert.match(css, /@keyframes trendingEqualizer\s*\{/);
  assert.match(css, /\.trending-equalizer\s*\{[\s\S]*animation-name:\s*trendingEqualizer\s*!important;[\s\S]*animation-duration:\s*var\(--trending-animation-duration,\s*0\.96s\)\s*!important;/);
});
