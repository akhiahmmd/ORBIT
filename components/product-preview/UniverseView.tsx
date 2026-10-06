'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectionState } from './AppShell';
import { JournalEntry } from './DataViews';

interface UniverseViewProps {
  selection: SelectionState;
  setSelection: (sel: SelectionState) => void;
  activeTab?: string;
  onInteract?: () => void;
  entries?: JournalEntry[];
}

import { CLUSTERS, getClusterForMood, MOODS } from '../../lib/shared-constants';

export default function UniverseView({ selection, setSelection, activeTab = 'universe', onInteract, entries }: UniverseViewProps) {
  return (
    <div className="absolute inset-0 cursor-grab active:cursor-grabbing pb-[260px] md:pb-0">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <color attach="background" args={['#020306']} />
        <ambientLight intensity={0.4} />
        <UniverseScene selection={selection} setSelection={setSelection} activeTab={activeTab} onInteract={onInteract} entries={entries} />
      </Canvas>

      {/* Mood Legend */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none flex flex-col gap-2 bg-[#020306]/80 p-3 rounded-xl border border-white/10 backdrop-blur-md">
        <div className="text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">Moods</div>
        {MOODS.map(mood => {
          const clusterId = getClusterForMood(mood);
          const cluster = CLUSTERS.find(c => c.id === clusterId);
          return (
            <div key={mood} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: cluster?.color }} />
              <span className="text-[10px] font-mono uppercase text-white/80">{mood}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UniverseScene({ selection, setSelection, activeTab, onInteract, entries }: UniverseViewProps) {
  const controlsRef = useRef<any>(null);
  
  const stars = useMemo(() => {
    const s: any[] = [];
    
    if (!entries || entries.length === 0) {
      CLUSTERS.forEach(cluster => {
        const numStars = 6 + Math.floor(Math.random() * 6);
        for (let i = 0; i < numStars; i++) {
          const radius = 1.5 + Math.random() * 2.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = cluster.position[0] + radius * Math.sin(phi) * Math.cos(theta);
          const y = cluster.position[1] + radius * Math.sin(phi) * Math.sin(theta);
          const z = cluster.position[2] + radius * Math.cos(phi);
          s.push({ 
            id: `demo-${cluster.id}-star-${i}`, 
            clusterId: cluster.id, 
            position: [x, y, z] 
          });
        }
      });
      return s;
    }

    entries.forEach((entry) => {
      const clusterId = getClusterForMood(entry.mood);

      const cluster = CLUSTERS.find(c => c.id === clusterId) || CLUSTERS[0];
      
      const hash = entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = (seed: number) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
      
      const radius = 1.5 + random(hash) * 2.5;
      const theta = random(hash + 1) * Math.PI * 2;
      const phi = Math.acos(2 * random(hash + 2) - 1);
      const x = cluster.position[0] + radius * Math.sin(phi) * Math.cos(theta);
      const y = cluster.position[1] + radius * Math.sin(phi) * Math.sin(theta);
      const z = cluster.position[2] + radius * Math.cos(phi);

      s.push({
        id: entry.id,
        clusterId: cluster.id,
        position: [x, y, z]
      });
    });
    
    return s;
  }, [entries]);

  const particles = useMemo(() => {
    const pos = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame(() => {
    if (controlsRef.current) {
      if (activeTab === 'universe') {
        if (selection.id) {
          let target = new THREE.Vector3(0,0,0);
          if (selection.type === 'cluster') {
            const c = CLUSTERS.find(x => x.id === selection.id);
            if (c) target.set(...c.position as [number,number,number]);
          } else {
            const s = stars.find(x => x.id === selection.id);
            if (s) target.set(...s.position as [number,number,number]);
          }
          controlsRef.current.target.lerp(target, 0.05);
        } else {
          controlsRef.current.autoRotate = true;
          controlsRef.current.autoRotateSpeed = 0.3;
        }
      } else {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 0.1;
      }
      controlsRef.current.update();
    }
  });

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} minDistance={2} maxDistance={25} enableDamping />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={400} args={[particles, 3]} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.15} sizeAttenuation />
      </points>
      
      {CLUSTERS.map(cluster => {
        const isSelected = selection.id === cluster.id;
        return (
          <group key={cluster.id} position={cluster.position as [number,number,number]}>
            <mesh 
              onClick={(e) => { e.stopPropagation(); setSelection({ type: 'cluster', id: cluster.id }); onInteract?.(); }}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
              <sphereGeometry args={[isSelected ? 2.5 : 2, 16, 16]} />
              <meshBasicMaterial color={cluster.color} transparent opacity={isSelected ? 0.06 : 0.02} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <Html center position={[0, -2.8, 0]} zIndexRange={[100,0]}>
              <div 
                className="font-mono text-[10px] tracking-[0.2em] transition-all cursor-pointer whitespace-nowrap"
                style={{
                  color: isSelected ? cluster.color : 'rgba(255,255,255,0.7)',
                  textShadow: isSelected ? `0 0 15px ${cluster.color}` : '0 0 5px rgba(0,0,0,0.5)',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                }}
                onClick={(e) => { e.stopPropagation(); setSelection({ type: 'cluster', id: cluster.id }); onInteract?.(); }}
              >
                {cluster.name}
              </div>
            </Html>
          </group>
        );
      })}

      {stars.map(star => {
        const cluster = CLUSTERS.find(c => c.id === star.clusterId);
        const color = cluster?.color || '#ffffff';
        const isSelected = selection.id === star.id;
        const isClusterSelected = selection.id === star.clusterId;
        const opacity = isSelected ? 1 : (isClusterSelected ? 0.9 : 0.6);
        
        return (
          <group key={star.id} position={star.position as [number,number,number]}>
            <mesh 
              scale={isSelected ? 1.5 : 1}
              onClick={(e) => { e.stopPropagation(); setSelection({ type: 'star', id: star.id }); onInteract?.(); }}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'auto'; }}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
            {isSelected && (
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}
