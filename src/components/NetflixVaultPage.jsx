import React, { useState, useEffect, useRef } from 'react';

// Cinematic couple videos from the repository (strictly our memories, no music videos)
const VAULT_VIDEOS = [
  {
    title: 'Golden Hour Dates',
    subtitle: 'Wishing time could last just a bit longer',
    src: '/video/New folder/83251256-0533-4c82-a7a8-31bfe721663b.mp4',
  },
  {
    title: 'Laughing Together',
    subtitle: 'Unscripted smiles that mean everything',
    src: '/video/New folder/2ed64372-9f46-4dce-9328-b9b37882372b.mp4',
  },
  {
    title: 'Afternoon Stroll',
    subtitle: 'Taking things slow, one step at a time',
    src: '/video/New folder/401bd376-1f49-4f42-9f5d-19c9b6bf7ec0.mp4',
  },
  {
    title: 'Late Night Conversations',
    subtitle: 'Under city lights & gentle silence',
    src: '/video/New folder/13c50998-ed55-4f80-80d9-4923e0d50c40.mp4',
  },
  {
    title: 'Her Natural Smile',
    subtitle: 'The view I will never get tired of',
    src: '/video/New folder/40ae0a35-a50b-4375-b333-94b438305289.mp4',
  },
  {
    title: 'Car Rides & Sing-alongs',
    subtitle: 'Playing our favorite songs on repeat',
    src: '/video/New folder/6d68d332-56e5-4d21-bc80-09a96d97ac90.mp4',
  },
  {
    title: 'Little Ordinary Moments',
    subtitle: 'Nothing grand, just being with you is enough',
    src: '/video/New folder/908e4a43-8f83-469b-a0a5-40ba4d84509d.mp4',
  },
  {
    title: 'Cafe Talks & Milk Tea',
    subtitle: 'Sharing stories about each other’s day',
    src: '/video/New folder/9db048e0-0ee7-4354-a366-aa92e29ed092.mp4',
  },
  {
    title: 'Her Warmth',
    subtitle: 'Grateful every single day for Kikay',
    src: '/video/New folder/a5bd7acf-c1d8-4afa-9de1-2a2ce6fd4a9d.mp4',
  },
  {
    title: 'Our Journey',
    subtitle: 'From five months of waiting to officially us',
    src: '/video/New folder/d9ef86c1-d0f4-4c2a-9823-22c17bc84a33.mp4',
  },
  {
    title: 'Always and Forever',
    subtitle: 'To all the beautiful memories still ahead',
    src: '/video/New folder/ee50b80d-3157-4f41-9ed7-a460028d27d1.mp4',
  },
];

// Selection Chapter Cards (Requested by User)
const CHAPTER_CARDS = [
  {
    id: 'game',
    title: 'Maze Game',
    episode: 'CHAPTER 1',
    category: 'Maze Game',
    duration: 'Interactive Maze',
    image: '/icon/1.jpeg',
    description: 'Navigate 3 rounds of the maze, light glowing lanterns, and unlock the path forward to where our story first blossomed.',
    badge: 'GAME',
  },
  {
    id: 'amour',
    title: 'Amour(French)',
    episode: 'CHAPTER 2',
    category: 'Amour(French)',
    duration: 'Love Letter & Moments',
    image: '/icon/2.jpeg',
    description: 'The main site experience — our heartfelt letter, memorable quotes, photo moments gallery, secret lock, and photobooth.',
  },
  {
    id: 'musika',
    title: 'Musika',
    episode: 'CHAPTER 3',
    category: 'Musika',
    duration: 'Sticky Notes & Songs',
    image: '/icon/3.jpeg',
    description: 'Interactive sticky note reminders, the 3D keepsake memory box, and songs that remind me of you with lyrics.',
  },
  {
    id: 'glimpse',
    title: 'A Quite Glimpse of Us',
    episode: 'CHAPTER 4',
    category: 'A Quite Glimpse of Us',
    duration: 'Video Journey & Letter',
    image: '/icon/4.jpeg',
    description: 'A cinematic video journey set to "To The Bone" — featuring cycling background clips, photo polaroids, and gratitude letters.',
  },
  {
    id: 'scrapbook',
    title: 'Monthsary Scrapbook',
    episode: 'CHAPTER 5',
    category: 'Monthsary Scrapbook',
    duration: 'Letter & Keepsakes',
    image: '/icon/5.jpeg',
    description: 'A cozy handwritten binder letter celebrating our 1st monthsary — complete with photo memories, cute stickers, and loving reminders.',
  },
];

