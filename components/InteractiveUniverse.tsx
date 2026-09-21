'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points on a sphere
function randomPoints(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const sphere = useMemo(() => randomPoints(4000, 4.5), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#818cf8" size={0.015} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      {/* Outer faint ring */}
      <mesh>
        <torusGeometry args={[3.0, 0.005, 16, 100]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </mesh>
      {/* Inner structured ring */}
      <mesh rotation={[Math.PI / 8, Math.PI / 8, 0]}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.25} />
      </mesh>
      {/* Core ring */}
      <mesh rotation={[-Math.PI / 6, 0, Math.PI / 4]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function InteractiveUniverse() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-90 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <Starfield />
        <Rings />
        {/* Central Glow Core */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color="#4f46e5" transparent opacity={0.6} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} />
        </mesh>
      </Canvas>
    </div>
  );
}
