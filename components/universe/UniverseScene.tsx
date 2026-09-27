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

// Pre-generate background particles outside component to maintain purity
const bgStars1 = new Float32Array(500 * 3);
const bgStars2 = new Float32Array(300 * 3);
for (let i = 0; i < 500; i++) {
  bgStars1[i * 3] = (Math.random() - 0.5) * 40;
  bgStars1[i * 3 + 1] = (Math.random() - 0.5) * 40;
  bgStars1[i * 3 + 2] = (Math.random() - 0.5) * 40;
}
for (let i = 0; i < 300; i++) {
  bgStars2[i * 3] = (Math.random() - 0.5) * 60;
  bgStars2[i * 3 + 1] = (Math.random() - 0.5) * 60;
  bgStars2[i * 3 + 2] = (Math.random() - 0.5) * 60;
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
    
    // Group memories by clusterId
    const clusters: Record<string, MemoryEntry[]> = {};
    memories.forEach(m => {
      if (m.clusterId) {
        if (!clusters[m.clusterId]) clusters[m.clusterId] = [];
        clusters[m.clusterId].push(m);
      }
    });

    // Connect nodes within each cluster
    Object.values(clusters).forEach(clusterMemories => {
      if (clusterMemories.length < 2) return;
      for (let i = 0; i < clusterMemories.length; i++) {
        for (let j = i + 1; j < clusterMemories.length; j++) {
          const v1 = new THREE.Vector3(...clusterMemories[i].position);
          const v2 = new THREE.Vector3(...clusterMemories[j].position);
          // Only connect if they are reasonably close to prevent cross-galaxy lines
          if (v1.distanceTo(v2) < 4) {
            lines.push([v1, v2]);
          }
        }
      }
    });
    return lines;
  }, [memories]);

  // Subtle whole-galaxy rotation and camera follow
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02; // Very slow rotation
    }

    if (activeMemoryId && controlsRef.current) {
      const targetMem = memories.find((m) => m.id === activeMemoryId);
      if (targetMem) {
        // Need to account for the group's rotation to find the true world position of the target memory
        const localPos = new THREE.Vector3(...targetMem.position);
        const worldPos = localPos.applyMatrix4(groupRef.current!.matrixWorld);
        controlsRef.current.target.lerp(worldPos, 0.05);
        controlsRef.current.update();
      }
    } else {
      // Gentle auto-rotation of camera when nothing is focused
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 0.5;
        controlsRef.current.update();
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        minDistance={3}
        maxDistance={25}
        enableDamping
        dampingFactor={0.05}
      />
      
      <ambientLight intensity={0.2} />
      
      {/* Deep space starfield (Drei utility for high quality stars) */}
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      {/* Additional layered dust/particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bgStars1, 3]} count={500} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#88aaff" transparent opacity={0.3} sizeAttenuation />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bgStars2, 3]} count={300} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#aaaaff" transparent opacity={0.15} sizeAttenuation />
      </points>

      {/* Main Galaxy Group */}
      <group ref={groupRef}>
        
        {/* Constellation Lines */}
        {connections.map(([start, end], idx) => (
          <Line
            key={`line-${idx}`}
            points={[start, end]}
            color="#aabbee"
            lineWidth={1}
            transparent
            opacity={0.2}
          />
        ))}

        {/* Memories / Memory Nodes */}
        {memories.map((mem) => {
          const isActive = activeMemoryId === mem.id;
          const isHovered = hoveredMemoryId === mem.id;
          const scale = isActive ? 1.8 : (isHovered ? 1.4 : 1);
          const opacity = isActive || isHovered ? 1 : 0.7;
          
          return (
            <group key={mem.id} position={mem.position}>
              {/* Core Star */}
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
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
              </mesh>
              
              {/* Outer Glow 1 */}
              <mesh scale={scale * 3}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshBasicMaterial
                  color="#88bbff"
                  transparent
                  opacity={isActive ? 0.5 : (isHovered ? 0.3 : 0.15)}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>

              {/* Outer Glow 2 (Larger, softer) */}
              <mesh scale={scale * 6}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshBasicMaterial
                  color="#4466ff"
                  transparent
                  opacity={isActive ? 0.2 : 0.05}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
              
              {/* Label */}
              {(isActive || isHovered) && (
                <Html center distanceFactor={12} zIndexRange={[100, 0]}>
                  <div 
                    className="mt-8 font-mono text-[11px] tracking-[0.2em] text-white/90 whitespace-nowrap px-3 py-1.5 bg-black/60 backdrop-blur-md rounded border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all"
                    style={{ pointerEvents: 'none' }}
                  >
                    {mem.date}
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>

      {/* Post-processing Bloom for cinematic glowing stars */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.5} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.6}
        />
      </EffectComposer>
    </>
  );
}
