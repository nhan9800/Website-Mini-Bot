const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const React = require('react');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/components/ui/motion-primitives.tsx'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
}).outputText;

function loadPrimitives({ reduced = false } = {}) {
  const values = [];
  const hookReact = {
    ...React,
    useRef: current => ({ current }),
    useEffect: effect => effect(),
    useMemo: factory => factory(),
  };
  const framer = {
    motion: { div: 'motion.div', span: 'motion.span' },
    useReducedMotion: () => reduced,
    useMotionValue(initial) {
      let value = initial;
      const result = { get: () => value, set: next => { value = next; } };
      values.push(result);
      return result;
    },
    useSpring: value => value,
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return hookReact;
      if (name === 'framer-motion') return framer;
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return { ...exports, values };
}

test('Reveal kích hoạt khi khối cao hơn viewport bắt đầu xuất hiện, vẫn giữ amount được chỉ định', () => {
  const { MotionReveal } = loadPrimitives();
  const reveal = MotionReveal({ children: 'Danh sách 29 máy chủ', variant: 'clip' });
  const shortViewportIntersection = 320 / 5000;
  assert.equal(reveal.props.viewport.once, true);
  assert.equal(reveal.props.viewport.amount, 0, 'Không đòi 18% chiều cao của một danh sách dài');
  assert.ok(shortViewportIntersection > reveal.props.viewport.amount, 'Viewport thấp vẫn đủ điều kiện hiển thị');
  assert.equal(reveal.props.whileInView, 'visible');
  assert.equal(MotionReveal({ children: 'Thẻ nhỏ', amount: 0.08 }).props.viewport.amount, 0.08);
});

test('Magnetic chỉ nhận chuột và trở về vị trí gốc sau pointercancel/pointerleave', () => {
  const { Magnetic, values } = loadPrimitives();
  const wrapper = Magnetic({ children: 'Mời Mimi' });
  wrapper.props.ref.current = { getBoundingClientRect: () => ({ left: 100, top: 100, width: 100, height: 60 }) };
  const move = pointerType => wrapper.props.onPointerMove({ pointerType, clientX: 220, clientY: 180 });
  move('touch');
  move('pen');
  assert.deepEqual(values.map(value => value.get()), [0, 0]);
  move('mouse');
  assert.ok(values[0].get() > 0 && values[1].get() > 0);
  wrapper.props.onPointerCancel();
  assert.deepEqual(values.map(value => value.get()), [0, 0]);
  move('mouse');
  wrapper.props.onPointerLeave();
  assert.deepEqual(values.map(value => value.get()), [0, 0]);
});

test('Magnetic giữ vị trí ổn định khi hệ thống yêu cầu giảm hiệu ứng con trỏ', () => {
  const { Magnetic, values } = loadPrimitives({ reduced: true });
  const wrapper = Magnetic({ children: 'Mở dashboard' });
  wrapper.props.ref.current = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 40 }) };
  wrapper.props.onPointerMove({ pointerType: 'mouse', clientX: 90, clientY: 35 });
  assert.equal(wrapper.props.style, undefined);
  assert.deepEqual(values.map(value => value.get()), [0, 0]);
});
