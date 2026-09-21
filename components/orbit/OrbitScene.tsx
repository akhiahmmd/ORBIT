'use client';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Galaxy from './Galaxy';
import StarField from './StarField';
import Nebula from './Nebula';
import DataStars from './DataStars';
import SpaceCamera from './SpaceCamera';
import InsightPanel from './InsightPanel';
import type { EventStarData } from './DataStars';

/**
 * OrbitScene — Top-level 3D scene container.
 * Renders the Canvas, all 3D layers, postprocessing, and the HTML insight panel overlay.
 */
export default function OrbitScene() {
  const [selectedStar, setSelectedStar] = useState<EventStarData | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 7, 33], fov: 52, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#010204' }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <Suspense fallback={null}>
          {/* Atmosphere */}
          <fog attach="fog" args={['#02030a', 42, 180]} />
          <ambientLight intensity={0.02} />

          {/* Background stars */}
          <StarField count={isMobile ? 2200 : 6200} />

          {/* Galaxy spiral - greatly increased count for cinematic realism */}
          <Galaxy particleCount={isMobile ? 25000 : 65000} />

          {/* Nebula dust */}
          <Nebula count={isMobile ? 120 : 350} />

          {/* Galactic core glow - warmer, cinematic intense core */}
          <pointLight position={[0, 0, 0]} intensity={3.5} color="#ffe8b5" distance={25} />
          <pointLight position={[0, 0, 0]} intensity={2.0} color="#7c8cff" distance={15} />
          
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
          </mesh>

          {/* Interactive data stars */}
          <DataStars
            onSelectStar={setSelectedStar}
            selectedStarId={selectedStar?.id ?? null}
          />

          {/* Camera controls */}
          <SpaceCamera />

          {/* Postprocessing - Restrained but beautiful bloom */}
          <EffectComposer enableNormalPass={false} multisampling={4}>
            <Bloom
              intensity={0.65}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
            <Vignette darkness={0.78} offset={0.3} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* HTML overlay — insight panel */}
      <InsightPanel
        star={selectedStar}
        onClose={() => setSelectedStar(null)}
      />
    </div>
  );
}
