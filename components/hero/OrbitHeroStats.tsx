'use client';

import { motion } from 'framer-motion';

const STATS = [
  { label: 'Days',     value: '12' },
  { label: 'Entries',  value: '47' },
  { label: 'Patterns', value: '6'  },
  { label: 'Clusters', value: '5'  },
];

export default function OrbitHeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 1.2 }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 72px)',
        }}
      >
        {/* Hairline separator */}
        <div
          style={{
            width: '160px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.0) 100%)',
            marginBottom: '20px',
          }}
        />

        {/* Stats row — four items, no "Continue", no cards */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 'clamp(20px, 4.5vw, 52px)',
            paddingBottom: 'clamp(22px, 3.2vw, 40px)',
            flexWrap: 'wrap',
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 1.25 + i * 0.07 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
              }}
            >
              {/* Value */}
              <span
                style={{
                  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  color: 'rgba(255,255,255,0.68)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              {/* Label */}
              <span
                style={{
                  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                  fontSize: '8.5px',
                  fontWeight: 400,
                  letterSpacing: '0.20em',
                  color: 'rgba(255,255,255,0.24)',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
