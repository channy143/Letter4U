import React, { useState, useEffect } from 'react';
import scrapbookPhotos from './scrapbookPhotos.json';
import pinkFlower from '../assets/flowers/pink.webp';

// Romantic letter paragraphs
const LETTER_PARAGRAPHS = [
  "Happy first monthsary, lovelovee.",
  "It's only been one month since we officially became us, but honestly, I'm really happy that I get to celebrate this little milestone with you.",
  "It's kind of funny to think about how we got here. After five months of waiting, getting to know each other, spending time together, and figuring out what we both wanted, we finally reached the point where I could call you my girlfriend. And now, here we are, celebrating our first month together.",
  "Usahay murag dili gihapon ko katuo nga uyab na jud tika HAHAHA. Maybe because I spent so much time hoping that this would happen, and now that it finally has, I'm still getting used to the thought that I actually get to experience this with you.",
  "And I'm really happy that I do.",
  "I know one month might not seem like a lot, and I know we still have so much to learn about each other. We're still figuring things out, learning how we handle different situations, and discovering more about each other now that we're officially together. But even if it's only been a month, I still think it's something worth appreciating.",
  "Because this isn't just about reaching another month together. It's about getting to experience something I've wanted for a while with someone who genuinely means a lot to me.",
  "And that someone is you, Kikay.",
  "One of the things I appreciate most about being with you is that I get to know you in ways I might not have understood before. I get to hear more about your day, know what's been on your mind, share random conversations with you, and spend time with you without having to wonder what it would be like if we were finally together.",
  "I love our dates, even the ones that don't go exactly as planned. I love the pictures we take, the random things we end up talking about, and the little moments that might seem ordinary while they're happening but become memories I enjoy looking back on afterward.",
  "Sometimes, I wish our time together could last a little longer. Kay bitaw, whenever I'm with you, murag paspas kaayo ang oras. We could spend hours together, and somehow, it would still feel like kulang pa. There's always another thing I want to talk about with you, another place I'd like us to visit, or another little moment I'd like to experience with you.",
  "But I also understand that we both have our own responsibilities and things we need to work on. We can't always spend our days together, and we don't have to. I think part of being in a relationship is learning how to enjoy the time we have while still giving each other room to grow individually.",
  "I want us to have our own lives, our own goals, and our own experiences, too. And when we do get to spend time together, I want us to genuinely enjoy it, not because we feel like we have to be together all the time, but because we want to share those moments with each other.",
  "I also want to thank you for the little things you do, even the ones you probably don't think much about.",
  "Thank you for sharing your thoughts with me, for telling me about the things happening in your life, for making time for me, and for letting me get to know the different sides of you. Thank you for the laughs, the kulit moments, the random conversations, and even the times when you tease me or make fun of me HAHAHA.",
  "And thank you for being honest with me, too.",
  "I know being in a relationship isn't always going to be easy. Even in just this first month, we've already had moments that made me reflect on myself and on how I treat you. There are still things I need to understand better, and there are times when I might not get things right immediately.",
  "I'm learning that being your boyfriend isn't just about making you happy or giving you sweet messages. It's also about paying attention, listening when something bothers you, respecting your feelings, and understanding that we can experience the same situation differently.",
  "I still have a lot to learn about you, lovelove. And I don't want to assume that just because we've known each other for a while, I already understand everything about you.",
  "I want to keep discovering the little things that make you who you are. I want to understand you better as time goes on, not because I expect myself to know everything about you, but because I genuinely want to know you.",
  "And I hope you get to know me more, too. Not just the happy and confident side of me, but also the parts of me that I'm still figuring out. I know I have my own flaws, worries, and moments when I don't know exactly what to do. I'm still growing, just like you are, and I think it's okay that we don't have everything figured out yet.",
  "We're still at the beginning of this, after all.",
  "We don't need to rush anything or act like we already know how everything will turn out. I just want us to enjoy what we have now, appreciate the time we spend together, and keep learning how to treat each other better along the way.",
  "And honestly, I'm excited about the little things that are still ahead of us.",
  "More dates, more pictures, more random conversations, more food trips, more moments when we laugh at something only we understand, and more memories that we'll probably look back on someday and laugh about. I'm sure there will be days when our plans don't go as expected, days when we're both tired or busy, and days when we'll need a little more patience with each other.",
  "But for now, I'm happy that we get to experience these things together, one step at a time.",
  "I don't need our relationship to be perfect just because it's still new. I don't expect every day to feel exciting, and I don't think we need to do something grand all the time to make our relationship meaningful.",
  "Sometimes, being able to talk to you after a long day is already nice. Sometimes, a simple date is enough. And sometimes, just knowing that we're okay and that we're both doing our own things while still being part of each other's lives is something worth appreciating, too.",
  "I think those little things matter just as much as the bigger moments.",
  "So, for our first monthsary, I just want you to know how happy I am that we're here.",
  "I'm happy that you gave us a chance. I'm happy that I get to call you my girlfriend. I'm happy that I get to make memories with you, and I'm happy that I get to experience this new part of our story with you.",
  "Thank you for choosing to try this with me, even when you had your own fears and uncertainties. I know that saying yes didn't mean all those fears disappeared overnight, and I don't expect them to. I'm just grateful that we get to take things as they come and learn along the way.",
  "And I hope that, as we spend more time together, you continue to feel comfortable being yourself with me. You don't have to be happy all the time, pretend that nothing bothers you, or have everything figured out. I want there to be room for the good days, the difficult days, and all the ordinary days in between.",
  "Because I don't just appreciate the moments when everything feels easy. I appreciate getting to know you as a whole person, too.",
  "Lovelove, I know this is only our first month, and we still have a long way to go in understanding each other and growing together. But I'm genuinely glad that I get to start this chapter with you.",
  "I don't know what every month ahead will look like, and I don't think we need to figure all of that out right now. For now, I'm just thankful for this month, for the memories we've already made, and for the chance to keep making more.",
  "Happy first monthsary again, Kikay.",
  "I hope today reminds you that you're appreciated, that I'm happy you're part of my life, and that I'm genuinely grateful for what we have.",
  "Thank you for being my girlfriend, lovelovee. Thank you for the time you've shared with me, for the memories we've made, and for all the little things that have made this first month special to me.",
  "**One month down, and we're still learning, still growing, and still figuring things out together.**",
  "And I'm really happy that it's you I'm doing this with.",
  "I love you, lovelove. Happy first monthsary. ❤️"
];

