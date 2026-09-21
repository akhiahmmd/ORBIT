'use client';
import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── DEMO DATA ───────────────────────────────────────────────────────
export interface EventStarData {
  id: string;
  date: string;
  topic: string;
  cluster: string;
  mood: string;
  productivity: string;
  journal: string;
}

export const CLUSTERS_3D = [
  { name: 'Study',        color: new THREE.Color(0.5, 0.55, 0.97),  angle: 0.3,   radius: 8,  armIndex: 0 },
  { name: 'Productivity', color: new THREE.Color(0.2, 0.83, 0.6),   angle: 1.2,   radius: 10, armIndex: 1 },
  { name: 'Goals',        color: new THREE.Color(0.96, 0.62, 0.04), angle: 2.5,   radius: 7,  armIndex: 2 },
  { name: 'Reflection',   color: new THREE.Color(0.22, 0.74, 0.97), angle: 3.8,   radius: 12, armIndex: 0 },
  { name: 'Stress',       color: new THREE.Color(0.97, 0.44, 0.44), angle: 4.5,   radius: 6,  armIndex: 1 },
  { name: 'Social',       color: new THREE.Color(0.75, 0.52, 0.98), angle: 5.5,   radius: 9,  armIndex: 2 },
];

export const EVENT_STARS: EventStarData[] = [
  { id: 'n1',  date: 'AUG 15, 2026', topic: 'Python / Learning',  cluster: 'Study',        mood: 'Happy',      productivity: '8/10', journal: 'Finally understood functions today.' },
  { id: 'n2',  date: 'AUG 12, 2026', topic: 'React Components',   cluster: 'Study',        mood: 'Focused',    productivity: '9/10', journal: 'Built my first custom hook.' },
  { id: 'n3',  date: 'AUG 18, 2026', topic: 'Project Deadline',   cluster: 'Productivity',  mood: 'Determined', productivity: '9/10', journal: 'Hit all milestones for the sprint.' },
  { id: 'n4',  date: 'AUG 20, 2026', topic: 'Morning Routine',    cluster: 'Productivity',  mood: 'Calm',       productivity: '7/10', journal: 'Journaling before code improves clarity.' },
  { id: 'n5',  date: 'AUG 10, 2026', topic: 'Career Planning',    cluster: 'Goals',         mood: 'Hopeful',    productivity: '6/10', journal: 'Mapped out the next six months.' },
  { id: 'n6',  date: 'AUG 22, 2026', topic: 'Portfolio Update',   cluster: 'Goals',         mood: 'Motivated',  productivity: '7/10', journal: 'Redesigned my portfolio.' },
  { id: 'n7',  date: 'AUG 14, 2026', topic: 'Evening Walk',       cluster: 'Reflection',    mood: 'Peaceful',   productivity: 'N/A',  journal: 'Walked for an hour without music.' },
  { id: 'n8',  date: 'AUG 16, 2026', topic: 'Gratitude Log',      cluster: 'Reflection',    mood: 'Content',    productivity: 'N/A',  journal: 'Good coffee, a solved bug, sunset.' },
  { id: 'n9',  date: 'AUG 11, 2026', topic: 'Exam Prep',          cluster: 'Stress',        mood: 'Anxious',    productivity: '5/10', journal: 'Two exams next week.' },
  { id: 'n10', date: 'AUG 19, 2026', topic: 'Sleep Deficit',      cluster: 'Stress',        mood: 'Tired',      productivity: '4/10', journal: 'Only five hours of sleep.' },
  { id: 'n11', date: 'AUG 17, 2026', topic: 'Dinner with Friends',cluster: 'Social',        mood: 'Joyful',     productivity: 'N/A',  journal: 'Great conversation about AI.' },
  { id: 'n12', date: 'AUG 21, 2026', topic: 'Study Group',        cluster: 'Social',        mood: 'Energized',  productivity: '7/10', journal: 'Teaching is the best way to learn.' },
];

