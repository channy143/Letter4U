import React from 'react';

const cells = [
  { src: '/moments/1.jpg', rowSpan: true },
  { src: '/moments/2.jpg' },
  { src: '/moments/3.jpg' },
  { src: '/moments/4.jpg' },
  { src: '/moments/5.jpg' },
  { src: '/moments/6.png', rowSpan: true },
  { src: '/moments/7.jpg' },
  { src: '/moments/8.jpg' },
  { src: '/moments/9.jpg' },
  { src: '/moments/10.jpg' },
  { src: '/moments/11.jpg' },
  { src: '/moments/12.jpg' },
  { src: '/moments/13.jpg' },
];

function Cell({ src, rowSpan }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        gridRow: rowSpan ? 'span 2' : undefined,
        cursor: 'default',
        overflow: 'hidden',
        minHeight: rowSpan ? '420px' : '200px',
        background: '#1a0a08',
        boxShadow: 'inset 0 0 0 1px rgba(245,237,224,0.15)',
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'transform 0.8s ease, filter 0.4s ease',
          filter: 'saturate(0.92) brightness(0.96)',
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.style.background =
            'linear-gradient(135deg, #2e1640 0%, #4a2a3a 100%)';
        }}
        className="moment-img"
      />
      <style>{`
        .moment-img:hover {
          transform: scale(1.04);
          filter: saturate(1) brightness(1.02);
        }
      `}</style>
    </div>
  );
}

export default function MomentsSection({ onLockClick }) {
  return (
    <section
      id="moments"
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '6rem 2rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.7rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: 'var(--gold)',
          marginBottom: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        Our Story
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', transform: 'scale(1.35)', transformOrigin: 'center center', cursor: 'pointer' }} onClick={onLockClick}>
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="none"
            style={{ verticalAlign: 'middle', animation: 'giggle 0.6s ease infinite', transformOrigin: 'center' }}
          >
            <rect x="1.5" y="5" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M3 5V3.5a2 2 0 1 1 4 0V5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          <span
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 5px)',
              left: 'calc(50% - 12px)',
              right: 'auto',
              transform: 'none',
              whiteSpace: 'nowrap',
              background: 'var(--rose)',
              color: '#fff',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '10px',
              letterSpacing: '0.05em',
              pointerEvents: 'none',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            Click me!
            <span
              style={{
                position: 'absolute',
                top: '100%',
                left: '7px',
                transform: 'none',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid var(--rose)',
              }}
            />
            <img
              src="/moments/cat3.gif"
              alt=""
              style={{
                position: 'absolute',
                top: '-22px',
                right: '-32px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </span>
        </span>
      </p>
      <h2
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 400,
          color: 'var(--ink)',
          marginBottom: '3rem',
        }}
      >
        Small moments, kept gently.
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridAutoRows: '200px',
          gap: '4px',
        }}
      >
        {cells.map((c, i) => (
          <Cell key={i} src={c.src} rowSpan={c.rowSpan} />
        ))}
      </div>
    </section>
  );
}
