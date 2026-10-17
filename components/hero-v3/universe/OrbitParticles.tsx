'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeStarTex(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d')!;
  
  // Create a soft glowing dot with a bright center
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0,    'rgba(255, 255, 255, 1)');
  gr.addColorStop(0.1,  'rgba(255, 255, 255, 0.9)');
  gr.addColorStop(0.3,  'rgba(255, 255, 255, 0.3)');
  gr.addColorStop(0.7,  'rgba(255, 255, 255, 0.05)');
  gr.addColorStop(1,    'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

const TOTAL_PARTICLES = 250000;
const RADIUS_MAX = 90;
const BRANCHES = 4; // Multiple arms for a dense, broad structure

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
      // 80% in spiral arms, 20% scattered dust
      const isArm = Math.random() < 0.8;
      
      let radius, angle;
      
      if (isArm) {
        // Spiral arm math
        const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
        
        // Curve power: 1.0 is linear, < 1.0 means more particles near center
        const curve = Math.pow(Math.random(), 1.6); // more density near core
        radius = curve * RADIUS_MAX;
        
        // Tighter spread to make arms distinct
        const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * (radius + 2);
        const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * (radius + 2);
        
        angle = branchAngle + (radius * 0.3); // moderate spiral wrap
        
        // Apply elliptical stretch to make it a "barred" spiral
        const x = Math.cos(angle) * radius * 1.6 + randomX; // stretch X
        const z = Math.sin(angle) * radius * 0.9 + randomZ; // squash Z
        
        // Y (vertical) spread - thicker core, thin disc edges
        const ySpread = 0.2 + (1 - (radius / RADIUS_MAX)) * 0.5;
        const y = (Math.random() - 0.5) * ySpread * (radius * 0.5 + 1);
        
        pos[i * 3]     = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        
      } else {
        // Random background dust/haze filling the space
        radius = Math.pow(Math.random(), 0.9) * RADIUS_MAX * 1.4;
        angle = Math.random() * Math.PI * 2;
        
        const x = Math.cos(angle) * radius * 1.5;
        const z = Math.sin(angle) * radius * 0.9;
        const y = (Math.random() - 0.5) * (radius * 0.6 + 4); // Thicker volume
        
        pos[i * 3]     = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }
      
      // Calculate actual distance from center for color/brightness falloff
      const dist = Math.sqrt(pos[i*3]*pos[i*3] + pos[i*3+1]*pos[i*3+1] + pos[i*3+2]*pos[i*3+2]);
      const distFrac = Math.min(1.0, dist / RADIUS_MAX);
      
      // Coloring based on reference: Extremely bright!
      let bright = 0;
      if (Math.random() < 0.05) {
        bright = 2.0 + Math.random() * 1.5; // bloom highlight stars
      } else if (Math.random() < 0.3) {
        bright = 0.8 + Math.random() * 1.0; // medium bright stars
      } else {
        bright = 0.3 + Math.random() * 0.5; // base level particles
      }
      
      // Fade out edge particles gently
      bright *= Math.max(0, 1.0 - Math.pow(distFrac, 3.0));

      // Color interpolation for atmospheric depth
      if (distFrac < 0.25) {
        // Core/Inner warm white to gold
        c.setHSL(0.12, 0.4, bright * 1.2); 
      } else if (distFrac < 0.6) {
        // Mid mix
        if (Math.random() < 0.4) {
          c.setHSL(0.85, 0.5, bright); // Pinkish/Purple dust
        } else if (Math.random() < 0.4) {
          c.setHSL(0.12, 0.6, bright * 1.1);  // Orange/Peach
        } else {
          c.setHSL(0.58, 0.4, bright); // Dusty blue
        }
      } else {
        // Outer cold space
        c.setHSL(0.62, 0.7, bright * 0.8); // Deep blue
      }

      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Perspective-based sizing: larger highlight stars
      let sizeBase = 0.12 + Math.random() * 0.15; // Much larger base size
      if (bright > 1.5) sizeBase *= 2.5;
      if (distFrac < 0.15) sizeBase *= 1.8; // Core stars massive
      sz[i] = sizeBase;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y -= d * 0.015; // Elegant slow rotation
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes,     1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={1.0}
        size={isMobile ? 0.2 : 0.45} // Drastically increase size to make them visible and glowing
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

