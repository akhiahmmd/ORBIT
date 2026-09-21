'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSoftCircleTexture } from './textures';

/**
 * Nebula — Layered transparent particles creating a volumetric dust cloud effect.
 * Uses additive blending for ethereal glow.
 */
export default function Nebula({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const softCircleTex = useSoftCircleTexture();

  const { positions, colors, opacities } = useMemo(() => {
    const cloudCount = count > 200 ? count : 400; // Increase count
    const pos = new Float32Array(cloudCount * 3);
    const col = new Float32Array(cloudCount * 3);
    const opa = new Float32Array(cloudCount);

    for (let i = 0; i < cloudCount; i++) {
      const i3 = i * 3;

      // Nebula clouds concentrated around the galactic plane, but some scattered
      const radius = 2 + Math.pow(Math.random(), 0.7) * 30;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.8 * (1 - Math.min(1, radius / 30));

      pos[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 6;
      pos[i3 + 1] = height;
      pos[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 6;

      // Nebula colors — subtle dusty blues and faint warm browns
      const colorChoice = Math.random();
      if (radius < 8) {
        // Core glow
        col[i3] = 0.4;
        col[i3 + 1] = 0.3;
        col[i3 + 2] = 0.2;
      } else if (colorChoice < 0.4) {
        // Deep faint blue/indigo
        col[i3] = 0.08;
        col[i3 + 1] = 0.12;
        col[i3 + 2] = 0.35;
      } else if (colorChoice < 0.7) {
        // Very faint cyan dust
        col[i3] = 0.05;
        col[i3 + 1] = 0.15;
        col[i3 + 2] = 0.25;
      } else {
        // Faint warm brown/orange dust in the lanes
        col[i3] = 0.2;
        col[i3 + 1] = 0.1;
        col[i3 + 2] = 0.05;
      }

      opa[i] = 0.01 + Math.random() * 0.025;
    }

    return { positions: pos, colors: col, opacities: opa };
  }, [count]);

  // Very slow drift
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.01;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.07}
        size={1.1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={softCircleTex}
        alphaMap={softCircleTex}
        alphaTest={0.001}
      />
    </points>
  );
}
