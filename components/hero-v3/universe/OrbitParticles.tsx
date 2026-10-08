'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeStarTex(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d')!;
  
  // Create a soft glowing dot
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0,    'rgba(255, 255, 255, 1)');
  gr.addColorStop(0.15, 'rgba(255, 255, 255, 0.8)');
  gr.addColorStop(0.3,  'rgba(255, 255, 255, 0.2)');
  gr.addColorStop(1,    'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

const TOTAL_PARTICLES = 100000;
const RADIUS_MAX = 35;
const BRANCHES = 2; // Two main spiral arms

export default function OrbitParticles({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = isMobile ? Math.floor(TOTAL_PARTICLES * 0.4) : TOTAL_PARTICLES;
  
  const tex = useMemo(() => makeStarTex(), []);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    const c   = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // 70% in spiral arms, 30% scattered dust
      const isArm = Math.random() < 0.7;
      
      let radius, angle;
      
      if (isArm) {
        // Spiral arm math
        radius = Math.random() * RADIUS_MAX;
        const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
        const spinAngle = radius * 0.35; // How tight the spiral is
        
        // Curve power: 1.0 is linear, < 1.0 means more particles near center
        const curve = Math.pow(Math.random(), 1.5);
        radius = curve * RADIUS_MAX;
        
        // Random spread that widens as we get further from center
        const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * (radius + 1);
        const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * (radius + 1);
        
        angle = branchAngle + (radius * 0.35); // base angle
        
        // Apply elliptical stretch to make it a "barred" spiral
        // We stretch along X axis and squash along Z
        const x = Math.cos(angle) * radius * 1.8 + randomX; // stretch X
        const z = Math.sin(angle) * radius * 0.7 + randomZ; // squash Z
        
        // Y (vertical) spread - very thin disc
        const ySpread = 0.15 + (1 - (radius / RADIUS_MAX)) * 0.4;
        const y = (Math.random() - 0.5) * ySpread * radius * 0.5;
        
        pos[i * 3]     = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        
      } else {
        // Random background dust/haze filling the space
        radius = Math.pow(Math.random(), 0.8) * RADIUS_MAX * 1.5;
        angle = Math.random() * Math.PI * 2;
        
        const x = Math.cos(angle) * radius * 1.8;
        const z = Math.sin(angle) * radius * 0.7;
        const y = (Math.random() - 0.5) * (radius * 0.3); // Thicker volume
        
        pos[i * 3]     = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }
      
      // Calculate actual distance from center for color/brightness falloff
      const dist = Math.sqrt(pos[i*3]*pos[i*3] + pos[i*3+1]*pos[i*3+1] + pos[i*3+2]*pos[i*3+2]);
      const distFrac = Math.min(1.0, dist / RADIUS_MAX);
      
      // Coloring based on reference:
      // Inner is warm (peach/gold), mid is dusty white/pinkish, outer is deep blue/purple
      let bright = 0;
      if (Math.random() < 0.02) {
        bright = 0.8 + Math.random() * 0.4; // extremely bright highlight stars
      } else if (Math.random() < 0.15) {
        bright = 0.3 + Math.random() * 0.3; // medium stars
      } else {
        bright = 0.05 + Math.random() * 0.1; // dim background dust
      }
      
      // Fade out edge particles
      bright *= Math.max(0, 1.0 - Math.pow(distFrac, 2));

      // Color interpolation
      if (distFrac < 0.2) {
        // Core/Inner warm
        c.setHSL(0.08, 0.6, bright); // Peach/Gold
      } else if (distFrac < 0.5) {
        // Mid mix
        if (Math.random() < 0.4) {
          c.setHSL(0.85, 0.4, bright); // Pinkish/Purple
        } else {
          c.setHSL(0.55, 0.2, bright); // Dusty blue-grey
        }
      } else {
        // Outer cold
        c.setHSL(0.65, 0.5, bright * 0.8); // Deep blue
      }

      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Sizes: closer to core = slightly larger, highlight stars = larger
      let sizeBase = 0.03 + Math.random() * 0.04;
      if (bright > 0.6) sizeBase *= 2.5; 
      sz[i] = sizeBase;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y -= d * 0.02; // Very slow rotation
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes,     1]} />
      </bufferGeometry>
      {/* We use a custom shader material to enable per-particle sizing based on the size attribute, 
          which standard PointsMaterial handles if sizeAttenuation is true. */}
      <pointsMaterial
        vertexColors
        transparent
        opacity={1.0}
        size={isMobile ? 0.04 : 0.05} // realistic tiny stars
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={tex}
        alphaMap={tex}
        alphaTest={0.001}
      />
    </points>
  );
}
