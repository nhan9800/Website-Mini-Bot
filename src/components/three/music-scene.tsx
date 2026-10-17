'use client';

import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { SafeCanvas } from './safe-canvas';
import { animationDelta, experienceAssets, type ExperienceModel, type RobotMotion } from '@/lib/experience';

const MINT = '#83d9b9';

function Robot({ motion, playing }: { motion: RobotMotion; playing: boolean }) {
  const source = useGLTF(experienceAssets.robot);
  const { invalidate } = useThree();
  const { object, materials, scale, offset } = useMemo(() => {
    const object = clone(source.scene);
    const materials = new Map<string, THREE.Material>();
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return;
      const customize = (original: THREE.Material) => {
        if (!materials.has(original.uuid)) {
          const material = original.clone();
          if (material instanceof THREE.MeshStandardMaterial) {
            if (material.name === 'Main') material.color.set(MINT);
            if (material.name === 'Grey') material.color.set('#d7e5df');
            material.roughness = 0.32;
            material.metalness = 0.26;
          }
          materials.set(original.uuid, material);
        }
        return materials.get(original.uuid)!;
      };
      node.material = Array.isArray(node.material) ? node.material.map(customize) : customize(node.material);
      node.frustumCulled = false;
    });
    // Xương của bản clone chưa đồng bộ ở frame đầu; đo scene gốc đã nạp,
    // tránh bounds phóng lớn hàng trăm lần rồi thu robot thành một chấm.
    const box = new THREE.Box3().setFromObject(source.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 3.4 / size.y;
    return { object, materials, scale, offset: new THREE.Vector3(-center.x * scale, -box.min.y * scale - 1.75, -center.z * scale) };
  }, [source.scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(object), [object]);
  const currentAction = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    const clip = source.animations.find(clip => clip.name === motion);
    if (!clip) return;
    const action = mixer.clipAction(clip);
    const previous = currentAction.current;
    if (previous && previous !== action) previous.fadeOut(0.3);
    action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(previous ? 0.3 : 0).play();
    currentAction.current = action;
    mixer.update(0.01);
    invalidate();
  }, [mixer, source.animations, motion, invalidate]);
  useEffect(() => () => {
    mixer.stopAllAction(); mixer.uncacheRoot(object);
    materials.forEach(material => material.dispose());
  }, [mixer, object, materials]);
  useFrame((_, delta) => { if (playing) mixer.update(animationDelta(delta)); });

  return <group rotation={[0, -0.28, 0]}><primitive object={object} scale={scale} position={offset} dispose={null} /></group>;
}

