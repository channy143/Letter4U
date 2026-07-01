import React, { useRef, useState, useEffect } from 'react';

export default function MusicPlayer({ externalPauseTrigger, externalResumeTrigger }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.7;
    const tryPlay = async () => {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setShowHint(true);
      }
    };
    tryPlay();
    return () => {
      a.pause();
    };
  }, []);

  useEffect(() => {
    if (!externalPauseTrigger) return;
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    setPlaying(false);
  }, [externalPauseTrigger]);

  useEffect(() => {
    if (!externalResumeTrigger) return;
    const a = audioRef.current;
    if (!a) return;
    a.play().catch(() => {});
    setPlaying(true);
  }, [externalResumeTrigger]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
      setShowHint(false);
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/song.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed',
          bottom: '1.4rem',
          right: '1.4rem',
          zIndex: 999,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(13,5,8,0.7)',
          border: '1px solid rgba(184,146,58,0.4)',
          color: 'rgba(245,237,224,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          transition: 'all 0.3s ease',
          boxShadow: playing
            ? '0 0 18px rgba(184,146,58,0.35)'
            : '0 2px 10px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(184,146,58,0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(184,146,58,0.4)';
        }}
      >
        {playing ? (
          <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
            <rect x="1" y="2" width="4" height="12" rx="0.5" />
            <rect x="9" y="2" width="4" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
            <path d="M2 1.5 L13 8 L2 14.5 Z" />
          </svg>
        )}
      </button>
      {showHint && !playing && (
        <div
          style={{
            position: 'fixed',
            bottom: '4.5rem',
            right: '1.4rem',
            zIndex: 999,
            padding: '0.5rem 0.9rem',
            background: 'rgba(13,5,8,0.85)',
            color: 'rgba(245,237,224,0.85)',
            fontFamily: "'Cinzel', serif",
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            border: '1px solid rgba(184,146,58,0.3)',
            borderRadius: '6px',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.4s ease',
            whiteSpace: 'nowrap',
          }}
        >
          tap to play music
        </div>
      )}
    </>
  );
}
