import React from 'react';

export default function Navbar({ onLetterClick }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.2rem 4rem',
        background: 'rgba(253, 246, 237, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: 'italic',
          fontSize: '1.6rem',
          color: 'var(--rose)',
        }}
      >
        Amour
      </span>

      <div style={{ display: 'flex', gap: '2.5rem' }}>
        <button
          onClick={onLetterClick}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--ink)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          The Letter
        </button>
        <button
          onClick={() => scrollTo('quotes')}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--ink)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Words
        </button>
        <button
          onClick={() => scrollTo('moments')}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--ink)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Moments
        </button>
      </div>
    </nav>
  );
}
