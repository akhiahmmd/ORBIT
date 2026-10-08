'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Universe',      href: '#' },
  { label: 'How it works',  href: '#' },
  { label: 'Insights',      href: '#' },
];

export default function OrbitHeroNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 0,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(20px, 3vw, 36px) clamp(20px, 5vw, 72px)',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,1.0)',
              textTransform: 'uppercase',
              pointerEvents: 'auto',
              userSelect: 'none',
              textShadow: '0 0 20px rgba(0,0,0,0.8)',
            }}
          >
            ORBIT
          </div>

          {/* Centre links — desktop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem',
              pointerEvents: 'auto',
            }}
            className="orbit-nav-links-desktop"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.055em',
                  color: 'rgba(255,255,255,0.56)',
                  textDecoration: 'none',
                  transition: 'color 0.35s ease',
                  textShadow: '0 0 12px rgba(0,0,0,0.6)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.48)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', pointerEvents: 'auto' }}>
            <a
              href="#"
              className="orbit-nav-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '8px 18px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 300,
                letterSpacing: '0.055em',
                color: 'rgba(255,255,255,0.72)',
                textDecoration: 'none',
                transition: 'all 0.35s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = 'rgba(255,255,255,0.95)';
                el.style.background = 'rgba(255,255,255,0.10)';
                el.style.borderColor = 'rgba(255,255,255,0.28)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = 'rgba(255,255,255,0.72)';
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
            >
              Enter your universe
              <span style={{ color: 'rgba(255,255,255,0.45)', transition: 'transform 0.3s ease', display: 'inline-block' }}>→</span>
            </a>

            {/* Mobile hamburger */}
            <button
              className="orbit-nav-hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
                flexDirection: 'column',
                gap: '4px',
                padding: '4px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.7)',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              top: '64px',
              left: '20px',
              right: '20px',
              zIndex: 25,
              background: 'rgba(3,6,9,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              style={{
                fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                marginTop: '4px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '16px',
              }}
            >
              Enter your universe →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS — scoped to hero nav only */}
      <style>{`
        @media (max-width: 768px) {
          .orbit-nav-links-desktop { display: none !important; }
          .orbit-nav-cta { display: none !important; }
          .orbit-nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
