'use client';

import React, { useRef, useMemo, useCallback, useEffect, useState, useContext, createContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// --------------------------------------------------
// DATA & RELATIONSHIPS
// --------------------------------------------------

const CATEGORY_COLORS: Record<string, string> = {
  Faith: '#fff2e6',
  Growth: '#e6f0ff',
  Ideas: '#e0e8ff',
  Goals: '#fff6d6',
  People: '#ffe6ea',
  Habits: '#eaf5ea',
  Health: '#eaf5ea',
  Moments: '#ffffff',
  Reflections: '#ffffff',
};

const MEMORIES = [
  { id: 1, title: "Fajr", category: "Faith", description: "A quiet beginning to the day.", pos: [-8, 6, 2] },
  { id: 2, title: "First AI Project", category: "Growth", description: "The moment ORBIT began.", pos: [5, 4, 8] },
  { id: 3, title: "Learning Python", category: "Growth", description: "A new skill taking shape.", pos: [8, 1, 4] },
  { id: 4, title: "Gym", category: "Health", description: "Building consistency, one session at a time.", pos: [-10, -3, 5] },
  { id: 5, title: "Family", category: "People", description: "The moments that matter beyond everything else.", pos: [4, -5, 12] },
  { id: 6, title: "Late Night Idea", category: "Ideas", description: "An idea worth remembering.", pos: [12, 7, -2] },
  { id: 7, title: "Exam Day", category: "Growth", description: "Pressure, effort, and progress.", pos: [-12, 2, -6] },
  { id: 8, title: "A Good Conversation", category: "People", description: "A moment that stayed.", pos: [1, -7, 6] },
  { id: 9, title: "New Goal", category: "Goals", description: "Something worth moving toward.", pos: [-6, -5, 0] },
  { id: 10, title: "Small Win", category: "Growth", description: "Progress doesn't always announce itself.", pos: [-4, -8, -4] },
  { id: 11, title: "Travel", category: "Moments", description: "A place worth remembering.", pos: [10, -2, -5] },
  { id: 12, title: "Reflection", category: "Reflections", description: "Something learned from the past.", pos: [3, 8, -4] },
  { id: 13, title: "Creative Spark", category: "Ideas", description: "The beginning of something.", pos: [11, 3, -1] },
  { id: 14, title: "Morning Routine", category: "Habits", description: "A small action repeated.", pos: [-2, 5, -2] },
  { id: 15, title: "Milestone", category: "Goals", description: "A moment that changed the trajectory.", pos: [7, -1, 10] },
  { id: 16, title: "Quiet Evening", category: "Moments", description: "Nothing dramatic. Still worth remembering.", pos: [-2, -4, 9] },
];

const RELATIONS: [number, number][] = [
  [1, 14], [14, 12], [11, 12],
  [2, 3], [3, 13], [13, 15],
  [4, 9], [9, 10],
  [5, 8], [8, 16],
];

const RELATION_GROUPS = [
  [1, 14, 12, 11],
  [2, 3, 13, 15],
  [4, 9, 10],
  [5, 8, 16],
  [6],
  [7]
];

function isRelated(selectedId: number, id: number) {
  if (selectedId === id) return true;
  const group = RELATION_GROUPS.find(g => g.includes(selectedId));
  return group ? group.includes(id) : false;
}

// --------------------------------------------------
// CONTEXT
// --------------------------------------------------

const MemoryContext = createContext<{
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
}>({
  selectedId: null,
  setSelectedId: () => { },
  hoveredId: null,
  setHoveredId: () => { },
});

// --------------------------------------------------
// TEXTURES
// --------------------------------------------------

function makeStarTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.1, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.2)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

function makeGlowTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.2, 'rgba(200,220,255,0.4)');
  g.addColorStop(0.5, 'rgba(100,150,255,0.1)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// --------------------------------------------------
// BACKGROUND STARS
// --------------------------------------------------

function ParticleStars({ count, minR, maxR, size, opacity, speed }: { count: number, minR: number, maxR: number, size: number, opacity: number, speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const tex = useMemo(() => makeStarTexture(), []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = minR + Math.pow(Math.random(), 1.5) * (maxR - minR);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.cos(phi) * 0.6;
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const t = Math.random();
      if (t > 0.9) {
        col[i3] = 1.0; col[i3 + 1] = 0.8; col[i3 + 2] = 0.6;
      } else if (t > 0.8) {
        col[i3] = 0.6; col[i3 + 1] = 0.8; col[i3 + 2] = 1.0;
      } else {
        const v = 0.5 + Math.random() * 0.5;
        col[i3] = v; col[i3 + 1] = v; col[i3 + 2] = v;
      }
    }
    return { positions: pos, colors: col };
  }, [count, minR, maxR]);

  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * speed;
      ref.current.rotation.x += d * (speed * 0.5);
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors transparent opacity={opacity}
        size={size} sizeAttenuation depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={tex} alphaMap={tex} alphaTest={0.001}
      />
    </points>
  );
}

