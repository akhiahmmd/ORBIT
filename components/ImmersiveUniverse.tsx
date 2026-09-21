'use client';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Brain, Target, Coffee, Moon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function generateRawParticles(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Generate in a sphere for the final orbit shape
    const radius = Math.random() * 25 + 2;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);
  }
  return pos;
}

function generateScatteredParticles(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;
  }
  return pos;
}

function ParticleSystem({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null);
  const orbitPos = useMemo(() => generateRawParticles(8000), []);
  const scatteredPos = useMemo(() => generateScatteredParticles(8000), []);
  const currentPos = useMemo(() => new Float32Array(orbitPos), [orbitPos]);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    // Normalize progress to make the transitions happen during the first 60% of the page
    const visualProgress = Math.min(1, scrollProgress * 1.5);
    
    for (let i = 0; i < 8000; i++) {
      const idx = i * 3;
      
      const targetX = THREE.MathUtils.lerp(scatteredPos[idx], orbitPos[idx], visualProgress);
      const targetY = THREE.MathUtils.lerp(scatteredPos[idx+1], orbitPos[idx+1], visualProgress);
      const targetZ = THREE.MathUtils.lerp(scatteredPos[idx+2], orbitPos[idx+2], visualProgress);
      
      const noiseIntensity = (1 - visualProgress) * 0.5 + 0.1;
      const driftX = Math.sin(time * 0.2 + i) * noiseIntensity;
      const driftY = Math.cos(time * 0.3 + i) * noiseIntensity;
      
      positions[idx] = THREE.MathUtils.lerp(positions[idx], targetX + driftX, delta * 2);
      positions[idx+1] = THREE.MathUtils.lerp(positions[idx+1], targetY + driftY, delta * 2);
      positions[idx+2] = THREE.MathUtils.lerp(positions[idx+2], targetZ, delta * 2);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    const rotationSpeed = 0.02 + (visualProgress * 0.08);
    ref.current.rotation.y += delta * rotationSpeed;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, visualProgress * 0.3, delta);
  });

  return (
    <Points ref={ref} positions={currentPos} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a5b4fc" size={0.035} sizeAttenuation={true} depthWrite={false} opacity={0.4 + (scrollProgress * 0.3)} />
    </Points>
  );
}

const mockData = [
  { id: 'study', icon: Brain, label: 'Study & Learning', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', glow: '#6366f1', pos: [-4, 2, 2] as [number,number,number] },
  { id: 'work', icon: Target, label: 'Productivity', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: '#10b981', pos: [5, 3, -1] as [number,number,number] },
  { id: 'health', icon: Activity, label: 'Stress Levels', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: '#f43f5e', pos: [-3, -4, 1.5] as [number,number,number] },
  { id: 'rest', icon: Moon, label: 'Reflection', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: '#06b6d4', pos: [3, -3, 2] as [number,number,number] },
  { id: 'coffee', icon: Coffee, label: 'Social Context', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: '#f59e0b', pos: [0, 5, -2] as [number,number,number] },
];

function DataNode({ data, progress }: { data: typeof mockData[0], progress: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  
  // Nodes appear earlier now
  const nodeProgress = Math.max(0, Math.min(1, (progress - 0.2) * 3));
  const opacity = nodeProgress;

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y = data.pos[1] + Math.sin(state.clock.elapsedTime * 0.5 + data.pos[0]) * 0.2;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={ref} position={data.pos} scale={opacity}>
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.1} />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color={data.glow} transparent opacity={hovered ? opacity * 0.4 : opacity * 0.15} />
      </mesh>
      
      <Html distanceFactor={12} zIndexRange={[100, 0]} className="pointer-events-none">
        <div className={cn(
          "transition-all duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
          hovered ? "scale-110 opacity-100 pointer-events-auto" : "scale-100 opacity-70 hover:opacity-100 pointer-events-auto"
        )}>
          <div className={cn("px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border cursor-pointer whitespace-nowrap shadow-xl", data.bg, data.border, data.color)}>
             <data.icon className="w-4 h-4" />
             <span className="font-medium text-sm tracking-wide">{data.label}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function OrbitalRings({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.z += delta * 0.02;
    }
  });

  const opacity = Math.max(0, Math.min(1, (progress - 0.4) * 2.5));

  if (opacity <= 0.01) return null;

  return (
    <group ref={ref} rotation={[Math.PI / 3, 0, 0]} scale={opacity}>
      <mesh>
        <torusGeometry args={[8.0, 0.01, 16, 100]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15 * opacity} />
      </mesh>
      <mesh rotation={[Math.PI / 8, Math.PI / 8, 0]}>
        <torusGeometry args={[6.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.25 * opacity} />
      </mesh>
      <mesh rotation={[-Math.PI / 6, 0, Math.PI / 4]}>
        <torusGeometry args={[4.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.15 * opacity} />
      </mesh>
    </group>
  );
}

function SceneControls({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const mouseX = (state.mouse.x * 2);
    const mouseY = (state.mouse.y * 2);
    
    // Smooth camera pull back
    const targetZ = 12 + (scrollProgress * 15);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX, delta * 2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY, delta * 2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {mockData.map(d => (
        <DataNode key={d.id} data={d} progress={scrollProgress} />
      ))}
      <OrbitalRings progress={scrollProgress} />
    </group>
  );
}

export default function ImmersiveUniverse() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <fog attach="fog" args={['#010204', 10, 50]} />
      <ParticleSystem scrollProgress={scrollProgress} />
      <SceneControls scrollProgress={scrollProgress} />
      
      <mesh scale={Math.max(0.01, scrollProgress)}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.05 * scrollProgress} />
      </mesh>
      <mesh scale={Math.max(0.01, scrollProgress)}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15 * scrollProgress} />
      </mesh>
    </>
  );
}
