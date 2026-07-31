import React, { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  'Thank you for coming into my life.',
  'You made ordinary days feel a little brighter.',
  "I hope you always have a reason to smile.",
  "I'm quietly cheering for you, always.",
  "Take your time. I'll never rush you.",
  'You deserve every good thing life has to offer.',
];

const SENTENCES = [
  'Some people become special without even trying.',
  'You became one of my favorite people.',
  'Thank you for being you.',
];

const FINAL_MESSAGE = "No matter where life takes us, I'm grateful that our paths crossed.";

const GOLD = ['#fff7d6', '#ffe9a8', '#ffd76e', '#f5c445', '#e8a33d', '#f0b429'];

export default function HeartPage({ onClose }) {
  const audioRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [orbiting, setOrbiting] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [colliding, setColliding] = useState(false);
  const [activeSentence, setActiveSentence] = useState(0);
  const [calm, setCalm] = useState(false);
  const [burst, setBurst] = useState([]);

  const R = Math.min(240, Math.min(window.innerWidth, window.innerHeight) * 0.28);
  const K = Math.min(1, R / 240);
  const fixedPos = [
    [-200 * K, -135 * K],
    [200 * K, -135 * K],
    [-225 * K, 0],
    [225 * K, 0],
    [-200 * K, 135 * K],
    [200 * K, 135 * K],
  ];
  const circlePos = Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return [Math.cos(a) * R, Math.sin(a) * R];
  });

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.7;
    a.play().catch(() => {});
    return () => {
      a.pause();
      a.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const t = [];
    const msgStart = 2300;
    for (let i = 0; i < 6; i++) {
      t.push(setTimeout(() => setRevealedCount(i + 1), msgStart + i * 1600));
    }
    const seqStart = msgStart + 5 * 1600 + 6000;
    t.push(setTimeout(() => { setOrbiting(true); setActiveSentence(1); }, seqStart));
    t.push(setTimeout(() => setActiveSentence(2), seqStart + 3800));
    t.push(setTimeout(() => setActiveSentence(3), seqStart + 7600));
    t.push(setTimeout(() => setRotating(true), seqStart + 4800));
    t.push(
      setTimeout(() => {
        setColliding(true);
        setBurst(
          Array.from({ length: 30 }, (_, i) => ({
            id: i,
            dx: (Math.random() - 0.5) * 520,
            dy: (Math.random() - 0.5) * 520,
            dr: (Math.random() - 0.5) * 720,
            size: 4 + Math.random() * 10,
            color: GOLD[i % GOLD.length],
            delay: Math.random() * 0.25,
            duration: 0.8 + Math.random() * 0.6,
            round: Math.random() > 0.35,
          }))
        );
      }, seqStart + 9800)
    );
    t.push(setTimeout(() => { setActiveSentence(4); setCalm(true); }, seqStart + 11400));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        background: 'linear-gradient(160deg, #fdf6ed 0%, #f5ede0 50%, #f0e6d6 100%)',
        overflow: 'hidden',
        fontFamily: "'Cormorant Garamond', serif",
        animation: 'fadeIn 0.6s ease',
      }}
    >
      <audio ref={audioRef} src="/music/Musika.mp3" loop preload="auto" />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          '--fall-end-px': 'calc(100vh - 40px)',
        }}
      >
        {Array.from({ length: 70 }, (_, i) => {
          const size = 2 + ((i * 37) % 120) / 10;
          const blur = ((i * 13) % 25) / 10;
          const left = (i * 61) % 100;
          const startPos = -(((i * 89) % 300) + 40);
          const delay = (i * 17) % 100;
          const duration = 14 + ((i * 29) % 100) / 10;
          const opacity = 0.25 + ((i * 23) % 55) / 100;
          const brightness = 0.7 + ((i * 31) % 60) / 100;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${startPos}px`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, rgba(255,240,190,${0.9 * brightness}) 0%, rgba(255,205,100,${0.55 * brightness}) 35%, rgba(240,180,60,0) 70%)`,
                filter: `blur(${blur}px)`,
                opacity,
                animation: `dustFall ${duration}s ${delay / 10}s linear infinite`,
              }}
            />
          );
        })}
      </div>

      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '2rem',
          zIndex: 10,
          fontFamily: "'Cinzel', serif",
          fontSize: '1.5rem',
          color: 'var(--ink)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.3,
          transition: 'opacity 0.3s ease',
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.3)}
      >
        &#10005;
      </button>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ animation: 'heartRise 2s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
          <img
            src="/Adobe%20Express%20-%20file.png"
            alt=""
            draggable={false}
            style={{
              width: 'min(340px, 60vw)',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              animation: calm ? 'heartbeat 2.6s ease-in-out infinite' : 'heartbeat 1.6s ease-in-out infinite',
              filter: 'drop-shadow(0 12px 32px rgba(155,58,74,0.25))',
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          zIndex: 4,
          pointerEvents: 'none',
          animation: rotating ? 'orbitSpin 5s cubic-bezier(0.4, 0, 0.9, 0.6) forwards' : 'none',
        }}
      >
        {MESSAGES.map((msg, i) => {
          const target = colliding
            ? 'translate(0px, 0px) translate(-50%, -50%) scale(0.15)'
            : orbiting
              ? `translate(${circlePos[i][0]}px, ${circlePos[i][1]}px) translate(-50%, -50%)`
              : `translate(${fixedPos[i][0]}px, ${fixedPos[i][1]}px) translate(-50%, -50%)`;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                transform: target,
                transition: colliding
                  ? 'transform 0.7s cubic-bezier(0.6, 0, 0.9, 0.4), opacity 0.7s ease'
                  : orbiting
                    ? 'transform 4.8s cubic-bezier(0.45, 0, 0.2, 1)'
                    : 'none',
                opacity: colliding ? 0 : 1,
              }}
            >
              <div
                style={{
                  width: '180px',
                  textAlign: 'center',
                  opacity: revealedCount > i ? 1 : 0,
                  transform: revealedCount > i ? 'translateY(0)' : 'translateY(14px)',
                  transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 1, 0.4, 1)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    lineHeight: 1.5,
                    color: '#9b3a4a',
                    background: 'rgba(253,246,237,0.75)',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(26,10,8,0.06)',
                  }}
                >
                  {msg}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {colliding && (
        <>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '440px',
              height: '440px',
              marginLeft: '-220px',
              marginTop: '-220px',
              zIndex: 6,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,236,180,0.55) 40%, rgba(255,220,120,0) 70%)',
              animation: 'collisionFlash 1s ease-out both',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '380px',
              height: '380px',
              marginLeft: '-190px',
              marginTop: '-190px',
              zIndex: 5,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,240,190,0.7) 0%, rgba(240,180,60,0.25) 50%, rgba(240,180,60,0) 75%)',
              animation: 'collisionBloom 1.4s ease-out both',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '80px',
              height: '80px',
              marginLeft: '-40px',
              marginTop: '-40px',
              zIndex: 5,
              borderRadius: '50%',
              border: '3px solid rgba(255,225,140,0.9)',
              boxShadow: '0 0 24px rgba(255,215,110,0.8)',
              animation: 'shockwave 1.1s cubic-bezier(0.2, 0.6, 0.4, 1) both',
              pointerEvents: 'none',
            }}
          />
          {burst.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                borderRadius: p.round ? '50%' : '2px',
                boxShadow: '0 0 10px rgba(255,220,120,0.9)',
                zIndex: 6,
                animation: `confettiBurst ${p.duration}s ${p.delay}s ease-out both`,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                '--dr': `${p.dr}deg`,
              }}
            />
          ))}
        </>
      )}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% + 195px)',
          transform: 'translateX(-50%)',
          width: 'min(620px, 92vw)',
          textAlign: 'center',
          zIndex: 4,
          minHeight: '80px',
          padding: '2.8rem 2.4rem',
          borderRadius: '999px',
          display: 'grid',
          placeItems: 'center',
          background:
            'radial-gradient(ellipse 100% 100% at center, rgba(255,251,245,0.97) 0%, rgba(255,251,245,0.9) 55%, rgba(250,241,229,0.55) 85%, rgba(250,241,229,0) 100%)',
          boxShadow: '0 10px 40px rgba(155,58,74,0.05)',
          pointerEvents: 'none',
        }}
      >
        {SENTENCES.map((s, i) => (
          <p
            key={i}
            style={{
              gridArea: '1 / 1',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
              color: '#7a6a64',
              lineHeight: 1.7,
              opacity: activeSentence === i + 1 ? 1 : 0,
              transform: activeSentence === i + 1 ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}
          >
            {s}
          </p>
        ))}
        <p
          style={{
            gridArea: '1 / 1',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1.15rem, 2.6vw, 1.55rem)',
            color: 'var(--rose)',
            lineHeight: 1.7,
            opacity: activeSentence === 4 ? 1 : 0,
            transform: activeSentence === 4 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          {FINAL_MESSAGE}
        </p>
      </div>
    </div>
  );
}
