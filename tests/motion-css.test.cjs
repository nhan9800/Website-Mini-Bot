const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('vinyl thương hiệu vẫn chuyển động khi desktop bật reduced-motion', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  const trending = fs.readFileSync(path.resolve(__dirname, '../src/components/trending-chart.tsx'), 'utf8');
  const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reducedMotion, /\.vinyl-disc\s*\{\s*animation:\s*vinylSpin\s+7s\s+linear\s+infinite\s*!important;/);
  assert.match(reducedMotion, /\.animate-soundwave\s*\{\s*animation:\s*soundwave\s+var\(--soundwave-duration,\s*1\.1s\)\s+ease-in-out\s+var\(--soundwave-delay,\s*0s\)\s+infinite\s*!important;/);
  assert.match(css, /@keyframes\s+trendingEqualizer[\s\S]*?50%\s*\{\s*transform:\s*scaleY\(1\)/);
  assert.match(trending, /className=\"trending-equalizer\b/);
});

test('equalizer BXH dùng nhịp riêng để không đứng hình trên desktop', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  assert.match(css, /@keyframes trendingEqualizer\s*\{/);
  assert.match(css, /\.trending-equalizer\s*\{[\s\S]*display:\s*inline-block;[\s\S]*animation-name:\s*trendingEqualizer\s*!important;[\s\S]*animation-duration:\s*var\(--trending-animation-duration,\s*0\.96s\)\s*!important;/);
});

test('BXH dùng thanh cuộn dọc riêng và chặn tràn ngang', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  const trending = fs.readFileSync(path.resolve(__dirname, '../src/components/trending-chart.tsx'), 'utf8');
  assert.match(trending, /className="trending-scroll-list[^\"]*overflow-x-hidden overflow-y-auto/);
  assert.match(css, /\.trending-scroll-list\s*\{[\s\S]*scrollbar-gutter:\s*stable;[\s\S]*overscroll-behavior:\s*contain;/);
  assert.match(css, /\.trending-scroll-list::\-webkit-scrollbar\s*\{[\s\S]*width:\s*7px;[\s\S]*height:\s*0;/);
  assert.match(css, /\.trending-scroll-list::\-webkit-scrollbar-corner\s*\{[\s\S]*background:\s*transparent;/);
  assert.match(css, /@media \(max-width:\s*767px\)\s*\{[\s\S]*\.trending-scroll-list\s*\{[\s\S]*overscroll-behavior-y:\s*auto;[\s\S]*-webkit-overflow-scrolling:\s*touch;/);
});

test('Soundwave gắn class chạy lại khi reduced-motion override animation', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  const soundwave = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/soundwave.tsx'), 'utf8');
  assert.match(soundwave, /soundwave-bar/);
  assert.match(soundwave, /playing \? 'animate-soundwave' : ''/);
  assert.match(css, /\.soundwave-bar\.animate-soundwave\s*\{\s*animation:\s*soundwave\s+var\(--soundwave-duration,\s*1\.1s\)\s+ease-in-out\s+var\(--soundwave-delay,\s*0s\)\s+infinite\s*!important;/);
  assert.match(soundwave, /'--soundwave-duration'/);
  assert.match(soundwave, /'--soundwave-delay'/);
});

test('StatusModal dùng animation của dialog chung, không phụ thuộc utility plugin chưa cài', () => {
  const modal = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/status-modal.tsx'), 'utf8');
  const shell = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/modal-shell.tsx'), 'utf8');
  assert.doesNotMatch(modal, /animate-in|zoom-in-95/);
  assert.match(modal, /<ModalShell\b/);
  assert.match(shell, /<AnimatePresence\b/);
  assert.match(shell, /<motion\.div\b[\s\S]*?exit=\{\{/);
});

test('Branded motion không bị OS reduced-motion tắt toàn cục', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');
  assert.doesNotMatch(css, /\*\s*,\s*\*::before\s*,\s*\*::after\s*\{\s*animation:\s*none\s*!important/);
  for (const file of [
    '../src/components/ui/reveal.tsx',
    '../src/components/layout/route-transition.tsx',
    '../src/components/ui/tilt-card.tsx',
    '../src/components/music/web-player.tsx',
    '../src/components/ui/notification-provider.tsx',
    '../src/app/pricing/page.tsx',
  ]) {
    const source = fs.readFileSync(path.resolve(__dirname, file), 'utf8');
    assert.doesNotMatch(source, /useReducedMotion|reducedMotion/);
  }
  const particles = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/particles.tsx'), 'utf8');
  assert.doesNotMatch(particles, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
});
