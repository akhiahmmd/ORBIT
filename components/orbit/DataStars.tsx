'use client';
import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
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
  { id: 'n1',  date: 'Aug 15, 2026', topic: 'Python / Learning',  cluster: 'Study',        mood: 'Happy',      productivity: '8/10', journal: 'Finally understood functions today.' },
  { id: 'n2',  date: 'Aug 12, 2026', topic: 'React Components',   cluster: 'Study',        mood: 'Productive', productivity: '9/10', journal: 'Built my first custom hook.' },
  { id: 'n3',  date: 'Aug 18, 2026', topic: 'Project Deadline',   cluster: 'Productivity', mood: 'Productive', productivity: '9/10', journal: 'Hit all milestones for the sprint.' },
  { id: 'n4',  date: 'Aug 20, 2026', topic: 'Morning Routine',    cluster: 'Productivity', mood: 'Calm',       productivity: '7/10', journal: 'Journaling before code improves clarity.' },
  { id: 'n5',  date: 'Aug 10, 2026', topic: 'Career Planning',    cluster: 'Goals',        mood: 'Reflective', productivity: '6/10', journal: 'Mapped out the next six months.' },
  { id: 'n6',  date: 'Aug 22, 2026', topic: 'Portfolio Update',   cluster: 'Goals',        mood: 'Productive', productivity: '7/10', journal: 'Redesigned my portfolio.' },
  { id: 'n7',  date: 'Aug 14, 2026', topic: 'Evening Walk',       cluster: 'Reflection',   mood: 'Calm',       productivity: 'N/A',  journal: 'Walked for an hour without music.' },
  { id: 'n8',  date: 'Aug 16, 2026', topic: 'Gratitude Log',      cluster: 'Reflection',   mood: 'Happy',      productivity: 'N/A',  journal: 'Good coffee, a solved bug, sunset.' },
  { id: 'n9',  date: 'Aug 11, 2026', topic: 'Exam Prep',          cluster: 'Stress',       mood: 'Anxious',    productivity: '5/10', journal: 'Two exams next week.' },
  { id: 'n10', date: 'Aug 19, 2026', topic: 'Sleep Deficit',      cluster: 'Stress',       mood: 'Sad',        productivity: '4/10', journal: 'Only five hours of sleep.' },
  { id: 'n11', date: 'Aug 17, 2026', topic: 'Dinner with Friends',cluster: 'Social',       mood: 'Happy',      productivity: 'N/A',  journal: 'Great conversation about AI.' },
  { id: 'n12', date: 'Aug 21, 2026', topic: 'Study Group',        cluster: 'Social',       mood: 'Productive', productivity: '7/10', journal: 'Teaching is the best way to learn.' },
];

