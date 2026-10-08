'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '31', label: 'Days' },
  { value: '146', label: 'Entries' },
  { value: '18', label: 'Patterns' },
  { value: '6', label: 'Clusters' },
];

export default function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0, delay: 1.3 }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 48px 36px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '8px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.30)',
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right — Live constellation indicator */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            opacity: 0.5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#60d080',
                boxShadow: '0 0 6px #60d080',
                display: 'inline-block',
                animation: 'pulse 2.5s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Live Constellation
            </span>
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '8px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            Drag to orbit · Select a memory
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </motion.div>
  );
}
