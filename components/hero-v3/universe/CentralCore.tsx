'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeCoreSprite(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,   'rgba(255, 255, 255, 1)');
  g.addColorStop(0.1, 'rgba(255, 240, 200, 0.9)');
  g.addColorStop(0.25,'rgba(255, 200, 150, 0.4)');
  g.addColorStop(0.6, 'rgba(150, 100, 255, 0.05)');
  g.addColorStop(1,   'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

const CORE_COUNT  = 12000;

export default function CentralCore() {
  const coreRef  = useRef<THREE.Points>(null);
  const tex = useMemo(() => makeCoreSprite(), []);

  // Dense, elongated point cloud for the barred core
  const coreData = useMemo(() => {
    const pos = new Float32Array(CORE_COUNT * 3);
    const col = new Float32Array(CORE_COUNT * 3);
    const c   = new THREE.Color();

    for (let i = 0; i < CORE_COUNT; i++) {
      // Elongated along X axis
      const radiusX = Math.pow(Math.random(), 2.0) * 8.0;
      const radiusZ = Math.pow(Math.random(), 2.0) * 1.5;
      const radiusY = Math.pow(Math.random(), 2.0) * 0.8;
      
      const angle = Math.random() * Math.PI * 2;
      
      const x = (Math.random() - 0.5) * 2 * radiusX;
      const y = (Math.random() - 0.5) * 2 * radiusY;
      const z = (Math.random() - 0.5) * 2 * radiusZ;

      pos[i * 3]     = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const distSq = (x*x/(8*8) + y*y + z*z/(1.5*1.5));
      const dist = Math.min(1.0, Math.sqrt(distSq));
      
      // Extremely bright in the absolute center, fading to warm orange
      const bright = (0.5 + Math.random() * 0.5) * Math.max(0, 1.0 - dist);
      
      c.setHSL(0.08, 0.7, bright * 1.5); // Warm gold/peach, blown out to white in center via bloom
      
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, d) => {
    if (coreRef.current) coreRef.current.rotation.y -= d * 0.02; // Match galaxy rotation
  });

  return (
    <group>
      {/* Intense elongated glow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.8, 0.6, 1]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffeedd"
        />
      </mesh>
      
      {/* Secondary crossed glow to create starburst */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[0.3, 1.5, 1]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ddeeff"
        />
      </mesh>

      {/* Dense core points */}
      <points ref={coreRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[coreData.positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[coreData.colors,    3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={1.0}
          size={0.12}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={tex}
          alphaMap={tex}
          alphaTest={0.001}
        />
      </points>

      {/* Point lights for strong bloom pickup on surrounding particles */}
      <pointLight position={[0, 0, 0]} intensity={6.0} color="#ffeedd" distance={35} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color="#a0c0ff" distance={60} />
    </group>
  );
}