// Genre / Filter categories for middle bar
const CATEGORIES = [
  'All Memories',
  'Maze Game',
  'Amour(French)',
  'Musika',
  'A Quite Glimpse of Us',
  'Monthsary Scrapbook',
];

// Canva Scrapbook tilt angles for organic paper drop
const CARD_TILTS = [
  { start: '-7deg', mid: '2.5deg', settle: '-0.8deg' },
  { start: '6.5deg', mid: '-2deg', settle: '0.6deg' },
  { start: '-5.5deg', mid: '1.8deg', settle: '-0.4deg' },
  { start: '7deg', mid: '-2.2deg', settle: '0.7deg' },
  { start: '-6deg', mid: '2deg', settle: '-0.5deg' },
];

export default function NetflixVaultPage({ onSelectChapter }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Memories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const videoRef = useRef(null);

  // Play current video safely
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  }, [videoIndex]);

  function handleNextVideo() {
    setIsVideoFading(true);
    setTimeout(() => {
      setVideoIndex((prev) => (prev + 1) % VAULT_VIDEOS.length);
      setIsVideoFading(false);
    }, 350);
  }

  function handlePrevVideo() {
    setIsVideoFading(true);
    setTimeout(() => {
      setVideoIndex((prev) => (prev - 1 + VAULT_VIDEOS.length) % VAULT_VIDEOS.length);
      setIsVideoFading(false);
    }, 350);
  }

  // Filter cards based on search and active category
  const filteredCards = CHAPTER_CARDS.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All Memories' || card.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const currentVideo = VAULT_VIDEOS[videoIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100030,
        background: '#111111',
        color: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: 'hidden',
        overflowY: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Netflix Fonts & Canva Scrapbook Animation System */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@400;500;600;700;800&family=Bebas+Neue&family=Cinzel:wght@700&display=swap');

        /* ======================================================== */
        /* CANVA SCRAPBOOK ANIMATION SYSTEM (INTRO)                 */
        /* ======================================================== */

        /* 1. Canvas / Board Drop Intro */
        @keyframes canvaBoardIntro {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(35px);
          }
          65% {
            opacity: 1;
            transform: scale(1.01) translateY(-3px);
          }
          85% {
            transform: scale(0.998) translateY(1px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* 2. Paper Drop / Cutout Flutter Intro */
        @keyframes canvaPaperDropIn {
          0% {
            opacity: 0;
            transform: scale(0.72) translateY(-50px) rotate(var(--rot-start, -10deg));
          }
          65% {
            opacity: 1;
            transform: scale(1.04) translateY(4px) rotate(var(--rot-mid, 3deg));
          }
          85% {
            transform: scale(0.99) translateY(-1px) rotate(var(--rot-settle, -0.6deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(var(--rot-end, 0deg));
          }
        }

        /* 3. Sticker / Stamp Pop In */
        @keyframes canvaStickerStampIn {
          0% {
            opacity: 0;
            transform: scale(0.35) translateY(14px) rotate(var(--rot-start, -12deg));
          }
          60% {
            opacity: 1;
            transform: scale(1.12) rotate(var(--rot-mid, 4deg));
          }
          82% {
            transform: scale(0.97) rotate(var(--rot-settle, -1deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(var(--rot-end, 0deg));
          }
        }

        /* 4. Adhesive Tape / Strip Stick In */
        @keyframes canvaTapeStickIn {
          0% {
            opacity: 0;
            transform: scaleX(0.4) translateY(-12px) rotate(var(--rot-start, -3deg));
          }
          65% {
            opacity: 1;
            transform: scaleX(1.03) translateY(2px) rotate(var(--rot-mid, 1deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(var(--rot-end, 0deg));
          }
        }

        /* 5. Header Ribbon / Nav Drop In */
        @keyframes canvaHeaderDropIn {
          0% {
            opacity: 0;
            transform: translateY(-45px);
          }
          70% {
            opacity: 1;
            transform: translateY(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .netflix-card {
          transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .netflix-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 9, 20, 0.35);
          border-color: rgba(229, 9, 20, 0.8) !important;
          z-index: 25;
        }

        .netflix-btn {
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .netflix-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(229, 9, 20, 0.45);
        }

        .nav-link {
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .nav-link:hover {
          color: #ffffff !important;
        }

        .tab-btn {
          transition: all 0.25s ease;
        }
        .tab-btn:hover {
          color: #ffffff !important;
        }
      `}</style>

      {/* ======================================================== */}
      {/* TOP NAVIGATION BAR (Exact Netflix Style)                  */}
      {/* ======================================================== */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '68px',
          padding: '0 clamp(1.2rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          animation: 'canvaHeaderDropIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
        }}
      >
        {/* Left: Netflix Brand & Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2.5vw, 2.5rem)' }}>
          {/* Iconic Netflix Style Red Logo */}
          <div
            style={{
              fontFamily: "'Montserrat', 'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.5rem, 2.5vw, 1.95rem)',
              fontWeight: 900,
              color: '#E50914',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(229, 9, 20, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>OURFLIX</span>
          </div>

          {/* Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.4rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#e5e5e5',
            }}
            className="hidden-on-mobile"
          >
            <span
              className="nav-link"
              onClick={() => setActiveCategory('All Memories')}
              style={{
                color: activeCategory === 'All Memories' ? '#fff' : '#b3b3b3',
                fontWeight: activeCategory === 'All Memories' ? 700 : 500,
              }}
            >
              Home
            </span>
            <span
              className="nav-link"
              onClick={() => setActiveCategory('Maze Game')}
              style={{
                color: activeCategory === 'Maze Game' ? '#fff' : '#b3b3b3',
                fontWeight: activeCategory === 'Maze Game' ? 700 : 500,
              }}
            >
              Maze Game
            </span>
            <span
              className="nav-link"
              onClick={() => setActiveCategory('Amour(French)')}
              style={{
                color: activeCategory === 'Amour(French)' ? '#fff' : '#b3b3b3',
                fontWeight: activeCategory === 'Amour(French)' ? 700 : 500,
              }}
            >
              Amour(French)
            </span>
            <span
              className="nav-link"
              onClick={() => setActiveCategory('Musika')}
              style={{
                color: activeCategory === 'Musika' ? '#fff' : '#b3b3b3',
                fontWeight: activeCategory === 'Musika' ? 700 : 500,
              }}
            >
              Musika
            </span>
            <span
              className="nav-link"
              onClick={() => setActiveCategory('A Quite Glimpse of Us')}
              style={{
                color: activeCategory === 'A Quite Glimpse of Us' ? '#fff' : '#b3b3b3',
                fontWeight: activeCategory === 'A Quite Glimpse of Us' ? 700 : 500,
              }}
            >
              A Quite Glimpse of Us
            </span>
            <span
              className="nav-link"
              style={{
                color: '#E50914',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>Vault</span>
              <span style={{ fontSize: '0.65rem', background: '#E50914', color: '#fff', padding: '1px 5px', borderRadius: '3px' }}>
                LIVE
              </span>
            </span>
          </nav>
        </div>

        {/* Right: Search Bar & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              gap: '0.5rem',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                fontFamily: 'inherit',
                width: 'clamp(90px, 14vw, 150px)',
              }}
            />
          </div>

          {/* Kikay & Bebot Cute Profile Badge */}
          <div
            title="Kikay & Bebot"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #E50914 0%, #b81d24 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.82rem',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(229, 9, 20, 0.4)',
              }}
            >
              K♡
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* HERO SECTION: VIDEO BACKGROUND WITH RIGHT-ALIGNED VAULT */}
      {/* ======================================================== */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(480px, 66vh, 620px)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end', // Aligns title on the right as requested
          padding: '0 clamp(1.5rem, 5vw, 4.5rem)',
          boxSizing: 'border-box',
          animation: 'canvaBoardIntro 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both',
        }}
      >
        {/* Full-width Video Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <video
            ref={videoRef}
            key={currentVideo.src}
            src={currentVideo.src}
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={handleNextVideo}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              display: 'block',
              opacity: isVideoFading ? 0 : 1,
              transition: 'opacity 0.4s ease-in-out',
            }}
          />

          {/* Cinema Gradients: Darken Left, Top, and Deep Fade to Bottom Content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 75% 45%, rgba(0,0,0,0.2) 0%, rgba(17,17,17,0.7) 65%, rgba(17,17,17,0.95) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #111111 0%, rgba(17,17,17,0.85) 18%, rgba(17,17,17,0.2) 50%, rgba(17,17,17,0.6) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Right side reading vignette */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '65%',
              background:
                'linear-gradient(to left, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.65) 45%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ======================================================== */}
        {/* TITLE ON THE RIGHT: THE MEMORY VAULT                    */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '560px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            paddingTop: '2.5rem',
            '--rot-start': '4deg',
            '--rot-mid': '-1.2deg',
            '--rot-settle': '0.4deg',
            '--rot-end': '0deg',
            animation: 'canvaPaperDropIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both',
          }}
        >
          {/* Category Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.5rem',
            }}
          >
            <span
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#E50914',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              ★ OUR ARCHIVE COLLECTION
            </span>
          </div>

          {/* Futuristic / Cinematic Title (like ALTERED CARBON) */}
          <h1
            style={{
              fontFamily: "'Montserrat', 'Cinzel', sans-serif",
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 0.4rem 0',
              lineHeight: '1.08',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 9, 20, 0.45)',
            }}
          >
            THE MEMORY
            <br />
            <span style={{ color: '#E50914' }}>VAULT</span>
          </h1>

          {/* Metadata Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#b3b3b3',
              marginBottom: '1rem',
            }}
          >
            <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 5px', borderRadius: '2px', fontSize: '0.7rem' }}>
              4K ULTRA HD
            </span>
            <span>{VAULT_VIDEOS.length} Video Memories</span>
          </div>

          {/* Romantic Vault Description */}
          <p
            style={{
              fontSize: 'clamp(0.86rem, 1.3vw, 0.98rem)',
              lineHeight: '1.65',
              color: '#d2d2d2',
              margin: '0 0 1.5rem 0',
              maxWidth: '480px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
            }}
          >
            A permanent sanctuary where every laugh, late-night confession, random food trip, and quiet milestone is stored in high definition. Every memory documented, forever replayable.
          </p>

          {/* Current Video Name Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(20, 20, 20, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.76rem',
              color: '#f8d7da',
              marginBottom: '1.4rem',
            }}
          >
            <span style={{ color: '#E50914' }}>●</span>
            <span style={{ fontWeight: 600 }}>Memory {videoIndex + 1} of {VAULT_VIDEOS.length}</span>
          </div>

          {/* THE 2 BUTTONS: PREV AND NEXT CONTROLS FOR THE VIDEO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* Prev Video Button */}
            <button
              onClick={handlePrevVideo}
              className="netflix-btn"
              style={{
                background: '#E50914',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.75rem 1.6rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                boxShadow: '0 6px 18px rgba(229, 9, 20, 0.4)',
              }}
            >
              <span>❮</span>
              <span>Previous Clip</span>
            </button>

            {/* Next Video Button */}
            <button
              onClick={handleNextVideo}
              className="netflix-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '6px',
                padding: '0.75rem 1.6rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
              }}
            >
              <span>Next Clip</span>
              <span>❯</span>
            </button>

            {/* Audio Mute/Unmute Toggle */}
            <button
              onClick={() => setIsMuted((m) => !m)}
              title={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
              style={{
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* CATEGORY / GENRE FILTER BAR (Like Sci-Fi in Screenshot)  */}
      {/* ======================================================== */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0 clamp(1.5rem, 5vw, 4.5rem)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 2.5vw, 2.2rem)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          marginBottom: '2rem',
          '--rot-start': '-1.5deg',
          '--rot-mid': '0.5deg',
          '--rot-settle': '0deg',
          '--rot-end': '0deg',
          animation: 'canvaTapeStickIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="tab-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#ffffff' : '#888888',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                padding: '0.85rem 0',
                cursor: 'pointer',
                borderBottom: isActive ? '3px solid #E50914' : '3px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* SELECTION SECTION: NETFLIX CARDS (Top Picks / Chapters)  */}
      {/* ======================================================== */}
      <section
        style={{
          padding: '0 clamp(1.5rem, 5vw, 4.5rem) 4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.4rem',
            '--rot-start': '-5deg',
            '--rot-mid': '1.8deg',
            '--rot-settle': '-0.4deg',
            '--rot-end': '0deg',
            animation: 'canvaStickerStampIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.55rem)',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <span>Top Picks for Us</span>
            <span style={{ fontSize: '0.8rem', color: '#b3b3b3', fontWeight: 500 }}>
              (Click any chapter to replay)
            </span>
          </h2>
        </div>

        {/* Card Row Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.4rem',
          }}
        >
          {filteredCards.map((card, idx) => {
            const tilt = CARD_TILTS[idx % CARD_TILTS.length];
            return (
              <div
                key={card.id}
                style={{
                  '--rot-start': tilt.start,
                  '--rot-mid': tilt.mid,
                  '--rot-settle': tilt.settle,
                  '--rot-end': '0deg',
                  animation: `canvaPaperDropIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${(0.48 + idx * 0.12).toFixed(2)}s both`,
                  display: 'flex',
                }}
              >
                <div
                  onClick={() => {
                    if (onSelectChapter) {
                      onSelectChapter(card.id);
                    } else {
                      setSelectedCard(card);
                    }
                  }}
                  className="netflix-card"
                  style={{
                    background: '#181818',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
              {/* Card Thumbnail Poster */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '148px',
                  background: '#222',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Badge Top Left (GAME only) */}
                {card.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(229, 9, 20, 0.9)',
                      color: '#fff',
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      letterSpacing: '0.08em',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                    }}
                  >
                    {card.badge}
                  </div>
                )}

                {/* Duration Top Right */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#e5e5e5',
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '3px',
                  }}
                >
                  {card.duration}
                </div>

                {/* Overlay Play Icon on Hover */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#E50914',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1rem',
                      boxShadow: '0 4px 15px rgba(229, 9, 20, 0.6)',
                    }}
                  >
                    ▶
                  </div>
                </div>
              </div>

              {/* Card Meta Description */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#E50914', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {card.episode}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: '1.3',
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#a3a3a3',
                    lineHeight: '1.45',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {card.description}
                </p>

                {/* Play Button Bar */}
                <div style={{ marginTop: 'auto', paddingTop: '0.6rem' }}>
                  <button
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '0.45rem 0',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E50914';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <span>▶</span>
                    <span>Play Chapter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
        </div>
      </section>

      {/* Modal Details if card is clicked when no direct router is used */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#181818',
              borderRadius: '10px',
              maxWidth: '460px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <img
                src={selectedCard.image}
                alt={selectedCard.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedCard(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <span style={{ color: '#E50914', fontWeight: 700, fontSize: '0.8rem' }}>
                {selectedCard.episode}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.3rem 0 0.8rem' }}>
                {selectedCard.title}
              </h2>
              <p style={{ color: '#b3b3b3', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
                {selectedCard.description}
              </p>
              <button
                onClick={() => {
                  setSelectedCard(null);
                  if (onSelectChapter) onSelectChapter(selectedCard.id);
                }}
                style={{
                  width: '100%',
                  background: '#E50914',
                  border: 'none',
                  color: '#fff',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>▶ Start Experience</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
