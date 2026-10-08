'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ── individual memory event data ───────────────────────────────────────────────
export interface MemoryEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  pos: [number, number, number];
  color: number;
}

const EVENTS: MemoryEvent[] = [
  // Social (Near [-8.0, 3.0, -1.0])
  { id: 1,  title: 'Coffee with Sara',     category: 'Social',      date: 'Oct 7',  pos: [-7.0,  3.5, -0.5], color: 0xa8c8e8 },
  { id: 2,  title: 'Team sync call',       category: 'Social',      date: 'Oct 3',  pos: [-8.5,  2.2, -1.5], color: 0xa8c8e8 },
  // Stress (Near [-3.5, 0.5, 2.0])
  { id: 3,  title: 'Deadline pressure',    category: 'Stress',      date: 'Oct 4',  pos: [-3.0,  0.8,  2.5], color: 0xe8a8a8 },
  { id: 4,  title: 'Traffic jam',          category: 'Stress',      date: 'Oct 6',  pos: [-4.2,  0.0,  1.5], color: 0xe8a8a8 },
  // Reflection (Near [2.0, -5.5, 4.0])
  { id: 5,  title: 'Morning meditation',   category: 'Reflection',  date: 'Oct 1',  pos: [ 1.2, -4.8,  3.5], color: 0x88c8b8 },
  { id: 6,  title: 'Evening walk',         category: 'Reflection',  date: 'Oct 6',  pos: [ 3.0, -6.0,  4.8], color: 0x88c8b8 },
  // Goals (Near [8.5, 1.5, -2.0])
  { id: 7,  title: 'New goal set',         category: 'Goals',       date: 'Oct 3',  pos: [ 9.2,  2.0, -1.5], color: 0xe8d0a0 },
  { id: 8,  title: 'Finished ORBIT v3',    category: 'Goals',       date: 'Oct 4',  pos: [ 7.5,  1.0, -2.5], color: 0xe8d0a0 },
  // Productivity (Near [4.0, 4.5, -4.0])
  { id: 9,  title: 'Weekly review',        category: 'Productivity',date: 'Oct 6',  pos: [ 3.5,  5.0, -3.5], color: 0xa8e8b8 },
  { id: 10, title: 'Deep focus block',     category: 'Productivity',date: 'Oct 5',  pos: [ 4.8,  4.0, -4.5], color: 0xa8e8b8 },
  // Study (Near [-1.0, 5.0, -3.0])
  { id: 11, title: 'Late night reading',   category: 'Study',       date: 'Oct 5',  pos: [-0.5,  5.5, -2.5], color: 0xb8a8e8 },
  { id: 12, title: 'Lecture notes',        category: 'Study',       date: 'Oct 4',  pos: [-1.8,  4.5, -3.5], color: 0xb8a8e8 },
];

// ── individual memory star ────────────────────────────────────────────────────
function MemoryStar({
  event,
  onSelect,
  selectedId,
}: {
  event: MemoryEvent;
  onSelect: (e: MemoryEvent | null) => void;
  selectedId: number | null;
}) {
  const coreRef  = useRef<THREE.Mesh>(null);
  const haloRef  = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === event.id;

  const baseColor = useMemo(() => new THREE.Color(event.color), [event.color]);

  useFrame((_, d) => {
    const targetScale = isSelected ? 1.8 : hovered ? 1.4 : 1.0;
    const targetBright = isSelected ? 1.2 : hovered ? 0.9 : 0.4;

    if (coreRef.current) {
      coreRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), d * 5
      );
      (coreRef.current.material as THREE.MeshBasicMaterial).color.lerp(
        baseColor.clone().multiplyScalar(targetBright), d * 5
      );
    }
    if (haloRef.current) {
      const hs = targetScale * 3.5;
      haloRef.current.scale.lerp(new THREE.Vector3(hs, hs, hs), d * 5);
      (haloRef.current.material as THREE.MeshBasicMaterial).color.lerp(
        baseColor.clone().multiplyScalar(targetBright * 0.25), d * 5
      );
    }
  });

  return (
    <group position={event.pos}>
      {/* Hit area */}
      <mesh
        visible={false}
        onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : event); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      {/* Core dot */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={baseColor.clone().multiplyScalar(0.4)} />
      </mesh>

      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial
          color={baseColor.clone().multiplyScalar(0.1)}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label on hover / select */}
      <Html
        position={[0, 0.45, 0]}
        center
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            opacity: hovered || isSelected ? 1 : 0,
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            transform: hovered || isSelected ? 'translateY(0)' : 'translateY(6px)',
            background: 'rgba(4, 6, 18, 0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '10px 14px',
            whiteSpace: 'nowrap',
            marginBottom: '8px',
          }}
        >
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(180,190,230,0.7)', marginBottom: '4px', fontFamily: 'system-ui' }}>
            {event.category} · {event.date}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8f8fa', fontFamily: 'system-ui', lineHeight: 1.3 }}>
            {event.title}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ── exported component ─────────────────────────────────────────────────────────
export default function MemoryParticles() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (e: MemoryEvent | null) => {
    setSelectedId(e ? e.id : null);
  };

  return (
    <group onPointerMissed={() => setSelectedId(null)}>
      {EVENTS.map((ev) => (
        <MemoryStar key={ev.id} event={ev} onSelect={handleSelect} selectedId={selectedId} />
      ))}
    </group>
  );
}
