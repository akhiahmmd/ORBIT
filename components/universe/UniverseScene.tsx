'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MemoryEntry } from './UniverseData';

interface UniverseSceneProps {
  memories: MemoryEntry[];
  activeMemoryId: string | null;
  hoveredMemoryId: string | null;
  onMemoryClick: (memory: MemoryEntry) => void;
  onMemoryHover: (memoryId: string | null) => void;
}

// Deep space background particles
const bgStars1 = new Float32Array(800 * 3);
const bgStars2 = new Float32Array(500 * 3);
for (let i = 0; i < 800; i++) {
  bgStars1[i * 3] = (Math.random() - 0.5) * 60;
  bgStars1[i * 3 + 1] = (Math.random() - 0.5) * 60;
  bgStars1[i * 3 + 2] = (Math.random() - 0.5) * 60;
}
for (let i = 0; i < 500; i++) {
  bgStars2[i * 3] = (Math.random() - 0.5) * 80;
  bgStars2[i * 3 + 1] = (Math.random() - 0.5) * 80;
  bgStars2[i * 3 + 2] = (Math.random() - 0.5) * 80;
}

export default function UniverseScene({
  memories,
  activeMemoryId,
  hoveredMemoryId,
  onMemoryClick,
  onMemoryHover,
}: UniverseSceneProps) {
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate constellation lines (connect within clusters)
  const connections = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    const clusters: Record<string, MemoryEntry[]> = {};
    memories.forEach(m => {
      if (m.clusterId) {
        if (!clusters[m.clusterId]) clusters[m.clusterId] = [];
        clusters[m.clusterId].push(m);
      }
    });

    Object.values(clusters).forEach(clusterMemories => {
      if (clusterMemories.length < 2) return;
      for (let i = 0; i < clusterMemories.length; i++) {
        for (let j = i + 1; j < clusterMemories.length; j++) {
          const v1 = new THREE.Vector3(...clusterMemories[i].position);
          const v2 = new THREE.Vector3(...clusterMemories[j].position);
          if (v1.distanceTo(v2) < 5) {
            lines.push([v1, v2]);
          }
        }
      }
    });
    return lines;
  }, [memories]);

  // Gentle auto-rotation and camera follow
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03; 
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }

    if (activeMemoryId && controlsRef.current) {
      const targetMem = memories.find((m) => m.id === activeMemoryId);
      if (targetMem) {
        const localPos = new THREE.Vector3(...targetMem.position);
        const worldPos = localPos.applyMatrix4(groupRef.current!.matrixWorld);
        controlsRef.current.target.lerp(worldPos, 0.05);
        controlsRef.current.update();
      }
    } else {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 0.3;
        controlsRef.current.update();
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#030712']} />
      
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        minDistance={4}
        maxDistance={25}
        enableDamping
        dampingFactor={0.05}
      />
      
      <ambientLight intensity={0.3} />
      
      <Stars radius={60} depth={60} count={3000} factor={4} saturation={0.5} fade speed={1.5} />

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bgStars1, 3]} count={800} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#6366f1" transparent opacity={0.2} sizeAttenuation />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bgStars2, 3]} count={500} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.09} color="#22d3ee" transparent opacity={0.1} sizeAttenuation />
      </points>

      <group ref={groupRef}>
        {connections.map(([start, end], idx) => (
          <Line
            key={`line-${idx}`}
            points={[start, end]}
            color="#4f46e5"
            lineWidth={1.2}
            transparent
            opacity={0.3}
          />
        ))}

        {memories.map((mem) => {
          const isActive = activeMemoryId === mem.id;
          const isHovered = hoveredMemoryId === mem.id;
          const isFocused = isActive || isHovered;
          
          // Different base colors depending on mood just for variety
          const starColor = mem.mood === 'Joyful' ? '#fde047' : 
                            mem.mood === 'Focused' ? '#22d3ee' : 
                            mem.mood === 'Calm' ? '#6ee7b7' : 
                            mem.mood === 'Anxious' ? '#f87171' : '#818cf8';
                            
          const scale = isActive ? 2.2 : (isHovered ? 1.8 : 1.2);
          const opacity = isFocused ? 1 : 0.8;
          
          return (
            <group key={mem.id} position={mem.position}>
              <mesh
                scale={scale}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                  onMemoryHover(mem.id);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'auto';
                  onMemoryHover(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMemoryClick(mem);
                }}
              >
                <sphereGeometry args={[0.07, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
              </mesh>
              
              <mesh scale={scale * 2.5}>
                <sphereGeometry args={[0.07, 32, 32]} />
                <meshBasicMaterial
                  color={starColor}
                  transparent
                  opacity={isActive ? 0.6 : (isHovered ? 0.4 : 0.2)}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>

              <mesh scale={scale * 5}>
                <sphereGeometry args={[0.07, 32, 32]} />
                <meshBasicMaterial
                  color={starColor}
                  transparent
                  opacity={isActive ? 0.25 : 0.08}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
              
              {/* Contextual Hover Label Anchored to Star */}
              {isHovered && !isActive && (
                <Html distanceFactor={10} zIndexRange={[100, 0]}>
                  <div 
                    className="absolute -translate-y-1/2 ml-4 bg-[#0a0c10]/95 backdrop-blur-xl border border-[#1e293b] rounded-lg p-3 shadow-2xl flex flex-col gap-1 min-w-[140px] pointer-events-none transform transition-all duration-300 animate-in fade-in zoom-in-95"
                  >
                    <span className="font-mono text-[9px] tracking-widest text-indigo-400 uppercase">
                      {mem.date}
                    </span>
                    <span className="font-serif text-[13px] text-slate-200 leading-tight">
                      {mem.title}
                    </span>
                    <div className="flex gap-1 mt-1">
                      <span className="text-[9px] font-mono tracking-wider text-slate-400 border border-slate-700/50 rounded px-1.5 py-0.5">
                        {mem.mood}
                      </span>
                    </div>
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.4} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.8}
        />
      </EffectComposer>
    </>
  );
}
