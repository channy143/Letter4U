import React from 'react';

const marqueeImages = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.png',
  '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
  '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg',
  'her.png', 'her1.png', 'her3.png',
];

const stripImages = ['g1.jpg', 'g2.jpg', 'g3.jpg'];

const IMG_W = 300;
const IMG_H = 320;



export default function PhotoBooth({ revealed, onTakePhotos }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#f5f0eb',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(-60px)',
        transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          textAlign: 'left',
          padding: '3rem 1rem 1.5rem',
          background: '#000',
        }}
      >
        <h1
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            color: '#fff',
            letterSpacing: '0.01em',
            lineHeight: 1.3,
            textTransform: 'uppercase',
          }}
        >
          Welcome to our<br />PhotoBooth!!
        </h1>
      </div>

      {/* ── Marquee Rows ── */}
      <div style={{ position: 'relative' }}>
        {/* Cat peeking from top-right, outside marquee overflow */}
        <div
          style={{
            position: 'absolute',
            top: -240,
            right: 450,
            width: 100,
            height: 100,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/moments/cat14.gif"
            alt=""
            style={{ width: 300, height: 300, objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            padding: '1.5rem 0',
            background: '#000',
          }}
        >
        {/* Row 1 — left */}
        <div
          style={{
            display: 'flex',
            width: `${marqueeImages.length * 2 * IMG_W}px`,
            animation: 'marqueeLeft 90s linear infinite',
            marginBottom: '20px',
            marginTop: '26px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {[...marqueeImages, ...marqueeImages].map((src, i) => (
            <div
              key={i}
              style={{
                width: `${IMG_W}px`,
                height: `${IMG_H}px`,
                flexShrink: 0,
                overflow: 'hidden',
                border: '3px solid #fff',
              }}
            >
              <img
                src={`/moments/${src}`}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>

        {/* Row 2 — right */}
        <div
          style={{
            display: 'flex',
            width: `${marqueeImages.length * 2 * IMG_W}px`,
            animation: 'marqueeRight 90s linear infinite',
          }}
        >
          {[...marqueeImages, ...marqueeImages].map((src, i) => (
            <div
              key={i}
              style={{
                width: `${IMG_W}px`,
                height: `${IMG_H}px`,
                flexShrink: 0,
                overflow: 'hidden',
                border: '3px solid #fff',
              }}
            >
              <img
                src={`/moments/${src}`}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* ── Description + Photo Strip + Button ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          maxWidth: '1100px',
          margin: '2rem auto',
          padding: '0 2rem 3rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Left — photo strip */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flexShrink: 0,
            transform: 'rotate(-5deg)',
            marginLeft: '-150px',
            border: '8px solid #fff',
            boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
            lineHeight: 0,
            background: '#fff',
          }}
        >
          {stripImages.map((src, i) => (
            <div
              key={i}
              style={{
                overflow: 'hidden',
                border: '8px solid #fff',
              }}
            >
              <img
                src={`/photostrip/${src}`}
                alt=""
                style={{
                  display: 'block',
                  width: '300px',  
    		  height: 'auto',  
                }}
              />
            </div>
          ))}
        </div>

        {/* Right — description + button */}
        <div
          style={{
            maxWidth: '420px',
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '1.8rem',
              lineHeight: 1.8,
              color: '#555',
              marginBottom: '2rem',
            }}
          >
            Here's a little photo booth where we can capture smiles, silly poses,
            and memories worth looking back on. Ready to make another one together?
          </p>

          <button
            onClick={onTakePhotos}
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              fontSize: '1.2rem',
              color: '#fff',
              background: '#dc143c',
              border: 'none',
              borderRadius: '40px',
              padding: '1rem 2.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(220,20,60,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(220,20,60,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(220,20,60,0.35)';
            }}
          >
            Take photos Together
          </button>
        </div>
      </div>
    </div>
  );
}
