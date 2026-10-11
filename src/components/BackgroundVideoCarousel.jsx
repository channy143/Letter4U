import React, { useState, useEffect, useRef } from 'react';

const BACKGROUND_VIDEOS = [
  '/video/New folder/13c50998-ed55-4f80-80d9-4923e0d50c40.mp4',
  '/video/New folder/2ed64372-9f46-4dce-9328-b9b37882372b.mp4',
  '/video/New folder/401bd376-1f49-4f42-9f5d-19c9b6bf7ec0.mp4',
  '/video/New folder/40ae0a35-a50b-4375-b333-94b438305289.mp4',
  '/video/New folder/6d68d332-56e5-4d21-bc80-09a96d97ac90.mp4',
  '/video/New folder/83251256-0533-4c82-a7a8-31bfe721663b.mp4',
  '/video/New folder/908e4a43-8f83-469b-a0a5-40ba4d84509d.mp4',
  '/video/New folder/9db048e0-0ee7-4354-a366-aa92e29ed092.mp4',
  '/video/New folder/a5bd7acf-c1d8-4afa-9de1-2a2ce6fd4a9d.mp4',
  '/video/New folder/d9ef86c1-d0f4-4c2a-9823-22c17bc84a33.mp4',
  '/video/New folder/ee50b80d-3157-4f41-9ed7-a460028d27d1.mp4',
];

export default function BackgroundVideoCarousel({ isVisible }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  }, [isVisible, videoIndex]);

  function handleVideoEnded() {
    setFade(false);
    setTimeout(() => {
      setVideoIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
      setFade(true);
    }, 600);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        transition: 'opacity 2.2s cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* The video element */}
      <video
        ref={videoRef}
        key={BACKGROUND_VIDEOS[videoIndex]}
        src={BACKGROUND_VIDEOS[videoIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.62) contrast(1.08) saturate(0.92)',
          transform: 'scale(1.04)',
          transition: 'opacity 0.8s ease-in-out',
          opacity: fade ? 1 : 0,
        }}
      />

      {/* Warm ambient tinted overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(20, 8, 12, 0.35) 0%, rgba(13, 5, 8, 0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dark vignette fade-away shade from every corner & edge */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 120px 45px rgba(10, 3, 6, 0.88), inset 0 0 240px 90px rgba(7, 2, 4, 0.94)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
