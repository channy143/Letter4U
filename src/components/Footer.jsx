import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '3rem 2rem',
        borderTop: '1px solid var(--gold)',
        marginTop: '2rem',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          color: 'var(--rose)',
          fontSize: '1.5rem',
          marginBottom: '0.6rem',
          animation: 'heartbeat 1.5s ease infinite',
        }}
      >
        &#9829;
      </span>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '1rem',
          color: '#7a6a64',
        }}
      >
        Take your time, kikay. I'll be right here.
      </p>
    </footer>
  );
}
