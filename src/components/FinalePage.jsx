import React, { useEffect, useRef, useState } from 'react';
import HeartPage from './HeartPage';
import BridgeSection from './BridgeSection';
import Scrapbook from './Scrapbook';

export default function FinalePage({ onExit }) {
  const [unlocked, setUnlocked] = useState(false);
  const [showScrapbook, setShowScrapbook] = useState(false);
  const scrollRef = useRef(null);
  const heartRef = useRef(null);
  const bridgeRef = useRef(null);
  const [opacity, setOpacity] = useState({ heart: 1, bridge: 0 });

  useEffect(() => {
    if (!unlocked) return;
    const el = scrollRef.current;
    const fade = () => el.clientHeight || window.innerHeight;
    const sectionOpacity = (node) => {
      if (!node) return 1;
      const top = node.offsetTop;
      const h = node.offsetHeight;
      const f = fade();
      const appearStart = top - f;
      const fadeOutEnd = top + h;
      const enter = Math.max(0, Math.min(1, (el.scrollTop - appearStart) / f));
      const exit = Math.max(0, Math.min(1, (fadeOutEnd - el.scrollTop) / f));
      return Math.min(enter, exit);
    };
    const update = () =>
      setOpacity({
        heart: sectionOpacity(heartRef.current),
        bridge: sectionOpacity(bridgeRef.current),
      });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [unlocked]);

  const sectionStyle = (o) => ({
    opacity: o,
    transition: 'opacity 0.3s linear',
    willChange: 'opacity',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1500 }}>
      <div
        ref={scrollRef}
        style={{
          position: 'relative',
          height: '100%',
          overflowY: unlocked ? 'auto' : 'hidden',
          overscrollBehavior: 'contain',
          background: 'linear-gradient(160deg, #fdf6ed 0%, #f5ede0 50%, #f0e6d6 100%)',
        }}
      >
        <div ref={heartRef} style={{ height: '100vh', ...sectionStyle(opacity.heart) }}>
          <HeartPage onClose={onExit} onComplete={() => setUnlocked(true)} />
        </div>
        <div ref={bridgeRef} style={{ display: unlocked ? undefined : 'none', minHeight: '100vh', ...sectionStyle(opacity.bridge) }}>
          <BridgeSection onOpenScrapbook={() => setShowScrapbook(true)} />
        </div>
      </div>

      {showScrapbook && <Scrapbook onExit={() => setShowScrapbook(false)} />}
    </div>
  );
}
