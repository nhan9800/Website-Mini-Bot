const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const sourcePath = path.join(__dirname, '../src/components/three/safe-canvas.tsx');
const compiled = ts.transpileModule(fs.readFileSync(sourcePath, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
}).outputText;

function loadCanvas({ document, react = React } = {}) {
  const exported = {};
  let canvasCalls = 0;
  vm.runInNewContext(compiled, {
    exports: exported,
    document,
    require(name) {
      if (name === 'react') return react;
      if (name === '@react-three/fiber') {
        return { Canvas() { canvasCalls++; throw new Error('Bộ dựng hình không khả dụng'); } };
      }
      throw new Error(`Unexpected dependency: ${name}`);
    },
  }, { filename: sourcePath });
  return { ...exported, canvasCalls: () => canvasCalls };
}

test('WebGL 1 không đủ điều kiện và không bao giờ được dùng làm dự phòng WebGL 2', () => {
  const requests = [];
  const ui = loadCanvas({ document: { createElement(name) {
    assert.equal(name, 'canvas');
    return { getContext(kind) { requests.push(kind); return kind === 'webgl' ? {} : null; } };
  } } });
  assert.equal(ui.supportsWebGL2(), false);
  assert.deepEqual(requests, ['webgl2']);
});

test('WebGL 2 khả dụng trả lại context thử nghiệm và lỗi GPU không thoát ra trang', () => {
  let released = 0;
  const ui = loadCanvas({ document: { createElement: () => ({ getContext: () => ({
    getExtension(name) {
      assert.equal(name, 'WEBGL_lose_context');
      return { loseContext() { released++; } };
    },
  }) }) } });
  assert.equal(ui.supportsWebGL2(), true);
  assert.equal(released, 1);
  const failed = loadCanvas({ document: { createElement() { throw new Error('GPU bị tắt'); } } });
  assert.equal(failed.supportsWebGL2(), false);
  assert.equal(loadCanvas().supportsWebGL2(), false);
});

test('Render đầu tiên giữ nền dự phòng và không gọi bộ dựng hình trước khi kiểm tra GPU', () => {
  const ui = loadCanvas();
  const fallback = React.createElement('canvas', { 'aria-hidden': true, 'data-background': 'particles' });
  const html = renderToStaticMarkup(React.createElement(ui.SafeCanvas, { fallback }));
  assert.match(html, /data-background="particles"/);
  assert.equal(renderToStaticMarkup(React.createElement(ui.SafeCanvas)), '');
  assert.equal(ui.canvasCalls(), 0);
});

test('Lỗi khởi tạo Canvas được vùng 3D chuyển về nền dự phòng', () => {
  const ui = loadCanvas({ react: {
    ...React, useState: () => [true, () => {}], useEffect: () => {},
  } });
  const fallback = React.createElement('canvas', { 'data-background': 'particles' });
  const element = ui.SafeCanvas({ fallback });
  const Boundary = element.type;
  const boundary = new Boundary(element.props);
  assert.equal(boundary.render().type.name, 'Canvas');
  boundary.state = { ...boundary.state, ...Boundary.getDerivedStateFromError(new Error('GPU khởi tạo lỗi')) };
  assert.equal(boundary.render(), fallback);
});
