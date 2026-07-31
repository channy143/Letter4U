import React, { useState, useRef, useEffect } from 'react';

export default function BoothStage({
  isCreator,
  roomId,
  localStream,
  remoteStream,
  roomState,
  onTakePhoto,
  onRetake,
  onCheck,
  onLeave,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const round = roomState.round;
  const complete = roomState.status === 'complete' || round > 3;
  const mySlot = isCreator ? roomState.creator : roomState.joiner;
  const partnerSlot = isCreator ? roomState.joiner : roomState.creator;

  function capturePhoto() {
    if (capturing) return;
    if (localStream) {
      setCapturing(true);
      const video = document.createElement('video');
      video.srcObject = localStream;
      video.play().catch(() => {});
      setTimeout(() => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          ctx.scale(-1, 1);
          ctx.drawImage(video, -640, 0, 640, 480);
          onTakePhoto(canvas.toDataURL('image/jpeg', 0.85));
        } finally {
          video.pause();
          video.srcObject = null;
          setCapturing(false);
        }
      }, 200);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      const hue = (round * 120 + Math.random() * 60) % 360;
      const grad = ctx.createRadialGradient(160, 120, 10, 160, 120, 160);
      grad.addColorStop(0, `hsl(${hue}, 60%, 70%)`);
      grad.addColorStop(1, `hsl(${hue}, 50%, 40%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 240);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = "italic 22px 'Cormorant Garamond', serif";
      ctx.textAlign = 'center';
      ctx.fillText('Round ' + round, 160, 125);
      onTakePhoto(canvas.toDataURL('image/png'));
    }
  }

  function handleDownload() {
    const canvas = document.createElement('canvas');
    const imgW = 200;
    const imgH = 150;
    const gap = 6;
    const pad = 30;
    const rows = roomState.strip.length;
    const cw = imgW * 2 + gap + pad * 2;
    const ch = rows * (imgH + gap) + pad * 2 - gap;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5ede0';
    ctx.fillRect(0, 0, cw, ch);

    let loaded = 0;
    const total = rows * 2;
    roomState.strip.forEach((slot, row) => {
      const y = pad + row * (imgH + gap);
      [slot.creator, slot.joiner].forEach((src, col) => {
        if (!src) { loaded++; return; }
        const x = pad + col * (imgW + gap);
        const img = new Image();
        img.onload = () => {
          ctx.shadowColor = 'rgba(0,0,0,0.1)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.roundRect(x - 1, y - 1, imgW + 2, imgH + 2, 4);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.drawImage(img, x, y, imgW, imgH);
          loaded++;
          if (loaded >= total) {
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'photobooth-strip.png';
            a.click();
          }
        };
        img.onerror = () => { loaded++; };
        img.src = src;
      });
    });
  }

  const cameraSlots = [
    { key: 'you', label: 'You', stream: localStream, videoRef: localVideoRef, mirror: true, slot: mySlot },
    { key: 'partner', label: 'Partner', stream: remoteStream, videoRef: remoteVideoRef, mirror: false, slot: partnerSlot },
  ];

  if (complete) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, background: '#0d0508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'auto' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8923a', marginBottom: '0.8rem' }}>
          &#10038; &nbsp; your photo strip &nbsp; &#10038;
        </p>
        <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Your Photos
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', background: '#f5ede0', borderRadius: '12px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', marginBottom: '1.5rem' }}>
          {roomState.strip.map((slot, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '160px', height: '120px', overflow: 'hidden', borderRadius: '6px', border: '6px solid #fff' }}>
                <img src={slot.creator} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ width: '160px', height: '120px', overflow: 'hidden', borderRadius: '6px', border: '6px solid #fff' }}>
                <img src={slot.joiner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleDownload} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9b3a4a', background: 'transparent', border: '1px solid #9b3a4a', padding: '0.75rem 2rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#9b3a4a'; e.currentTarget.style.color = '#f5ede0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9b3a4a'; }}>
            Download Strip
          </button>
          <button onClick={onLeave} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', background: 'transparent', border: '1px solid', padding: '0.75rem 2rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, background: '#0d0508', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#b8923a' }}>
            Room: {roomId} &mdash; Round {round}/3
          </span>
        </div>
        <button onClick={onLeave} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '0.4rem 1rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#9b3a4a'; e.currentTarget.style.borderColor = '#9b3a4a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
          Leave
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '1.5rem', padding: '1.5rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', flexShrink: 0 }}>
          {[0, 1, 2].map((i) => {
            const saved = roomState.strip[i];
            const isCurrent = round <= 3 && i === round - 1;
            const isPast = !!saved;
            return (
              <div
                key={i}
                style={{
                  display: 'flex', flexDirection: 'column', gap: '4px',
                  padding: '6px',
                  borderRadius: '8px',
                  border: isCurrent ? '2px solid #b8923a' : isPast ? '2px solid rgba(255,255,255,0.15)' : '2px dashed rgba(255,255,255,0.1)',
                  background: isCurrent ? 'rgba(184,146,58,0.08)' : 'transparent',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{
                    width: '90px', height: '68px', borderRadius: '4px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                  }}>
                    {saved ? (
                      <img src={saved.creator} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>Creator</span>
                    )}
                  </div>
                  <div style={{
                    width: '90px', height: '68px', borderRadius: '4px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                  }}>
                    {saved ? (
                      <img src={saved.joiner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>Joiner</span>
                    )}
                  </div>
                </div>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.4rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: isCurrent ? '#b8923a' : isPast ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  {saved ? 'Done' : isCurrent ? 'Current' : `Slot ${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '640px', justifyContent: 'center' }}>
            {cameraSlots.map((s) => (
              <div key={s.key} style={{ flex: 1, aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: '#1a0a08', border: s.slot.preview ? '2px solid rgba(184,146,58,0.4)' : '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, fontFamily: "'Cinzel', serif", fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '4px' }}>
                  {s.label}
                </div>
                {s.slot.preview ? (
                  <img src={s.slot.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : s.stream ? (
                  <video ref={s.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: s.mirror ? 'scaleX(-1)' : 'none', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: s.key === 'partner' ? '1.5rem' : '2rem', opacity: 0.2 }}>
                      {s.key === 'partner' ? '\u{1F464}' : '\u{1F4F7}'}
                    </span>
                    {s.key === 'partner' && (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>Awaiting video...</span>
                    )}
                  </div>
                )}
                {s.slot.confirmed && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 4, width: '28px', height: '28px', borderRadius: '50%', background: '#4caf50', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                    <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>&#10003;</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', minHeight: '120px' }}>
            {mySlot.preview ? (
              <>
                <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
                  <button onClick={onRetake} disabled={mySlot.confirmed} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: mySlot.confirmed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)', padding: '0.8rem 1.8rem', cursor: mySlot.confirmed ? 'default' : 'pointer', borderRadius: '8px', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { if (!mySlot.confirmed) { e.currentTarget.style.borderColor = '#ff5252'; e.currentTarget.style.color = '#ff5252'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = mySlot.confirmed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'; }}>
                    &#x21BB; Retry
                  </button>
                  <button onClick={onCheck} disabled={mySlot.confirmed} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: mySlot.confirmed ? 'rgba(76,175,80,0.2)' : '#4caf50', border: 'none', color: '#fff', padding: '0.8rem 1.8rem', cursor: mySlot.confirmed ? 'default' : 'pointer', borderRadius: '8px', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(76,175,80,0.3)' }}
                    onMouseEnter={(e) => { if (!mySlot.confirmed) { e.currentTarget.style.background = '#66bb6a'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = mySlot.confirmed ? 'rgba(76,175,80,0.2)' : '#4caf50'; e.currentTarget.style.transform = 'none'; }}>
                    {mySlot.confirmed ? '\u2713 Confirmed' : '\u2713 Check'}
                  </button>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: mySlot.confirmed ? '#4caf50' : 'rgba(255,255,255,0.3)' }}>
                  {mySlot.confirmed ? '\u2713 Your photo is confirmed' : 'Happy with your photo? Press Check.'}
                </p>
              </>
            ) : (
              <>
                <button onClick={capturePhoto} disabled={capturing} style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)', cursor: capturing ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease, border-color 0.2s ease', boxShadow: '0 0 24px rgba(255,255,255,0.1)' }}
                  onMouseEnter={(e) => { if (!capturing) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = 'var(--rose)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fff' }} />
                </button>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                  {capturing ? 'Capturing...' : 'Take Photo'}
                </p>
              </>
            )}
          </div>

          <div style={{ minHeight: '2.2rem', textAlign: 'center' }}>
            {mySlot.confirmed && partnerSlot.confirmed && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.95rem', color: '#4caf50' }}>
                &#10003; Both photos confirmed &mdash; saving to your strip...
              </p>
            )}
            {mySlot.confirmed && !partnerSlot.confirmed && partnerSlot.preview && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                You confirmed your photo. Waiting for partner to check...
              </p>
            )}
            {!mySlot.confirmed && partnerSlot.confirmed && mySlot.preview && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                Partner confirmed their photo. Press Check when you're ready.
              </p>
            )}
            {mySlot.preview && partnerSlot.preview && !mySlot.confirmed && !partnerSlot.confirmed && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                Both previews are ready. Check yours when you're happy.
              </p>
            )}
            {!mySlot.preview && partnerSlot.preview && !partnerSlot.confirmed && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                Partner captured their photo and is waiting for you.
              </p>
            )}
            {mySlot.preview && !mySlot.confirmed && !partnerSlot.preview && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                You captured your photo. Waiting for partner to take theirs...
              </p>
            )}
            {!mySlot.preview && !partnerSlot.preview && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>
                Both cameras are live. Take your photos together.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