function SubtleDust({ count = 100 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const tex = useMemo(() => makeGlowTexture(), []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2 - 1));

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.cos(phi) * 0.5;
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const cool = Math.random() > 0.5;
      if (cool) {
        col[i3] = 0.05; col[i3 + 1] = 0.08; col[i3 + 2] = 0.15;
      } else {
        col[i3] = 0.12; col[i3 + 1] = 0.08; col[i3 + 2] = 0.05;
      }
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.001;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors transparent opacity={0.08}
        size={8.0} sizeAttenuation depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={tex} alphaMap={tex} alphaTest={0.001}
      />
    </points>
  );
}

function BackgroundEnvironment({ isMobile }: { isMobile: boolean }) {
  return (
    <group>
      <ParticleStars count={isMobile ? 500 : 1000} minR={40} maxR={100} size={0.2} opacity={0.3} speed={0.0003} />
      <ParticleStars count={isMobile ? 300 : 600} minR={25} maxR={60} size={0.35} opacity={0.4} speed={0.0005} />
      <ParticleStars count={isMobile ? 150 : 300} minR={10} maxR={30} size={0.5} opacity={0.6} speed={0.0008} />
      <SubtleDust count={isMobile ? 50 : 120} />
    </group>
  );
}

// --------------------------------------------------
// MEMORY OBJECTS
// --------------------------------------------------

