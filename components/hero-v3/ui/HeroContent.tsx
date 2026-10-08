'use client';

import { motion } from 'framer-motion';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as number[] },
});

export default function HeroContent() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Left column — max 48% width on desktop */}
        <div style={{ maxWidth: '520px' }}>

          {/* Eyebrow */}
          <motion.div {...fadeUp(0.5)}>
            <span
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
                display: 'block',
                marginBottom: '22px',
              }}
            >
              Personal Pattern Archive / 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.65)}>
            <span
              style={{
                display: 'block',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '28px',
              }}
            >
              Explore the
              <br />
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.82)', fontWeight: 300 }}>
                patterns
              </span>
              <br />
              that shape you.
            </span>
          </motion.h1>

          {/* Supporting text */}
          <motion.p {...fadeUp(0.80)}>
            <span
              style={{
                display: 'block',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.58)',
                maxWidth: '380px',
                marginBottom: '40px',
              }}
            >
              Turn your thoughts, goals, and daily moments into an
              interactive universe powered by AI.
            </span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            {...fadeUp(0.95)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              flexWrap: 'wrap',
              pointerEvents: 'auto',
            }}
          >
            {/* Primary */}
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 26px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                fontSize: '13px',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 24px rgba(255,255,255,0.04)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.10)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 32px rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 24px rgba(255,255,255,0.04)';
              }}
            >
              Enter Your Universe
              <span style={{ transition: 'transform 0.3s ease' }}>→</span>
            </a>

            {/* Secondary */}
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              Explore how it works
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
