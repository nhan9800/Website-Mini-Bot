const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise component effects without a browser or requests to a real provider.
function componentHarness(file, exportName) {
  const states = [], refs = [], effects = [], requests = [], intervals = new Set(), timers = new Set();
  let stateIndex = 0, refIndex = 0, writes = 0, tree;
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
    useEffect: (effect) => { if (!effects.length) effects.push(effect); },
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
    setTimeout: (callback) => { timers.add(callback); return callback; },
    clearTimeout: (callback) => timers.delete(callback),
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'framer-motion') return { motion: { li: 'li' } };
      if (name.endsWith('use-player-store')) return { usePlayerStore: () => ({}) };
      return {};
    },
  });
  return {
    states, requests, intervals, timers,
    get writes() { return writes; },
    render() { stateIndex = 0; refIndex = 0; tree = module.exports[exportName](); return tree; },
    mount() { this.render(); return effects[0](); },
  };
}

const songFeed = (title) => ({ ok: true, json: async () => ({ feed: { entry: [{ 'im:name': { label: title } }] } }) });
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