// ─── SINGLE EVENT STAR ───────────────────────────────────────────────
function EventStar({
  data,
  position,
  color,
  onHover,
  onUnhover,
  onClick,
  isHovered,
  isSelected,
}: {
  data: EventStarData;
  position: [number, number, number];
  color: THREE.Color;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
  isHovered: boolean;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const active = isHovered || isSelected;
  const baseScale = active ? 1.8 : 1;

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      meshRef.current.scale.setScalar(baseScale * pulse);
    }
    if (glowRef.current) {
      const targetOpacity = active ? 0.6 : 0.15;
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      glowRef.current.scale.setScalar(active ? 2.5 : 1.2);
    }
  });

  return (
    <group position={position}>
      {/* Soft halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Star core */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color={active ? new THREE.Color(1, 1, 1) : color} transparent opacity={0.9} />
      </mesh>

      {/* Hover tooltip — compact, projected into space */}
      {isHovered && !isSelected && (
        <Html
          distanceFactor={12}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-[#050811]/90 backdrop-blur-xl border border-white/[0.12] rounded-xl px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] whitespace-nowrap -translate-x-1/2 -translate-y-[130%] min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `#${color.getHexString()}` }} />
              <div className="text-[9px] font-mono text-white/50 tracking-widest uppercase">{data.date}</div>
            </div>
            <div className="text-white/95 text-[13px] font-medium mb-1.5 tracking-wide">{data.topic}</div>
            <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
              <span>Mood: <span className="text-white/75">{data.mood}</span></span>
              <span>·</span>
              <span>Productivity: <span className="text-white/75">{data.productivity}</span></span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed font-serif italic border-l border-white/10 pl-2">
              "{data.journal}"
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── DATA STARS CONTAINER ────────────────────────────────────────────
export default function DataStars({
  onSelectStar,
  selectedStarId,
}: {
  onSelectStar: (data: EventStarData | null) => void;
  selectedStarId: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute 3D positions for each event star within its cluster region
  const starPositions = useMemo(() => {
    const map: Record<string, [number, number, number]> = {};

    EVENT_STARS.forEach((star, i) => {
      const cluster = CLUSTERS_3D.find(c => c.name === star.cluster)!;
      // Position along the spiral arm at the cluster's angle/radius
      const baseAngle = cluster.angle + (Math.random() - 0.5) * 0.6;
      const baseRadius = cluster.radius + (Math.random() - 0.5) * 3;
      const height = (Math.random() - 0.5) * 1.5;

      map[star.id] = [
        Math.cos(baseAngle) * baseRadius,
        height,
        Math.sin(baseAngle) * baseRadius,
      ];
    });

    return map;
  }, []);

  // Rotate with galaxy
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render cluster labels */}
      {CLUSTERS_3D.map((cluster) => {
        // Calculate the base position of the cluster
        const x = Math.cos(cluster.angle) * cluster.radius;
        const z = Math.sin(cluster.angle) * cluster.radius;
        // Count events in this cluster
        const eventCount = EVENT_STARS.filter(s => s.cluster === cluster.name).length;
        
        return (
          <group key={cluster.name} position={[x, 1.5, z]}>
            <Html distanceFactor={15} center zIndexRange={[50, 0]} style={{ pointerEvents: 'none' }}>
              <div className="flex flex-col items-center gap-1 opacity-80 mix-blend-screen transition-opacity duration-500">
                <span className="text-white/90 text-[14px] font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{cluster.name}</span>
                <span className="text-white/40 text-[9px] tracking-wider uppercase font-mono">{eventCount} events</span>
              </div>
            </Html>
            {/* Subtle glow behind label */}
            <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial color={cluster.color} transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        );
      })}

      {EVENT_STARS.map((star) => {
        const cluster = CLUSTERS_3D.find(c => c.name === star.cluster)!;
        return (
          <EventStar
            key={star.id}
            data={star}
            position={starPositions[star.id]}
            color={cluster.color}
            isHovered={hoveredId === star.id}
            isSelected={selectedStarId === star.id}
            onHover={() => {
              setHoveredId(star.id);
              document.body.style.cursor = 'pointer';
            }}
            onUnhover={() => {
              setHoveredId(null);
              document.body.style.cursor = 'default';
            }}
            onClick={() => {
              onSelectStar(selectedStarId === star.id ? null : star);
            }}
          />
        );
      })}
    </group>
  );
}
