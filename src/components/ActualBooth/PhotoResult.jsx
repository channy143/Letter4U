import React, { useEffect, useRef } from 'react';

const btnBase = {
  fontFamily: "'Cinzel', serif",
  fontSize: '0.65rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#9b3a4a',
  background: 'transparent',
  border: '1px solid #9b3a4a',
  padding: '0.75rem 2rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

export default function PhotoResult({ yourPhoto, partnerPhoto, onBackToBooth }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!yourPhoto || !partnerPhoto) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img1 = new Image();
    const img2 = new Image();
    let loaded = 0;

    function draw() {
      const w = 600;
      const h = Math.round((w / 2) * (4 / 3));
      canvas.width = w;
      canvas.height = h;

      ctx.fillStyle = '#f5ede0';
      ctx.fillRect(0, 0, w, h);

      const margin = 8;
      const halfW = (w - margin * 3) / 2;
      const imgH = h - margin * 2;

      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(margin, margin, halfW, imgH, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(margin * 2 + halfW, margin, halfW, imgH, 4);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(margin, margin, halfW, imgH, 2);
      ctx.clip();
      ctx.drawImage(img1, margin, margin, halfW, imgH);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(margin * 2 + halfW, margin, halfW, imgH, 2);
      ctx.clip();
      ctx.drawImage(img2, margin * 2 + halfW, margin, halfW, imgH);
      ctx.restore();

      ctx.fillStyle = '#1a0a08';
      ctx.font = "italic 14px 'Cormorant Garamond', serif";
      ctx.textAlign = 'center';
      ctx.fillText('You', margin + halfW / 2, h - margin + 20);
      ctx.fillText('Partner', margin * 2 + halfW + halfW / 2, h - margin + 20);

      ctx.fillStyle = 'rgba(184,146,58,0.3)';
      ctx.font = "10px 'Cinzel', serif";
      ctx.textAlign = 'center';
      ctx.fillText('✦', w / 2, margin + 16);
    }

    img1.onload = () => {
      loaded++;
      if (loaded === 2) draw();
    };
    img2.onload = () => {
      loaded++;
      if (loaded === 2) draw();
    };
    img1.src = yourPhoto;
    img2.src = partnerPhoto;
  }, [yourPhoto, partnerPhoto]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'photobooth-moment.png';
    a.click();
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        background: '#0d0508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'auto',
      }}
    >
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.55rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#b8923a',
          marginBottom: '0.8rem',
        }}
      >
        &#10038; &nbsp; your memories &nbsp; &#10038;
      </p>

      <h1
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        A Moment Together
      </h1>

      <div
        style={{
          background: '#f5ede0',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          marginBottom: '1.5rem',
          maxWidth: '90vw',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleDownload}
          style={btnBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#9b3a4a';
            e.currentTarget.style.color = '#f5ede0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#9b3a4a';
          }}
        >
          Download Photo
        </button>
        <button
          onClick={onBackToBooth}
          style={{
            ...btnBase,
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          Take Another
        </button>
      </div>
    </div>
  );
}
