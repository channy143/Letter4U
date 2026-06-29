import React, { useEffect, useState, useRef } from 'react';
import { TopRoller, BottomRoller } from './Rollers';

const ROLLED_HEIGHT = 0;
const UNFURLED_HEIGHT = 600;

const petals = Array.from({ length: 6 }, () => ({
  top: Math.random() * 80 + 5 + '%',
  left: Math.random() * 80 + 5 + '%',
}));

export default function LetterModal({ onClose }) {
  const [phase, setPhase] = useState(0);
  const [parchmentHeight, setParchmentHeight] = useState(ROLLED_HEIGHT);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => {
        setPhase(2);
        setParchmentHeight(UNFURLED_HEIGHT);
      }, 900),
      setTimeout(() => setPhase(3), 1700),
    ];

    function handleKey(e) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
      timers.forEach(clearTimeout);
    };
  }, []);

  function handleClose() {
    if (closing) return;
    setClosing(true);
    setParchmentHeight(ROLLED_HEIGHT);
    setTimeout(onClose, 700);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(13,5,8,0.92)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={panelRef}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
        }}
      >
        <TopRoller />

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${parchmentHeight}px`,
            background:
              'linear-gradient(180deg, #f8f0e0 0%, #faf3e8 10%, #f5ede0 50%, #f0e8d8 90%, #e8ddc8 100%)',
            borderLeft: '2px solid #c8b8a0',
            borderRight: '2px solid #c8b8a0',
            overflow: 'hidden',
            transition: 'height 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'inset 0 0 50px rgba(138, 106, 74, 0.1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.08,
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 22px, #c8b8a0 22px, #c8b8a0 23px)',
              pointerEvents: 'none',
            }}
          />

          {phase >= 1 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at center, rgba(184,146,58,0.18) 0%, transparent 60%)',
                pointerEvents: 'none',
                transition: 'opacity 0.5s ease',
              }}
            />
          )}

          {phase < 1 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: '-26px',
                marginTop: '-26px',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #d45a5a, #8b2a3a 80%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                animation: 'sealAppear 0.4s ease forwards',
              }}
            >
              <span style={{ color: '#d4a040', fontSize: '1.3rem' }}>&#10038;</span>
            </div>
          )}

          {phase >= 1 && phase < 2 && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-26px',
                  marginTop: '-26px',
                  width: '26px',
                  height: '52px',
                  background: 'radial-gradient(circle at 0% 50%, #d45a5a, #8b2a3a 80%)',
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                  zIndex: 3,
                  animation: 'sealCrackLeft 0.5s ease forwards',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-26px',
                  width: '26px',
                  height: '52px',
                  background: 'radial-gradient(circle at 100% 50%, #d45a5a, #8b2a3a 80%)',
                  clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                  zIndex: 3,
                  animation: 'sealCrackRight 0.5s ease forwards',
                }}
              />
            </>
          )}

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '3rem 4rem',
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              pointerEvents: phase >= 3 ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '2.5rem',
                top: '3rem',
                bottom: '3rem',
                width: '1px',
                background: 'var(--blush)',
                opacity: 0.4,
              }}
            />

            {petals.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: p.top,
                  left: p.left,
                  width: '10px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--blush)',
                  opacity: 0.15,
                  pointerEvents: 'none',
                  transform: `rotate(${i * 30}deg)`,
                }}
              />
            ))}

            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.4rem',
                fontFamily: "'Cinzel', serif",
                fontSize: '1.2rem',
                color: 'var(--blush)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.3s ease, transform 0.3s ease',
                lineHeight: 1,
                zIndex: 5,
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--rose)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--blush)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              &#10005;
            </button>

            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                color: 'var(--gold)',
                textAlign: 'right',
                marginBottom: '2rem',
                letterSpacing: '0.1em',
              }}
            >
              June 1, 2026
            </p>

            <p
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: 'italic',
                fontSize: '1.6rem',
                color: 'var(--rose)',
                marginBottom: '1.5rem',
              }}
            >
              Dearest Kikay,
            </p>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '1.1rem',
                lineHeight: 2,
                color: 'var(--ink)',
                maxHeight: 'calc(90vh - 320px)',
                overflowY: 'auto',
              }}
              className="letter-panel"
            >
              <p style={{ marginBottom: '1.2rem', textIndent: '1.5rem' }}>
                We are not yet anything with a name, and I am not in any rush to
                give it one. Some things grow better in the quiet before they are
                spoken. But I will say this — in a world that has been loud, you
                are the first room that ever felt like quiet. I did not invite
                you in. You just walked through, and somehow, the noise stopped.
              </p>
              <p style={{ marginBottom: '1.2rem', textIndent: '1.5rem' }}>
                Thank you for saying you feel safe with me. I do not take that
                word lightly. You, who has carried so much alone, who has stood
                up after every fall — you chose to set something soft down. I want
                you to know I will not drop it. I will hold it the way you asked:
                gently, little by little, with the patience it deserves.
              </p>
              <p style={{ marginBottom: '1.2rem', textIndent: '1.5rem' }}>
                I am not a doctor. I am not a cure.{' '}
                <em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>
                  But I am the gentle. I am the slow.
                </em>{' '}
                I am the one who stays when the storm comes — and believe me, the
                storm comes. So I am not going anywhere. Take all the time you
                need — I'm not rushing either. The slow kind of love is the one
                that lasts.
              </p>
              <p style={{ marginBottom: '2.5rem', textIndent: '1.5rem' }}>
                And listen — I see you. Not the maldita the world sees, the one
                beneath. The one who said "heal me gently" and meant it. That is
                the strongest person I have ever known. You are still that
                strong, kikay. Maybe stronger now. And I will keep being the
                witness, every single day, until you remember it too.
              </p>
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '1.1rem',
                color: 'var(--ink)',
                marginBottom: '0.5rem',
                marginTop: '1rem',
              }}
            >
              Just here, kikay.
            </p>
            <p
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: 'italic',
                fontSize: '2rem',
                color: 'var(--rose)',
              }}
            >
              — C.
            </p>
          </div>
        </div>

        <BottomRoller />
      </div>

      <style>{`
        .letter-panel::-webkit-scrollbar {
          width: 4px;
        }
        .letter-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .letter-panel::-webkit-scrollbar-thumb {
          background: var(--blush);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
