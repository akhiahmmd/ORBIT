'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SelectionState } from './AppShell';
import { JournalEntry } from './DataViews';
import { CLUSTERS, getClusterForMood, MOODS } from '../../lib/shared-constants';

interface UniverseViewProps {
  selection: SelectionState;
  setSelection: (sel: SelectionState) => void;
  activeTab?: string;
  onInteract?: () => void;
  entries?: JournalEntry[];
}

function formatDateTime(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${datePart} · ${timePart}`;
}

function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.22)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createNebulaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.42)');
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.16)');
    gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.03)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function UniverseView({ selection, setSelection, activeTab = 'universe', onInteract, entries }: UniverseViewProps) {
  const hasEntries = !!(entries && entries.length > 0);
  const isUniverseActive = activeTab === 'universe';

  return (
    <div 
      className={`absolute inset-0 select-none pb-[260px] md:pb-0 transition-opacity duration-500 ${
        isUniverseActive 
          ? 'opacity-100 cursor-grab active:cursor-grabbing' 
          : 'opacity-25 pointer-events-none'
      }`}
    >
      <Canvas 
        frameloop={isUniverseActive ? 'always' : 'never'}
        camera={{ position: [0, 2, 11], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerMissed={() => setSelection({ type: null, id: null })}
      >
        <color attach="background" args={['#020306']} />
        <ambientLight intensity={0.5} />
        <UniverseScene 
          selection={selection} 
          setSelection={setSelection} 
          activeTab={activeTab} 
          onInteract={onInteract} 
          entries={entries} 
        />
      </Canvas>

      {/* Empty State Banner (shows when no journal entries exist yet) */}
      {isUniverseActive && !hasEntries && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 bg-[#020306]/85 border border-indigo-500/30 px-4 py-2 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] font-mono text-indigo-200/90 tracking-wide">
            Record a moment in Journal to add your first star
          </span>
        </div>
      )}

      {/* Mood Legend */}
      {isUniverseActive && (
        <div className="absolute bottom-6 left-6 z-10 pointer-events-none flex flex-col gap-2 bg-[#020306]/85 p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
          <div className="text-[9px] font-mono tracking-widest uppercase text-white/50 mb-1">Moods</div>
          {MOODS.map(mood => {
            const clusterId = getClusterForMood(mood);
            const cluster = CLUSTERS.find(c => c.id === clusterId);
            return (
              <div key={mood} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ backgroundColor: cluster?.color }} />
                <span className="text-[10px] font-mono uppercase text-white/80">{mood}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface StarData {
  id: string;
  clusterId: string;
  position: [number, number, number];
  title: string;
  mood: string;
  date: string;
  isRecent: boolean;
  isNewest: boolean;
  seed: number;
}

function UniverseScene({ selection, setSelection, activeTab, onInteract, entries }: UniverseViewProps) {
  const controlsRef = useRef<any>(null);
  const { camera, size } = useThree();

  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flightStartTimeRef = useRef<number>(0);
  const prevSelectionIdRef = useRef<string | null>(null);
  const entryBirthTimesRef = useRef<Map<string, number>>(new Map());

  // Shared pre-allocated vectors to avoid per-frame allocations in useFrame
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const desiredCamPos = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);

  // Pre-allocated vectors & state for cluster label projection & culling (0 per-frame allocations)
  const clusterLabelVecs = useMemo(() => CLUSTERS.map(() => new THREE.Vector3()), []);
  const clusterScreenCoords = useMemo(() => CLUSTERS.map(() => ({ x: 0, y: 0, z: 0, dist: 0, visible: true, opacity: 1 })), []);
  const labelDomRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Shared reusable geometries
  const coreGeo = useMemo(() => new THREE.SphereGeometry(0.14, 16, 16), []);
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.24, 0.32, 32), []);
  const pulseRingGeo = useMemo(() => new THREE.RingGeometry(0.20, 0.28, 32), []);

  // Shared additive textures
  const glowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return createGlowTexture();
  }, []);

  const nebulaTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return createNebulaTexture();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      coreGeo.dispose();
      ringGeo.dispose();
      pulseRingGeo.dispose();
      glowTexture?.dispose();
      nebulaTexture?.dispose();
    };
  }, [coreGeo, ringGeo, pulseRingGeo, glowTexture, nebulaTexture]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Track entry appearance times for the newest gentle pulse
  useEffect(() => {
    if (entries && entries.length > 0) {
      const now = Date.now();
      entries.forEach(e => {
        if (!entryBirthTimesRef.current.has(e.id)) {
          entryBirthTimesRef.current.set(e.id, now);
        }
      });
    }
  }, [entries]);

  // Handle selection changes to trigger smooth camera flight
  useEffect(() => {
    if (selection.id !== prevSelectionIdRef.current) {
      prevSelectionIdRef.current = selection.id;
      flightStartTimeRef.current = performance.now();
    }
  }, [selection.id]);

  // Generate star positions
  const stars: StarData[] = useMemo(() => {
    const s: StarData[] = [];
    
    if (!entries || entries.length === 0) {
      CLUSTERS.forEach(cluster => {
        const numStars = 6 + Math.floor(Math.random() * 6);
        for (let i = 0; i < numStars; i++) {
          const radius = 1.4 + Math.random() * 2.3;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = cluster.position[0] + radius * Math.sin(phi) * Math.cos(theta);
          const y = cluster.position[1] + radius * Math.sin(phi) * Math.sin(theta);
          const z = cluster.position[2] + radius * Math.cos(phi);
          const defaultMood = cluster.id === 'study' ? 'Productive' : cluster.id === 'productivity' ? 'Productive' : cluster.id === 'stress' ? 'Anxious' : cluster.id === 'social' ? 'Happy' : 'Reflective';
          s.push({ 
            id: `demo-${cluster.id}-star-${i}`, 
            clusterId: cluster.id, 
            position: [x, y, z],
            title: `Moment in ${cluster.name}`,
            mood: defaultMood,
            date: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
            isRecent: false,
            isNewest: false,
            seed: i + 1,
          });
        }
      });
      return s;
    }

    entries.forEach((entry, idx) => {
      // Use AI cluster if present and valid; otherwise fall back to mood mapping
      const aiCluster = entry.analysis?.cluster?.toLowerCase?.();
      const clusterId =
        aiCluster && CLUSTERS.some((c) => c.id === aiCluster)
          ? aiCluster
          : getClusterForMood(entry.mood);

      const cluster = CLUSTERS.find(c => c.id === clusterId) || CLUSTERS[0];
      
      const hash = entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = (seed: number) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
      
      const radius = 1.4 + random(hash) * 2.3;
      const theta = random(hash + 1) * Math.PI * 2;
      const phi = Math.acos(2 * random(hash + 2) - 1);
      const x = cluster.position[0] + radius * Math.sin(phi) * Math.cos(theta);
      const y = cluster.position[1] + radius * Math.sin(phi) * Math.sin(theta);
      const z = cluster.position[2] + radius * Math.cos(phi);

      const isNewest = idx === 0 || !!entry.active;
      const isRecent = idx < 3;

      s.push({
        id: entry.id,
        clusterId: cluster.id,
        position: [x, y, z],
        title: entry.title || entry.text || 'Untitled Memory',
        mood: entry.mood,
        date: entry.date,
        isRecent,
        isNewest,
        seed: hash,
      });
    });
    
    return s;
  }, [entries]);

  // Subtle foreground particles
  const particles = useMemo(() => {
    const pos = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return pos;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  // Interaction handlers for OrbitControls
  const handleInteractionStart = () => {
    setIsUserInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  };

  const handleInteractionEnd = () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 2500);
  };

  // Main frame loop: camera flight, target lerp, slow auto-rotate, screen-space label checks
  useFrame((state, delta) => {
    // Drifting foreground dust
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.015;
    }

    if (controlsRef.current) {
      const now = performance.now();
      const flightElapsed = (now - flightStartTimeRef.current) / 1000;
      const isFlying = flightElapsed < 1.1 && !isUserInteracting;
      const lerpSpeed = 1 - Math.exp(-3.8 * delta);

      if (activeTab === 'universe') {
        if (selection.id) {
          if (selection.type === 'cluster') {
            const c = CLUSTERS.find(x => x.id === selection.id);
            if (c) {
              targetVec.set(c.position[0], c.position[1], c.position[2]);
              controlsRef.current.target.lerp(targetVec, lerpSpeed);

              if (isFlying) {
                camDir.subVectors(camera.position, targetVec).normalize();
                if (camDir.lengthSq() < 0.001) camDir.set(0, 0.3, 1).normalize();
                desiredCamPos.copy(targetVec).addScaledVector(camDir, 8.0);
                desiredCamPos.y = Math.max(desiredCamPos.y, targetVec.y + 0.9);
                camera.position.lerp(desiredCamPos, lerpSpeed);
              }
            }
          } else {
            const s = stars.find(x => x.id === selection.id);
            if (s) {
              targetVec.set(s.position[0], s.position[1], s.position[2]);
              controlsRef.current.target.lerp(targetVec, lerpSpeed);

              if (isFlying) {
                camDir.subVectors(camera.position, targetVec).normalize();
                if (camDir.lengthSq() < 0.001) camDir.set(0, 0.3, 1).normalize();
                // Clamp camera distance to a comfortable minimum (6.5 units)
                desiredCamPos.copy(targetVec).addScaledVector(camDir, 6.5);
                desiredCamPos.y = Math.max(desiredCamPos.y, targetVec.y + 0.8);
                camera.position.lerp(desiredCamPos, lerpSpeed);
              }
            }
          }
          controlsRef.current.autoRotate = false;
        } else {
          // Deselected: lerp target back toward center origin smoothly
          targetVec.set(0, 0, 0);
          controlsRef.current.target.lerp(targetVec, lerpSpeed * 0.4);

          controlsRef.current.autoRotate = !reducedMotion && !isUserInteracting;
          controlsRef.current.autoRotateSpeed = 0.35;
        }
      } else {
        controlsRef.current.autoRotate = !reducedMotion && !isUserInteracting;
        controlsRef.current.autoRotateSpeed = 0.15;
      }

      controlsRef.current.update();

      // Screen-space cluster label positioning, fading, and collision culling (0 per-frame allocations)
      const { width: canvasWidth, height: canvasHeight } = size;

      for (let i = 0; i < CLUSTERS.length; i++) {
        const cluster = CLUSTERS[i];
        const vec = clusterLabelVecs[i];
        // Label position placed at fixed offset below its nebula
        vec.set(cluster.position[0], cluster.position[1] - 2.8, cluster.position[2]);

        const dist = camera.position.distanceTo(vec);
        vec.project(camera);

        const screenX = ((vec.x + 1) * 0.5) * canvasWidth;
        const screenY = ((1 - vec.y) * 0.5) * canvasHeight;

        const coord = clusterScreenCoords[i];
        coord.x = screenX;
        coord.y = screenY;
        coord.z = vec.z;
        coord.dist = dist;

        // Distance-based fading
        let distOpacity = 1;
        if (dist < 4.2) {
          distOpacity = Math.max(0, (dist - 2.8) / 1.4);
        } else if (dist > 20.0) {
          distOpacity = Math.max(0, (26.0 - dist) / 6.0);
        }

        // Hide any label whose projected position is outside canvas margins or behind camera
        const inBounds = vec.z <= 1.0 &&
                         screenX >= 55 && screenX <= (canvasWidth - 55) &&
                         screenY >= 35 && screenY <= (canvasHeight - 35);

        coord.visible = inBounds && distOpacity > 0.05;
        coord.opacity = distOpacity;
      }

      // Check pairwise overlaps and cull overlapping labels (prioritizing selected cluster)
      for (let i = 0; i < CLUSTERS.length; i++) {
        if (!clusterScreenCoords[i].visible) continue;
        const isSelectedI = selection.id === CLUSTERS[i].id;

        for (let j = i + 1; j < CLUSTERS.length; j++) {
          if (!clusterScreenCoords[j].visible) continue;
          const isSelectedJ = selection.id === CLUSTERS[j].id;

          const dx = Math.abs(clusterScreenCoords[i].x - clusterScreenCoords[j].x);
          const dy = Math.abs(clusterScreenCoords[i].y - clusterScreenCoords[j].y);

          if (dx < 90 && dy < 34) {
            if (isSelectedJ && !isSelectedI) {
              clusterScreenCoords[i].visible = false;
              break;
            } else {
              clusterScreenCoords[j].visible = false;
            }
          }
        }
      }

      // Apply visibility and opacity directly to DOM elements via refs without React re-renders
      for (let i = 0; i < CLUSTERS.length; i++) {
        const domEl = labelDomRefs.current[i];
        if (domEl) {
          const coord = clusterScreenCoords[i];
          if (!coord.visible) {
            domEl.style.opacity = '0';
            domEl.style.pointerEvents = 'none';
          } else {
            const isSelected = selection.id === CLUSTERS[i].id;
            domEl.style.opacity = String(coord.opacity);
            domEl.style.pointerEvents = 'auto';
            domEl.style.transform = isSelected ? 'scale(1.12)' : 'scale(1)';
          }
        }
      }
    }
  });

  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        enableZoom={true} 
        minDistance={4.5} 
        maxDistance={28} 
        enableDamping 
        dampingFactor={0.06}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
      />

      {/* Depth Starfield Background with slow drifting speed */}
      <Stars 
        radius={60} 
        depth={50} 
        count={1400} 
        factor={3.8} 
        saturation={0} 
        fade 
        speed={0.4} 
      />

      {/* Subtle drifting cosmic dust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={350} args={[particles, 3]} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#ffffff" transparent opacity={0.16} sizeAttenuation />
      </points>
      
      {/* Cluster Nebulae */}
      {CLUSTERS.map((cluster, idx) => {
        const isSelected = selection.id === cluster.id;
        return (
          <group key={cluster.id} position={cluster.position as [number,number,number]}>
            {/* Soft radial-gradient nebula sprite (additive blending, depthWrite false) */}
            {nebulaTexture && (
              <sprite
                scale={isSelected ? [7.0, 7.0, 1] : [5.4, 5.4, 1]}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelection({ type: 'cluster', id: cluster.id }); 
                  onInteract?.(); 
                }}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
              >
                <spriteMaterial 
                  map={nebulaTexture} 
                  color={cluster.color} 
                  transparent 
                  opacity={isSelected ? 0.35 : 0.18} 
                  blending={THREE.AdditiveBlending} 
                  depthWrite={false} 
                />
              </sprite>
            )}

            {/* Non-overlapping cluster badge positioned at fixed offset below nebula */}
            <Html center position={[0, -2.8, 0]} zIndexRange={[100, 0]}>
              <div 
                ref={el => { labelDomRefs.current[idx] = el; }}
                className="font-mono text-[9px] tracking-[0.22em] transition-opacity duration-200 cursor-pointer whitespace-nowrap px-3 py-1 rounded-full border backdrop-blur-md select-none pointer-events-auto shadow-md"
                style={{
                  backgroundColor: isSelected ? `${cluster.color}35` : 'rgba(4, 6, 14, 0.85)',
                  borderColor: isSelected ? cluster.color : 'rgba(255,255,255,0.18)',
                  color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)',
                  boxShadow: isSelected ? `0 0 16px ${cluster.color}70` : '0 2px 10px rgba(0,0,0,0.7)',
                  transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelection({ type: 'cluster', id: cluster.id }); 
                  onInteract?.(); 
                }}
              >
                {cluster.name}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Stars */}
      {stars.map(star => {
        const cluster = CLUSTERS.find(c => c.id === star.clusterId);
        const color = cluster?.color || '#ffffff';
        const isSelected = selection.id === star.id;
        const isClusterSelected = selection.id === star.clusterId;
        const birthTime = entryBirthTimesRef.current.get(star.id) || 0;
        const isPulsing = star.isNewest && (Date.now() - birthTime < 14000);

        return (
          <StarItem
            key={star.id}
            star={star}
            color={color}
            isSelected={isSelected}
            isClusterSelected={isClusterSelected}
            isPulsing={isPulsing}
            glowTexture={glowTexture}
            coreGeo={coreGeo}
            ringGeo={ringGeo}
            pulseRingGeo={pulseRingGeo}
            isHovered={hoveredStarId === star.id}
            onHover={(h) => setHoveredStarId(h ? star.id : null)}
            onSelect={() => {
              setSelection({ type: 'star', id: star.id });
              onInteract?.();
            }}
          />
        );
      })}
    </>
  );
}

interface StarItemProps {
  star: StarData;
  color: string;
  isSelected: boolean;
  isClusterSelected: boolean;
  isPulsing: boolean;
  glowTexture: THREE.CanvasTexture | null;
  coreGeo: THREE.SphereGeometry;
  ringGeo: THREE.RingGeometry;
  pulseRingGeo: THREE.RingGeometry;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

function StarItem({
  star,
  color,
  isSelected,
  isClusterSelected,
  isPulsing,
  glowTexture,
  coreGeo,
  ringGeo,
  pulseRingGeo,
  isHovered,
  onHover,
  onSelect,
}: StarItemProps) {
  const { camera } = useThree();
  const spriteRef = useRef<THREE.Sprite>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Animate twinkle, selection ring rotation, and gentle newest pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + star.seed;
    const twinkle = 0.92 + 0.14 * Math.sin(t * 2.8);

    if (spriteRef.current) {
      const baseScale = isSelected 
        ? 1.9 
        : star.isRecent 
          ? 1.3 
          : isClusterSelected 
            ? 1.1 
            : 0.9;
      const s = baseScale * twinkle;
      spriteRef.current.scale.set(s, s, 1);
    }

    if (coreRef.current) {
      const coreScale = isSelected ? 1.4 : star.isRecent ? 1.15 : 1.0;
      coreRef.current.scale.set(coreScale, coreScale, coreScale);
    }

    if (isSelected && ringRef.current) {
      ringRef.current.quaternion.copy(camera.quaternion);
      ringRef.current.rotateZ(clock.getElapsedTime() * 0.9);
      const ringPulse = 1.0 + 0.08 * Math.sin(clock.getElapsedTime() * 4);
      ringRef.current.scale.set(ringPulse, ringPulse, ringPulse);
    }

    if (isPulsing && pulseRef.current) {
      pulseRef.current.quaternion.copy(camera.quaternion);
      const cycle = (clock.getElapsedTime() * 1.4) % 1; // 0 -> 1
      const pScale = 1.0 + cycle * 2.8;
      pulseRef.current.scale.set(pScale, pScale, pScale);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, (1 - cycle) * 0.75);
      }
    }
  });

  const displayTitle = star.title.length > 30 ? star.title.slice(0, 30) + '…' : star.title;
  const coreOpacity = isSelected ? 1 : isClusterSelected ? 0.95 : star.isRecent ? 0.95 : 0.85;

  return (
    <group position={star.position}>
      {/* Clickable Core Star Mesh */}
      <mesh 
        ref={coreRef}
        geometry={coreGeo}
        onClick={(e) => { 
          e.stopPropagation(); 
          onSelect(); 
        }}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          document.body.style.cursor = 'pointer'; 
          onHover(true); 
        }}
        onPointerOut={() => { 
          document.body.style.cursor = 'auto'; 
          onHover(false); 
        }}
      >
        <meshBasicMaterial color={color} transparent opacity={coreOpacity} />
      </mesh>

      {/* Additive Radial Glow Halo Sprite (no postprocessing) */}
      {glowTexture && (
        <sprite ref={spriteRef}>
          <spriteMaterial 
            map={glowTexture} 
            color={color} 
            transparent 
            opacity={isSelected ? 0.9 : star.isRecent ? 0.75 : 0.55} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </sprite>
      )}

      {/* Selected Star Luminous Ring */}
      {isSelected && (
        <mesh ref={ringRef} geometry={ringGeo}>
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.85} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Gentle Ripple Pulse for Newest Entry */}
      {isPulsing && (
        <mesh ref={pulseRef} geometry={pulseRingGeo}>
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.7} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Star Hover Tooltip Card */}
      {isHovered && (
        <Html
          position={[0, 0, 0]}
          center={false}
          zIndexRange={[200, 0]}
          className="pointer-events-none select-none"
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="bg-[#070913]/95 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.85)] max-w-[220px] text-left pointer-events-none select-none transform translate-x-3.5 -translate-y-[calc(100%+8px)]"
            style={{ pointerEvents: 'none' }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded font-semibold border flex-shrink-0"
                style={{ 
                  backgroundColor: `${color}25`, 
                  borderColor: `${color}50`,
                  color: color 
                }}
              >
                {star.mood}
              </span>
              <span className="text-[11px] font-mono text-white/50 whitespace-nowrap">
                {formatDateTime(star.date)}
              </span>
            </div>
            <div className="font-serif text-[13px] text-white/95 line-clamp-2 leading-snug">
              {displayTitle}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

