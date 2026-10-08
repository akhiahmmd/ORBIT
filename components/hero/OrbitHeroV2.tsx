'use client';

import dynamic from 'next/dynamic';
import OrbitHeroNav from './OrbitHeroNav';
import OrbitHeroContent from './OrbitHeroContent';
import OrbitHeroStats from './OrbitHeroStats';

/**
 * OrbitGalaxyV2 is loaded client-side only.
 * The loading fallback matches the hero background colour so there is
 * no flash before the canvas is ready.
 */
const OrbitGalaxyV2 = dynamic(() => import('./OrbitGalaxyV2'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#030609',
      }}
    />
  ),
});

/**
 * OrbitHeroV2
 *
 * Architecture:
 *   <section>               — hero root, 100svh, overflow:hidden, position:relative
 *     OrbitGalaxyV2         — position:absolute, inset:0, z-index:0
 *     left-side vignette    — absolute, z-index:5, pointer-events:none
 *     OrbitHeroNav          — absolute, z-index:20
 *     OrbitHeroContent      — fills height, z-index:10
 *     OrbitHeroStats        — absolute bottom, z-index:10
 *   </section>
 *
 * The canvas NEVER determines hero height.
 * All UI layers are z-index > 0 so galaxy stays behind.
 */
export default function OrbitHeroV2() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        height: '100svh',
        overflow: 'hidden',
        background: '#030609',
        // Fallback for browsers without svh support
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore – CSS custom property for fallback
        '--hero-height': '100dvh',
      }}
    >
      {/* ── Layer 0: Galaxy canvas — absolutely positioned, never in flow ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <OrbitGalaxyV2 />
      </div>

      {/* ── Layer 5: Vignette overlays for text readability ── */}
      {/* Edge-blending vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 160px rgba(3,6,9,0.85)',
        }}
      />
      {/* Left-side gradient to keep text readable over bright galactic centre */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          pointerEvents: 'none',
          background:
            'linear-gradient(90deg, rgba(3,6,9,0.85) 0%, rgba(3,6,9,0.5) 40%, rgba(3,6,9,0.0) 75%)',
        }}
      />

      {/* ── Layer 20: Navigation ── */}
      <OrbitHeroNav />

      {/* ── Layer 10: Main content — fills viewport height, flex column centred ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <OrbitHeroContent />
      </div>

      {/* ── Layer 10: Stats strip — absolute bottom ── */}
      <OrbitHeroStats />
    </section>
  );
}
