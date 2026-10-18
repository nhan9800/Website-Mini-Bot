const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise component effects without a browser or requests to a real provider.
function componentHarness(file, exportName, player = {}) {
  const states = [], refs = [], effects = [], requests = [], intervals = new Set(), timers = new Set();
  let stateIndex = 0, refIndex = 0, writes = 0, tree, rendered = false;
  const react = {
    useState(initial) {
      const index = stateIndex++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => { states[index] = value; writes++; }];
    },
    useRef(initial) {
      const index = refIndex++;
      return refs[index] ??= { current: initial };
    },
    useCallback: (callback) => callback,
    useEffect: (effect) => { if (!rendered) effects.push(effect); },
  };
  const jsx = (type, props) => ({ type, props });
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, AbortController, Date,
    console: { error() {} },
    navigator: { clipboard: { writeText: async () => {} } },
    fetch: (url, options) => new Promise((resolve) => requests.push({ url, options, resolve })),
    setInterval: (callback) => { intervals.add(callback); return callback; },
    clearInterval: (callback) => intervals.delete(callback),
    setTimeout: (callback) => { const timer = () => { timers.delete(timer); callback(); }; timers.add(timer); return timer; },
    clearTimeout: (callback) => timers.delete(callback),
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'framer-motion') return { motion: { li: 'li' } };
      if (name.endsWith('use-player-store')) {
        const usePlayerStore = () => player;
        usePlayerStore.getState = () => player;
        return { usePlayerStore };
      }
      return {};
    },
  });
  return {
    states, refs, effects, requests, intervals, timers,
    get writes() { return writes; },
    render() { stateIndex = 0; refIndex = 0; tree = module.exports[exportName](); rendered = true; return tree; },
    mount() { this.render(); return effects[0](); },
  };
}

const songFeed = (title, previewUrl = null) => ({ ok: true, json: async () => ({ feed: { entry: [{ 'im:name': { label: title }, link: previewUrl ? [{ attributes: { title: 'Preview', href: previewUrl } }] : [] }] } }) });
const flush = () => new Promise(setImmediate);
function findNode(node, predicate) {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) return node.map((child) => findNode(child, predicate)).find(Boolean);
  return predicate(node) ? node : findNode(node.props?.children, predicate);
}

test('trending polling keeps one request and manual refresh discards stale responses', async () => {
  const harness = componentHarness('../src/components/trending-chart.tsx', 'TrendingChart');
  const unmount = harness.mount();
  assert.equal(harness.requests.length, 1);
  for (const poll of harness.intervals) poll();
  assert.equal(harness.requests.length, 1, 'slow requests must not overlap on each interval');
  const refresh = findNode(harness.render(), (node) => node.props?.title === 'Làm mới bảng xếp hạng LIVE');
  const refreshing = refresh.props.onClick();
  assert.equal(harness.requests.length, 2);
  assert.equal(harness.requests[0].options.signal.aborted, true);
  harness.requests[0].resolve(songFeed('Stale'));
  await flush();
  assert.equal(harness.states[0], null);
  assert.equal(harness.states[2], true, 'old response must not clear the replacement loading state');
  harness.requests[1].resolve(songFeed('Latest'));
  await refreshing;
  assert.equal(harness.states[0][0].title, 'Latest');
  assert.equal(harness.states[2], false);
  unmount();
});

test('trending unmount aborts pending work and clears copy feedback timers', async () => {
  const harness = componentHarness('../src/components/trending-chart.tsx', 'TrendingChart');
  const unmount = harness.mount();
  harness.requests[0].resolve(songFeed('Current'));
  await flush();
  const copy = findNode(harness.render(), (node) => node.props?.['aria-label'] === 'Copy lệnh phát bài Current');
  await copy.props.onClick();
  assert.equal(harness.timers.size, 1);
  await copy.props.onClick();
  assert.equal(harness.timers.size, 1, 'copying again replaces the previous feedback timer');
  for (const poll of harness.intervals) poll();
  assert.equal(harness.requests.length, 2);
  unmount();
  const writes = harness.writes;
  assert.equal(harness.requests[1].options.signal.aborted, true);
  assert.equal(harness.intervals.size, 0);
  assert.equal(harness.timers.size, 0);
  harness.requests[1].resolve(songFeed('Too late'));
  await flush();
  assert.equal(harness.writes, writes, 'unmounted chart must not receive response state updates');
});

test('review section aborts unmounted requests without replacing loading state', async () => {
  const harness = componentHarness('../src/components/feedback/community-reviews-section.tsx', 'CommunityReviewsSection');
  const unmount = harness.mount();
  unmount();
  assert.equal(harness.requests[0].options.signal.aborted, true);
  const writes = harness.writes;
  harness.requests[0].resolve({ ok: true, json: async () => ({ ok: true, averageStars: 5, totalReviews: 1, recentFeedbacks: [] }) });
  await flush();
  assert.equal(harness.writes, writes);
});

