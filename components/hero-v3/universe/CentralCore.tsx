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

const CORE_COUNT  = 30000; // Even more dense

export default function CentralCore() {
  const coreRef  = useRef<THREE.Points>(null);
  const tex = useMemo(() => makeCoreSprite(), []);

  // Dense, elongated point cloud for the barred core
  const coreData = useMemo(() => {
    const pos = new Float32Array(CORE_COUNT * 3);
    const col = new Float32Array(CORE_COUNT * 3);
    const c   = new THREE.Color();

    for (let i = 0; i < CORE_COUNT; i++) {
      // Massive dense center volume
      const radiusX = Math.pow(Math.random(), 1.8) * 22.0;
      const radiusZ = Math.pow(Math.random(), 1.8) * 8.0;
      const radiusY = Math.pow(Math.random(), 2.0) * 4.0;
      
      const angle = Math.random() * Math.PI * 2;
      
      const x = (Math.random() - 0.5) * 2 * radiusX;
      const y = (Math.random() - 0.5) * 2 * radiusY;
      const z = (Math.random() - 0.5) * 2 * radiusZ;

      pos[i * 3]     = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const distSq = (x*x/(22*22) + y*y/(4*4) + z*z/(8*8));
      const dist = Math.min(1.0, Math.sqrt(distSq));
      
      // Intense brightness
      const bright = (1.0 + Math.random() * 1.5) * Math.max(0, 1.0 - dist);
      
      c.setHSL(0.12, 0.8, bright * 1.8); // Brilliant gold/peach
      
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, d) => {
    if (coreRef.current) coreRef.current.rotation.y -= d * 0.015; // Match galaxy rotation
  });

  return (
    <group>
      {/* Intense elongated glow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[4.5, 1.8, 1]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#fff0e0"
        />
      </mesh>
      
      {/* Secondary crossed glow to create starburst */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.2, 4.0, 1]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#e0f0ff"
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
          size={0.6} // Massive core particles
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={tex}
          alphaMap={tex}
          alphaTest={0.001}
        />
      </points>

      {/* Point lights for strong bloom pickup on surrounding particles */}
      <pointLight position={[0, 0, 0]} intensity={12.0} color="#ffeedd" distance={90} />
      <pointLight position={[0, 0, 0]} intensity={6.0} color="#a0c0ff" distance={150} />
    </group>
  );
}
