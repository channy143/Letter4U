import React from 'react';

export default function Hero({ onReadLetter }) {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(155,58,74,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 80%, rgba(184,146,58,0.06) 0%, transparent 60%)
        `,
        padding: '0 2rem',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.75rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.35em',
          color: 'var(--gold)',
          marginBottom: '2rem',
          animation: 'fadeUp 0.8s ease forwards',
          opacity: 0,
        }}
      >
        A small letter
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2.5rem',
          animation: 'fadeUp 0.8s ease 0.15s forwards',
          opacity: 0,
        }}
      >
        <span style={{ width: '3rem', height: '1px', background: 'var(--blush)' }} />
        <span style={{ color: 'var(--blush)', fontSize: '1.2rem' }}>&#9829;</span>
        <span style={{ width: '3rem', height: '1px', background: 'var(--blush)' }} />
      </div>

      <h1
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.3,
          marginBottom: '1.5rem',
          animation: 'fadeUp 0.8s ease 0.3s forwards',
          opacity: 0,
        }}
      >
        For{' '}
        <span style={{ position: 'relative', color: 'var(--rose)', whiteSpace: 'nowrap' }}>
          you
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              right: 0,
              height: '2px',
              background: 'var(--rose)',
              transformOrigin: 'left center',
              animation: 'lineGrow 0.8s ease 1.4s forwards',
              transform: 'scaleX(0)',
            }}
          />
        </span>
        , slow and gentle.
      </h1>

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: '#7a6a64',
          maxWidth: '460px',
          marginBottom: '3rem',
          lineHeight: 1.7,
          animation: 'fadeUp 0.8s ease 0.5s forwards',
          opacity: 0,
        }}
      >
        You're safe with me. Take your time—I'll be here, one step at a time.
      </p>

      <button
        onClick={onReadLetter}
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'var(--rose)',
          background: 'transparent',
          border: '1.5px solid var(--rose)',
          padding: '0.9rem 2.5rem',
          cursor: 'pointer',
          transition: 'all 0.35s ease',
          animation: 'fadeUp 0.8s ease 0.7s forwards',
          opacity: 0,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--rose)';
          e.target.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = 'var(--rose)';
        }}
      >
        Read the Letter
      </button>
    </section>
  );
}
