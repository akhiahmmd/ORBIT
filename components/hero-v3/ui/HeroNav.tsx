'use client';

import { motion } from 'framer-motion';

export default function HeroNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 48px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
          }}
        >
          {/* N mark */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.02em',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            N
          </div>
          <span
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 300,
            }}
          >
            ORBIT
          </span>
        </div>

        {/* Centre links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
            pointerEvents: 'auto',
          }}
        >
          {['Universe', 'How it works', 'Insights'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
                fontWeight: 300,
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            fontSize: '11px',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.65)',
            textDecoration: 'none',
            fontWeight: 300,
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.22)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.10)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
          }}
        >
          Enter your universe
          <span style={{ fontSize: '12px', opacity: 0.5 }}>→</span>
        </a>
      </div>
    </motion.nav>
  );
}