test('trending deadline releases a stalled body and allows retry without stale overwrite', async () => {
  const harness = componentHarness('../src/components/trending-chart.tsx', 'TrendingChart');
  const unmount = harness.mount();
  let finishOldBody;
  harness.requests[0].resolve({ ok: true, json: () => new Promise(resolve => { finishOldBody = resolve; }) });
  await flush();
  for (const deadline of harness.timers) deadline();
  assert.equal(harness.requests[0].options.signal.aborted, true);
  assert.equal(harness.states[2], false);
  let tree = harness.render();
  assert.ok(findNode(tree, node => node.props?.id === 'bxh'), 'failure retains the real section and retry controls');
  const retry = findNode(tree, node => node.type === 'button' && node.props?.children === 'Thử lại');
  const retrying = retry.props.onClick();
  harness.requests[1].resolve(songFeed('Recovered'));
  await retrying;
  finishOldBody(await songFeed('Old body').json());
  await flush();
  assert.equal(harness.states[0][0].title, 'Recovered');
  assert.equal(harness.states[1], false);
  unmount();
});

test('trending keeps the last successful list when a later feed refresh fails', async () => {
  const harness = componentHarness('../src/components/trending-chart.tsx', 'TrendingChart');
  const unmount = harness.mount();
  harness.requests[0].resolve(songFeed('Last good result'));
  await flush();
  for (const poll of harness.intervals) poll();
  harness.requests[1].resolve({ ok: false, json: async () => ({}) });
  await flush();
  assert.equal(harness.states[0][0].title, 'Last good result');
  assert.equal(harness.states[1], true);
  const tree = harness.render();
  assert.ok(findNode(tree, node => node.type === 'ul'));
  assert.ok(findNode(tree, node => node.type === 'button' && node.props?.children === 'Thử lại'));
  unmount();
});

test('equal-title previews choose the requested URL instead of resuming a different artist', async () => {
  const played = [], resumed = [];
  const player = { track: { title: 'Same title', url: 'https://example.test/artist-a.m4a' }, isPlaying: true,
    playTrack: track => played.push(track), setIsPlaying: playing => resumed.push(playing) };
  const harness = componentHarness('../src/components/trending-chart.tsx', 'TrendingChart', player);
  const unmount = harness.mount();
  harness.requests[0].resolve(songFeed('Same title', 'https://example.test/artist-b.m4a'));
  await flush();
  const preview = findNode(harness.render(), node => node.props?.['aria-label'] === 'Nghe thử Same title');
  preview.props.onClick();
  assert.equal(played[0].url, 'https://example.test/artist-b.m4a');
  assert.equal(resumed.length, 0);
  unmount();
});

test('web preview visuals follow real media events and keep a paused record angle', () => {
  const player = { track: { title: 'Preview', artist: 'Artist', url: 'https://example.test/preview.m4a', cover: '/cover.webp' },
    isPlaying: true, playbackStatus: 'loading',
    setIsPlaying(playing) { this.isPlaying = playing; this.playbackStatus = playing ? 'loading' : 'paused'; },
    setPlaybackStatus(status) { this.playbackStatus = status; }, stop() {} };
  // Store actions are stable closures, just as Zustand actions are in production.
  player.setIsPlaying = player.setIsPlaying.bind(player);
  player.setPlaybackStatus = player.setPlaybackStatus.bind(player);
  const harness = componentHarness('../src/components/music/web-player.tsx', 'WebPlayer', player);
  let tree = harness.render();
  let pauses = 0;
  const audio = { paused: false, play: () => Promise.resolve(), pause: () => { pauses++; } };
  harness.refs[0].current = audio;
  const cleanup = harness.effects[1]();
  const media = findNode(tree, node => node.type === 'audio');
  media.props.onPlaying({ currentTarget: audio });
  assert.equal(player.playbackStatus, 'playing');
  tree = harness.render();
  const runningCover = findNode(tree, node => node.type === 'img');
  assert.equal(runningCover.props.style.animationPlayState, 'running');
  media.props.onWaiting({ currentTarget: audio });
  assert.equal(player.isPlaying, true, 'buffering must not cancel play intent');
  assert.equal(player.playbackStatus, 'loading');
  media.props.onPause({ currentTarget: audio });
  assert.equal(player.isPlaying, true, 'a stale pause event must not interrupt audio that has resumed');
  audio.paused = true;
  media.props.onPause({ currentTarget: audio });
  assert.equal(player.isPlaying, false);
  const frozenCover = findNode(harness.render(), node => node.type === 'img');
  assert.equal(frozenCover.props.style.animationPlayState, 'paused');
  assert.equal(frozenCover.props.className, runningCover.props.className, 'same animation remains attached to preserve its angle');
  cleanup();
  assert.ok(pauses >= 1);
});
