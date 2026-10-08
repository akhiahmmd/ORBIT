'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Soft circular sprite texture baked once
function makeSpriteTex() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.12,'rgba(255,255,255,0.8)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

interface LayerCfg {
  count: number;
  rMin: number;
  rMax: number;
  yScale: number;
  size: number;
  opacity: number;
  speed: number;
}

const STAR_LAYERS: LayerCfg[] = [
  { count: 900, rMin: 60, rMax: 140, yScale: 0.45, size: 0.18, opacity: 0.28, speed: 0.00015 },
  { count: 500, rMin: 32, rMax:  70, yScale: 0.50, size: 0.28, opacity: 0.35, speed: 0.00022 },
  { count: 220, rMin: 15, rMax:  38, yScale: 0.55, size: 0.42, opacity: 0.45, speed: 0.00030 },
];

function StarBand({ cfg, tex }: { cfg: LayerCfg; tex: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(cfg.count * 3);
    const col = new Float32Array(cfg.count * 3);
    const c   = new THREE.Color();

    for (let i = 0; i < cfg.count; i++) {
      const r     = cfg.rMin + Math.pow(Math.random(), 1.4) * (cfg.rMax - cfg.rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * cfg.yScale;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const t = Math.random();
      const brightness = 0.45 + Math.random() * 0.55;
      if      (t > 0.92) c.setHSL(0.60, 0.55, brightness); // blue-white
      else if (t > 0.85) c.setHSL(0.08, 0.50, brightness); // warm-white
      else               c.setHSL(0.60, 0.06, brightness); // neutral-white

      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [cfg]);

  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * cfg.speed;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={cfg.opacity}
        size={cfg.size}
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

export default function DistantStars() {
  const tex = useMemo(() => makeSpriteTex(), []);
  return (
    <group>
      {STAR_LAYERS.map((cfg, i) => (
        <StarBand key={i} cfg={cfg} tex={tex} />
      ))}
    </group>
  );
}
