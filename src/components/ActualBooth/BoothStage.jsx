import React, { useState, useRef, useEffect } from 'react';

export default function BoothStage({
  roomId,
  localStream,
  remoteStream,
  stageIndex,
  myPhoto,
  myPhotoSubmitted,
  myPhotoApproved,
  partnerPhoto,
  partnerPhotoSubmitted,
  partnerPhotoApproved,
  stripPhotos,
  stageComplete,
  onCaptureMyPhoto,
  onSubmitMyPhoto,
  onRetakeMyPhoto,
  onApprovePartnerPhoto,
  onRequestPartnerRetake,
  onNextStage,
  onLeave,
}) {
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [viewResult, setViewResult] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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

  useEffect(() => {
    setPendingPhoto(null);
  }, [stageIndex]);

  function capturePhoto() {
    if (localStream) {
      const video = document.createElement('video');
      video.srcObject = localStream;
      video.play();
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.scale(-1, 1);
        ctx.drawImage(video, -640, 0, 640, 480);
        video.pause();
        video.srcObject = null;
        const data = canvas.toDataURL('image/jpeg', 0.85);
        setPendingPhoto(data);
        onCaptureMyPhoto(data);
      }, 200);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      const hue = (stageIndex * 120 + Math.random() * 60) % 360;
      const grad = ctx.createRadialGradient(160, 120, 10, 160, 120, 160);
      grad.addColorStop(0, `hsl(${hue}, 60%, 70%)`);
      grad.addColorStop(1, `hsl(${hue}, 50%, 40%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 240);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = "italic 22px 'Cormorant Garamond', serif";
      ctx.textAlign = 'center';
      ctx.fillText('Stage ' + (stageIndex + 1), 160, 125);
      const data = canvas.toDataURL('image/png');
      setPendingPhoto(data);
      onCaptureMyPhoto(data);
    }
  }

  function submitPhoto() {
    setPendingPhoto(null);
    onSubmitMyPhoto();
  }

  function retryPhoto() {
    setPendingPhoto(null);
    onRetakeMyPhoto();
  }

  function getCurrentStagePhoto() {
    if (stripPhotos.length > stageIndex) {
      return stripPhotos[stageIndex];
    }
    return null;
  }

  function handleDownload() {
    const canvas = document.createElement('canvas');
    const imgW = 200;
    const imgH = 150;
    const gap = 6;
    const pad = 30;
    const rows = stripPhotos.length;
    const cw = imgW * 2 + gap + pad * 2;
    const ch = rows * (imgH + gap) + pad * 2 - gap;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5ede0';
    ctx.fillRect(0, 0, cw, ch);

    let loaded = 0;
    const total = rows * 2;
    stripPhotos.forEach((slot, row) => {
      const y = pad + row * (imgH + gap);
      [slot.me, slot.partner].forEach((src, col) => {
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

  useEffect(() => {
    if (stageIndex >= 3) {
      setViewResult(true);
    }
  }, [stageIndex]);

  const cameraDisabled = !localStream;
  const canCapture = !myPhoto && !myPhotoSubmitted && !stageComplete;
  const showCaptureBtn = canCapture && !pendingPhoto;

  const myFeedFrozen = myPhoto;

  if (viewResult) {
    const allSlots = [...stripPhotos];
    if (myPhoto && partnerPhoto && !stageComplete) {
      allSlots.push({ me: myPhoto, partner: partnerPhoto });
    }
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, background: '#0d0508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'auto' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8923a', marginBottom: '0.8rem' }}>
          &#10038; &nbsp; your photo strip &nbsp; &#10038;
        </p>
        <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Your Photos
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', background: '#f5ede0', borderRadius: '12px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', marginBottom: '1.5rem' }}>
          {allSlots.map((slot, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '160px', height: '120px', overflow: 'hidden', borderRadius: '6px', border: '6px solid #fff' }}>
                <img src={slot.me} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ width: '160px', height: '120px', overflow: 'hidden', borderRadius: '6px', border: '6px solid #fff' }}>
                <img src={slot.partner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
            Room: {roomId} &mdash; Stage {stageIndex + 1}/3
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
            const slot = stripPhotos[i];
            const isCurrent = i === stageIndex;
            const isPast = i < stageIndex;
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
                    {slot ? (
                      <img src={slot.me} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>You</span>
                    )}
                  </div>
                  <div style={{
                    width: '90px', height: '68px', borderRadius: '4px', overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                  }}>
                    {slot ? (
                      <img src={slot.partner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>Partner</span>
                    )}
                  </div>
                </div>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.4rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: isCurrent ? '#b8923a' : isPast ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  {slot ? 'Done' : isCurrent ? 'Current' : `Slot ${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
          {!pendingPhoto && (
            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
              <div style={{ flex: 1, aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: '#1a0a08', border: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, fontFamily: "'Cinzel', serif", fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '4px' }}>You</div>
                {myFeedFrozen ? (
                  <img src={myPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : localStream ? (
                  <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.2 }}>&#x1F4F7;</span>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: '#1a0a08', border: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, fontFamily: "'Cinzel', serif", fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '4px' }}>Partner</div>
                {partnerPhotoSubmitted ? (
                  <img src={partnerPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : remoteStream ? (
                  <video ref={remoteVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '1.5rem', opacity: 0.2 }}>&#x1F464;</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>Awaiting video...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {pendingPhoto && (
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '520px' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', background: '#1a0a08' }}>
                <img src={pendingPhoto} alt="captured" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={retryPhoto} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.6)', padding: '0.8rem 1.8rem', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                  &#x21BB; Retry
                </button>
                <button onClick={submitPhoto} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: 'var(--rose)', border: 'none', color: '#fff', padding: '0.8rem 1.8rem', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(155,58,74,0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#b44a5a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--rose)'; e.currentTarget.style.transform = 'none'; }}>
                  Send to Partner
                </button>
              </div>
            </div>
          )}

          {showCaptureBtn && (
            <>
              <button onClick={capturePhoto} disabled={!canCapture} style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '4px solid rgba(255,255,255,0.4)', cursor: canCapture ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease, border-color 0.2s ease', boxShadow: '0 0 24px rgba(255,255,255,0.1)', opacity: canCapture ? 1 : 0.3 }}
                onMouseEnter={(e) => { if (canCapture) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = 'var(--rose)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fff' }} />
              </button>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>Tap the circle to take a photo</p>
            </>
          )}

          {partnerPhotoSubmitted && !partnerPhotoApproved && myPhotoSubmitted && !pendingPhoto && !stageComplete && (
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '520px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                Partner sent you a photo:
              </p>
              <div style={{ width: '100%', maxWidth: '340px', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', background: '#1a0a08', margin: '0 auto' }}>
                <img src={partnerPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '0.8rem 0' }}>
                Do you approve this photo?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={onRequestPartnerRetake} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.6)', padding: '0.7rem 1.5rem', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff5252'; e.currentTarget.style.color = '#ff5252'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                  Request Retake
                </button>
                <button onClick={onApprovePartnerPhoto} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', background: '#4caf50', border: 'none', color: '#fff', padding: '0.7rem 1.5rem', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(76,175,80,0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#66bb6a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#4caf50'; e.currentTarget.style.transform = 'none'; }}>
                  &#10003; Approve
                </button>
              </div>
            </div>
          )}

          {myPhotoSubmitted && !partnerPhotoSubmitted && !stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(184,146,58,0.4)', borderTopColor: '#b8923a', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>Photo sent to partner!</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Waiting for partner to take their photo...</p>
            </div>
          )}

          {partnerPhotoSubmitted && !myPhotoSubmitted && !pendingPhoto && !stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                Partner has submitted their photo. Submit yours to continue.
              </p>
            </div>
          )}

          {partnerPhotoApproved && !myPhotoSubmitted && !stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#4caf50' }}>
                &#10003; You approved partner's photo!
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
                Take your photo to continue.
              </p>
            </div>
          )}

          {myPhotoApproved && !partnerPhotoSubmitted && !stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#4caf50' }}>
                &#10003; Partner approved your photo!
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>
                Waiting for partner to take their photo...
              </p>
            </div>
          )}

          {myPhotoSubmitted && partnerPhotoSubmitted && partnerPhotoApproved && !myPhotoApproved && !stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                Both photos submitted. Waiting for partner to approve yours...
              </p>
            </div>
          )}

          {myPhotoSubmitted && partnerPhotoSubmitted && myPhotoApproved && !partnerPhotoApproved && !stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                Waiting for you to approve partner's photo...
              </p>
            </div>
          )}

          {stageComplete && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(76,175,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ fontSize: '2.5rem', color: '#4caf50' }}>&#10003;</span>
              </div>
              <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem' }}>
                Stage {stageIndex + 1} Complete!
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
                {stageIndex < 2 ? 'Ready for the next stage?' : 'All photos captured!'}
              </p>
              <button onClick={onNextStage} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: 'var(--rose)', border: 'none', color: '#fff', padding: '0.9rem 2.5rem', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(155,58,74,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#b44a5a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--rose)'; e.currentTarget.style.transform = 'none'; }}>
                {stageIndex < 2 ? 'Next Stage \u2192' : 'View Strip \u2192'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}