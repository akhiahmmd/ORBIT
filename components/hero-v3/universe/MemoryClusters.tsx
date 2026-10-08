'use client';

import { useRef, useMemo, useState, createContext, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// ── cluster definitions ────────────────────────────────────────────────────────
export interface ClusterDef {
  id: string;
  label: string;
  count: number;
  color: string;       // HTML label color
  threeColor: number;  // Sphere volume color
  position: [number, number, number];
  radius: number;
}

export const CLUSTERS: ClusterDef[] = [
  // Social: Left, slightly up, purple
  { id: 'social',      label: 'Social',      count: 31, color: '#f0e0f0', threeColor: 0x5a4a68, position: [-8.0,  3.0, -1.0], radius: 2.5 },
  // Stress: Middle-left, reddish brown
  { id: 'stress',      label: 'Stress',      count: 18, color: '#f0d0d0', threeColor: 0x684040, position: [-3.5,  0.5,  2.0], radius: 2.8 },
  // Reflection: Bottom center, very large, dark teal
  { id: 'reflection',  label: 'Reflection',  count: 24, color: '#d0f0f0', threeColor: 0x2a454d, position: [ 2.0, -5.5,  4.0], radius: 4.5 },
  // Goals: Right, golden brown
  { id: 'goals',       label: 'Goals',       count: 24, color: '#f0e8d0', threeColor: 0x6a561f, position: [ 8.5,  1.5, -2.0], radius: 3.2 },
  // Productivity: Top right, green
  { id: 'productivity',label: 'Productivity',count: 29, color: '#d0f0e0', threeColor: 0x3a5646, position: [ 4.0,  4.5, -4.0], radius: 2.0 },
  // Study: Top center, blue-purple
  { id: 'study',       label: 'Study',       count: 22, color: '#d0d0f0', threeColor: 0x4a4a68, position: [-1.0,  5.0, -3.0], radius: 1.8 },
];

export const ClusterCtx = createContext<{
  hovered: string | null;
  setHovered: (id: string | null) => void;
}>({ hovered: null, setHovered: () => {} });

// ── cluster boundary sphere ────────────────────────────────────────────────────
function ClusterBubble({ cluster }: { cluster: ClusterDef }) {
  const meshRef    = useRef<THREE.Mesh>(null);
  const { hovered, setHovered } = useContext(ClusterCtx);
  const active     = hovered === cluster.id;
  const scaleRef   = useRef(1.0);

  useFrame((state, d) => {
    const targetScale = active ? 1.05 : 1.0;
    scaleRef.current += (targetScale - scaleRef.current) * d * 5;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scaleRef.current);
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity += ((active ? 0.8 : 0.6) - mat.opacity) * d * 5;
    }
  });

  return (
    <group position={cluster.position}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* Invisible raycasting hit sphere */}
        <mesh
          visible={false}
          onPointerOver={() => setHovered(cluster.id)}
          onPointerOut={() => setHovered(null)}
        >
          <circleGeometry args={[cluster.radius, 16]} />
          <meshBasicMaterial />
        </mesh>

        {/* Flat translucent circle/sphere matching the reference style */}
        <mesh ref={meshRef}>
          <circleGeometry args={[cluster.radius, 64]} />
          <meshBasicMaterial
            color={cluster.threeColor}
            transparent
            opacity={0.6}
            depthWrite={false}
            blending={THREE.NormalBlending} 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Small bright dot at the center (as seen in some reference clusters) */}
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color={cluster.color} transparent opacity={active ? 1 : 0.4} />
        </mesh>
      </Billboard>

      {/* HTML label */}
      <Html
        position={[0, 0, 0.2]}
        center
        zIndexRange={[50, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            opacity: active ? 1 : 0.8,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              color: '#ffffff',
            }}
          >
            {cluster.label}
          </span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '8px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            {cluster.count} EVENTS
          </span>
        </div>
      </Html>
    </group>
  );
}

// ── exported component ─────────────────────────────────────────────────────────
export default function MemoryClusters() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      {/* Force the circles to always face the camera by putting them in a group 
          that counters the scene rotation, or we can just let them exist in 3D. 
          The reference looks like they are 2D overlays mapped to 3D space. 
          Using Billboard behavior would be ideal, but standard circle geometry works if we just rotate them to face front. */}
      <ClusterCtx.Provider value={{ hovered, setHovered }}>
        {CLUSTERS.map((cl) => (
          <ClusterBubble key={cl.id} cluster={cl} />
        ))}
      </ClusterCtx.Provider>
    </group>
  );
}