// ─── SINGLE EVENT STAR ───────────────────────────────────────────────
function EventStar({
  data,
  position,
  color,
  onHover,
  onUnhover,
  onClick,
  onFocus,
  isHovered,
  isSelected,
}: {
  data: EventStarData;
  position: [number, number, number];
  color: THREE.Color;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
  onFocus: (vec: THREE.Vector3) => void;
  isHovered: boolean;
  isSelected: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const active = isHovered || isSelected;
  const baseScale = active ? 1.8 : 1;

  useFrame(() => {
    if (isSelected && groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      onFocus(worldPos);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Invisible hit area for precise raycasting without massive overlap */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Star core - significantly larger so it stands out from background galaxy */}
      <mesh scale={baseScale}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial color={active ? new THREE.Color(1, 1, 1) : color} transparent opacity={active ? 1 : 0.8} />
      </mesh>
      
      {/* Outer Glow 1 */}
      <mesh scale={baseScale * 3}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.6 : 0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Glow 2 (Larger, softer) */}
      <mesh scale={baseScale * 6}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.25 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Hover tooltip — compact, projected into space */}
      {isHovered && !isSelected && (
        <Html
          distanceFactor={12}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="bg-[#050811]/95 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3.5 shadow-2xl w-[220px] -translate-x-1/2 -translate-y-[120%]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `#${color.getHexString()}` }} />
              <div className="text-[9px] font-mono text-white/50 tracking-widest uppercase">{data.date}</div>
            </div>
            <div className="text-white text-[14px] font-serif mb-2 tracking-wide leading-tight">{data.topic}</div>
            <div className="flex items-center gap-3 text-[10px] text-white/50 mb-3 font-sans">
              <span>Mood: <span className="text-white/90">{data.mood}</span></span>
              <span>·</span>
              <span>Prod: <span className="text-white/90">{data.productivity}</span></span>
            </div>
            <p className="text-[12px] text-white/75 leading-relaxed font-serif italic border-l-2 border-indigo-500/30 pl-3">
              "{data.journal}"
            </p>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

// ─── DATA STARS CONTAINER ────────────────────────────────────────────
export default function DataStars({
  onSelectStar,
  selectedStarId,
  onFocus,
}: {
  onSelectStar: (data: EventStarData | null) => void;
  selectedStarId: string | null;
  onFocus: (vec: THREE.Vector3) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute 3D positions for each event star within its cluster region
  const starPositions = useMemo(() => {
    // Seeded-like placement to avoid random jumps on re-render
    const map: Record<string, [number, number, number]> = {};
    EVENT_STARS.forEach((star, i) => {
      const cluster = CLUSTERS_3D.find(c => c.name === star.cluster)!;
      // Deterministic offset based on index so it's stable
      const pseudoRandom1 = (Math.sin(i * 123.45) + 1) / 2;
      const pseudoRandom2 = (Math.cos(i * 321.12) + 1) / 2;
      const pseudoRandom3 = (Math.sin(i * 555.55) + 1) / 2;

      const baseAngle = cluster.angle + (pseudoRandom1 - 0.5) * 0.8;
      const baseRadius = cluster.radius + (pseudoRandom2 - 0.5) * 4;
      const height = (pseudoRandom3 - 0.5) * 2.0;

      map[star.id] = [
        Math.cos(baseAngle) * baseRadius,
        height,
        Math.sin(baseAngle) * baseRadius,
      ];
    });
    return map;
  }, []);

  // Generate constellation lines linking stars in the same cluster
  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    CLUSTERS_3D.forEach(cluster => {
      const clusterStars = EVENT_STARS.filter(s => s.cluster === cluster.name);
      for (let i = 0; i < clusterStars.length; i++) {
        for (let j = i + 1; j < clusterStars.length; j++) {
          const v1 = new THREE.Vector3(...starPositions[clusterStars[i].id]);
          const v2 = new THREE.Vector3(...starPositions[clusterStars[j].id]);
          if (v1.distanceTo(v2) < 6) {
            lines.push([v1, v2]);
          }
        }
      }
    });
    return lines;
  }, [starPositions]);

  // Rotate with galaxy
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Constellation Lines */}
      {connections.map(([start, end], idx) => (
        <Line
          key={`line-${idx}`}
          points={[start, end]}
          color="#aabbee"
          lineWidth={1.5}
          transparent
          opacity={0.15}
        />
      ))}

      {/* Render cluster labels */}
      {CLUSTERS_3D.map((cluster) => {
        const x = Math.cos(cluster.angle) * cluster.radius;
        const z = Math.sin(cluster.angle) * cluster.radius;
        const eventCount = EVENT_STARS.filter(s => s.cluster === cluster.name).length;
        
        return (
          <group key={cluster.name} position={[x, 1.5, z]}>
            <Html distanceFactor={15} center zIndexRange={[50, 0]} style={{ pointerEvents: 'none' }}>
              <div className="flex flex-col items-center gap-1 opacity-90 mix-blend-plus-lighter transition-opacity duration-700">
                <span className="text-white/95 text-[15px] font-light tracking-[0.05em] drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">{cluster.name}</span>
                <span className="text-white/50 text-[9px] tracking-[0.2em] uppercase font-mono">{eventCount} events</span>
              </div>
            </Html>
            <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[2.5, 16, 16]} />
              <meshBasicMaterial color={cluster.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
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
            onFocus={onFocus}
          />
        );
      })}
    </group>
  );
}
