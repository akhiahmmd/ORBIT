'use client';

import { motion } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function OrbitHeroContent() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // Shift focal point upward — avoids collision with the bottom stats strip
        // Stats strip is ~110px tall; we pad the bottom so flex centering
        // never pushes CTA buttons into that zone.
        justifyContent: 'center',
        pointerEvents: 'none',
        // Top padding clears the nav bar (~80px tall)
        // Bottom padding clears the stats strip (~120px tall)
        padding: 'clamp(80px, 10vw, 110px) clamp(20px, 5vw, 72px) clamp(100px, 14vw, 140px)',
        maxWidth: '1440px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '580px' }}>

        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE_OUT }}
          style={{
            fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 300,
            letterSpacing: '0.42em',
            color: 'rgba(255,255,255,0.32)',
            textTransform: 'uppercase',
            marginBottom: '26px',
          }}
        >
          Personal Universe
        </motion.div>

        {/* Headline — editorial serif, keep exactly as specified */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.55, ease: EASE_OUT }}
          style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: 'clamp(2.6rem, 5.8vw, 5.0rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: 0,
            marginBottom: '24px',
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          }}
        >
          Explore the
          <br />
          <span
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            patterns
          </span>
          <br />
          that shape you.
        </motion.h1>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.75, ease: EASE_OUT }}
          style={{
            fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
            fontWeight: 300,
            lineHeight: 1.74,
            color: 'rgba(255,255,255,0.50)',
            maxWidth: '380px',
            margin: 0,
            marginBottom: '40px',
          }}
        >
          Turn your thoughts, goals, and daily moments into an
          interactive universe powered by AI.
        </motion.p>

        {/* CTA row — has its own vertical space, never near stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: EASE_OUT }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '20px',
            pointerEvents: 'auto',
          }}
        >
          {/* Primary CTA */}
          <a
            href="#"
            id="hero-v2-enter-universe"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 26px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.88)',
              textDecoration: 'none',
              transition: 'all 0.45s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background    = 'rgba(255,255,255,0.11)';
              el.style.borderColor   = 'rgba(255,255,255,0.26)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background    = 'rgba(255,255,255,0.06)';
              el.style.borderColor   = 'rgba(255,255,255,0.12)';
            }}
          >
            Enter Your Universe
            <span className="hero-v2-arrow" style={{ display: 'inline-block', transition: 'transform 0.35s ease' }}>
              →
            </span>
          </a>

          {/* Secondary CTA */}
          <button
            id="hero-v2-explore-how"
            onClick={() => {/* placeholder */}}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '11px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
              fontSize: '12.5px',
              fontWeight: 300,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.40)',
              transition: 'color 0.35s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.78)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.40)'; }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.13)',
                background: 'rgba(255,255,255,0.03)',
                flexShrink: 0,
                transition: 'border-color 0.35s ease',
              }}
            >
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" style={{ marginLeft: '1px' }}>
                <path d="M0.5 1L7.5 5L0.5 9V1Z" fill="rgba(255,255,255,0.65)" stroke="rgba(255,255,255,0.65)" strokeWidth="0.5" />
              </svg>
            </span>
            Explore how it works
          </button>
        </motion.div>
      </div>

      {/* Hover arrow nudge */}
      <style>{`
        #hero-v2-enter-universe:hover .hero-v2-arrow { transform: translateX(3px); }
      `}</style>
    </div>
  );
}
