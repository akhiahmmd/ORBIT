'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useStarTexture } from './textures';

/**
 * Galaxy — Procedural spiral galaxy with thousands of particles along spiral arms.
 * Uses Points (one draw call) for performance.
 */
export default function Galaxy({ particleCount = 12000 }: { particleCount?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const starTex = useStarTexture();

  const { positions, colors, sizes } = useMemo(() => {
    // Increase density massively for cinematic realism
    const count = particleCount > 20000 ? particleCount : 60000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const arms = 5;
    const galaxyRadius = 32;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distance from center - weighted heavily toward the core for a luminous center
      const radiusFraction = Math.pow(Math.random(), 2.8);
      let radius = radiusFraction * galaxyRadius;
      
      // Core bulge - ensure dense center
      if (Math.random() < 0.15) {
        radius *= 0.15;
      }

      const armIndex = i % arms;
      const armAngle = (armIndex / arms) * Math.PI * 2;
      
      // Logarithmic spiral twist
      const spiralAngle = armAngle + radius * 0.35 + Math.sin(radius * 0.15) * 0.1;

      // Dust lanes & dispersion: Create gaps between arms and tighten the arms themselves
      const distanceFactor = Math.pow(radius / galaxyRadius, 0.8);
      // Tight in the center, loose at the edges, with some random scattering
      let spread = (Math.random() - 0.5) * distanceFactor * 14.0;
      
      // Add a chance for particles to form dense clusters inside the arms
      if (Math.random() > 0.4) {
        spread *= 0.3;
      }

      const spreadX = Math.cos(spiralAngle + Math.PI / 2) * spread;
      const spreadZ = Math.sin(spiralAngle + Math.PI / 2) * spread;

      // Y-axis height - thin disk, bulging core
      const heightSpread = (Math.random() - 0.5) * Math.max(0.2, (1 - radiusFraction) * 3.5) * Math.pow(Math.random(), 2);

      pos[i3] = Math.cos(spiralAngle) * radius + spreadX;
      pos[i3 + 1] = heightSpread;
      pos[i3 + 2] = Math.sin(spiralAngle) * radius + spreadZ;

      // Color palette based on astrophotography
      const innerFactor = 1 - radiusFraction;
      
      let r, g, b;
      const randColor = Math.random();

      // Dark dust lanes simulation - occasionally make particles very faint/dark brown
      const isDust = Math.random() < 0.12 && radiusFraction > 0.1;

      if (isDust) {
        // Dark interstellar dust
        r = 0.05 + Math.random() * 0.02;
        g = 0.02 + Math.random() * 0.01;
        b = 0.02;
        sz[i] = 0.01 + Math.random() * 0.03;
      } else if (radiusFraction < 0.15) {
        // Luminous Core: Hot white/yellow/orange
        r = 1.0;
        g = 0.85 + Math.random() * 0.15;
        b = 0.6 + Math.random() * 0.2;
      } else if (randColor < 0.05) {
        // Red giants scattered
        r = 0.95;
        g = 0.4 + Math.random() * 0.2;
        b = 0.2 + Math.random() * 0.1;
      } else if (randColor < 0.2) {
        // Hot young blue stars in arms
        r = 0.4 + Math.random() * 0.3;
        g = 0.6 + Math.random() * 0.3;
        b = 1.0;
      } else {
        // Standard main sequence fading to deep blue/magenta at edges
        r = THREE.MathUtils.lerp(0.2, 0.9, innerFactor) + Math.random() * 0.1;
        g = THREE.MathUtils.lerp(0.2, 0.8, innerFactor) + Math.random() * 0.1;
        b = THREE.MathUtils.lerp(0.5, 0.7, innerFactor) + Math.random() * 0.3;
      }

      col[i3] = r;
      col[i3 + 1] = g;
      col[i3 + 2] = b;

      // Size
      if (!isDust) {
        const sizeRand = Math.random();
        if (sizeRand > 0.995) {
          sz[i] = 0.05 + Math.random() * 0.08; // Bright focal stars
        } else {
          sz[i] = 0.002 + Math.random() * 0.018; // Tiny mass stars
        }
        
        // Increase core size slightly for bloom effect
        if (radiusFraction < 0.1) {
          sz[i] *= 1.5;
        }
      }
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [particleCount]);

  // Slow galaxy rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
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
        opacity={0.68}
        size={0.18}
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
