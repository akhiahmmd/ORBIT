'use client';

import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import HeroNav     from './ui/HeroNav';
import HeroContent from './ui/HeroContent';
import HeroStats   from './ui/HeroStats';

// Keep Three.js canvas client-only (no SSR)
const OrbitUniverseV3 = dynamic(
  () => import('./OrbitUniverseV3'),
  { ssr: false, loading: () => null }
);

export default function OrbitHeroV3() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '640px',
        overflow: 'hidden',
        background: '#01010c',
      }}
    >
      {/* ── Three.js canvas — fills entire hero ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [2, 9, 28], fov: 52, near: 0.1, far: 400 }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ antialias: !isMobile, alpha: false }}
          onPointerMissed={() => {}}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        >
          <OrbitUniverseV3 isMobile={isMobile} />
        </Canvas>
      </div>

      {/* ── Vignettes for UI readability ── */}

      {/* Edge vignette all around */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5,
          boxShadow: 'inset 0 0 180px rgba(1,1,12,0.75)',
        }}
      />

      {/* Left gradient — keeps editorial text readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 6,
          background: 'linear-gradient(to right, rgba(1,1,12,0.88) 0%, rgba(1,1,12,0.55) 38%, rgba(1,1,12,0.10) 62%, transparent 80%)',
        }}
      />

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          pointerEvents: 'none',
          zIndex: 6,
          background: 'linear-gradient(to top, rgba(1,1,12,0.70) 0%, transparent 100%)',
        }}
      />

      {/* Top fade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          pointerEvents: 'none',
          zIndex: 6,
          background: 'linear-gradient(to bottom, rgba(1,1,12,0.65) 0%, transparent 100%)',
        }}
      />

      {/* ── UI overlays ── */}

      {/* Navigation */}
      <HeroNav />

      {/* Main editorial content */}
      <HeroContent />

      {/* Stats strip + live indicator */}
      <HeroStats />
    </section>
  );
}