function MemoryStar({ data }: { data: typeof MEMORIES[0] }) {
  const { selectedId, setSelectedId, hoveredId, setHoveredId } = useContext(MemoryContext);
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const isActive = selectedId === data.id;
  const isHovered = hoveredId === data.id;
  const inSelectedGroup = selectedId ? isRelated(selectedId, data.id) : false;

  const targetScale = isActive ? 1.5 : (isHovered ? 1.3 : (inSelectedGroup ? 1.1 : 1.0));
  const targetIntensity = isActive ? 1.2 : (isHovered ? 1.0 : (inSelectedGroup ? 0.7 : 0.3));
  const baseColorHex = CATEGORY_COLORS[data.category] || '#ffffff';
  const baseColor = useMemo(() => new THREE.Color(baseColorHex), [baseColorHex]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      const tColor = baseColor.clone().multiplyScalar(targetIntensity);
      mat.color.lerp(tColor, delta * 6);
    }
    if (haloRef.current) {
      const hScale = targetScale * 2.8;
      haloRef.current.scale.lerp(new THREE.Vector3(hScale, hScale, hScale), delta * 6);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      const tColor = baseColor.clone().multiplyScalar(targetIntensity * 0.25);
      mat.color.lerp(tColor, delta * 6);
    }
  });

  return (
    <group position={data.pos as [number, number, number]}>
      {/* Invisible hit area */}
      <mesh
        onClick={(e) => { e.stopPropagation(); setSelectedId(data.id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredId(data.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredId(null); document.body.style.cursor = 'auto'; }}
        visible={false}
      >
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={baseColor.clone().multiplyScalar(0.3)} transparent />
      </mesh>

      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={baseColor.clone().multiplyScalar(0.1)} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <Html
        position={[0, 0, 0]}
        center
        zIndexRange={[100, 0]}
        style={{
          opacity: isHovered || isActive ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{
          marginLeft: '32px',
          padding: '10px 14px',
          background: 'rgba(2, 4, 10, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#fff',
          fontFamily: 'sans-serif',
          transform: isActive ? 'translate3d(0,0,0)' : 'translate3d(-8px,0,0)',
          transition: 'transform 0.4s ease-out',
        }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#8ea8e0', marginBottom: '2px' }}>
            {data.category}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>
            {data.title}
          </div>
          <div style={{ fontSize: '11px', color: '#a0a0a0' }}>
            {data.description}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Connections() {
  const { selectedId } = useContext(MemoryContext);

  const positions = useMemo(() => {
    const pos = new Float32Array(RELATIONS.length * 6);
    RELATIONS.forEach(([a, b], i) => {
      const memA = MEMORIES.find(m => m.id === a)!;
      const memB = MEMORIES.find(m => m.id === b)!;
      pos[i * 6] = memA.pos[0];
      pos[i * 6 + 1] = memA.pos[1];
      pos[i * 6 + 2] = memA.pos[2];
      pos[i * 6 + 3] = memB.pos[0];
      pos[i * 6 + 4] = memB.pos[1];
      pos[i * 6 + 5] = memB.pos[2];
    });
    return pos;
  }, []);

  const ref = useRef<THREE.LineSegments>(null);
  const colorsRef = useRef(new Float32Array(RELATIONS.length * 6));

  useFrame((_, delta) => {
    if (!ref.current) return;

    let needsUpdate = false;
    RELATIONS.forEach(([a, b], i) => {
      const isActive = selectedId ? (isRelated(selectedId, a) && isRelated(selectedId, b)) : false;
      const targetOpacity = isActive ? 0.4 : 0.03;

      const c = new THREE.Color(isActive ? '#aaccff' : '#445588');
      const targetR = c.r * targetOpacity;
      const targetG = c.g * targetOpacity;
      const targetB = c.b * targetOpacity;

      const lerpFactor = delta * 4;
      const rIdx = i * 6;
      colorsRef.current[rIdx] += (targetR - colorsRef.current[rIdx]) * lerpFactor;
      colorsRef.current[rIdx + 1] += (targetG - colorsRef.current[rIdx + 1]) * lerpFactor;
      colorsRef.current[rIdx + 2] += (targetB - colorsRef.current[rIdx + 2]) * lerpFactor;

      colorsRef.current[rIdx + 3] = colorsRef.current[rIdx];
      colorsRef.current[rIdx + 4] = colorsRef.current[rIdx + 1];
      colorsRef.current[rIdx + 5] = colorsRef.current[rIdx + 2];
      needsUpdate = true;
    });

    if (needsUpdate) {
      ref.current.geometry.setAttribute('color', new THREE.BufferAttribute(colorsRef.current, 3));
    }
  });

  return (
    <lineSegments ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorsRef.current, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        linewidth={1}
      />
    </lineSegments>
  );
}

// --------------------------------------------------
// CAMERA & INTERACTION
// --------------------------------------------------

function CameraParallax() {
  const { camera, size } = useThree();
  const { selectedId } = useContext(MemoryContext);
  const pointer = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });

  const onMove = useCallback((e: MouseEvent) => {
    pointer.current.x = (e.clientX / size.width) * 2 - 1;
    pointer.current.y = -(e.clientY / size.height) * 2 + 1;
  }, [size]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  useFrame((_, d) => {
    const lf = 1 - Math.pow(0.01, d);
    smoothed.current.x += (pointer.current.x - smoothed.current.x) * lf;
    smoothed.current.y += (pointer.current.y - smoothed.current.y) * lf;

    let targetX = smoothed.current.x * 3.0;
    let targetY = smoothed.current.y * 2.0;
    let targetZ = 25;

    if (selectedId) {
      const memory = MEMORIES.find(m => m.id === selectedId);
      if (memory) {
        targetX += memory.pos[0] * 0.15;
        targetY += memory.pos[1] * 0.15;
        targetZ = 25 - 4;
      }
    }

    camera.position.x += (targetX - camera.position.x) * d * 2;
    camera.position.y += (targetY - camera.position.y) * d * 2;
    camera.position.z += (targetZ - camera.position.z) * d * 2;

    const lookAtTarget = new THREE.Vector3(smoothed.current.x * 0.5, smoothed.current.y * 0.5, 0);
    camera.lookAt(lookAtTarget);
  });

  return null;
}

// --------------------------------------------------
// SCENE ROOT
// --------------------------------------------------

function GalaxyScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <fog attach="fog" args={['#020407', 15, 60]} />
      <ambientLight intensity={0.05} />

      <BackgroundEnvironment isMobile={isMobile} />

      <group>
        {MEMORIES.map(m => (
          <MemoryStar key={m.id} data={m} />
        ))}
        <Connections />
      </group>

      <CameraParallax />

      <EffectComposer enableNormalPass={false} multisampling={isMobile ? 0 : 4}>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette darkness={0.7} offset={0.3} />
      </EffectComposer>
    </>
  );
}

// --------------------------------------------------
// EXPORTED COMPONENT
// --------------------------------------------------

export default function OrbitGalaxyV2() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <MemoryContext.Provider value={{ selectedId, setSelectedId, hoveredId, setHoveredId }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 25], fov: 48, near: 0.1, far: 200 }}
          gl={{ antialias: !isMobile, alpha: false }}
          dpr={[1, isMobile ? 1.5 : 2]}
          onPointerMissed={() => setSelectedId(null)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            background: '#020407',
          }}
        >
          <GalaxyScene isMobile={isMobile} />
        </Canvas>
      </div>
    </MemoryContext.Provider>
  );
}
