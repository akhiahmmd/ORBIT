'use client';

import { Suspense } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import DistantStars    from './universe/DistantStars';
import OrbitParticles  from './universe/OrbitParticles';
import CentralCore     from './universe/CentralCore';
import MemoryClusters  from './universe/MemoryClusters';
import MemoryParticles from './universe/MemoryParticles';
import UniverseCamera  from './universe/UniverseCamera';

interface Props {
  isMobile: boolean;
}

/**
 * OrbitUniverseV3 — full 3D scene.
 * Mounted inside R3F <Canvas> so all children are Three.js components.
 */
export default function OrbitUniverseV3({ isMobile }: Props) {
  return (
    <>
      {/* Atmosphere */}
      <color attach="background" args={['#01010c']} />
      <fog attach="fog" args={['#01010c', 30, 110]} />
      <ambientLight intensity={0.03} />

      <Suspense fallback={null}>
        {/* 1 — Distant background star field */}
        <DistantStars />

        {/* 2 — Main orbital disc / spiral particle system */}
        <OrbitParticles isMobile={isMobile} />

        {/* 3 — Dense central core */}
        <CentralCore />

        {/* 4 — Memory clusters */}
        <MemoryClusters />

        {/* 5 — Individual memory events */}
        <MemoryParticles />

        {/* 6 — Camera controller */}
        <UniverseCamera />

        {/* 7 — Post-processing */}
        <EffectComposer enableNormalPass={false} multisampling={isMobile ? 0 : 4}>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette darkness={0.75} offset={0.25} />
        </EffectComposer>
      </Suspense>
    </>
  );
}
