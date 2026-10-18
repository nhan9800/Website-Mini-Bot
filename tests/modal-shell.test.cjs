const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const React = require('react');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/components/ui/modal-shell.tsx'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function setup() {
  const listeners = new Map();
  const viewportListeners = new Map();
  let active;
  const doc = {
    body: { style: { overflow: 'auto', paddingRight: '6px' } },
    documentElement: { clientWidth: 980 },
    activeElement: null,
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
  };
  const dispatch = (name, event) => { for (const fn of listeners.get(name) || []) { fn(event); if (event.stopped) break; } };
  class Element {
    constructor() { this.isConnected = true; this.tabIndex = 0; this.controls = []; }
    focus() { doc.activeElement = this; dispatch('focusin', { target: this }); }
    contains(value) { return value === this || this.controls.includes(value); }
    querySelectorAll() { return this.controls; }
    querySelector() { return null; }
    getClientRects() { return [{}]; }
  }
  const viewport = {
    height: 520, offsetTop: 12,
    addEventListener(name, fn) { if (!viewportListeners.has(name)) viewportListeners.set(name, new Set()); viewportListeners.get(name).add(fn); },
    removeEventListener(name, fn) { viewportListeners.get(name)?.delete(fn); },
  };
  const hookReact = {
    useId() { return active.name; },
    useRef(initial) { const index = active.cursor++; return active.slots[index] ||= { current: initial }; },
    useState(initial) {
      const current = active;
      const index = current.cursor++;
      current.slots[index] ||= { value: initial };
      return [current.slots[index].value, value => { current.slots[index].value = typeof value === 'function' ? value(current.slots[index].value) : value; }];
    },
    useEffect(callback, deps) {
      const current = active;
      const index = current.cursor++;
      const previous = current.slots[index];
      if (!previous || deps.some((value, i) => value !== previous.deps[i])) {
        current.effects.push(() => {
          previous?.cleanup?.();
          current.slots[index] = { deps, cleanup: callback() };
        });
      }
    },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return hookReact;
      if (name === 'react/jsx-runtime') return require(name);
      if (name === 'react-dom') return { createPortal(children, destination) { assert.equal(destination, doc.body); return children; } };
      if (name === 'framer-motion') return { AnimatePresence: 'presence', motion: { div: 'div' } };
      throw new Error(name);
    },
    HTMLElement: Element, Node: Element,
    document: doc,
    window: { innerWidth: 1000, innerHeight: 800, visualViewport: viewport, addEventListener() {}, removeEventListener() {} },
    getComputedStyle() { return { paddingRight: '6px' }; },
  });
  const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...React.Children.toArray(node.props?.children).flatMap(nodes)];
  const instance = name => {
    const current = { name, slots: [], effects: [], cursor: 0, panel: new Element() };
    current.render = (open, onClose) => {
      active = current;
      current.cursor = 0;
      current.tree = exports.ModalShell({ open, onClose, labelledBy: 'title', children: 'Dialog content' });
      const panelNode = nodes(current.tree).find(node => node.props.role === 'dialog');
      if (panelNode) panelNode.props.ref.current = current.panel;
      current.effects.splice(0).forEach(fn => fn());
      return current.tree;
    };
    current.open = onClose => { current.render(true, onClose); return current.render(true, onClose); };
    current.finishExit = onClose => {
      nodes(current.tree).find(node => node.type === 'presence').props.onExitComplete();
      current.render(false, onClose);
    };
    current.unmount = () => current.slots.forEach(slot => slot?.cleanup?.());
    return current;
  };
  const key = (name, shiftKey = false) => {
    const event = { key: name, shiftKey, prevented: false, stopped: false, preventDefault() { this.prevented = true; }, stopImmediatePropagation() { this.stopped = true; } };
    dispatch('keydown', event);
    return event;
  };
  return { doc, Element, instance, key, nodes, viewport, listeners, viewportListeners };
}

