'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { Particles } from '@/components/ui/particles';

/* ────────────────────────────────────────────────────────────────
 * Hero3D — cảnh WebGL thật cho hero trang chủ:
 * đĩa vinyl 3D quay, vòng equalizer neon, nốt nhạc bay lơ lửng,
 * hạt sáng lấp lánh và camera parallax theo chuột.
 * Render client-only (import bằng next/dynamic, ssr: false).
 * ──────────────────────────────────────────────────────────────── */

const MIMI_GREEN = '#2ECC71';
const MIMI_CYAN = '#22D3EE';
const MIMI_PURPLE = '#8B5CF6';
const MIMI_PINK = '#F472B6';

/** Có hỗ trợ WebGL không (máy quá cũ / bị tắt thì fallback về particles). */
function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

/** Người dùng bật "giảm chuyển động" thì chỉ render 1 khung hình tĩnh. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/* ── Texture vẽ thủ công (không tải file ngoài) ────────────────── */

/** Mặt đĩa vinyl: rãnh đồng tâm + phản chiếu nhẹ. */
function makeVinylTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d')!;
  g.fillStyle = '#0b0c13';
  g.fillRect(0, 0, 1024, 1024);
  for (let r = 140; r < 508; r += 3) {
    g.beginPath();
    g.arc(512, 512, r, 0, Math.PI * 2);
    g.strokeStyle = `rgba(255,255,255,${(0.018 + 0.028 * Math.random()).toFixed(3)})`;
    g.lineWidth = 1.25;
    g.stroke();
  }
  // vài "track" sáng hơn chia vùng như đĩa thật
  for (const r of [190, 262, 335, 408, 472]) {
    g.beginPath();
    g.arc(512, 512, r, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(255,255,255,0.10)';
    g.lineWidth = 2;
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/** Nhãn giữa đĩa: gradient thương hiệu + chữ MIMI. */
function makeLabelTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(60, 60, 452, 452);
  grad.addColorStop(0, MIMI_GREEN);
  grad.addColorStop(0.55, MIMI_CYAN);
  grad.addColorStop(1, '#38bdf8');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  
  const img = new Image();
  img.src = '/logo.webp';
  img.onload = () => {
    // Vẽ logo tròn trịa ở giữa đĩa
    g.drawImage(img, 106, 106, 300, 300);
    tex.needsUpdate = true;
  };
  
  return tex;
}

/** Quầng sáng mềm (đặt sau đĩa, blend cộng). */
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(46, 204, 113, 0.55)');
  grad.addColorStop(0.4, 'rgba(34, 211, 238, 0.22)');
  grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ── Đĩa vinyl + nhãn + vòng sáng ──────────────────────────────── */

function VinylTurntable() {
  const discRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const vinylTex = useMemo(makeVinylTexture, []);
  const labelTex = useMemo(makeLabelTexture, []);
  const glowTex = useMemo(makeGlowTexture, []);
  useEffect(
    () => () => {
      vinylTex.dispose();
      labelTex.dispose();
      glowTex.dispose();
    },
    [vinylTex, labelTex, glowTex]
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (discRef.current) discRef.current.rotation.y += dt * 0.85;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.22;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.16;
  });

  return (
    <group rotation={[0.5, 0, 0]}>
      {/* quầng sáng phía sau */}
      <sprite scale={[10.5, 10.5, 1]} position={[0, 0, -1.6]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* đĩa quay quanh trục riêng */}
      <group ref={discRef}>
        <mesh castShadow>
          <cylinderGeometry args={[2.2, 2.2, 0.09, 96]} />
          <meshStandardMaterial
            attach="material-0"
            color="#101219"
            metalness={0.7}
            roughness={0.45}
          />
          <meshStandardMaterial
            attach="material-1"
            map={vinylTex}
            metalness={0.82}
            roughness={0.38}
          />
          <meshStandardMaterial
            attach="material-2"
            color="#0a0b12"
            metalness={0.6}
            roughness={0.6}
          />
        </mesh>
        {/* nhãn giữa */}
        <mesh position={[0, 0.056, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.025, 64]} />
          <meshStandardMaterial
            attach="material-0"
            color="#0f766e"
            metalness={0.3}
            roughness={0.5}
          />
          <meshStandardMaterial
            attach="material-1"
            map={labelTex}
            metalness={0.25}
            roughness={0.35}
            emissive={new THREE.Color(MIMI_GREEN)}
            emissiveIntensity={0.12}
          />
          <meshStandardMaterial attach="material-2" color="#0f766e" />
        </mesh>
        {/* trục giữa */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.06, 24]} />
          <meshStandardMaterial color="#05060f" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* viền phát sáng ôm sát đĩa */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.26, 0.022, 16, 128]} />
        <meshBasicMaterial color={MIMI_CYAN} toneMapped={false} transparent opacity={0.85} />
      </mesh>

      {/* 2 vành sáng nghiêng kiểu quỹ đạo */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.15, 0.18, 0]}>
        <torusGeometry args={[3.05, 0.012, 12, 160, Math.PI * 1.35]} />
        <meshBasicMaterial color={MIMI_GREEN} toneMapped={false} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 1.9, -0.22, 0.4]}>
        <torusGeometry args={[3.45, 0.01, 12, 160, Math.PI * 1.1]} />
        <meshBasicMaterial color={MIMI_PURPLE} toneMapped={false} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/* ── Vòng equalizer neon quanh đĩa ─────────────────────────────── */

