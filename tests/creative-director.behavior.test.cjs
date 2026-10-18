const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/components/creative/creative-director.tsx'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

async function setupDirector({ mediaMatches = true } = {}) {
  const effects = [];
  const instances = [];
  const frames = new Set();
  const listeners = new Map();
  let nextFrame = 0;
  let observerDisconnected = false;
  const browserWindow = { scrollY: 450, addEventListener: (name, fn) => listeners.set(`window:${name}`, fn), removeEventListener: name => listeners.delete(`window:${name}`) };
  const browserDocument = { hidden: false, body: { style: { overflow: '' } }, addEventListener: (name, fn) => listeners.set(`document:${name}`, fn), removeEventListener: name => listeners.delete(`document:${name}`) };
  class LenisMock {
    constructor(options) { this.options = options; this.isScrolling = false; this.calls = []; this.destroyed = false; instances.push(this); }
    start() {}
    stop() {}
    raf() {}
    scrollTo(top, options) { this.calls.push({ top, immediate: options.immediate }); this.isScrolling = false; }
    destroy() { this.destroyed = true; }
  }
  const value = initial => ({ set() {}, get: () => initial });
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return { useState: initial => [initial, () => {}], useEffect: effect => effects.push(effect) };
      if (name === 'react/jsx-runtime') return { jsx: () => null };
      if (name === 'next/navigation') return { usePathname: () => '/' };
      if (name === 'framer-motion') return { motion: {}, useMotionValue: value, useSpring: original => original };
      if (name === 'lenis') return LenisMock;
      if (name.endsWith('.css')) return {};
      throw new Error(`Unexpected import: ${name}`);
    },
    matchMedia: () => ({ matches: mediaMatches, addEventListener: (name, fn) => listeners.set(`media:${name}`, fn), removeEventListener: name => listeners.delete(`media:${name}`) }),
    requestAnimationFrame: () => { frames.add(++nextFrame); return nextFrame; },
    cancelAnimationFrame: frame => frames.delete(frame),
    MutationObserver: class { observe() {} disconnect() { observerDisconnected = true; } },
    window: browserWindow,
    document: browserDocument,
  });
  exports.CreativeDirector();
  const cleanup = effects[0]();
  await new Promise(resolve => setImmediate(resolve));
  return { instances, frames, listeners, browserWindow, browserDocument, cleanup, observerDisconnected: () => observerDisconnected };
}

test('Handoff sang vùng cuộn native hủy đích wheel cũ, giữ khóa modal và cleanup khi rời route', async () => {
  const harness = await setupDirector();
  const instance = harness.instances[0];
  assert.ok(instance);
  assert.equal(harness.frames.size, 1);
  const nativeRegion = { closest: () => ({}) };
  const ordinaryPage = { closest: () => null };

  instance.isScrolling = 'smooth';
  assert.equal(instance.options.prevent(ordinaryPage), false);
  assert.equal(instance.calls.length, 0);
  assert.equal(instance.options.prevent(nativeRegion), true);
  assert.deepEqual(instance.calls, [{ top: harness.browserWindow.scrollY, immediate: true }]);
  instance.options.prevent(nativeRegion);
  assert.equal(instance.calls.length, 1, 'Không reset liên tục khi native scroll đã nhận quyền');

  harness.browserDocument.body.style.overflow = 'hidden';
  instance.isScrolling = 'smooth';
  assert.equal(instance.options.prevent(nativeRegion), true);
  assert.equal(instance.calls.length, 1, 'Không mở lại hay dịch chuyển trang đang khóa bởi modal');

  harness.cleanup();
  assert.equal(instance.destroyed, true);
  assert.equal(harness.frames.size, 0);
  assert.equal(harness.listeners.size, 0);
  assert.equal(harness.observerDisconnected(), true);
});

test('Thiết bị không đạt media query giữ cuộn native, không tạo Lenis hay RAF', async () => {
  const harness = await setupDirector({ mediaMatches: false });
  assert.equal(harness.instances.length, 0);
  assert.equal(harness.frames.size, 0);
  harness.cleanup();
  assert.equal(harness.listeners.size, 0);
});
