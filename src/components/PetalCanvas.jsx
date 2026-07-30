import React, { useRef, useEffect } from 'react';

export default function PetalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let petals = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createPetal() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: 6 + Math.random() * 8,
        speed: 0.6 + Math.random() * 1.0,
        drift: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        opacity: 0.2 + Math.random() * 0.3,
        hue: 340 + Math.random() * 20,
      };
    }

    function init() {
      resize();
      petals = Array.from({ length: 18 }, createPetal);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of petals) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `hsl(${p.hue}, 60%, 60%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;

        if (p.y > canvas.height + p.size) {
          p.y = -p.size;
          p.x = Math.random() * canvas.width;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
