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

test('Model tự chạy trên mobile dù giảm chuyển động; không có công tắc và tự phục hồi khi xem lại', () => {
  const vm = require('node:vm');
  const ts = require('typescript');
  const React = require('react');
  const file=path.join(root,'src/components/three/experience-stage.tsx');
  const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
  const slots=[]; let cursor=0; const effects=[];
  let observer; const listeners={};
  const pageDocument={visibilityState:'visible',addEventListener(name,fn){listeners[name]=fn;},removeEventListener(){}};
  const hookReact={...React,useState(initial){const id=cursor++; if(!slots[id])slots[id]={value:initial}; return [slots[id].value,value=>{slots[id].value=value;}];},useRef(initial){const id=cursor++; return slots[id]??(slots[id]={current:initial});},useCallback(fn){return fn;},useEffect(fn){const id=cursor++; if(!slots[id]){slots[id]=true; effects.push(fn);}}};
  const exports={};
  vm.runInNewContext(compiled,{exports,require(name){if(name==='react')return hookReact;if(name==='next/dynamic')return ()=>function Scene(){};if(name==='next/image')return function Image(){};if(name==='lucide-react')return Object.fromEntries(['Disc3','Headphones','Bot','Hand','Music2'].map(name=>[name,function Icon(){}]));throw Error(name);},window:{matchMedia(query){return {matches:query.includes('reduce'),addEventListener(){},removeEventListener(){}};}},document:pageDocument,IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}disconnect(){}}});
  function render(){cursor=0;return exports.ExperienceStage();}
  function all(node){return !node||typeof node!=='object'?[]:[node,...React.Children.toArray(node.props?.children).flatMap(all)];}
  function button(tree,label){return all(tree).find(node=>node.type==='button'&&(node.props['aria-label']===label||React.Children.toArray(node.props.children).some(child=>child?.props?.children===label)));}
  let tree=render(); effects.forEach(fn=>fn()); observer([{isIntersecting:true}]); tree=render();
  assert.equal(all(tree).filter(node=>node.type?.name==='Scene').length,1);
  assert.equal(all(tree).find(node=>node.type?.name==='Scene').props.playing,true,'Tự chạy trước mọi click');
  assert.equal(all(tree).filter(node=>node.type==='button'&&/Tạm dừng|Bật chuyển động|Khám phá/.test(node.props['aria-label']||'')).length,0);
  button(tree,'Tai nghe').props.onClick(); tree=render();
  let scene=all(tree).find(node=>node.type?.name==='Scene'); assert.equal(scene.props.model,'headphones'); assert.equal(scene.props.playing,true);
  button(tree,'Đĩa nhạc').props.onClick(); tree=render(); scene=all(tree).find(node=>node.type?.name==='Scene'); assert.equal(scene.props.model,'vinyl'); assert.equal(scene.props.playing,true);
  button(tree,'Mimi robot').props.onClick(); tree=render(); button(tree,'Chào Mimi, cho robot vẫy tay').props.onClick(); tree=render();
  scene=all(tree).find(node=>node.type?.name==='Scene'); assert.equal(scene.props.motion,'Wave'); assert.equal(scene.props.playing,true);
  observer([{isIntersecting:false}]); tree=render(); assert.equal(all(tree).find(node=>node.type?.name==='Scene').props.playing,false);
  observer([{isIntersecting:true}]); tree=render(); assert.equal(all(tree).find(node=>node.type?.name==='Scene').props.playing,true);
  pageDocument.visibilityState='hidden'; listeners.visibilitychange(); tree=render(); assert.equal(all(tree).find(node=>node.type?.name==='Scene').props.playing,false);
  pageDocument.visibilityState='visible'; listeners.visibilitychange(); tree=render(); assert.equal(all(tree).find(node=>node.type?.name==='Scene').props.playing,true);
});
