'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface ClusterInfo {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  count: number;
}

export interface StarInfo {
  id: string;
  clusterId: string;
  position: [number, number, number];
  isMain?: boolean;
}

const CLUSTERS: ClusterInfo[] = [
  { id: 'study', name: 'STUDY', color: '#4488ff', position: [-2, 0.5, -2], count: 24 },
  { id: 'productivity', name: 'PRODUCTIVITY', color: '#ff8844', position: [2, -0.5, -1], count: 18 },
  { id: 'stress', name: 'STRESS', color: '#ff4466', position: [-1, -1.5, 2], count: 12 },
  { id: 'goals', name: 'GOALS', color: '#aa44ff', position: [1.5, 1.5, 1.5], count: 8 },
  { id: 'reflection', name: 'REFLECTION', color: '#44ccaa', position: [0.5, 2, -2.5], count: 15 },
];

function generateStars(): StarInfo[] {
  const stars: StarInfo[] = [];
  // Main memory star (belongs to study conceptually, but centered)
  stars.push({
    id: 'main-memory',
    clusterId: 'study',
    position: [0, 0, 0],
    isMain: true,
  });

  // Generate 4-6 stars per cluster
  CLUSTERS.forEach(cluster => {
    const numStars = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numStars; i++) {
      // Random position around cluster center
      const radius = 0.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = cluster.position[0] + radius * Math.sin(phi) * Math.cos(theta);
      const y = cluster.position[1] + radius * Math.sin(phi) * Math.sin(theta);
      const z = cluster.position[2] + radius * Math.cos(phi);
      
      stars.push({
        id: `${cluster.id}-star-${i}`,
        clusterId: cluster.id,
        position: [x, y, z],
      });
    }
  });
  
  return stars;
}

interface MiniOrbitSceneProps {
  hoveredId: string | null;
  clickedId: string | null;
  onHover: (id: string | null, type: 'star' | 'cluster' | null) => void;
  onClick: (id: string | null, type: 'star' | 'cluster' | null) => void;
}

export default function MiniOrbitScene({ hoveredId, clickedId, onHover, onClick }: MiniOrbitSceneProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const stars = useMemo(() => generateStars(), []);
  
  // Background particles
  const particles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  // Smooth camera focus
  useFrame((state) => {
    if (clickedId && controlsRef.current) {
      // Find target position
      let targetPos = new THREE.Vector3(0, 0, 0);
      
      const star = stars.find(s => s.id === clickedId);
      if (star) targetPos.set(...star.position);
      else {
        const cluster = CLUSTERS.find(c => c.id === clickedId);
        if (cluster) targetPos.set(...cluster.position);
      }

      // Interpolate controls target
      controlsRef.current.target.lerp(targetPos, 0.05);
      
      // We don't force camera position, let OrbitControls handle it around the new target
      controlsRef.current.update();
    } else {
      // Gentle auto-rotation when nothing is clicked
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
        minDistance={3}
        maxDistance={12}
        enableDamping
        dampingFactor={0.05}
      />
      
      <ambientLight intensity={0.2} />
      
      {/* Background Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={300}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#88aaff" transparent opacity={0.3} sizeAttenuation />
      </points>

      {/* Render Clusters */}
      {CLUSTERS.map(cluster => {
        const isHovered = hoveredId === cluster.id || (hoveredId && stars.find(s => s.id === hoveredId)?.clusterId === cluster.id);
        const isClicked = clickedId === cluster.id;
        
        return (
          <group key={cluster.id} position={cluster.position}>
            {/* Ambient cluster glow */}
            <mesh 
              onPointerOver={(e) => { e.stopPropagation(); onHover(cluster.id, 'cluster'); }}
              onPointerOut={(e) => { e.stopPropagation(); onHover(null, null); }}
              onClick={(e) => { e.stopPropagation(); onClick(cluster.id, 'cluster'); }}
            >
              <sphereGeometry args={[isHovered ? 2 : 1.5, 16, 16]} />
              <meshBasicMaterial 
                color={cluster.color} 
                transparent 
                opacity={isHovered ? 0.08 : 0.04} 
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Faint orbital path */}
            <mesh rotation-x={Math.PI / 2}>
              <ringGeometry args={[1.4, 1.42, 32]} />
              <meshBasicMaterial 
                color={cluster.color}
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* HTML Label */}
            <Html center distanceFactor={10} zIndexRange={[100, 0]}>
              <div 
                className="font-mono text-[8px] tracking-[0.2em] transition-all duration-300 cursor-pointer select-none"
                style={{ 
                  color: isHovered || isClicked ? cluster.color : 'rgba(255,255,255,0.4)',
                  textShadow: isHovered || isClicked ? `0 0 10px ${cluster.color}` : 'none',
                  transform: isHovered || isClicked ? 'scale(1.1)' : 'scale(1)'
                }}
                onPointerOver={() => onHover(cluster.id, 'cluster')}
                onPointerOut={() => onHover(null, null)}
                onClick={() => onClick(cluster.id, 'cluster')}
              >
                {cluster.name}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Render Stars */}
      {stars.map(star => {
        const cluster = CLUSTERS.find(c => c.id === star.clusterId);
        const color = star.isMain ? '#ffffff' : (cluster?.color || '#ffffff');
        
        const isHovered = hoveredId === star.id;
        const isClicked = clickedId === star.id;
        const clusterHovered = hoveredId === star.clusterId;
        
        // Determine opacity/scale based on state
        const isActive = isHovered || isClicked;
        const opacity = isActive ? 1 : (clusterHovered ? 0.8 : (star.isMain ? 0.9 : 0.4));
        const scale = star.isMain ? (isActive ? 1.4 : 1.2) : (isActive ? 1.2 : 0.8);
        
        return (
          <group key={star.id} position={star.position}>
            {/* Core */}
            <mesh
              scale={scale}
              onPointerOver={(e) => { e.stopPropagation(); onHover(star.id, 'star'); }}
              onPointerOut={(e) => { e.stopPropagation(); onHover(null, null); }}
              onClick={(e) => { e.stopPropagation(); onClick(star.id, 'star'); }}
            >
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
            
            {/* Halo */}
            <mesh scale={scale * (isActive ? 3 : 2)}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={isActive ? 0.3 : 0.15} 
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
