'use client';
import { useRef, useMemo, useState } from 'react';
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
    pos[i * 3] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  return pos;
}

function ParticleSystem() {
  const ref = useRef<THREE.Points>(null);
  const originalPos = useMemo(() => generateRawParticles(6000), []);
  const currentPos = useMemo(() => new Float32Array(originalPos), [originalPos]);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < 6000; i++) {
      const idx = i * 3;
      // Particles converge as progress increases
      const pullFactor = progress * 0.85; 
      
      const targetX = originalPos[idx] * (1 - pullFactor);
      const targetY = originalPos[idx+1] * (1 - pullFactor);
      const targetZ = originalPos[idx+2] * (1 - pullFactor);
      
      const time = state.clock.elapsedTime;
      const driftX = Math.sin(time * 0.2 + i) * 0.3;
      const driftY = Math.cos(time * 0.3 + i) * 0.3;
      
      positions[idx] = THREE.MathUtils.lerp(positions[idx], targetX + driftX, delta * 1.5);
      positions[idx+1] = THREE.MathUtils.lerp(positions[idx+1], targetY + driftY, delta * 1.5);
      positions[idx+2] = THREE.MathUtils.lerp(positions[idx+2], targetZ, delta * 1.5);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.05;
    ref.current.rotation.x += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={currentPos} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a5b4fc" size={0.035} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

const mockData = [
  { id: 'study', icon: Brain, label: 'Learning', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', date: 'Oct 12', topic: 'React 3D', mood: 'Focused', prod: '90%', text: 'Mastered the basics of Three.js today. My spatial reasoning is improving.', pos: [-2, 1, 1] as [number,number,number] },
  { id: 'work', icon: Target, label: 'Goals', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', date: 'Oct 14', topic: 'Q4 Launch', mood: 'Determined', prod: '85%', text: 'Hit all milestone metrics for the new release. Feeling confident.', pos: [2.5, 1.5, -0.5] as [number,number,number] },
  { id: 'health', icon: Activity, label: 'Health', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', date: 'Oct 15', topic: 'Recovery', mood: 'Tired', prod: '40%', text: 'Need to prioritize sleep. The resting heart rate metric was elevated.', pos: [-1.5, -2, 0.5] as [number,number,number] },
  { id: 'rest', icon: Moon, label: 'Rest', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', date: 'Oct 16', topic: 'Meditation', mood: 'Calm', prod: 'N/A', text: 'Taking a complete day off screens. The mind needs empty space to create.', pos: [1.5, -1.5, 1.5] as [number,number,number] },
  { id: 'coffee', icon: Coffee, label: 'Social', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', date: 'Oct 18', topic: 'Catchup', mood: 'Joyful', prod: 'N/A', text: 'Great conversation about the future of AI. Inspiration struck.', pos: [0, 2.5, -1.5] as [number,number,number] },
];

function DataNode({ data, progress }: { data: typeof mockData[0], progress: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  
  // Show nodes only when scrolled down far enough
  const opacity = Math.max(0, Math.min(1, (progress - 0.5) * 2.5));

  useFrame((state, delta) => {
    if (ref.current) {
      // Gentle floating of the nodes
      ref.current.position.y = data.pos[1] + Math.sin(state.clock.elapsedTime + data.pos[0]) * 0.1;
    }
  });

  return (
    <group ref={ref} position={data.pos} scale={opacity > 0.05 ? 1 : 0}>
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={(e) => { document.body.style.cursor = 'auto'; setHovered(false); }}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.2} />
      </mesh>
      
      {/* Node Glow */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={hovered ? opacity * 0.5 : opacity * 0.15} />
      </mesh>
      
      {opacity > 0.1 && (
        <Html distanceFactor={8} zIndexRange={[100, 0]} className="pointer-events-none">
          <div className={cn(
            "transition-all duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2",
            hovered ? "w-[280px] opacity-100 pointer-events-auto" : "w-10 opacity-60 hover:opacity-100 pointer-events-auto"
          )}>
            {!hovered ? (
               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border cursor-pointer", data.bg, data.border, data.color)}>
                 <data.icon className="w-5 h-5" />
               </div>
            ) : (
               <div className="bg-[#050914]/80 border border-white/10 rounded-xl p-5 shadow-2xl backdrop-blur-xl cursor-default transition-all duration-300">
                  <div className={cn("absolute top-0 left-0 w-full h-1", data.bg)}></div>
                  <div className="flex items-center gap-2 mb-3">
                    <data.icon className={cn("w-4 h-4", data.color)} />
                    <span className="font-semibold text-white text-sm">{data.label}</span>
                  </div>
                  <div className="space-y-1 mb-3 text-xs">
                    <div className="flex justify-between text-slate-400"><span>Topic:</span><span className="text-white">{data.topic}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Mood:</span><span className="text-white">{data.mood}</span></div>
                  </div>
                  <p className="text-slate-300 text-xs italic border-l-2 border-indigo-500/30 pl-2">
                    "{data.text}"
                  </p>
               </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function SceneControls() {
  const { camera } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);

  useFrame((state, delta) => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
    setScrollProgress(progress);

    // Parallax mouse effect (diminishes as we scroll into the scene)
    const targetX = (state.mouse.x * 3) * (1 - progress * 0.7);
    const targetY = (state.mouse.y * 3) * (1 - progress * 0.7);
    
    // Camera zooms into the data clusters
    const targetZ = 12 - (progress * 7.5);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {mockData.map(d => (
        <DataNode key={d.id} data={d} progress={scrollProgress} />
      ))}
    </group>
  );
}

export default function ImmersiveUniverse() {
  return (
    <>
      <fog attach="fog" args={['#010204', 5, 25]} />
      <ParticleSystem />
      <SceneControls />
      
      {/* Central Core */}
      <mesh position={[0,0,0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </mesh>
    </>
  );
}