const BAR_COUNT = 44;
const BAR_RADIUS = 3.4;

function EqualizerRing() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // màu chuyển dần xanh lá → cyan → tím quanh vòng tròn
  const colors = useMemo(() => {
    const green = new THREE.Color(MIMI_GREEN);
    const cyan = new THREE.Color(MIMI_CYAN);
    const purple = new THREE.Color(MIMI_PURPLE);
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const t = i / (BAR_COUNT - 1);
      const c = new THREE.Color();
      if (t < 0.5) c.lerpColors(green, cyan, t * 2);
      else c.lerpColors(cyan, purple, (t - 0.5) * 2);
      return c;
    });
  }, []);

  // useLayoutEffect + material.needsUpdate: buộc three biên dịch lại shader
  // với USE_INSTANCING_COLOR — gán màu sau khi material đã compile sẽ bị bỏ qua.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    colors.forEach((c, i) => mesh.setColorAt(i, c));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    (mesh.material as THREE.Material).needsUpdate = true;
  }, [colors]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < BAR_COUNT; i++) {
      const angle = (i / BAR_COUNT) * Math.PI * 2;
      // 2 sóng chồng nhau cho chuyển động hữu cơ như nhạc thật
      const wave =
        Math.sin(t * 2.3 + i * 0.55) * 0.5 +
        Math.sin(t * 3.7 + i * 1.3) * 0.28 +
        0.78;
      const h = 0.25 + Math.max(0.06, wave) * 0.85;
      dummy.position.set(
        Math.cos(angle) * BAR_RADIUS,
        h / 2 - 0.55,
        Math.sin(angle) * BAR_RADIUS
      );
      dummy.scale.set(1, h, 1);
      dummy.rotation.set(0, -angle, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={[0.5, 0, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, BAR_COUNT]}>
        <boxGeometry args={[0.13, 1, 0.13]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
      </instancedMesh>
    </group>
  );
}

/* ── Nốt nhạc 3D dựng từ khối cơ bản ───────────────────────────── */

function EighthNotePair({ color }: { color: string }) {
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={new THREE.Color(color)}
      emissiveIntensity={0.5}
      metalness={0.35}
      roughness={0.3}
    />
  );
  return (
    <group scale={0.55}>
      {/* 2 đầu nốt */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, -0.45]} scale={[1, 0.68, 1]}>
        <sphereGeometry args={[0.34, 24, 18]} />
        {mat}
      </mesh>
      <mesh position={[1.05, 0.16, 0]} rotation={[0, 0, -0.45]} scale={[1, 0.68, 1]}>
        <sphereGeometry args={[0.34, 24, 18]} />
        {mat}
      </mesh>
      {/* 2 thân nốt */}
      <mesh position={[0.28, 0.75, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
        {mat}
      </mesh>
      <mesh position={[1.33, 0.91, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
        {mat}
      </mesh>
      {/* thanh nối */}
      <mesh position={[0.8, 1.57, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[1.28, 0.24, 0.1]} />
        {mat}
      </mesh>
    </group>
  );
}

function SingleNote({ color }: { color: string }) {
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={new THREE.Color(color)}
      emissiveIntensity={0.5}
      metalness={0.35}
      roughness={0.3}
    />
  );
  return (
    <group scale={0.5}>
      <mesh rotation={[0, 0, -0.45]} scale={[1, 0.68, 1]}>
        <sphereGeometry args={[0.36, 24, 18]} />
        {mat}
      </mesh>
      <mesh position={[0.29, 0.8, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 1.6, 12]} />
        {mat}
      </mesh>
      <mesh position={[0.52, 1.35, 0]} rotation={[0, 0, -0.7]}>
        <boxGeometry args={[0.5, 0.16, 0.09]} />
        {mat}
      </mesh>
    </group>
  );
}

function FloatingNotes() {
  const notes: { pos: [number, number, number]; color: string; pair: boolean; speed: number }[] = [
    { pos: [-3.9, 1.6, -1.2], color: MIMI_GREEN, pair: true, speed: 1.4 },
    { pos: [3.7, 2.2, -0.8], color: MIMI_CYAN, pair: false, speed: 1.8 },
    { pos: [-2.9, 3.0, -2.4], color: MIMI_PURPLE, pair: false, speed: 1.2 },
    { pos: [3.1, 0.9, -2.0], color: MIMI_PINK, pair: true, speed: 1.6 },
    { pos: [0.2, 3.4, -3.0], color: MIMI_CYAN, pair: false, speed: 1.0 },
  ];
  return (
    <>
      {notes.map((n, i) => (
        <Float
          key={i}
          speed={n.speed}
          rotationIntensity={0.55}
          floatIntensity={1.4}
          position={n.pos}
        >
          {n.pair ? <EighthNotePair color={n.color} /> : <SingleNote color={n.color} />}
        </Float>
      ))}
    </>
  );
}

/* ── Camera parallax theo chuột + scale responsive ─────────────── */

function Rig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  useFrame((state, dt) => {
    if (reduced) return;
    const k = Math.min(1, dt * 2.2);
    camera.position.x += (state.pointer.x * 0.85 - camera.position.x) * k;
    camera.position.y += (2.1 - state.pointer.y * 0.55 - camera.position.y) * k;
    camera.lookAt(0, 0.15, 0);
  });
  return null;
}

function ResponsiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame(() => {
    if (!groupRef.current) return;
    const s = THREE.MathUtils.clamp(viewport.width / 11.5, 0.58, 1);
    groupRef.current.scale.setScalar(s);
  });
  return (
    <group ref={groupRef} position={[0, -1.15, 0]}>
      {children}
    </group>
  );
}

/* ── Component chính ───────────────────────────────────────────── */

export default function Hero3D() {
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Cuộn qua khỏi hero thì ngừng hẳn vòng render — đỡ tốn pin/CPU ở phần dưới trang.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? true), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [webgl]);

  // Chưa xác định xong / không có WebGL → dùng nền particles cũ
  if (webgl !== true) return <Particles />;

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2.1, 7.6], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduced || !visible ? 'demand' : 'always'}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 4, 5]} intensity={40} color={MIMI_GREEN} />
        <pointLight position={[-5, 3, -2]} intensity={34} color={MIMI_PURPLE} />
        <pointLight position={[0, 6, 2]} intensity={26} color={MIMI_CYAN} />

        <ResponsiveGroup>
          <VinylTurntable />
          <EqualizerRing />
          <FloatingNotes />
          <Sparkles count={110} scale={[15, 8, 9]} size={2.4} speed={0.32} opacity={0.5} color="#7effc0" />
          <Sparkles count={60} scale={[13, 7, 8]} size={1.8} speed={0.22} opacity={0.4} color="#c4b5fd" />
        </ResponsiveGroup>

        <Rig reduced={reduced} />
      </Canvas>
    </div>
  );
}
