import React, { useEffect, useRef } from 'react';

const quotes = [
  {
    text: 'I have found the one whom my soul loves.',
    author: 'Song of Solomon',
  },
  {
    text: 'I love you without knowing how, or when, or from where.',
    author: 'Pablo Neruda',
  },
  {
    text: 'She was a storm, not the kind you run from, but the kind you chase.',
    author: 'R. H. Sin',
  },
];

const numerals = ['I', 'II', 'III'];

function QuoteCard({ quote, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="quote-card"
      style={{
        position: 'relative',
        background:
          'linear-gradient(160deg, #fdf6ed 0%, var(--parchment) 55%, #f3e6d2 100%)',
        padding: '3.5rem 2.5rem 2.8rem',
        overflow: 'hidden',
        opacity: 0,
        transform: 'translateY(32px)',
        transition:
          'opacity 0.8s ease, transform 0.8s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        transitionDelay: `${index * 0.18}s`,
        border: '1px solid rgba(184, 146, 58, 0.18)',
        borderTop: '2px solid var(--gold)',
        boxShadow: '0 4px 24px rgba(26, 10, 8, 0.05)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 18px 48px rgba(155, 58, 74, 0.12)';
        e.currentTarget.style.borderColor = 'rgba(155, 58, 74, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(26, 10, 8, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(184, 146, 58, 0.18)';
      }}
    >
      {/* Watermark numeral */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-1.2rem',
          right: '-0.4rem',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '8rem',
          fontWeight: 500,
          fontStyle: 'italic',
          color: 'var(--rose)',
          opacity: 0.06,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {numerals[index]}
      </span>

      {/* Top eyebrow with roman numeral */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '1.6rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            color: 'var(--gold)',
          }}
        >
          {numerals[index]}
        </span>
        <span
          style={{
            flex: 1,
            height: '1px',
            background:
              'linear-gradient(90deg, var(--gold) 0%, transparent 100%)',
            opacity: 0.5,
          }}
        />
        <span
          style={{
            color: 'var(--blush)',
            fontSize: '0.7rem',
          }}
        >
          &#10038;
        </span>
      </div>

      {/* Opening quotation glyph */}
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          fontFamily: "'Libre Baskerville', serif",
          fontSize: '4rem',
          lineHeight: 0.6,
          color: 'var(--rose)',
          opacity: 0.35,
          marginBottom: '0.6rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <blockquote
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '1.3rem',
          fontWeight: 400,
          lineHeight: 1.75,
          color: 'var(--ink)',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 1,
          textIndent: '0.5rem',
        }}
      >
        {quote.text}
      </blockquote>

      {/* Author divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          style={{
            width: '1.4rem',
            height: '1px',
            background: 'var(--gold)',
            opacity: 0.6,
          }}
        />
        <span
          style={{
            color: 'var(--gold)',
            fontSize: '0.5rem',
            opacity: 0.8,
          }}
        >
          &#9670;
        </span>
        <span
          style={{
            flex: 1,
            height: '1px',
            background:
              'linear-gradient(90deg, var(--gold) 0%, transparent 100%)',
            opacity: 0.4,
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.65rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: 'var(--rose)',
          marginTop: '0.9rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {quote.author}
      </p>

      <style>{`
        .quote-card.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </article>
  );
}

export default function QuotesSection() {
  return (
    <section
      id="quotes"
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '7rem 2rem',
      }}
    >
      {/* Section header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '4.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            color: 'var(--gold)',
            marginBottom: '0.8rem',
          }}
        >
          &#10038; &nbsp; A Treasury &nbsp; &#10038;
        </p>

        <h2
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: '1rem',
          }}
        >
          Words I Kept for You
        </h2>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
          }}
        >
          <span
            style={{
              width: '3rem',
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, var(--blush))',
            }}
          />
          <span
            style={{
              color: 'var(--blush)',
              fontSize: '0.5rem',
            }}
          >
            &#9670;
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.95rem',
              color: '#7a6a64',
            }}
          >
            a few things the heart keeps saying
          </span>
          <span
            style={{
              color: 'var(--blush)',
              fontSize: '0.5rem',
            }}
          >
            &#9670;
          </span>
          <span
            style={{
              width: '3rem',
              height: '1px',
              background:
                'linear-gradient(90deg, var(--blush), transparent)',
            }}
          />
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.2rem',
        }}
      >
        {quotes.map((q, i) => (
          <QuoteCard key={i} quote={q} index={i} />
        ))}
      </div>
    </section>
  );
}
