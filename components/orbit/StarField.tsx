'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStarTexture } from './textures';

export default function StarField({ count = 5000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const starTex = useStarTexture();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Spherical distribution with varying depth
      const radius = 42 + Math.pow(Math.random(), 1.65) * 150; // Keep foreground clear of oversized stars
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Star color types
      const starType = Math.random();
      if (starType > 0.95) {
        // Bright blue
        col[i3] = 0.6 + Math.random() * 0.4;
        col[i3 + 1] = 0.8 + Math.random() * 0.2;
        col[i3 + 2] = 1.0;
      } else if (starType > 0.8) {
        // Warm/yellowish
        col[i3] = 1.0;
        col[i3 + 1] = 0.8 + Math.random() * 0.2;
        col[i3 + 2] = 0.6 + Math.random() * 0.2;
      } else {
        // Standard white/faint
        const intensity = 0.5 + Math.random() * 0.5;
        col[i3] = intensity;
        col[i3 + 1] = intensity;
        col[i3 + 2] = intensity;
      }

      // Sizes - mostly tiny, some large
      const sizeRand = Math.random();
      if (sizeRand > 0.992) {
        sz[i] = 0.55 + Math.random() * 0.55; // Bright distinct stars
      } else if (sizeRand > 0.88) {
        sz[i] = 0.18 + Math.random() * 0.25; // Medium
      } else {
        sz[i] = 0.04 + Math.random() * 0.1; // Tiny background dust
      }
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Extremely slow rotation for the whole background sphere
      pointsRef.current.rotation.y += delta * 0.001;
      pointsRef.current.rotation.x += delta * 0.0005;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.56}
        size={0.34}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={starTex}
        alphaMap={starTex}
        alphaTest={0.001}
      />
    </points>
  );
}