test('Portal dialog traps focus, preserves Enter and restores the trigger/body after closing', () => {
  const env = setup();
  const trigger = new env.Element();
  trigger.focus();
  const dialog = env.instance('feedback');
  const first = new env.Element();
  const last = new env.Element();
  dialog.panel.controls = [first, last];
  let closeCount = 0;
  const close = () => closeCount++;
  dialog.open(close);
  assert.equal(env.doc.activeElement, dialog.panel);
  assert.equal(env.doc.body.style.overflow, 'hidden');
  assert.equal(env.doc.body.style.paddingRight, '26px');
  last.focus();
  assert.equal(env.key('Tab').prevented, true);
  assert.equal(env.doc.activeElement, first);
  assert.equal(env.key('Tab', true).prevented, true);
  assert.equal(env.doc.activeElement, last);
  assert.equal(env.key('Enter').prevented, false);
  assert.equal(closeCount, 0, 'Enter only belongs to the focused native control');
  env.key('Escape');
  assert.equal(closeCount, 1);
  dialog.render(false, close);
  assert.equal(env.doc.body.style.overflow, 'hidden', 'The exiting backdrop must keep background scrolling locked');
  assert.equal(env.doc.activeElement, last, 'Focus stays inside until the final exit frame');
  env.key('Escape');
  assert.equal(closeCount, 1, 'An exiting dialog does not dispatch a second close');
  dialog.finishExit(close);
  assert.equal(env.doc.activeElement, trigger);
  assert.equal(env.doc.body.style.overflow, 'auto');
  assert.equal(env.doc.body.style.paddingRight, '6px');
  assert.equal(env.listeners.get('keydown').size, 0);
  assert.equal(env.viewportListeners.get('resize').size, 0);
});

test('Nested notice closes alone, retains the parent scroll lock and uses the keyboard viewport height', () => {
  const env = setup();
  const parent = env.instance('payment');
  const child = env.instance('notice');
  let parentCloses = 0;
  let childCloses = 0;
  const parentClose = () => parentCloses++;
  const childClose = () => childCloses++;
  parent.open(parentClose);
  const copyButton = new env.Element();
  parent.panel.controls = [copyButton];
  copyButton.focus();
  child.open(childClose);
  child.render(true, childClose);
  const overlay = env.nodes(child.tree).find(node => node.props.className?.includes('fixed inset-x-0'));
  assert.equal(overlay.props.style.height, 520);
  assert.equal(overlay.props.style.top, 12);
  env.key('Escape');
  assert.equal(childCloses, 1);
  assert.equal(parentCloses, 0);
  child.render(false, childClose);
  assert.equal(env.doc.activeElement, child.panel);
  env.key('Escape');
  assert.equal(parentCloses, 0, 'Parent cannot close through a notice that is still exiting');
  child.finishExit(childClose);
  assert.equal(env.doc.activeElement, copyButton);
  assert.equal(env.doc.body.style.overflow, 'hidden');
  env.key('Escape');
  assert.equal(parentCloses, 1);
  parent.render(false, parentClose);
  assert.equal(env.doc.body.style.overflow, 'hidden');
  parent.finishExit(parentClose);
  assert.equal(env.doc.body.style.overflow, 'auto');
});

test('Reopening during exit retains the boundary; unmount during exit releases it immediately', () => {
  const env = setup();
  const trigger = new env.Element();
  trigger.focus();
  const dialog = env.instance('payment');
  const close = () => {};
  dialog.render(false, close);
  dialog.open(close);
  dialog.render(false, close);
  const oldExit = env.nodes(dialog.tree).find(node => node.type === 'presence').props.onExitComplete;
  dialog.render(true, close);
  oldExit();
  dialog.render(true, close);
  assert.equal(env.doc.body.style.overflow, 'hidden', 'An old exit callback cannot unlock a reopened dialog');
  assert.equal(env.doc.activeElement, dialog.panel);
  dialog.render(false, close);
  dialog.unmount();
  assert.equal(env.doc.body.style.overflow, 'auto');
  assert.equal(env.doc.activeElement, trigger);
  assert.equal(env.listeners.get('keydown').size, 0);
  assert.equal(env.viewportListeners.get('resize').size, 0);
});
