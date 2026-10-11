import React, { useState, useEffect, useMemo } from 'react';
import ALL_PHOTOS from './allPhotos.json';

// Shuffle helper
function shuffleArray(arr, seed = 0) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor((Math.sin(seed + i) * 10000) % 1 * (i + 1) + (i + 1)) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function WhiteMemoriesPage({ onContinue, onPlayFoundYou }) {
  const [showContent, setShowContent] = useState(false);
  const [step, setStep] = useState(1);
  const [fadeVisible, setFadeVisible] = useState(true);

  // Track which images in the background marquees have appeared
  const [revealedKeys, setRevealedKeys] = useState(() => new Set());

  // Distribute all comprehensive project photos across 5 marquee rows
  const marqueeRows = useMemo(() => {
    const rows = [];
    // With 198 total images, distribute ~38-40 images per row
    const countPerRow = Math.ceil(ALL_PHOTOS.length / 5);
    for (let r = 0; r < 5; r++) {
      const slice = ALL_PHOTOS.slice(r * countPerRow, (r + 1) * countPerRow);
      const shuffled = shuffleArray(slice, r * 29 + 17);
      const items = shuffled.map((src, i) => ({
        id: `r${r}_i${i}`,
        src,
      }));
      rows.push(items);
    }
    return rows;
  }, []);

  // Stays purely white for 5 seconds, then reveals "Thinking back..." and starts photos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Slowly reveal images one by one across rows (gentle pace)
  useEffect(() => {
    if (!showContent) return;

    // Collect all unique keys
    const allKeys = [];
    marqueeRows.forEach((row) => {
      row.forEach((item) => allKeys.push(item.id));
    });

    // Shuffle the keys so photos appear randomly all over the 5 rows
    const shuffledKeys = [...allKeys].sort(() => Math.random() - 0.5);
    let index = 0;

    // Reveal one photo every 220ms for a faster, engaging build-up
    const interval = setInterval(() => {
      if (index >= shuffledKeys.length) {
        clearInterval(interval);
        return;
      }
      const nextKey = shuffledKeys[index];
      setRevealedKeys((prev) => {
        const next = new Set(prev);
        next.add(nextKey);
        return next;
      });
      index += 1;
    }, 220);

    return () => clearInterval(interval);
  }, [showContent, marqueeRows]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flyUpStarted, setFlyUpStarted] = useState(false);
  const [viewportPanUp, setViewportPanUp] = useState(false);

  // Generate stable random delays for each duplicated item so they lift off randomly
  const flyDelays = useMemo(() => {
    const map = {};
    marqueeRows.forEach((row) => {
      [...row, ...row].forEach((item, idx) => {
        const key = `${item.id}-${idx}`;
        // Random staggered delay between 0.05s and 1.6s
        const randomDelay = (Math.random() * 1.55 + 0.05).toFixed(2);
        // Duration: 1.1s to 1.45s with motion blur and acceleration
        const randomDuration = (Math.random() * 0.35 + 1.1).toFixed(2);
        map[key] = { delay: `${randomDelay}s`, duration: `${randomDuration}s` };
      });
    });
    return map;
  }, [marqueeRows]);

  function handleNext() {
    if (isTransitioning) return;

    // 1st continue clicked (step 1 -> step 2): play foundyou.mp3
    if (step === 1) {
      onPlayFoundYou?.();
    }

    if (step < 4) {
      setIsTransitioning(true);
      // Fade out only the central text, increment step, then fade in new text
      setFadeVisible(false);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setFadeVisible(true);
        setIsTransitioning(false);
      }, 500);
    } else {
      // 4th continue button clicked!
      // Step 1: Photos launch skyward with motion blur
      setIsTransitioning(true);
      setFlyUpStarted(true);

      // Step 2: Wait for photos to finish flying towards the top out of viewport (~2.8s)
      setTimeout(() => {
        // Step 3: Viewport pans upwards, leaving the text and continue button behind at the bottom
        setViewportPanUp(true);

        // Step 4: When viewport completes moving to the top, transition to the new 3D heart page
        setTimeout(() => {
          onContinue?.();
        }, 1500);
      }, 2700);
    }
  }

  return (
    <div
      className="no-scrollbar"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        animation: 'fadeIn 1.4s ease forwards',
      }}
    >
      {/* Container that pans down when viewport moves up, creating seamless camera pan */}
      <div
        style={{
          width: '100%',
          minHeight: '100%',
          transition: viewportPanUp
            ? 'transform 1.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.45s ease'
            : undefined,
          transform: viewportPanUp ? 'translateY(110vh)' : 'translateY(0)',
          opacity: viewportPanUp ? 0.05 : 1,
        }}
      >
      {/* ======================================================== */}
      {/* 5-ROW BACKGROUND MARQUEE OF MEMORY IMAGES                 */}
      {/* Row 1, 3, 5: move left | Row 2, 4: move right             */}
      {/* Positioned behind the airbrush circle and text (zIndex 5) */}
      {/* ======================================================== */}
      {showContent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '1.2vh 0',
            overflow: flyUpStarted ? 'visible' : 'hidden',
            opacity: 0.95,
            animation: 'fadeIn 2s ease forwards',
          }}
        >
          {marqueeRows.map((row, rowIndex) => {
            const isLeft = rowIndex % 2 === 0; // Row 0,2,4 -> Left, Row 1,3 -> Right
            const animName = isLeft ? 'whiteMarqueeLeft' : 'whiteMarqueeRight';
            // Slow, serene scroll speed (120s - 150s per loop)
            const duration = 120 + rowIndex * 8;

            return (
              <div
                key={rowIndex}
                style={{
                  width: '100%',
                  overflow: flyUpStarted ? 'visible' : 'hidden',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '14px',
                    animation: `${animName} ${duration}s linear infinite`,
                    willChange: 'transform',
                    flexShrink: 0,
                  }}
                >
                  {/* Duplicate twice to ensure seamless continuous looping */}
                  {[...row, ...row].map((item, idx) => {
                    const itemKey = `${item.id}-${idx}`;
                    const isVisible = revealedKeys.has(item.id);
                    const flyConfig = flyDelays[itemKey] || { delay: '0.2s', duration: '1.2s' };

                    return (
                      <div
                        key={itemKey}
                        style={{
                          width: 'clamp(115px, 11vw, 155px)',
                          height: 'clamp(145px, 14.5vh, 195px)',
                          flexShrink: 0,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#f4ede6',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.7)',
                          transition: flyUpStarted
                            ? undefined
                            : 'opacity 1.5s cubic-bezier(0.25, 1, 0.5, 1), transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
                          animation: flyUpStarted
                            ? `photoFlyUpWithMotionBlur ${flyConfig.duration} cubic-bezier(0.55, 0.05, 0.68, 0.19) ${flyConfig.delay} forwards`
                            : undefined,
                          opacity: flyUpStarted ? undefined : (isVisible ? 0.92 : 0),
                          transform: flyUpStarted ? undefined : (isVisible ? 'scale(1)' : 'scale(0.85)'),
                          willChange: flyUpStarted ? 'transform, opacity' : 'opacity, transform',
                          zIndex: flyUpStarted ? 15 : 1,
                        }}
                      >
                        <img
                          src={item.src}
                          alt="Memory"
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            filter: 'saturate(0.92) contrast(1.02)',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* IBISPAINT AIRBRUSH-STYLE WHITE FADE CIRCLE                */}
      {/* Enlarged & ultra-smooth multi-stop feathered falloff       */}
      {/* ======================================================== */}
      {showContent && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // Moderately larger to comfortably frame the text
            width: 'clamp(580px, 66vw, 840px)',
            height: 'clamp(580px, 66vw, 840px)',
            borderRadius: '50%',
            zIndex: 10,
            pointerEvents: 'none',
            // Ultra-smooth cosine/airbrush fade curve with 14 precise gradient stops
            background:
              'radial-gradient(circle at 50% 50%, ' +
              '#ffffff 0%, ' +
              '#ffffff 22%, ' +
              'rgba(255, 255, 255, 0.99) 30%, ' +
              'rgba(255, 255, 255, 0.96) 38%, ' +
              'rgba(255, 255, 255, 0.90) 46%, ' +
              'rgba(255, 255, 255, 0.80) 54%, ' +
              'rgba(255, 255, 255, 0.67) 62%, ' +
              'rgba(255, 255, 255, 0.52) 70%, ' +
              'rgba(255, 255, 255, 0.36) 78%, ' +
              'rgba(255, 255, 255, 0.22) 85%, ' +
              'rgba(255, 255, 255, 0.11) 91%, ' +
              'rgba(255, 255, 255, 0.04) 96%, ' +
              'rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(28px)',
          }}
        />
      )}

      {/* Secondary airbrush diffusion aura for seamless edge softening */}
      {showContent && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(520px, 58vw, 740px)',
            height: 'clamp(520px, 58vw, 740px)',
            borderRadius: '50%',
            zIndex: 11,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 50% 50%, ' +
              'rgba(255, 255, 255, 0.95) 0%, ' +
              'rgba(255, 255, 255, 0.90) 28%, ' +
              'rgba(255, 255, 255, 0.75) 48%, ' +
              'rgba(255, 255, 255, 0.45) 68%, ' +
              'rgba(255, 255, 255, 0.15) 86%, ' +
              'rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(45px)',
          }}
        />
      )}

      {/* Pure crisp white center directly anchoring the text readability */}
      {showContent && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(400px, 46vw, 560px)',
            height: 'clamp(400px, 46vw, 560px)',
            borderRadius: '50%',
            zIndex: 12,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 50% 50%, #ffffff 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0) 100%)',
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* ======================================================== */}
      {/* FOREGROUND CONTENT & NARRATIVE (zIndex 20)                */}
      {/* ======================================================== */}
      {showContent && (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.8rem 5.5rem 1.8rem',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 20,
            animation: 'fadeIn 1.2s ease forwards',
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              textAlign: 'center',
              color: '#1a0a08',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: fadeVisible ? 1 : 0,
              transform: fadeVisible ? 'translateY(0)' : 'translateY(14px)',
            }}
          >
            {/* STEP 1: Just "Thinking back..." */}
            {step === 1 && (
              <div
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                  fontWeight: 400,
                  color: '#1a0a08',
                  letterSpacing: '0.02em',
                  lineHeight: 1.5,
                }}
              >
                Thinking back...
              </div>
            )}

            {/* STEP 2: The collection of moments reflection */}
            {step === 2 && (
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(0.95rem, 1.35vw, 1.12rem)',
                  lineHeight: 1.8,
                  fontWeight: 400,
                  color: '#261418',
                }}
              >
                <p style={{ marginBottom: '1.2rem' }}>
                  We've already collected quite a few moments here, haven't we?
                </p>

                <p style={{ marginBottom: '1.2rem' }}>
                  From the random dates, the little trips, the awkward conversations, the pictures, the laughs, and even the moments that didn't go exactly as planned.
                </p>

                <p style={{ marginBottom: '0.4rem' }}>
                  Some of them were simple.
                </p>
                <p style={{ marginBottom: '0.4rem' }}>
                  Some of them were unexpected.
                </p>
                <p style={{ marginBottom: '1.3rem' }}>
                  And some of them became memories I didn't know I'd end up cherishing this much.
                </p>

                <p style={{ marginBottom: '1.1rem' }}>
                  But when I look back at all of them...
                </p>

                <p style={{ fontStyle: 'italic', color: '#1a0a08', fontWeight: 500 }}>
                  There's one moment that still feels a little different.
                </p>
              </div>
            )}

            {/* STEP 3: "Because before all these memories happened..." */}
            {step === 3 && (
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(0.98rem, 1.4vw, 1.15rem)',
                  lineHeight: 1.85,
                  fontWeight: 400,
                  color: '#261418',
                }}
              >
                <p style={{ marginBottom: '1.3rem' }}>
                  Because before all these memories happened...
                </p>

                <p style={{ marginBottom: '1.3rem', fontStyle: 'italic', fontWeight: 500, color: '#1a0a08' }}>
                  There was a moment that changed what we were.
                </p>

                <p style={{ marginBottom: '1.3rem' }}>
                  A moment that turned all the waiting, the uncertainty, and everything we had been building toward into something real.
                </p>

                <p style={{ marginBottom: '1.2rem' }}>
                  And honestly...
                </p>

                <p style={{ fontStyle: 'italic', color: '#1a0a08' }}>
                  I don't think I'll ever forget how I felt that night.
                </p>
              </div>
            )}

            {/* STEP 4: "So... The day you said yes." */}
            {step === 4 && (
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(0.98rem, 1.4vw, 1.15rem)',
                  lineHeight: 1.85,
                  fontWeight: 400,
                  color: '#261418',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.35rem, 2.1vw, 1.7rem)',
                    fontWeight: 400,
                    color: '#1a0a08',
                    marginBottom: '1.3rem',
                  }}
                >
                  So...
                </h2>

                <p style={{ marginBottom: '1.2rem' }}>
                  Before we continue with everything that came after,
                </p>

                <p style={{ marginBottom: '1.2rem' }}>
                  let's go back to where this chapter really began.
                </p>

                <p style={{ marginBottom: '1.4rem' }}>
                  The night you finally gave me the answer I'd been waiting for.
                </p>

                <p
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: 'clamp(1.1rem, 1.7vw, 1.35rem)',
                    fontWeight: 700,
                    color: 'var(--rose, #9b3a4a)',
                    marginTop: '1.2rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  The day you said yes. ❤️
                </p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div
            style={{
              position: 'fixed',
              bottom: '2.5rem',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 30,
            }}
          >
            <button
              onClick={handleNext}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--rose, #9b3a4a)',
                border: '1px solid var(--rose, #9b3a4a)',
                padding: '0.9rem 2.8rem',
                cursor: 'pointer',
                borderRadius: '2px',
                boxShadow: '0 6px 24px rgba(155, 58, 74, 0.28)',
                transition: 'all 0.35s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b84758';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 32px rgba(155, 58, 74, 0.42)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--rose, #9b3a4a)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(155, 58, 74, 0.28)';
              }}
            >
              Continue &rarr;
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