// Realistic Lavender Bulldog Binder Clip (SVG)
function LavenderBulldogClip({ style, className }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: '-18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.28))',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
        <path
          d="M 7 20 C 7 18, 37 18, 37 20 L 41 36 C 41 38, 3 38, 3 36 Z"
          fill="url(#lavenderClipGrad)"
          stroke="#9b6cb6"
          strokeWidth="0.8"
        />
        <rect x="6.5" y="22" width="31" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
        <circle cx="22" cy="11" r="8.5" stroke="url(#lavenderHandleGrad)" strokeWidth="4.2" fill="none" />
        <circle cx="22" cy="11" r="5.5" fill="#fdf4ff" opacity="0.4" />
        <defs>
          <linearGradient id="lavenderClipGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="85%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <linearGradient id="lavenderHandleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Seamless Crossfade Image Component using Pure CSS Keyframe Animation
function CrossfadeImage({ src, alt, style, objectPosition = 'center' }) {
  const [layers, setLayers] = useState(() => (src ? [{ id: `init_${src}`, src }] : []));

  useEffect(() => {
    if (!src) return;
    setLayers((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].src === src) {
        return prev;
      }
      const last = prev[prev.length - 1];
      const newLayer = { id: `${src}_${Date.now()}_${Math.random()}`, src };
      return last ? [last, newLayer] : [newLayer];
    });
  }, [src]);

  useEffect(() => {
    if (layers.length > 1) {
      const timer = setTimeout(() => {
        setLayers((prev) => (prev.length > 1 ? [prev[prev.length - 1]] : prev));
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [layers]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {layers.map((layer, idx) => {
        const isIncoming = idx === layers.length - 1 && layers.length > 1;
        return (
          <img
            key={layer.id}
            src={layer.src}
            alt={alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition,
              display: 'block',
              animation: isIncoming ? 'crossfadePhotoIn 0.85s cubic-bezier(0.25, 1, 0.5, 1) forwards' : 'none',
              zIndex: idx + 1,
              ...style,
            }}
          />
        );
      })}
    </div>
  );
}

export default function MonthsaryScrapbookPage({ onContinue }) {
  // Static Monthsary Date
  const dateText = 'October 12, 2026';

  // Active photo indices across 4 distinct categories (200 curated photos total)
  const [herIndex, setHerIndex] = useState(0);
  const [polaroid1Index, setPolaroid1Index] = useState(0);
  const [polaroid2Index, setPolaroid2Index] = useState(0);
  const [standingIndex, setStandingIndex] = useState(0);

  // Sticky note custom text wiggle
  const [stickyWiggle, setStickyWiggle] = useState(false);

  // Canva Scrapbook Animation state: Outro (isExiting)
  const [isExiting, setIsExiting] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Preload upcoming images so auto-transitions are instantaneous
  useEffect(() => {
    if (!scrapbookPhotos.her?.length) return;
    const nextHer = scrapbookPhotos.her[(herIndex + 1) % scrapbookPhotos.her.length];
    const nextP1 = scrapbookPhotos.together[(polaroid1Index + 1) % scrapbookPhotos.together.length];
    const nextP2 = scrapbookPhotos.date[(polaroid2Index + 1) % scrapbookPhotos.date.length];
    const nextStd = scrapbookPhotos.other[(standingIndex + 1) % scrapbookPhotos.other.length];
    [nextHer, nextP1, nextP2, nextStd].forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [herIndex, polaroid1Index, polaroid2Index, standingIndex]);

  // Automatically cycle through images every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHerIndex((prev) => (prev + 1) % (scrapbookPhotos.her?.length || 1));
      setPolaroid1Index((prev) => (prev + 1) % (scrapbookPhotos.together?.length || 1));
      setPolaroid2Index((prev) => (prev + 1) % (scrapbookPhotos.date?.length || 1));
      setStandingIndex((prev) => (prev + 1) % (scrapbookPhotos.other?.length || 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  function triggerStickyWiggle() {
    setStickyWiggle(true);
    setTimeout(() => setStickyWiggle(false), 600);
  }

  // Canva Scrapbook Outro Trigger
  function handleTriggerOutro(callback) {
    if (isExiting) return;
    setIsExiting(true);
    if (callback) {
      callback();
    }
  }

  // Replay Canva Scrapbook Animation
  function handleReplayAnimation() {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      setAnimKey((prev) => prev + 1);
    }, 800);
  }

  return (
    <div
      key={animKey}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100015,
        background: 'radial-gradient(circle at 45% 35%, #2a1620 0%, #170912 60%, #0a0308 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.6s ease forwards',
      }}
    >
      {/* Google Fonts & Canva Scrapbook Animation Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Montserrat:wght@800;900&family=Courier+Prime:wght@700&family=Inter:wght@600;700;800&family=Cinzel:wght@600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

        /* ======================================================== */
        /* CANVA SCRAPBOOK ANIMATION SYSTEM (INTRO & OUTRO)         */
        /* ======================================================== */

        /* 1. Canvas / Board Drop Intro & Outro */
        @keyframes canvaBoardIntro {
          0% {
            opacity: 0;
            transform: scale(0.86) translateY(55px);
          }
          65% {
            opacity: 1;
            transform: scale(1.02) translateY(-4px);
          }
          85% {
            transform: scale(0.995) translateY(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes canvaBoardOutro {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          30% {
            transform: scale(1.02) translateY(-6px);
          }
          100% {
            opacity: 0;
            transform: scale(0.86) translateY(65px);
          }
        }

        /* 2. Paper Drop / Cutout Flutter Intro & Outro */
        @keyframes canvaPaperDropIn {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(-60px) rotate(var(--rot-start, -14deg));
          }
          65% {
            opacity: 1;
            transform: scale(1.06) translateY(5px) rotate(var(--rot-mid, 4deg));
          }
          85% {
            transform: scale(0.985) translateY(-2px) rotate(var(--rot-settle, -1deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(var(--rot-end, 0deg));
          }
        }
        @keyframes canvaPaperOutro {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(var(--rot-end, 0deg));
          }
          25% {
            transform: scale(1.06) translateY(-8px) rotate(var(--rot-mid, 4deg));
          }
          100% {
            opacity: 0;
            transform: scale(0.65) translateY(-70px) rotate(var(--rot-start, -15deg));
          }
        }

        /* 3. Sticker / Stamp Pop In & Out */
        @keyframes canvaStickerStampIn {
          0% {
            opacity: 0;
            transform: scale(0.25) translateY(15px) rotate(var(--rot-start, -22deg));
          }
          60% {
            opacity: 1;
            transform: scale(1.18) rotate(var(--rot-mid, 7deg));
          }
          82% {
            transform: scale(0.96) rotate(var(--rot-settle, -2deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(var(--rot-end, 0deg));
          }
        }
        @keyframes canvaStickerOutro {
          0% {
            opacity: 1;
            transform: scale(1) rotate(var(--rot-end, 0deg));
          }
          25% {
            transform: scale(1.15) rotate(var(--rot-mid, 6deg));
          }
          100% {
            opacity: 0;
            transform: scale(0.25) translateY(20px) rotate(var(--rot-start, -24deg));
          }
        }

        /* 4. Bulldog Binder Clip Snap In & Pop Out */
        @keyframes canvaClipSnapIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-40px) scale(0.6);
          }
          70% {
            opacity: 1;
            transform: translateX(-50%) translateY(4px) scale(1.15);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        @keyframes canvaClipSnapOut {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          30% {
            transform: translateX(-50%) translateY(4px) scale(1.12);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-45px) scale(0.5);
          }
        }

        /* 5. Adhesive Tape Stick In & Peel Out */
        @keyframes canvaTapeStickIn {
          0% {
            opacity: 0;
            transform: scaleX(0.35) scaleY(0.75) rotate(var(--rot-start, -6deg));
          }
          65% {
            opacity: 1;
            transform: scaleX(1.05) scaleY(1.05) rotate(var(--rot-mid, 2deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(var(--rot-end, 0deg));
          }
        }
        @keyframes canvaTapePeelOut {
          0% {
            opacity: 1;
            transform: scale(1) rotate(var(--rot-end, 0deg));
          }
          30% {
            transform: scaleX(1.08) rotate(var(--rot-mid, 3deg)) translateY(-4px);
          }
          100% {
            opacity: 0;
            transform: scaleX(0.3) scaleY(0.7) rotate(var(--rot-start, -8deg)) translateY(-20px);
          }
        }

        /* 6. Corner Floral Ornaments Flutter In & Out */
        @keyframes flowerTopLeftIntro {
          0% {
            opacity: 0;
            transform: translate(-45px, -45px) scale(0.65) rotate(-15deg);
          }
          70% {
            opacity: 1;
            transform: translate(6px, 6px) scale(1.05) rotate(3deg);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
        }
        @keyframes flowerTopLeftOutro {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50px, -50px) scale(0.65) rotate(-15deg);
          }
        }

        @keyframes flowerBottomRightIntro {
          0% {
            opacity: 0;
            transform: scaleX(-1) scaleY(-1) translate(-45px, -45px) scale(0.65) rotate(-15deg);
          }
          70% {
            opacity: 1;
            transform: scaleX(-1) scaleY(-1) translate(6px, 6px) scale(1.05) rotate(3deg);
          }
          100% {
            opacity: 1;
            transform: scaleX(-1) scaleY(-1) translate(0, 0) scale(1) rotate(0deg);
          }
        }
        @keyframes flowerBottomRightOutro {
          0% {
            opacity: 1;
            transform: scaleX(-1) scaleY(-1) translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: scaleX(-1) scaleY(-1) translate(-50px, -50px) scale(0.65) rotate(-15deg);
          }
        }

        /* 7. Image Slideshow Pure Crossfade */
        @keyframes crossfadePhotoIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes stickerWiggle {
          0%, 100% { transform: rotate(-6deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.04); }
          75% { transform: rotate(-2deg) scale(1.04); }
        }

        .polaroid-card {
          transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.3s ease;
          cursor: pointer;
        }
        .polaroid-card:hover {
          transform: scale(1.03) rotate(0deg) !important;
          box-shadow: 0 20px 42px rgba(0, 0, 0, 0.38), 0 4px 10px rgba(0, 0, 0, 0.15) !important;
          z-index: 40 !important;
        }

        .interactive-tag {
          transition: transform 0.2s ease, filter 0.2s ease;
          cursor: pointer;
        }
        .interactive-tag:hover {
          filter: brightness(1.08);
          transform: scale(1.05);
        }

        /* Hide scrollbars while allowing smooth mouse & touch scroll */
        .no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        @media (max-width: 960px) {
          .monthsary-wrapper {
            flex-direction: column !important;
            overflow-y: auto !important;
            height: 100% !important;
            max-height: 100vh !important;
            justify-content: flex-start !important;
            padding: 1.5rem 1rem 4rem 1rem !important;
            gap: 2rem !important;
          }
          .monthsary-collage-col {
            width: min(400px, 94vw) !important;
            height: min(680px, 80vh) !important;
            flex-shrink: 0 !important;
          }
          .monthsary-letter-col {
            width: min(600px, 95vw) !important;
            height: auto !important;
            max-height: none !important;
            overflow-y: visible !important;
            padding: 2rem 1.4rem !important;
          }
        }
      `}</style>

      {/* Floating Replay / Outro Control Pill */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1.2rem',
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <button
          onClick={handleReplayAnimation}
          title="Replay Canva Scrapbook Animation"
          style={{
            background: 'rgba(25, 12, 18, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            color: '#f8d7da',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '0.72rem',
            padding: '0.38rem 0.85rem',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(155, 58, 74, 0.75)';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(25, 12, 18, 0.65)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>↺</span>
          <span>Replay Scrapbook</span>
        </button>
      </div>

      {/* SVG ClipPath Definition for the Heart Photo Cutout */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="scrapbookHeartClip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5, 0.22 C 0.33, -0.06, 0.02, 0.06, 0.01, 0.45 C 0.00, 0.68, 0.26, 0.86, 0.5, 1 C 0.74, 0.86, 1.00, 0.68, 0.99, 0.45 C 0.98, 0.06, 0.67, -0.06, 0.5, 0.22 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Top-Left Corner Floral Accent (Canva Flutter Intro / Outro) */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 100,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 8px 22px rgba(0, 0, 0, 0.45))',
          animation: isExiting
            ? 'flowerTopLeftOutro 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            : 'flowerTopLeftIntro 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
        }}
      >
        <img
          src={pinkFlower}
          alt=""
          style={{
            display: 'block',
            width: 'clamp(170px, 20vw, 280px)',
            height: 'auto',
            userSelect: 'none',
          }}
        />
      </div>

      {/* Bottom-Right Corner Floral Accent (Upside Down & Mirrored - Canva Flutter Intro / Outro) */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          zIndex: 100,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 8px 22px rgba(0, 0, 0, 0.45))',
          animation: isExiting
            ? 'flowerBottomRightOutro 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            : 'flowerBottomRightIntro 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both',
        }}
      >
        <img
          src={pinkFlower}
          alt=""
          style={{
            display: 'block',
            width: 'clamp(170px, 20vw, 280px)',
            height: 'auto',
            userSelect: 'none',
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 2-COLUMN MAIN WRAPPER (Collage on Left, Letter on Right) */}
      {/* ======================================================== */}
      <div
        className="monthsary-wrapper no-scrollbar"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5rem',
          width: '100%',
          maxWidth: '1240px',
          height: '100%',
          maxHeight: '94vh',
          padding: '1.2rem',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        {/* ======================================================== */}
        {/* LEFT COLUMN: INTERACTIVE SCRAPBOOK COLLAGE BOARD        */}
        {/* ======================================================== */}
        <div
          className="monthsary-collage-col"
          style={{
            position: 'relative',
            width: '420px',
            flexShrink: 0,
            height: 'min(760px, 88vh)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 28px 75px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            background: 'linear-gradient(170deg, #f3ede2 0%, #eae1d2 45%, #dfd3c0 100%)',
            animation: isExiting
              ? 'canvaBoardOutro 0.75s cubic-bezier(0.4, 0, 0.2, 1) 0.25s forwards'
              : 'canvaBoardIntro 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
            boxSizing: 'border-box',
          }}
        >
          {/* Background Texture & Soft Cafe Wallpaper Ambience */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, transparent 60%), repeating-linear-gradient(0deg, rgba(120,90,50,0.02) 0 1px, transparent 1px 24px)',
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          />

          {/* Background Couple Standing Photo (Bottom Right Corner - Canva Paper Intro/Outro) */}
          <div
            onClick={() => {
              setStandingIndex((prev) => (prev + 1) % (scrapbookPhotos.other?.length || 1));
            }}
            title="Click to cycle next photo"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '56%',
              height: '52%',
              zIndex: 2,
              cursor: 'pointer',
              opacity: 0.94,
              filter: 'contrast(1.02) brightness(0.98)',
              overflow: 'hidden',
              maskImage:
                'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.35) 12%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,1) 24%)',
              WebkitMaskImage:
                'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.35) 12%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,1) 24%)',
              animation: isExiting
                ? 'canvaBoardOutro 0.65s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards'
                : 'canvaBoardIntro 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both',
            }}
          >
            <CrossfadeImage
              src={scrapbookPhotos.other[standingIndex]}
              alt="Moments Together"
              objectPosition="center 20%"
            />
            {/* Intense but compact left-edge fade overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(223, 211, 192, 0.95) 0%, rgba(223, 211, 192, 0.6) 8%, rgba(223, 211, 192, 0.15) 16%, transparent 22%)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          </div>

          {/* ======================================================== */}
          {/* TOP-LEFT: HEART-SHAPED PHOTO CUTOUT (Canva Stamp In/Out) */}
          {/* ======================================================== */}
          <div
            onClick={() => {
              setHerIndex((prev) => (prev + 1) % (scrapbookPhotos.her?.length || 1));
            }}
            className="interactive-tag"
            title="Click to cycle next photo of her"
            style={{
              position: 'absolute',
              top: '5%',
              left: '4%',
              width: '128px',
              height: '128px',
              zIndex: 15,
              filter: 'drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28)) drop-shadow(0 2px 4px rgba(0,0,0,0.14))',
              '--rot-start': '-24deg',
              '--rot-mid': '6deg',
              '--rot-settle': '-6deg',
              '--rot-end': '-4deg',
              animation: isExiting
                ? 'canvaStickerOutro 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.05s forwards'
                : 'canvaStickerStampIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.62s both',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                clipPath: 'url(#scrapbookHeartClip)',
                background: '#f8d7da',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CrossfadeImage
                src={scrapbookPhotos.her[herIndex]}
                alt="Her Smile"
                objectPosition="center 25%"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* PINK STICKY NOTE ("Milk Tea..." Canva Stamp In/Out)      */}
          {/* ======================================================== */}
          <div
            onClick={triggerStickyWiggle}
            className="interactive-tag"
            title="Click for love note!"
            style={{
              position: 'absolute',
              top: '25%',
              left: '6%',
              width: '114px',
              height: '108px',
              background: 'linear-gradient(135deg, #fba7b8 0%, #f794a8 100%)',
              padding: '0.65rem 0.5rem',
              boxSizing: 'border-box',
              borderRadius: '2px',
              boxShadow: '0 8px 16px rgba(120, 30, 50, 0.25), 0 2px 4px rgba(0,0,0,0.1)',
              '--rot-start': '-26deg',
              '--rot-mid': '4deg',
              '--rot-settle': '-8deg',
              '--rot-end': '-6deg',
              animation: isExiting
                ? 'canvaStickerOutro 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards'
                : stickyWiggle
                ? 'stickerWiggle 0.6s ease'
                : 'canvaStickerStampIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.72s both',
              zIndex: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: '#46131c',
              cursor: 'pointer',
            }}
          >
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.12rem',
                lineHeight: '1.14',
                fontWeight: 700,
                margin: 0,
                letterSpacing: '0.01em',
              }}
            >
              Bring me
              <br />
              Milk Tea
              <br />
              and
              <br />
              tell me
              <br />
              i'm Pretty &#9825;
            </p>
          </div>

          {/* ======================================================== */}
          {/* UPPER-CENTER POLAROID (Canva Paper Drop In / Out)        */}
          {/* ======================================================== */}
          <div
            className="polaroid-card"
            onClick={() => {
              setPolaroid1Index((prev) => (prev + 1) % (scrapbookPhotos.together?.length || 1));
            }}
            title="Click to cycle next photo"
            style={{
              position: 'absolute',
              top: '9.5%',
              right: '5%',
              width: '194px',
              background: '#ffffff',
              padding: '8px 8px 28px 8px',
              boxSizing: 'border-box',
              borderRadius: '3px',
              boxShadow: '0 14px 32px rgba(0, 0, 0, 0.24), 0 3px 8px rgba(0,0,0,0.1)',
              '--rot-start': '18deg',
              '--rot-mid': '2deg',
              '--rot-settle': '6deg',
              '--rot-end': '5deg',
              zIndex: 12,
              animation: isExiting
                ? 'canvaPaperOutro 0.68s cubic-bezier(0.4, 0, 0.2, 1) 0.12s forwards'
                : 'canvaPaperDropIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.30s both',
            }}
          >
            {/* Lavender Bulldog Clip fastened at top (Canva Snap In / Out) */}
            <LavenderBulldogClip
              style={{
                animation: isExiting
                  ? 'canvaClipSnapOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.05s forwards'
                  : 'canvaClipSnapIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both',
              }}
            />

            {/* Photo Frame */}
            <div
              style={{
                width: '100%',
                height: '172px',
                background: '#222',
                overflow: 'hidden',
                borderRadius: '2px',
              }}
            >
              <CrossfadeImage
                src={scrapbookPhotos.together[polaroid1Index]}
                alt="Us Together"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* TOP-RIGHT RANSOM/COLLAGE STICKERS                        */}
          {/* "HAPPY MONTHSARY! October 12, 2026" (Canva Stamp In/Out) */}
          {/* ======================================================== */}
          <div
            style={{
              position: 'absolute',
              top: '2%',
              right: '4%',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              pointerEvents: 'none',
            }}
          >
            {/* "HAPPY" Cutout Sticker */}
            <div
              style={{
                background: '#121212',
                color: '#ffffff',
                fontFamily: "'Montserrat', 'Arial Black', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.15rem, 3.2vw, 1.4rem)',
                letterSpacing: '0.12em',
                padding: '3px 12px',
                borderRadius: '1px',
                '--rot-start': '-18deg',
                '--rot-mid': '2deg',
                '--rot-settle': '-5deg',
                '--rot-end': '-4deg',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                marginBottom: '2px',
                animation: isExiting
                  ? 'canvaStickerOutro 0.55s cubic-bezier(0.4, 0, 0.2, 1) 0.02s forwards'
                  : 'canvaStickerStampIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.82s both',
              }}
            >
              HAPPY
            </div>

            {/* "MONTHSARY!" Cutout Tape Sticker */}
            <div
              style={{
                background: '#ffffff',
                color: '#121212',
                border: '2px solid #121212',
                fontFamily: "'Montserrat', 'Arial Black', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.18rem, 3.4vw, 1.45rem)',
                letterSpacing: '0.08em',
                padding: '3px 10px',
                borderRadius: '2px',
                '--rot-start': '16deg',
                '--rot-mid': '-2deg',
                '--rot-settle': '5deg',
                '--rot-end': '4deg',
                boxShadow: '0 5px 12px rgba(0,0,0,0.22)',
                marginBottom: '5px',
                animation: isExiting
                  ? 'canvaStickerOutro 0.55s cubic-bezier(0.4, 0, 0.2, 1) 0.06s forwards'
                  : 'canvaStickerStampIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.90s both',
              }}
            >
              MONTHSARY!
            </div>

            {/* "October 12, 2026" Tape Label */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.96)',
                color: '#2a141b',
                fontFamily: "'Courier Prime', monospace",
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                padding: '3px 9px',
                borderRadius: '2px',
                border: '1px dashed #666',
                '--rot-start': '-12deg',
                '--rot-mid': '5deg',
                '--rot-settle': '1deg',
                '--rot-end': '2deg',
                boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                animation: isExiting
                  ? 'canvaTapePeelOut 0.55s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards'
                  : 'canvaTapeStickIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.98s both',
              }}
            >
              {dateText}
            </div>
          </div>

          {/* ======================================================== */}
          {/* LOWER-LEFT POLAROID (Canva Paper Drop In / Out)          */}
          {/* ======================================================== */}
          <div
            className="polaroid-card"
            onClick={() => {
              setPolaroid2Index((prev) => (prev + 1) % (scrapbookPhotos.date?.length || 1));
            }}
            title="Click to cycle next photo"
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              width: '198px',
              background: '#ffffff',
              padding: '8px 8px 32px 8px',
              boxSizing: 'border-box',
              borderRadius: '3px',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.26), 0 4px 10px rgba(0,0,0,0.12)',
              '--rot-start': '-18deg',
              '--rot-mid': '2deg',
              '--rot-settle': '-8deg',
              '--rot-end': '-6deg',
              zIndex: 14,
              animation: isExiting
                ? 'canvaPaperOutro 0.68s cubic-bezier(0.4, 0, 0.2, 1) 0.16s forwards'
                : 'canvaPaperDropIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both',
            }}
          >
            {/* Matching Lavender Bulldog Clip fastened at top */}
            <LavenderBulldogClip
              style={{
                animation: isExiting
                  ? 'canvaClipSnapOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.08s forwards'
                  : 'canvaClipSnapIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.58s both',
              }}
            />

            {/* Photo Frame */}
            <div
              style={{
                width: '100%',
                height: '182px',
                background: '#222',
                overflow: 'hidden',
                borderRadius: '2px',
              }}
            >
              <CrossfadeImage
                src={scrapbookPhotos.date[polaroid2Index]}
                alt="Date Memories"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* OVERLAID WHITE TAPE CAPTION STRIP (Canva Tape In/Out)    */}
          {/* ======================================================== */}
          <div
            style={{
              position: 'absolute',
              bottom: '4.5%',
              left: '4%',
              width: '80%',
              zIndex: 25,
              pointerEvents: 'none',
              '--rot-start': '-8deg',
              '--rot-mid': '2deg',
              '--rot-end': '-1.5deg',
              animation: isExiting
                ? 'canvaTapePeelOut 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.04s forwards'
                : 'canvaTapeStickIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.05s both',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.96)',
                color: '#111111',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '0.72rem',
                lineHeight: '1.42',
                padding: '5px 9px',
                borderRadius: '2px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)',
                letterSpacing: '0.01em',
              }}
            >
              Happy Monthsary! Our journey together is my favorite story—filled with love, growth, and endless smiles. I'm excited for every page we'll write in the days to come.
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: THE COMPLETE ROMANTIC MONTHSARY LETTER     */}
        {/* (Canva Scrapbook Paper Board Intro / Outro)              */}
        {/* ======================================================== */}
        <div
          className="monthsary-letter-col no-scrollbar"
          style={{
            flex: '1 1 540px',
            maxWidth: '640px',
            height: 'min(760px, 88vh)',
            overflowY: 'auto',
            background: 'rgba(255, 253, 249, 0.96)',
            borderRadius: '14px',
            border: '1px solid rgba(180, 110, 125, 0.22)',
            boxShadow: '0 28px 75px rgba(0, 0, 0, 0.55), 0 8px 24px rgba(0, 0, 0, 0.2)',
            padding: '2.6rem 2.8rem',
            boxSizing: 'border-box',
            animation: isExiting
              ? 'canvaBoardOutro 0.75s cubic-bezier(0.4, 0, 0.2, 1) 0.20s forwards'
              : 'canvaBoardIntro 0.92s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
            position: 'relative',
          }}
        >
          {/* Header Title (Canva Paper Stamp Reveal) */}
          <div
            style={{
              marginBottom: '1.8rem',
              borderBottom: '1px solid rgba(155, 58, 74, 0.2)',
              paddingBottom: '1.2rem',
              animation: isExiting
                ? 'canvaBoardOutro 0.5s ease forwards'
                : 'canvaPaperDropIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both',
              '--rot-start': '-6deg',
              '--rot-mid': '1deg',
              '--rot-end': '0deg',
            }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Libre Baskerville', serif",
                fontSize: 'clamp(1.65rem, 3.2vw, 2.15rem)',
                fontWeight: 700,
                color: '#8d2b3d',
                margin: '0 0 0.4rem 0',
                lineHeight: '1.25',
                letterSpacing: '-0.01em',
              }}
            >
              Happy First Monthsary, Lovelove❤️
            </h1>
            <div
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.78rem',
                color: '#9e5a69',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>October 12, 2026</span>
              <span>•</span>
              <span>Our First Milestone</span>
            </div>
          </div>

          {/* Letter Body Paragraphs */}
          <div
            style={{
              color: '#2b1820',
              animation: isExiting
                ? 'canvaBoardOutro 0.5s ease forwards'
                : 'canvaBoardIntro 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.60s both',
            }}
          >
            {LETTER_PARAGRAPHS.map((p, idx) => {
              // Highlight bold block
              if (p.startsWith('**') && p.endsWith('**')) {
                const text = p.slice(2, -2);
                return (
                  <p
                    key={idx}
                    style={{
                      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                      fontSize: 'clamp(1.15rem, 1.9vw, 1.3rem)',
                      lineHeight: '1.8',
                      fontWeight: 700,
                      color: '#8d2b3d',
                      background: 'rgba(247, 148, 168, 0.12)',
                      borderLeft: '3px solid #8d2b3d',
                      padding: '0.8rem 1.1rem',
                      borderRadius: '0 6px 6px 0',
                      margin: '1.6rem 0',
                    }}
                  >
                    {text}
                  </p>
                );
              }

              // Special sign-off paragraph
              if (idx === LETTER_PARAGRAPHS.length - 1) {
                return (
                  <p
                    key={idx}
                    style={{
                      fontFamily: "'Playfair Display', 'Libre Baskerville', serif",
                      fontSize: 'clamp(1.18rem, 2vw, 1.35rem)',
                      lineHeight: '1.7',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      color: '#8d2b3d',
                      marginTop: '1.6rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {p}
                  </p>
                );
              }

              return (
                <p
                  key={idx}
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                    fontSize: 'clamp(1.08rem, 1.8vw, 1.2rem)',
                    lineHeight: '1.88',
                    fontWeight: 500,
                    margin: '0 0 1.25rem 0',
                    color: '#2d1a22',
                  }}
                >
                  {p}
                </p>
              );
            })}
          </div>

          {/* Bottom subtle decorative heart footer & Exit action */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.4rem',
              borderTop: '1px dashed rgba(155, 58, 74, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: '#8d2b3d',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.85 }}>
              <span style={{ fontSize: '1.2rem' }}>❦</span>
              <span
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.2rem',
                  letterSpacing: '0.04em',
                }}
              >
                Forever & Always with you, Kikay
              </span>
              <span style={{ fontSize: '1.2rem' }}>❦</span>
            </div>

            {/* Optional fold/exit button if onContinue handler is available */}
            {onContinue && (
              <button
                onClick={() => handleTriggerOutro(() => onContinue())}
                style={{
                  background: 'linear-gradient(135deg, rgba(155, 58, 74, 0.12) 0%, rgba(155, 58, 74, 0.05) 100%)',
                  border: '1px solid rgba(155, 58, 74, 0.35)',
                  color: '#8d2b3d',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: '0.88rem',
                  padding: '0.5rem 1.6rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(155, 58, 74, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--rose, #9b3a4a)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'scale(1.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(155, 58, 74, 0.12) 0%, rgba(155, 58, 74, 0.05) 100%)';
                  e.currentTarget.style.color = '#8d2b3d';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Fold Letter & Finish ♡
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