function HeadphoneModel({ playing }: { playing: boolean }) {
  const { scene } = useGLTF(experienceAssets.headphones);
  const ref = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const { object, materials } = useMemo(() => {
    const object = scene.clone(true);
    const materials: THREE.Material[] = [];
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return;
      const original = node.material as THREE.MeshStandardMaterial;
      const material = original.clone();
      // Giữ đệm tai đen trong texture, chuyển phần vỏ màu cam của asset sang mint.
      material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
          if (diffuseColor.r > diffuseColor.g * 1.4 && diffuseColor.r > diffuseColor.b * 1.5) {
            diffuseColor.rgb = vec3(0.227, 0.694, 0.485) * max(diffuseColor.r, 0.35);
          }`);
      };
      material.roughness = 0.36; material.metalness = 0.15;
      node.material = material; materials.push(material);
    });
    return { object, materials };
  }, [scene]);
  useEffect(() => () => materials.forEach(material => material.dispose()), [materials]);
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const scale = 3.25 / Math.max(...box.getSize(new THREE.Vector3()).toArray());
    return { scale, offset: box.getCenter(new THREE.Vector3()).multiplyScalar(-scale) };
  }, [scene]);
  useFrame((_, delta) => {
    if (!ref.current || !playing) return;
    elapsed.current += animationDelta(delta);
    ref.current.rotation.y += animationDelta(delta) * 0.2;
    ref.current.position.y = Math.sin(elapsed.current * 1.1) * 0.08;
  });
  return <group ref={ref} rotation={[0.1, -0.45, -0.1]}><primitive object={object} scale={scale} position={offset} dispose={null} /></group>;
}

function Turntable({ playing }: { playing: boolean }) {
  const disc = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (disc.current && playing) disc.current.rotation.y += animationDelta(delta) * 0.65; });
  return (
    <group rotation={[0.34, -0.45, 0]} position={[0, -0.35, 0]}>
      <RoundedBox args={[3.9, 0.42, 3.15]} radius={0.16} smoothness={4}>
        <meshStandardMaterial color={MINT} metalness={0.22} roughness={0.28} />
      </RoundedBox>
      {[-1.45, 1.45].flatMap(x => [-1.08, 1.08].map(z => <mesh key={`${x}-${z}`} position={[x, -0.3, z]}><cylinderGeometry args={[0.16, 0.16, 0.22, 16]} /><meshStandardMaterial color="#243d37" /></mesh>))}
      <mesh position={[-0.28, 0.28, 0]}><cylinderGeometry args={[1.32, 1.32, 0.15, 64]} /><meshStandardMaterial color="#b7c9c2" metalness={0.85} roughness={0.25} /></mesh>
      <group ref={disc} position={[-0.28, 0.38, 0]}>
        <mesh><cylinderGeometry args={[1.26, 1.26, 0.04, 64]} /><meshStandardMaterial color="#132922" roughness={0.38} metalness={0.4} /></mesh>
        {[0.7, 0.82, 0.94, 1.06, 1.18].map(radius => <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}><torusGeometry args={[radius, 0.006, 4, 64]} /><meshStandardMaterial color="#50655c" metalness={0.65} roughness={0.3} /></mesh>)}
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.39, 0.39, 0.018, 40]} /><meshStandardMaterial color={MINT} /></mesh>
        <mesh position={[0.16, 0.055, 0]}><boxGeometry args={[0.14, 0.012, 0.06]} /><meshStandardMaterial color="#173b2f" /></mesh>
      </group>
      <mesh position={[-0.28, 0.47, 0]}><cylinderGeometry args={[0.035, 0.035, 0.18, 12]} /><meshStandardMaterial color="#d9e8df" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[1.42, 0.43, -0.95]}><cylinderGeometry args={[0.21, 0.21, 0.36, 24]} /><meshStandardMaterial color="#30483e" metalness={0.55} roughness={0.28} /></mesh>
      <group position={[1.42, 0.66, -0.95]} rotation={[0, 0.34, 0]}>
        <RoundedBox args={[0.08, 0.08, 1.9]} radius={0.035} position={[0, 0, 0.83]}><meshStandardMaterial color="#d9e8df" metalness={0.7} roughness={0.2} /></RoundedBox>
        <RoundedBox args={[0.2, 0.13, 0.32]} radius={0.04} position={[-0.05, -0.04, 1.8]}><meshStandardMaterial color="#243d37" /></RoundedBox>
      </group>
      <mesh position={[-1.56, 0.27, 1.12]}><cylinderGeometry args={[0.12, 0.12, 0.1, 20]} /><meshStandardMaterial color="#e3ece7" metalness={0.6} /></mesh>
    </group>
  );
}

function RenderReady({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

function ContextGuard({ onUnavailable }: { onUnavailable: () => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onUnavailable);
    return () => canvas.removeEventListener('webglcontextlost', onUnavailable);
  }, [gl, onUnavailable]);
  return null;
}

export default function MusicScene({ model, motion, playing, onReady, onUnavailable }: {
  model: ExperienceModel; motion: RobotMotion; playing: boolean; onReady: () => void; onUnavailable: () => void;
}) {
  return (
    <SafeCanvas onUnavailable={onUnavailable} camera={{ position: [0, 0.9, 7.2], fov: 38 }} dpr={[1, 1.5]} frameloop={playing ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}>
      <ambientLight intensity={1.6} />
      <hemisphereLight args={['#effff5', '#5c8c77', 2.2]} />
      <directionalLight position={[4, 6, 5]} intensity={3.3} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={2.7} color={MINT} />
      <Suspense fallback={null}>
        {model === 'robot' ? <Robot motion={motion} playing={playing} /> : model === 'headphones' ? <HeadphoneModel playing={playing} /> : <Turntable playing={playing} />}
        <RenderReady key={model} onReady={onReady} />
      </Suspense>
      <ContextGuard onUnavailable={onUnavailable} />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} target={[0, -0.1, 0]} />
    </SafeCanvas>
  );
}
