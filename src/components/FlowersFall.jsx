import React, { useState, useEffect, useRef } from 'react';

const IMAGES = ['/flowers/1.png', '/flowers/2.png', '/flowers/3.png', '/flowers/4.png'];
const COUNT = 600;

const flowerData = Array.from({ length: COUNT }, (_, i) => ({
  src: IMAGES[i % IMAGES.length],
  size: 80 + Math.random() * 70,
  startPos: -(Math.random() * 200),
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 3 + Math.random() * 3,
}));

export default function FlowersFall({ onFalling, onReveal }) {
  const [phase, setPhase] = useState('waiting');
  const containerRef = useRef(null);
  const [fallEnd, setFallEnd] = useState('calc(100vh - 50px)');

  // Measure parent height during waiting phase (before animation starts)
  useEffect(() => {
    if (phase !== 'waiting') return;
    const t = setTimeout(() => {
      const parent = containerRef.current?.parentElement;
      if (parent) {
        const ph = parent.scrollHeight;
        if (ph > window.innerHeight + 50) {
          setFallEnd(`${ph - 50}px`);
        }
      }
    }, 100);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    const t = setTimeout(() => setPhase('falling'), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'falling') return;
    onFalling?.();
    const t = setTimeout(() => setPhase('revealed'), 10000);
    return () => clearTimeout(t);
  }, [phase, onFalling]);

  useEffect(() => {
    if (phase !== 'revealed') return;
    onReveal?.();
  }, [phase, onReveal]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 20,
        pointerEvents: 'none',
        overflow: 'hidden',
        '--fall-end-px': fallEnd,
        opacity: phase === 'waiting' ? 0 : 1,
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {flowerData.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${f.startPos}px`,
              left: `${f.left}%`,
              width: `${f.size}px`,
              opacity: 1,
              marginLeft: `-${f.size / 2}px`,
              animation: phase === 'waiting' ? 'none' : `flowerFall ${f.duration}s ${f.delay}s ease-in forwards`,
              zIndex: 20,
            }}
          >
            <img
              src={f.src}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: 'auto',
                transform: `rotate(${Math.random() * 360}deg)`,
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}