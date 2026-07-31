import React, { useEffect, useRef, useState } from 'react';

const PHOTOS = {
  bgTL: '/moments/5.jpg',
  bgTR: '/moments/8.jpg',
  bgTop: '/moments/11.jpg',
  fgLeft: '/moments/1.jpg',
  fgRight: '/moments/3.jpg',
};

function HangingPolaroid({
  src,
  w,
  h,
  rot,
  top,
  left,
  right,
  strings = 1,
  blur = 0,
  opacity = 1,
  swingDelay = 0,
  drift,
  drifting,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        zIndex: drift === 'none' ? 2 : 3,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: strings > 1 ? '64px' : 0,
          transformOrigin: 'top center',
          animation: 'stringDrop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
          transition: 'opacity 0.6s ease',
          opacity: drifting ? 0 : 1,
        }}
      >
        {Array.from({ length: strings }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '1px',
              height: '88px',
              background: 'linear-gradient(180deg, rgba(58,42,36,0.75), rgba(58,42,36,0.25))',
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: '-2px',
          animation: drifting
            ? `${drift} 2.2s cubic-bezier(0.4, 0, 1, 1) both`
            : `polaroidSwingIn 2.2s ${swingDelay}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
          '--rot': `${rot}deg`,
          '--swing-from': `${rot + 34}deg`,
        }}
      >
        <div
          style={{
            animation: drift === 'none' ? 'none' : 'polaroidSway 6.5s ease-in-out infinite alternate',
            filter: blur ? `blur(${blur}px)` : undefined,
            opacity,
            transformOrigin: 'top center',
          }}
        >
          <div
            style={{
              background: '#fdfaf4',
              padding: '10px 10px 14px',
              borderRadius: '3px',
              boxShadow: drift === 'none' ? '0 6px 22px rgba(58,42,36,0.18)' : '0 14px 34px rgba(58,42,36,0.28)',
            }}
          >
            <img
              src={src}
              alt=""
              draggable={false}
              style={{
                display: 'block',
                height: `${h}px`,
                width: `${w}px`,
                objectFit: 'cover',
                objectPosition: 'center 30%',
                filter: 'saturate(0.92) contrast(1.02)',
              }}
            />
            <div
              style={{
                height: '10px',
                background:
                  'repeating-linear-gradient(90deg, rgba(58,42,36,0.12) 0 1px, transparent 1px 14px)',
                marginTop: '10px',
                opacity: 0.7,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BridgeSection({ onComplete }) {
  const audioRef = useRef(null);
  const [line, setLine] = useState(0);
  const [textGone, setTextGone] = useState(false);
  const [drifting, setDrifting] = useState(false);
  const [dust, setDust] = useState([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const a = audioRef.current;
    if (a) {
      a.volume = 0.35;
      a.play().catch(() => {});
    }
    return () => {
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    setDust(
      Array.from({ length: 44 }, (_, i) => ({
        size: 2 + ((i * 37) % 90) / 10,
        left: (i * 67) % 100,
        startPos: -(((i * 89) % 280) + 40),
        delay: (i * 19) % 110,
        duration: 18 + ((i * 29) % 90) / 10,
        opacity: 0.14 + ((i * 23) % 30) / 100,
      }))
    );
  }, []);

  useEffect(() => {
    const t = [];
    t.push(setTimeout(() => setLine(1), 2600));
    t.push(setTimeout(() => setLine(2), 4600));
    t.push(setTimeout(() => setLine(3), 6600));
    t.push(setTimeout(() => setTextGone(true), 12700));
    t.push(setTimeout(() => setDrifting(true), 13800));
    t.push(
      setTimeout(() => {
        if (!doneRef.current && onComplete) {
          doneRef.current = true;
          onComplete();
        }
      }, 16200)
    );
    return () => t.forEach(clearTimeout);
  }, [onComplete]);

  const textStyle = (delay) => ({
    fontFamily: "'Libre Baskerville', serif",
    fontStyle: 'italic',
    color: '#3a2a24',
    textAlign: 'center',
    lineHeight: 1.55,
    opacity: line >= delay ? 1 : 0,
    transform: line >= delay ? 'translateY(0)' : 'translateY(18px)',
    transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.25, 1, 0.4, 1)',
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        overflow: 'hidden',
        background:
          'linear-gradient(160deg, #fdf6ed 0%, #f5ede0 50%, #f0e6d6 100%)',
        animation: 'fadeIn 0.9s ease',
      }}
    >
      <audio ref={audioRef} src="/music/Musika.mp3" loop preload="auto" />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          '--fall-end-px': 'calc(100vh - 30px)',
        }}
      >
        {dust.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${d.startPos}px`,
              left: `${d.left}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, rgba(255,240,190,0.85) 0%, rgba(255,205,100,0.5) 35%, rgba(240,180,60,0) 70%)',
              filter: 'blur(1.5px)',
              opacity: d.opacity,
              animation: `dustFall ${d.duration}s ${d.delay / 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      <HangingPolaroid
        src={PHOTOS.bgTL}
        w={88}
        h={118}
        rot={-8}
        top="7%"
        left="9%"
        strings={1}
        blur={2}
        opacity={0.3}
        swingDelay={0.7}
        drift="none"
        drifting={drifting}
      />
      <HangingPolaroid
        src={PHOTOS.bgTR}
        w={111}
        h={148}
        rot={10}
        top="10%"
        right="7%"
        strings={1}
        blur={2}
        opacity={0.3}
        swingDelay={1.1}
        drift="none"
        drifting={drifting}
      />
      <HangingPolaroid
        src={PHOTOS.bgTop}
        w={66}
        h={88}
        rot={-2}
        top="1.5%"
        left="50%"
        strings={1}
        blur={3}
        opacity={0.25}
        swingDelay={1.5}
        drift="none"
        drifting={drifting}
      />

      <HangingPolaroid
        src={PHOTOS.fgLeft}
        w={255}
        h={340}
        rot={-5}
        top="20%"
        left="5vw"
        strings={2}
        swingDelay={1.3}
        drift="driftLeft"
        drifting={drifting}
      />
      <HangingPolaroid
        src={PHOTOS.fgRight}
        w={220}
        h={292}
        rot={6}
        top="25%"
        right="6vw"
        strings={1}
        swingDelay={1.7}
        drift="driftRight"
        drifting={drifting}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 10vw',
          pointerEvents: 'none',
          transition: 'opacity 1.2s ease',
          opacity: textGone ? 0 : 1,
        }}
      >
        <h2 style={{ ...textStyle(1), fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)', maxWidth: '900px', marginBottom: '1.2rem' }}>
          I know this little update isn't anything grand, but...
        </h2>
        <h2 style={{ ...textStyle(2), fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)', maxWidth: '900px', marginBottom: '1.2rem' }}>
          I wanted to leave a few more pages for us.
        </h2>
        <p
          style={{
            ...textStyle(3),
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: '#7a6a64',
            maxWidth: '760px',
          }}
        >
          Because some memories deserve a place they'll never be forgotten.
        </p>
      </div>
    </div>
  );
}
