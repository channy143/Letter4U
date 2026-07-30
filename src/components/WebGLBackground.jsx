import React, { useRef, useEffect } from 'react';

const SPARKLE_COUNT = 80;

function makeSparkle(i) {
  const seed = i * 13.7;
  const hash = (n) => {
    const x = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    x: hash(seed + 1),
    y: hash(seed + 2),
    r: 2 + hash(seed + 3) * 8,
    bright: 0.4 + hash(seed + 4) * 0.6,
    spd: 0.01 + hash(seed + 5) * 0.04,
    phase: hash(seed + 6) * Math.PI * 2,
    driftX: (hash(seed + 7) - 0.5) * 0.04,
    driftY: (hash(seed + 8) - 0.5) * 0.04,
    twinkleSpd: 0.5 + hash(seed + 9) * 2,
    twinkleOff: hash(seed + 10) * Math.PI * 2,
  };
}

export default function WebGLBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => makeSparkle(i));

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let animId;
    let start = performance.now();

    function draw() {
      const t = (performance.now() - start) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (const s of sparkles) {
        const px = (0.05 + s.x * 0.9) * w;
        const py = 0.05 + s.y * 0.9 * h;
        const dx = Math.sin(t * s.spd + s.phase) * s.driftX * w;
        const dy = Math.cos(t * s.spd * 0.7 + s.phase * 1.3) * s.driftY * h;

        const cx = px + dx;
        const cy = py + dy;

        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpd + s.twinkleOff);
        const alpha = s.bright * twinkle;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s.r);
        grad.addColorStop(0, `rgba(255, 230, 120, ${alpha})`);
        grad.addColorStop(0.3, `rgba(255, 210, 80, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255, 200, 80, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
