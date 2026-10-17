const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const test = require('node:test');
const root = path.join(__dirname, '..');
const sources = JSON.parse(fs.readFileSync(path.join(root, 'public/models/sources.json'),'utf8').replace(/^\uFEFF/,''));

test('Các model GLB đóng gói khớp nguồn/hash, không tham chiếu file ngoài', () => {
  for (const source of sources) {
    const bytes=fs.readFileSync(path.join(root,'public/models',source.file));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),source.sha256);
    assert.equal(bytes.toString('ascii',0,4),'glTF');
    assert.equal(bytes.readUInt32LE(4),2);
    assert.equal(bytes.readUInt32LE(8),bytes.length);
    const model=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
    for (const item of [...(model.buffers||[]),...(model.images||[])]) assert.ok(!item.uri || item.uri.startsWith('data:'));
    assert.equal(source.license,'CC0-1.0');
    assert.ok(bytes.length < 500000);
  }
});

test('Robot được Three.js nạp thật, Dance/Wave thay đổi xương và có bounds hữu hạn', async () => {
  const THREE=await import('three');
  const {GLTFLoader}=await import('three/examples/jsm/loaders/GLTFLoader.js');
  const bytes=fs.readFileSync(path.join(root,'public/models/mimi-robot.glb'));
  const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
  const mixer=new THREE.AnimationMixer(gltf.scene);
  const box=new THREE.Box3().setFromObject(gltf.scene);
  assert.ok(box.getSize(new THREE.Vector3()).y > 0);
  for(const name of ['Dance','Wave']) {
    const clip=gltf.animations.find(clip=>clip.name===name); assert.ok(clip,name);
    const action=mixer.clipAction(clip).reset().play();
    mixer.update(0.01); gltf.scene.updateMatrixWorld(true);
    const before=[]; gltf.scene.traverse(node=>{ if(node.isBone)before.push(node.matrixWorld.elements.join(',')); });
    mixer.update(0.5); gltf.scene.updateMatrixWorld(true);
    const after=[]; gltf.scene.traverse(node=>{ if(node.isBone)after.push(node.matrixWorld.elements.join(',')); });
    assert.notDeepEqual(before,after,name+' phải chuyển động');
    action.stop();
  }
  mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene);
});
