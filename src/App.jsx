import React, { useState, useEffect, useRef } from 'react';
import PetalCanvas from './components/PetalCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LetterModal from './components/LetterModal';
import QuotesSection from './components/QuotesSection';
import MomentsSection from './components/MomentsSection';
import Footer from './components/Footer';
import GameIntro from './components/GameIntro';
import MusicPlayer from './components/MusicPlayer';
import WebGLBackground from './components/WebGLBackground';

export default function App() {
  const [zoomDone, setZoomDone] = useState(false);
  const [zoomFading, setZoomFading] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amourRevealed, setAmourRevealed] = useState(false);
  const [showLockPage, setShowLockPage] = useState(false);
  const [pin, setPin] = useState([]);
  const [pinError, setPinError] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [tulipCount, setTulipCount] = useState(0);
  const [wrongCat, setWrongCat] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState([]);
  const [showBgPage, setShowBgPage] = useState(false);
  const [exitAnimating, setExitAnimating] = useState(false);
  const [bgRevealStep, setBgRevealStep] = useState(0);
  const [bgExitStep, setBgExitStep] = useState(0);
  const [bgExitTarget, setBgExitTarget] = useState('close');
  const [bgPageIndex, setBgPageIndex] = useState(0);
  const [p2Step, setP2Step] = useState(0);
  const [p2ExitStep, setP2ExitStep] = useState(0);
  const [p2ExitTarget, setP2ExitTarget] = useState('close');
  const [p3Step, setP3Step] = useState(0);
  const [songPlaying, setSongPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [bgMusicPauseTrigger, setBgMusicPauseTrigger] = useState(0);
  const [bgMusicResumeTrigger, setBgMusicResumeTrigger] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [pageFade, setPageFade] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [p3ExitStep, setP3ExitStep] = useState(0);
  const [showPage4, setShowPage4] = useState(false);
  const [p4Step, setP4Step] = useState(0);
  const [p4LetterWordsVisible, setP4LetterWordsVisible] = useState(0);
  const [p4TypewriterChars, setP4TypewriterChars] = useState(0);
  const [stickyFlipped, setStickyFlipped] = useState([false, false, false, false, false, false]);
  const [boxOpen, setBoxOpen] = useState(false);
  const [boxCardIndex, setBoxCardIndex] = useState(0);
  const [boxShowFinal, setBoxShowFinal] = useState(false);
  const [exitOverlay, setExitOverlay] = useState(false);
  const p4StripImages = [
    '/moments/1.jpg', '/moments/2.jpg', '/moments/3.jpg', '/moments/4.jpg',
    '/moments/5.jpg', '/moments/6.png', '/moments/7.jpg', '/moments/8.jpg',
    '/moments/9.jpg', '/moments/10.jpg', '/moments/11.jpg', '/moments/12.jpg',
    '/moments/13.jpg', '/moments/14.jpg', '/moments/15.jpg', '/moments/16.jpg',
    '/moments/17.jpg', '/moments/her.png', '/moments/her1.png', '/moments/her3.png',
  ];

  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const pasilyoRef = useRef(null);
  const pasilyoVideoRef = useRef(null);
  const scrollLockRef = useRef(0);

  const songData = [
    { title: 'Pasilyo', artist: 'SunKissed Lola', image: '/moments/14.jpg', audio: '/music/pasilyo.mp3', gif: '/moments/cat3.gif' },
    { title: 'Glue', artist: 'Bini', image: '/moments/17.jpg', audio: '/music/glue.mp3', gif: '/moments/cat9.gif' },
    { title: 'Tibok', artist: 'Earl Agustin', image: '/moments/16.jpg', audio: '/music/tibok.mp3', gif: '/moments/cat7.gif' },
    { title: 'Palagi', artist: 'Syd Hartha', image: '/moments/11.jpg', audio: '/music/palagi.mp3', gif: '/moments/cat12.gif' },
    { title: 'Ikaw at Ako', artist: 'Moira Dela Torre', image: '/moments/13.jpg', audio: '/music/ikawatako.mp3', gif: '/moments/cat13.gif' },
    { title: 'Her', artist: 'Unknown', image: '/moments/her.png', audio: '/music/her.mp3', gif: '/moments/cat14.gif' },
  ];

  const letterContent = [
    { emoji: '\uD83C\uDF37', subtitle: 'The beginning.', body: "This was one of the first songs that made me think of you. It reminds me that some people quietly become important before you even realize it." },
    { emoji: '\uD83D\uDC8C', subtitle: 'The comfort.', body: "I don't know why, but this song always reminds me of how easy it feels talking to you. Even on ordinary days, you somehow make them feel a little brighter." },
    { emoji: '\u2764\uFE0F', subtitle: 'The feeling.', body: "This one reminds me of those moments when I catch myself smiling because of you. No big reason\u2014just you." },
    { emoji: '\uD83C\uDF3C', subtitle: 'The constant.', body: "This song reminds me that some people naturally become part of your everyday thoughts. You're one of those people for me." },
    { emoji: '\uD83C\uDF19', subtitle: 'The hope.', body: "Not because we're already there, but because it reminds me of the kind of future I'd love to build\u2014with patience, trust, and genuine care." },
    { emoji: '\uD83C\uDF3C', subtitle: 'The quiet one.', body: "This song reminds me how someone can quietly become special. I don't have all the answers about where our story will go, but I'm grateful that you're part of it." },
  ];

  const p4QA = [
    ['whether you\u2019re appreciated\u2014', 'You are.'],
    ['whether someone is quietly rooting for you\u2014', 'I am.'],
    ['whether you have to figure everything out on your own\u2014', 'You don\u2019t.'],
    ['whether I\u2019ll still be here cheering you on\u2014', 'Absolutely.'],
  ];

  const p4NewLetter = "Looking back at these moments, I realize it was never about doing anything extraordinary. It was the ordinary conversations, the random laughs, the little updates about our day, and simply having someone to share them with. You became someone I genuinely enjoy having in my life, and I'm grateful that our paths crossed. Wherever life takes us, I hope you never forget how appreciated you are\u2014not just by me, but for the person you are. If one day you begin doubting yourself, come back here for a little reminder.";

  const p4Sentences = [
    'And before you go...',
    'You are appreciated.',
    'You are valued.',
    'You are important.',
    "And I'm really glad we met. \u2764\ufe0f",
  ];

  const p4TypewriterText = "Thank you for reading my little corner of the internet. I made this because sometimes words are easier to write than to say. Whether you visit this once or a hundred times, I hope every time you finish reading this, you take at least one reminder with you\u2014that someone is quietly cheering for you, proud of you, and grateful that you're part of their life. Take care, kikay.\ud83e\udd0d";

  const stickyNotes = [
    { emoji: '\uD83C\uDF71', text: "Don't forget to eat on busy days." },
    { emoji: '\uD83C\uDF38', text: "I'm always rooting for you." },
    { emoji: '\uD83D\uDCDA', text: "One bad day doesn't define you." },
    { emoji: '\u2615', text: "I'm proud of how hard you're working." },
    { emoji: '\uD83C\uDF19', text: "Rest is productive too." },
    { emoji: '\uD83E\uDD0D', text: "I hope you smile a little today." },
  ];
  const noteRotations = [-2, 1, -1, 3, 0, -2];

  const boxCards = [
    { title: 'Can I take my time?', text: "Always. There's no deadline with me. I'd rather let things grow naturally than rush something meaningful." },
    { title: 'What if I have a bad day?', text: "Then let it be a bad day. You don't have to pretend you're okay around me." },
    { title: 'Will you still cheer me on?', text: "Every single time. Whether it's school, your goals, or the little victories no one else notices." },
    { title: 'What if I overthink?', text: "I'll choose patience over pressure. You never have to have everything figured out." },
    { title: 'Do I have to be perfect?', text: "Never. I appreciate you for who you are, not for being perfect." },
    { title: 'What do you hope for me?', text: "That you stay kind to yourself, keep believing in what you're capable of, and never forget how much you're worth." },
  ];

  function handleGameComplete() {
    setGameDone(true);
    // Slight delay then reveal amour-root with fade
    requestAnimationFrame(() => {
      setAmourRevealed(true);
    });
  }

  useEffect(() => {
    if (pinUnlocked) {
      const colors = ['#9b3a4a', '#b8923a', '#d4847a', '#c8ab37', '#e8c4a0', '#f5ede0'];
      const particles = [];
      for (let i = 0; i < 40; i++) {
        const isLeft = i < 20;
        particles.push({
          id: i,
          isLeft,
          dx: isLeft ? 80 + Math.random() * 350 : -(80 + Math.random() * 350),
          dy: (Math.random() - 0.5) * 600,
          dr: (Math.random() - 0.5) * 720,
          size: 6 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          duration: 1.2 + Math.random() * 1,
          top: 10 + Math.random() * 80,
          round: Math.random() > 0.5,
        });
      }
      setConfettiParticles(particles);
    }
  }, [pinUnlocked]);

  useEffect(() => {
    if (!exitAnimating) return;
    const t = setTimeout(() => {
      setShowBgPage(true);
      setShowLockPage(false);
      setExitAnimating(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [exitAnimating]);

  useEffect(() => {
    if (!showBgPage) return;
    const t = setTimeout(() => {
      setBgRevealStep(1);
      if (bgPageIndex === 1) setP2Step(1);
    }, 100);
    return () => clearTimeout(t);
  }, [showBgPage, bgPageIndex]);

  useEffect(() => {
    if (bgRevealStep === 0 || bgRevealStep >= 4) return;
    const delays = [0, 1100, 1000, 0];
    const t = setTimeout(() => setBgRevealStep(s => s + 1), delays[bgRevealStep]);
    return () => clearTimeout(t);
  }, [bgRevealStep]);

  useEffect(() => {
    if (bgExitStep === 0 || bgExitStep >= 3) return;
    const delays = [0, 0.35, 1.0];
    const t = setTimeout(() => setBgExitStep(s => s + 1), delays[bgExitStep] * 1000);
    return () => clearTimeout(t);
  }, [bgExitStep]);

  useEffect(() => {
    if (bgExitStep < 3) return;
    if (bgExitTarget === 'next') {
      setBgPageIndex(1);
    } else {
      setShowBgPage(false);
      setBgPageIndex(0);
      setPageFade(1);
    }
    setBgExitStep(0);
    setBgRevealStep(0);
    setP2Step(0);
    setP2ExitStep(0);
    setBgExitTarget('close');
  }, [bgExitStep]);

  useEffect(() => {
    if (p2Step === 0 || p2Step >= 5) return;
    const delays = [0, 800, 400, 400, 400];
    const t = setTimeout(() => setP2Step(s => s + 1), delays[p2Step]);
    return () => clearTimeout(t);
  }, [p2Step]);

  useEffect(() => {
    if (p2ExitStep === 0 || p2ExitStep >= 4) return;
    const delays = [0, 1.2, 0.3, 0.3];
    const t = setTimeout(() => setP2ExitStep(s => s + 1), delays[p2ExitStep] * 1000);
    return () => clearTimeout(t);
  }, [p2ExitStep]);

  useEffect(() => {
    if (p2ExitStep < 4) return;
    if (p2ExitTarget === 'next') {
      setPageFade(0);
      setTimeout(() => {
        setBgPageIndex(2);
        setP3Step(0);
        setP2ExitStep(0);
        setP2Step(0);
        setBgRevealStep(0);
        setBgExitStep(0);
        setP2ExitTarget('close');
        requestAnimationFrame(() => setPageFade(1));
      }, 500);
    } else {
      setShowBgPage(false);
      setBgPageIndex(0);
      setPageFade(1);
      setP2ExitStep(0);
      setP2Step(0);
      setBgRevealStep(0);
      setBgExitStep(0);
      setP2ExitTarget('close');
    }
  }, [p2ExitStep, p2ExitTarget]);

  useEffect(() => {
    if (bgPageIndex !== 2) { setP3Step(0); return; }
    const t = setTimeout(() => setP3Step(1), 1300);
    return () => clearTimeout(t);
  }, [bgPageIndex]);

  useEffect(() => {
    if (p3ExitStep !== 1) return;
    const t = setTimeout(() => setP3ExitStep(2), 700);
    return () => clearTimeout(t);
  }, [p3ExitStep]);

  useEffect(() => {
    if (p3ExitStep !== 2) return;
    setShowPage4(true);
    setP3ExitStep(0);
  }, [p3ExitStep]);

  useEffect(() => {
    if (!showPage4) { setP4Step(0); setP4LetterWordsVisible(0); setP4TypewriterChars(0); return; }
    const delays = [3000, 2500, 1500, 500, 2000, 2500, 2000, 2500, 2000, 2500, 2000, 3000, 1200];
    const timers = [];
    delays.forEach((d, i) => {
      const t = setTimeout(() => setP4Step(i + 1), d + (i > 0 ? delays.slice(0, i).reduce((a, b) => a + b, 0) : 0));
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [showPage4]);

  useEffect(() => {
    if (p4Step !== 13) { setP4LetterWordsVisible(0); return; }
    const words = p4NewLetter.split(' ');
    const interval = setInterval(() => {
      setP4LetterWordsVisible(v => Math.min(v + 3, words.length));
    }, 60);
    return () => clearInterval(interval);
  }, [p4Step]);

  useEffect(() => {
    if (p4Step !== 20) return;
    const t = setTimeout(() => setP4Step(21), 1400);
    return () => clearTimeout(t);
  }, [p4Step]);

  useEffect(() => {
    if (p4Step < 21 || p4Step > 27) return;
    let delay;
    if (p4Step >= 21 && p4Step <= 24) delay = 2500;
    else if (p4Step === 25) delay = 5000;
    else if (p4Step === 26) delay = 500;
    else if (p4Step === 27) return;
    else return;
    const t = setTimeout(() => setP4Step(p4Step + 1), delay);
    return () => clearTimeout(t);
  }, [p4Step]);

  useEffect(() => {
    if (p4Step !== 28) return;
    const t = setTimeout(() => setP4Step(29), 2000);
    return () => clearTimeout(t);
  }, [p4Step]);

  useEffect(() => {
    if (p4Step !== 29) return;
    const t = setTimeout(() => setP4Step(30), 3000);
    return () => clearTimeout(t);
  }, [p4Step]);

  useEffect(() => {
    if (p4Step !== 30) return;
    setShowPage4(false);
    setShowBgPage(false);
    setP4Step(0);
    setP4LetterWordsVisible(0);
    setP4TypewriterChars(0);
    setExitOverlay(true);
    setTimeout(() => setExitOverlay(false), 2000);
  }, [p4Step]);

  useEffect(() => {
    if (p4Step !== 27) { setP4TypewriterChars(0); return; }
    const total = p4TypewriterText.length;
    const interval = setInterval(() => {
      setP4TypewriterChars(pc => {
        if (pc >= total) return pc;
        const next = pc + 1;
        if (next >= total) {
          setTimeout(() => setP4Step(28), 7000);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [p4Step]);

  useEffect(() => {
    if (!amourRevealed) return;
    const t = setTimeout(() => {
      if (rootRef.current) {
        rootRef.current.style.visibility = 'visible';
        rootRef.current.style.pointerEvents = 'auto';
        rootRef.current.style.opacity = '1';
      }
    }, 50);
    return () => clearTimeout(t);
  }, [amourRevealed]);

  useEffect(() => {
    setVideoLoaded(false);
  }, [currentSongIndex]);

  useEffect(() => {
    const v = pasilyoVideoRef.current;
    if (!v) return;
    if (songPlaying && videoLoaded) {
      v.play().catch(() => {});
    } else if (!songPlaying) {
      v.pause();
    }
  }, [currentSongIndex, songPlaying, videoLoaded]);



  function handlePinDigit(d) {
    if (pinUnlocked || tulipCount > 0) return;
    if (pin.length >= 4) return;
    const next = [...pin, d];
    setPin(next);
    if (next.length === 4) {
      if (next.join('') === '0409') {
        for (let i = 1; i <= 4; i++) {
          setTimeout(() => setTulipCount(i), i * 400);
        }
        setTimeout(() => setPinUnlocked(true), 4 * 400 + 600);
      } else {
        setWrongCat(true);
        setPinError(true);
        setTimeout(() => {
          setWrongCat(false);
          setPinError(false);
          setPin([]);
        }, 5000);
      }
    }
  }

  function handleReadLetter() {
    setShowModal(true);
  }

  useEffect(() => {
    if (!shouldAutoPlay) return;
    const a = pasilyoRef.current;
    if (a) {
      a.play();
      setSongPlaying(true);
      setBgMusicPauseTrigger(t => t + 1);
      scrollLockRef.current = scrollRef.current?.scrollTop || 0;
    }
    setShouldAutoPlay(false);
  }, [shouldAutoPlay, currentSongIndex]);

  function handleCloseModal() {
    setShowModal(false);
  }

  function togglePasilyo() {
    const a = pasilyoRef.current;
    if (!a) return;
    if (a.paused) {
      a.play(); setSongPlaying(true);
      setBgMusicPauseTrigger(t => t + 1);
      scrollLockRef.current = scrollRef.current?.scrollTop || 0;
    } else {
      a.pause(); a.currentTime = 0; setSongPlaying(false);
      const v = pasilyoVideoRef.current;
      if (v) { v.pause(); v.currentTime = 0; }
      setBgMusicResumeTrigger(t => t + 1);
      scrollLockRef.current = 0;
    }
  }

  function prevSong() {
    const a = pasilyoRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    const v = pasilyoVideoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
    setSongPlaying(false);
    scrollLockRef.current = scrollRef.current?.scrollTop || 0;
    setCurrentSongIndex(i => (i - 1 + songData.length) % songData.length);
    setShouldAutoPlay(true);
  }
  function nextSong() {
    const a = pasilyoRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    const v = pasilyoVideoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
    setSongPlaying(false);
    scrollLockRef.current = scrollRef.current?.scrollTop || 0;
    setCurrentSongIndex(i => (i + 1) % songData.length);
    setShouldAutoPlay(true);
  }

  const vh = window.innerHeight;
  const sectionTopPx = 1.49 * vh;
  const fadeLen = Math.min(350, Math.max(150, 0.4 * vh));
  const stickyTop = vh;
  const boxTop = 2 * vh;
  const musicTop = 3 * vh;
  const flippedCount = stickyFlipped.filter(Boolean).length;
  const musicEntryP = Math.max(0, Math.min(1, (scrollY - (musicTop - fadeLen)) / fadeLen));

  return (
    <>
      {!gameDone && <GameIntro onComplete={handleGameComplete} />}

      {!zoomDone && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0d0508',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            animation: zoomFading ? 'fadeOut 0.6s ease forwards' : 'fadeIn 0.8s ease',
            fontFamily: "'Cormorant Garamond', serif",
            pointerEvents: zoomFading ? 'none' : 'auto',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.65rem',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#b8923a',
                marginBottom: '1.5rem',
              }}
            >
              &#10038; &nbsp; a quick note &nbsp; &#10038;
            </p>
            <p
              style={{
                fontStyle: 'italic',
                fontSize: '1.15rem',
                lineHeight: 1.9,
                color: 'rgba(245,237,224,0.85)',
                marginBottom: '1rem',
              }}
            >
              Kindly set your browser zoom to 125% for the best experience.
            </p>
            <p
              style={{
                fontStyle: 'italic',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(245,237,224,0.6)',
                marginBottom: '2.5rem',
              }}
            >
              To do this, hold the <strong style={{ color: '#b8923a' }}>Ctrl</strong> button and scroll up until the zoom indicator at the top right shows 125%. Once you have the correct zoom, click continue below.
            </p>
            <button
              onClick={() => {
                setZoomFading(true);
                setTimeout(() => setZoomDone(true), 600);
              }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#9b3a4a',
                background: 'transparent',
                border: '1px solid #9b3a4a',
                padding: '0.8rem 2.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#9b3a4a';
                e.currentTarget.style.color = '#f5ede0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9b3a4a';
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div
        ref={rootRef}
        id="amour-root"
        style={{
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.8s ease',
          display: showLockPage || showBgPage ? 'none' : undefined,
        }}
      >
          <PetalCanvas />
          <Navbar onLetterClick={handleReadLetter} />
          <Hero onReadLetter={handleReadLetter} />
          {showModal && <LetterModal onClose={handleCloseModal} />}
          <QuotesSection />
          <MomentsSection onLockClick={() => setShowLockPage(true)} />
          <Footer />
        </div>

      {showLockPage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: pinUnlocked ? '#fff' : 'linear-gradient(160deg, #fdf6ed 0%, #f5ede0 50%, #f0e6d6 100%)',
            display: 'flex',
            animation: 'fadeIn 0.8s ease',
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          <button
            onClick={() => { setShowLockPage(false); setShowBgPage(false); setExitAnimating(false); setPin([]); setPinError(false); setPinUnlocked(false); setTulipCount(0); setConfettiParticles([]); }}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              zIndex: 10,
              fontFamily: "'Cinzel', serif",
              fontSize: '1.5rem',
              color: 'var(--ink)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: 0.3,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.3)}
          >
            &#10005;
          </button>

          <img
            src="/moments/tulip.png"
            alt=""
            style={{
              position: 'absolute',
              left: '-240px',
              top: 'calc(50% + 200px)',
              transform: 'translateY(-50%) rotate(15deg)',
              width: 'auto',
              height: '540px',
              pointerEvents: exitAnimating ? 'none' : 'none',
              zIndex: 20,
              animation: exitAnimating ? 'slideOutLeft 0.8s ease-in forwards' : 'slideInLeft 1.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          />
          <img
            src="/moments/tulip.png"
            alt=""
            style={{
              position: 'absolute',
              right: '-240px',
              top: 'calc(50% + 200px)',
              transform: 'translateY(-50%) rotate(-15deg) scaleX(-1)',
              width: 'auto',
              height: '540px',
              pointerEvents: 'none',
              zIndex: 20,
              animation: exitAnimating ? 'slideOutRight 0.8s ease-in forwards' : 'slideInRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          />

          {pinUnlocked && confettiParticles.map(p => {
            return (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: p.isLeft ? 0 : 'auto',
                  right: p.isLeft ? 'auto' : 0,
                  top: p.top + '%',
                  width: p.size + 'px',
                  height: p.size + 'px',
                  background: p.color,
                  borderRadius: p.round ? '50%' : '2px',
                  zIndex: 15,
              filter: 'brightness(1.35)',
              pointerEvents: 'none',
                  animation: 'confettiBurst ' + p.duration + 's ' + p.delay + 's ease-out both',
                  '--dx': p.dx + 'px',
                  '--dy': p.dy + 'px',
                  '--dr': p.dr + 'deg',
                }}
              />
            );
          })}

          {!pinUnlocked ? (
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem 2rem 1rem calc(2rem + 250px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.6rem',
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}
                  >
                    &#10038; &nbsp; a locked page &nbsp; &#10038;
                  </span>
                  <h1
                    style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                      fontWeight: 400,
                      color: 'var(--ink)',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    Hidden Words<br />From My Heart
                  </h1>
                  <div
                    style={{
                      width: '3rem',
                      height: '1px',
                      background: 'var(--blush)',
                      opacity: 0.5,
                      marginTop: '0.3rem',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '48px',
                        height: '56px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.4rem',
                        color: 'var(--ink)',
                        background: pin[i] !== undefined ? 'rgba(184,146,58,0.08)' : 'transparent',
                        transition: 'all 0.2s ease',
                        border: '2px solid ' + (pinError ? 'var(--rose)' : pin[i] !== undefined ? 'var(--rose)' : 'rgba(184,146,58,0.35)'),
                      }}
                    >
                      {pin[i] !== undefined ? (
                        i < tulipCount ? (
                          <svg width="22" height="32" viewBox="0 0 22 32" fill="none" style={{ display: 'block' }}>
                            <path d="M11 21Q6 21 5 17Q4 12 5 9Q6 5 7 3Q8 4 9 4Q10 2 11 1Q12 2 13 4Q14 4 15 3Q16 5 17 9Q18 12 17 17Q16 21 11 21Z" fill="#9b3a4a" fillOpacity="0.88" />
                            <path d="M11 21V28" stroke="#9b3a4a" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M11 23Q6 23 3 27" stroke="#9b3a4a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M11 25Q16 25 19 29" stroke="#9b3a4a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                          </svg>
                        ) : (
                          '✧'
                        )
                      ) : ''}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 60px)',
                    gap: '10px',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      onClick={() => handlePinDigit(n)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        border: '1px solid rgba(184,146,58,0.25)',
                        background: 'rgba(253,246,237,0.6)',
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.2rem',
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(26,10,8,0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--rose)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = 'var(--rose)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(155,58,74,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(253,246,237,0.6)';
                        e.currentTarget.style.color = 'var(--ink)';
                        e.currentTarget.style.borderColor = 'rgba(184,146,58,0.25)';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,10,8,0.06)';
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <div />
                  <button
                    onClick={() => handlePinDigit(0)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      border: '1px solid rgba(184,146,58,0.25)',
                      background: 'rgba(253,246,237,0.6)',
                      fontFamily: "'Cinzel', serif",
                      fontSize: '1.2rem',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(26,10,8,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--rose)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--rose)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(155,58,74,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(253,246,237,0.6)';
                      e.currentTarget.style.color = 'var(--ink)';
                      e.currentTarget.style.borderColor = 'rgba(184,146,58,0.25)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,10,8,0.06)';
                    }}
                  >
                    0
                  </button>
                  <button
                    onClick={() => { setPin([]); setPinError(false); }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '0.8rem',
                      fontStyle: 'italic',
                      color: '#7a6a64',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--rose)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#7a6a64'; }}
                  >
                    clear
                  </button>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  background: 'rgba(253,246,237,0.3)',
                  position: 'relative',
                }}
              >
                <img
                  src={wrongCat ? '/moments/cat2.gif' : '/moments/cat4.gif'}
                  alt=""
                  style={{
                    width: '42%',
                    height: 'auto',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    boxShadow: '0 4px 24px rgba(26,10,8,0.08)',
                    transition: 'box-shadow 0.6s ease, opacity 0.4s ease',
                  }}
                />

                {pinError && (
                  <div
                    style={{
                      marginTop: '1rem',
                      background: 'var(--rose)',
                      color: '#fff',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic',
                      fontSize: '0.95rem',
                      padding: '10px 18px',
                      borderRadius: '14px',
                      maxWidth: '260px',
                      textAlign: 'center',
                      lineHeight: 1.5,
                      position: 'relative',
                      animation: 'fadeIn 0.3s ease',
                      boxShadow: '0 4px 16px rgba(155,58,74,0.2)',
                    }}
                  >
                    Almost! Here's a little hint.
                    <br />
                    <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                      It's the day we first met.
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '30px',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '8px solid var(--rose)',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  animation: exitAnimating ? 'fadeOut 0.4s ease 0s both' : 'textFade 0.8s ease 0.2s both',
                }}
              >
                &#10038; &nbsp; unlocked &nbsp; &#10038;
              </span>
              <h1
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  fontWeight: 400,
                  color: 'var(--rose)',
                  lineHeight: 1.3,
                  animation: exitAnimating ? 'fadeOut 0.4s ease 0.15s both' : 'textFade 0.8s ease 0.4s both',
                }}
              >
                You remembered.
              </h1>
              <img
                src="/moments/cat5.gif"
                alt=""
                style={{
                  width: '42%',
                  maxWidth: '420px',
                  height: 'auto',
                  maxHeight: '55vh',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  boxShadow: '0 8px 40px rgba(155,58,74,0.15)',
                  animation: exitAnimating ? 'fadeOut 0.4s ease 0.3s both' : 'catReveal 2s ease forwards',
                }}
              />
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: '#7a6a64',
                  maxWidth: '360px',
                  lineHeight: 1.7,
                  animation: exitAnimating ? 'fadeOut 0.4s ease 0.45s both' : 'textFade 0.8s ease 1s both',
                }}
              >
                April 9 — the day we crossed paths,
                <br />
                and I'm really glad we did.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginTop: '0.5rem',
                  animation: exitAnimating ? 'fadeOut 0.4s ease 0.6s both' : undefined,
                }}
              >
                <div style={{ width: '10px', height: '1px', background: 'var(--rose)', opacity: 0.4 }} />
                <span
                  onClick={() => setExitAnimating(true)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: '1rem',
                  color: songPlaying && videoLoaded ? 'rgba(255,255,255,0.85)' : 'var(--rose)',
                    cursor: exitAnimating ? 'default' : 'pointer',
                    letterSpacing: '0.05em',
                    animation: exitAnimating ? 'fadeOut 0.4s ease 0.6s both' : 'flicker 2.5s ease-in-out infinite',
                  }}
                >
                  click to continue
                </span>
                <div style={{ width: '10px', height: '1px', background: 'var(--rose)', opacity: 0.4 }} />
              </div>
            </div>
          )}
        </div>
      )}

      {showBgPage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2000,
            background: 'url(/moments/' + (bgPageIndex === 2 ? 'bg3.png' : 'bg1.jpg') + ') center/cover no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            opacity: pageFade,
            transition: 'opacity 0.5s ease',
          }}
        >
          <img
            src="/moments/letter.png"
            alt=""
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: p2ExitStep >= 1 ? 'translateY(200vh) translate(-50%, calc(-50% + 400px))' : bgPageIndex >= 1 ? 'translate(-50%, calc(-50% + 400px))' : bgRevealStep >= 1 ? 'translate(-50%, calc(-50% + 400px))' : 'translateY(200vh) translate(-50%, calc(-50% + 400px))',
              maxWidth: 'calc(76vw + 800px)',
              maxHeight: 'calc(76vh + 800px)',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              pointerEvents: 'none',
              opacity: bgPageIndex === 2 ? 0 : 1,
              transition: p2ExitStep >= 1 ? 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : bgPageIndex >= 1 ? 'none' : 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
          {bgPageIndex === 0 && <><div
            style={{
              position: 'absolute',
              left: '46%',
              top: '38%',
              transform: bgExitStep >= 2 ? 'translateX(80px) translate(-50%, -50%)' : bgRevealStep >= 2 ? 'translate(-50%, -50%)' : 'translateX(80px) translate(-50%, -50%)',
              width: 'min(800px, 50vw)',
              maxHeight: 'calc(76vh + 400px)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              lineHeight: 1.8,
              color: '#3a2a24',
              padding: '10% 8%',
              textAlign: 'right',
              overflowY: 'auto',
              pointerEvents: 'none',
              opacity: bgExitStep >= 2 ? 0 : bgRevealStep >= 2 ? 1 : 0,
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            Thank you for being you. You may not realize it, but you've brought so much happiness into my life. Some days become lighter just because I got to talk to you. Some moments become special simply because you were part of them.
          </div>
          <div
            style={{
              position: 'absolute',
              left: '52%',
              top: '74%',
              transform: bgExitStep >= 2 ? 'translateX(-80px) translate(-50%, -50%)' : bgRevealStep >= 3 ? 'translate(-50%, -50%)' : 'translateX(-80px) translate(-50%, -50%)',
              width: 'min(800px, 48vw)',
              maxHeight: 'calc(40vh)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              lineHeight: 1.8,
              color: '#3a2a24',
              padding: '2% 8%',
              textAlign: 'left',
              pointerEvents: 'none',
              opacity: bgExitStep >= 2 ? 0 : bgRevealStep >= 3 ? 1 : 0,
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            Thank you for the laughs, the random conversations, the small updates about your day, and even the moments when you just stayed. Thank you for letting me get to know you, little by little.
          </div>
          {bgPageIndex === 0 && (
            <span
              onClick={() => { if (bgExitStep === 0) { setBgExitTarget('next'); setBgExitStep(1); } }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '90%',
                transform: 'translate(-50%, -50%)',
                zIndex: 15,
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--rose)',
                cursor: bgExitStep === 0 ? 'pointer' : 'default',
                letterSpacing: '0.05em',
                opacity: bgExitStep >= 2 ? 0 : bgRevealStep >= 3 ? 1 : 0,
                transition: 'opacity 0.8s ease',
                pointerEvents: bgExitStep === 0 ? 'auto' : 'none',
              }}
            >
              click to continue
            </span>
          )}
          <div
            style={{
              position: 'absolute',
              left: '25%',
              top: '76%',
              transform: bgExitStep >= 2 ? 'translateY(-200vh) translate(-50%, -50%) rotate(10deg)' : bgExitStep === 1 ? 'translate(-50%, calc(-50% + 25px)) rotate(10deg)' : bgRevealStep >= 1 ? 'translate(-50%, -50%) rotate(10deg)' : 'translateY(-200vh) translate(-50%, -50%) rotate(10deg)',
              background: '#fff',
              padding: '0 16px 140px',
              borderRadius: '4px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: bgExitStep === 1 ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' : bgExitStep >= 2 ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 1.5s cubic-bezier(0.25, 1.2, 0.5, 1)',
            }}
          >
            <div
              style={{
                width: 'calc(20vw - 60px)',
                height: 'calc(40vh - 40px)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src="/moments/11.jpg"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '120%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          </div>
          <div
            style={{
              background: '#fff',
              padding: '0 16px 140px',
              borderRadius: '4px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: '800px',
              transform: bgExitStep >= 2 ? 'translateY(calc(-70px - 200vh)) rotate(-10deg)' : bgExitStep === 1 ? 'translateY(calc(-70px + 25px)) rotate(-10deg)' : bgRevealStep >= 1 ? 'translateY(-70px) rotate(-10deg)' : 'translateY(calc(-70px - 200vh)) rotate(-10deg)',
              transition: bgExitStep === 1 ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' : bgExitStep >= 2 ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 1.5s cubic-bezier(0.25, 1.2, 0.5, 1)',
            }}
          >
            <img
              src="/moments/13 - Copy.jpg"
              alt=""
              style={{
                display: 'block',
                maxWidth: 'calc(48vw - 60px)',
                maxHeight: 'calc(48vh - 60px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
          <img
            src="/moments/cat6.gif"
            alt=""
            style={{
              position: 'absolute',
              left: 'calc(5% + 970px)',
              bottom: '24%',
              width: 'auto',
              height: '250px',
              borderRadius: '12px',
              objectFit: 'contain',
              clipPath: 'inset(20% 0 0 0)',
              opacity: bgExitStep >= 2 ? 0 : bgRevealStep >= 2 ? 1 : 0,
              transition: 'opacity 0.7s ease',
            }}
          />
          <button
            onClick={() => { if (bgExitStep === 0) { setBgExitTarget('close'); setBgExitStep(1); } }}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              zIndex: 10,
              fontFamily: "'Cinzel', serif",
              fontSize: '1.5rem',
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: bgExitStep === 0 ? 0.5 : 0,
              transition: 'opacity 0.3s ease',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              pointerEvents: bgExitStep === 0 ? 'auto' : 'none',
            }}
            onMouseEnter={(e) => { if (bgExitStep === 0) e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { if (bgExitStep === 0) e.currentTarget.style.opacity = 0.5; }}
          >
            &#10005;
          </button>
          </>}
          {bgPageIndex === 1 && (
            <>
              <img
                src="/moments/sunmoon.webp"
                alt=""
                style={{
                  position: 'absolute',
                  left: '10%',
                  top: '27%',
                  transform: p2ExitStep >= 1 ? 'translateX(-100px) translateY(-50%)' : p2Step >= 1 ? 'translateY(-50%)' : 'translateX(-100px) translateY(-50%)',
                  width: 'auto',
                  height: 'min(43vh, 400px)',
                  objectFit: 'contain',
                  opacity: p2ExitStep >= 1 ? 0 : p2Step >= 1 ? 1 : 0,
                  pointerEvents: 'none',
                  transition: 'opacity 1.2s ease, transform 1.2s ease',
                }}
              />
              <img
                src="/moments/cam.png"
                alt=""
                style={{
                  position: 'absolute',
                  right: '13%',
                  top: '84%',
                  transform: p2ExitStep >= 1 ? 'translateX(100px) translateY(-50%) scaleX(-1)' : p2Step >= 1 ? 'translateY(-50%) scaleX(-1)' : 'translateX(100px) translateY(-50%) scaleX(-1)',
                  width: 'auto',
                  height: '420px',
                  objectFit: 'contain',
                  opacity: p2ExitStep >= 1 ? 0 : p2Step >= 1 ? 1 : 0,
                  pointerEvents: 'none',
                  transition: 'opacity 1.2s ease, transform 1.2s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'min(590px, 70vw)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                  lineHeight: 1.9,
                  color: '#3a2a24',
                  textAlign: 'right',
                  padding: '2rem',
                  opacity: p2ExitStep >= 1 ? 0 : p2Step >= 1 ? 1 : 0,
                  transition: 'opacity 1.2s ease',
                }}
              >
                You once told me that I gave you comfort and peace, but the truth is, you've done the same for me. You became someone I genuinely look forward to talking to every day.
              </div>
              {['her.png', 'her1.png', 'her3.png'].map((src, i) => {
                const rotations = [-10, -10, 10];
                const leftPositions = [25, 75, 87];
                const topPositions = [75, 28, 47];
                const entered = p2Step >= (1 + i);
                const exiting = p2ExitStep >= 1;
                let t;
                if (exiting) {
                  t = 'translate(-50%, calc(-50% - 200vh)) rotate(' + rotations[i] + 'deg)';
                } else if (entered) {
                  t = 'translate(-50%, -50%) rotate(' + rotations[i] + 'deg)';
                } else {
                  t = 'translateY(-200vh) translate(-50%, -50%) rotate(' + rotations[i] + 'deg)';
                }
                return (
                  <div
                    key={src}
                    style={{
                      position: 'absolute',
                      left: leftPositions[i] + '%',
                      top: topPositions[i] + '%',
                      transform: t,
                      background: '#fff',
                      padding: '8px 8px 40px 8px', 
                      borderRadius: '3px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: exiting ? 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 1.5s cubic-bezier(0.25, 1.2, 0.5, 1)',
                      zIndex: 5,
                    }}
                  >
                    <img
                      src={'/moments/' + src}
                      alt=""
                      style={{
                        display: 'block',
                        width: 'auto',
                        height: 'min(600vh, 250px)',
                        objectFit: 'cover',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                );
              })}
              <span
                onClick={() => { if (p2ExitStep === 0) { setP2ExitTarget('next'); setP2ExitStep(1); } }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '90%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 15,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--rose)',
                  cursor: p2ExitStep === 0 ? 'pointer' : 'default',
                  letterSpacing: '0.05em',
                  opacity: p2ExitStep >= 1 ? 0 : p2Step >= 1 ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                  pointerEvents: p2ExitStep === 0 ? 'auto' : 'none',
                }}
              >
                click to continue
              </span>
              <button
                onClick={() => { if (p2ExitStep === 0) { setP2ExitTarget('close'); setP2ExitStep(1); } }}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '2rem',
                  zIndex: 10,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.5rem',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  cursor: p2ExitStep === 0 ? 'pointer' : 'default',
                  opacity: p2ExitStep === 0 ? 0.5 : 0,
                  transition: 'opacity 0.3s ease',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  pointerEvents: p2ExitStep === 0 ? 'auto' : 'none',
                }}
                onMouseEnter={(e) => { if (p2ExitStep === 0) e.currentTarget.style.opacity = 1; }}
                onMouseLeave={(e) => { if (p2ExitStep === 0) e.currentTarget.style.opacity = 0.5; }}
              >
                &#10005;
              </button>
            </>
          )}
          {bgPageIndex === 2 && (
            <>
              <video
                ref={pasilyoVideoRef}
                loop
                muted
                playsInline
                preload="auto"
                src={['/video/pasilyo.mp4', '/video/glue.mp4', '/video/tibok.mp4', '/video/palagi.mp4', '/video/ikawatako.mp4', '/video/her.mp4'][currentSongIndex]}
                onCanPlay={() => setVideoLoaded(true)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                  pointerEvents: 'none',
                  opacity: songPlaying && videoLoaded && !showPage4 ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  background: 'rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                  opacity: songPlaying && !showPage4 ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              />
              <div
                ref={scrollRef}
                onScroll={() => { if (!scrollRef.current) return; setScrollY(scrollRef.current.scrollTop); }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 5,
                  overflowY: songPlaying ? 'hidden' : 'auto',
                  overflowX: 'hidden',
                }}
              >
                <div style={{ height: 'calc(100vh)' }} />
                <div
                  style={{
                    position: 'absolute',
                    left: '30%',
                    top: '50vh',
                    transform: p3Step >= 1
                      ? `translate(calc(-50% + ${-Math.min(1, scrollY / 300) * 100}vw), -50%) rotate(3deg)`
                      : 'translateX(-100vw) translate(-50%, -50%) rotate(3deg)',
                    transition: p3Step >= 1 && scrollY === 0 ? 'transform 1.2s cubic-bezier(0.25, 1.2, 0.5, 1)' : 'none',
                    opacity: p3Step >= 1 ? 1 : 0,
                  }}
                >
                  <img
                    src="/moments/tulip1.webp"
                    alt=""
                    style={{
                      width: 'auto',
                      height: 'min(100vh, 600px)',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: '70%',
                    top: '55vh',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(500px, 38vw)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                    lineHeight: 2,
                    color: '#3a2a24',
                    opacity: Math.max(0, 1 - scrollY / 300) * (p3Step >= 1 ? 1 : 0),
                    transition: 'opacity 1s ease',
                    pointerEvents: 'none',
                  }}
                >
                  A few things I want you to remember.
                  You never have to force yourself to be okay around me.
                  If you're happy, I'll celebrate with you.
                  If you're tired, I'll understand.
                  If you're stressed, I'll listen.
                  If you're having a bad day, you don't have to pretend that everything is fine.
                  You don't always have to be strong.
                  I want you to know that my care for you isn't only there during the good days. It's there during the quiet days, the messy days, and the days when you feel like disappearing from everyone else.
                </div>

              {/* Sticky Notes Section */}
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%',
                opacity: Math.max(0, Math.min(1, (scrollY - (stickyTop - fadeLen)) / fadeLen)) - Math.max(0, Math.min(1, (scrollY - (boxTop - fadeLen)) / fadeLen)),
                transform: `translateY(${30 * (1 - Math.max(0, Math.min(1, (scrollY - (stickyTop - fadeLen)) / fadeLen)))}px)`,
                transition: 'none',
              }}>
                <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', color: '#3a2a24', textAlign: 'center', marginBottom: '0.3rem' }}>
                  Little Reminders, Just for You
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.15rem', color: '#7a6a64', textAlign: 'center', marginBottom: '1.5rem' }}>
                  Six little notes. Open them whenever you need a smile.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%' }}>
                  {stickyNotes.map((note, i) => (
                    <div
                      key={i}
                      onClick={() => setStickyFlipped(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                      style={{ perspective: '800px', height: '200px', cursor: 'pointer', transform: `rotate(${noteRotations[i]}deg)` }}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s ease',
                        transform: stickyFlipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          background: 'linear-gradient(135deg, #fdf6ed, #f5ede0)',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.7rem',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                          border: '1px solid rgba(184,146,58,0.2)',
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            left: '15%',
                            width: '70%',
                            height: '12px',
                            background: `linear-gradient(90deg, ${['#f4a4c8','#a8d8ea','#c8e6c9','#ffcc80','#ce93d8','#ef9a9a'][i]}, ${['#f06292','#4fc3f7','#81c784','#ffb74d','#ab47bc','#e57373'][i]})`,
                            borderRadius: '2px',
                            opacity: 0.75,
                            zIndex: 2,
                          }} />
                          <span style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{note.emoji}</span>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.8rem', color: '#7a6a64' }}>click me!</span>
                        </div>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          background: 'linear-gradient(135deg, #fff8e7, #fdf6ed)',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.7rem',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                          border: '1px solid rgba(184,146,58,0.2)',
                        }}>
                          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: '#3a2a24', textAlign: 'center', lineHeight: 1.5 }}>{note.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#7a6a64', textAlign: 'center' }}>
                  {flippedCount === 6 ? (
                    <span>&#x1F48C; All reminders opened</span>
                  ) : (
                    <span>&#x1F48C; {flippedCount} / 6 opened</span>
                  )}
                </div>
              </div>

              {/* Box Section */}
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%',
                textAlign: 'center',
                opacity: Math.max(0, Math.min(1, (scrollY - (boxTop - fadeLen)) / fadeLen)) - Math.max(0, Math.min(1, (scrollY - (musicTop - fadeLen)) / fadeLen)),
                transform: `translateY(${30 * (1 - Math.max(0, Math.min(1, (scrollY - (boxTop - fadeLen)) / fadeLen)))}px)`,
                transition: 'none',
              }}>
                <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#3a2a24', marginBottom: '0.0rem' }}>
                  A Little Box I Made for You
                </h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.15rem', color: '#7a6a64', marginBottom: '0rem' }}>
                  Open it whenever you need a little reminder.
                </p>
                <div
                  onClick={() => setBoxOpen(true)}
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/moments/box.png" alt="Open the box" style={{ width: '400px', height: 'auto', display: 'block', animation: 'jiggle 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.5rem', color: '#3a2a24', marginTop: '-6px' }}>
                    tap to open
                  </span>
                </div>
              </div>

              <audio ref={pasilyoRef} src={songData[currentSongIndex].audio} loop preload="auto" />

              {/* Music Player Section */}
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%',
                opacity: Math.max(0, Math.min(1, (scrollY - (musicTop - fadeLen)) / fadeLen)),
                transform: `translateY(${30 * (1 - Math.max(0, Math.min(1, (scrollY - (musicTop - fadeLen)) / fadeLen)))}px)`,
                transition: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', width: '100%' }}>
                  <div style={{ flex: 1, textAlign: 'right', transform: p3ExitStep >= 1 ? 'translateX(-250px)' : `translateX(${(1 - musicEntryP) * -200}px)`, opacity: p3ExitStep >= 1 ? 0 : 1, transition: p3ExitStep >= 1 ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease' : 'none' }}>
                    <h2
                      style={{
                        fontFamily: "'Libre Baskerville', serif",
                        fontStyle: 'italic',
                        fontSize: 'clamp(3.0rem, 2.2vw, 1.8rem)',
                        color: songPlaying ? '#fff' : '#3a2a24',
                        lineHeight: 1.5,
                        fontWeight: 400,
                        opacity: songPlaying ? 0 : 1,
                        textShadow: songPlaying
                          ? '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.5), 0 0 100px rgba(255,255,255,0.3)'
                          : 'none',
                        transition: 'opacity 0.5s ease, color 0.6s ease',
                      }}
                    >
                      These are the songs that reminds me of you
                    </h2>
                    </div>

                  <div
                    style={{
                      flex: '0 0 450px',
                      height: '380px',
                      position: 'relative',
                      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)',
                      borderRadius: '14px',
                      padding: '1.2rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                      color: '#fff',
                      overflow: 'visible',
                      transform: p3ExitStep >= 1 ? 'translateX(300px)' : `translateX(${(1 - musicEntryP) * 200}px)`,
                      opacity: p3ExitStep >= 1 ? 0 : 1,
                      transition: p3ExitStep >= 1 ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease' : 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: 'calc(100% + 2rem)',
                        top: '50%',
                        transform: songPlaying ? 'translateY(-50%) translateX(0) rotate(-1deg)' : 'translateY(-50%) translateX(20px) rotate(0deg)',
                        width: '290px',
                        background: '#fdf8f0',
                        borderRadius: '3px',
                        padding: '1.6rem 1.8rem',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                        opacity: songPlaying ? 1 : 0,
                        pointerEvents: songPlaying ? 'auto' : 'none',
                        transition: 'transform 0.7s cubic-bezier(0.25, 1.2, 0.5, 1), opacity 0.5s ease',
                        zIndex: 5,
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 26px 26px 0', borderColor: 'transparent #e4d5c0 transparent transparent' }} />
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#000', fontSize: '0.95rem', lineHeight: 1.75 }}>
                        {letterContent[currentSongIndex].emoji && (
                          <div style={{ fontSize: '1.7rem', marginBottom: '0.3rem' }}>{letterContent[currentSongIndex].emoji}</div>
                        )}
                        <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 600, color: '#000', marginBottom: '0.5rem' }}>
                          {letterContent[currentSongIndex].subtitle}
                        </div>
                        <div style={{ color: '#000', fontWeight: 400 }}>
                          {letterContent[currentSongIndex].body}
                        </div>
                      </div>
                    </div>
                    <img
                      src={songData[currentSongIndex].gif}
                      alt=""
                      style={{
                        position: 'absolute',
                        bottom: '-20px',
                        right: '-90px',
                        width: '240px',
                        height: '240px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                        zIndex: 3,
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      <img
                        src={songData[currentSongIndex].image}
                        alt=""
                        style={{
                          width: '250px',
                          height: '250px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600 }}>{songData[currentSongIndex].title}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{songData[currentSongIndex].artist}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '3px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '2px',
                        marginBottom: '0.8rem',
                      }}
                    >
                      <div
                        style={{
                          width: songPlaying ? '45%' : '0%',
                          height: '100%',
                          background: '#1db954',
                          borderRadius: '2px',
                          transition: 'width 0.3s linear',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevSong(); }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#666',
                          border: 'none',
                          color: '#fff',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#1db954'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#666'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        &#9664;
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePasilyo(); }}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#1db954',
                          border: 'none',
                          color: '#fff',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {songPlaying ? (
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                            <rect x="1" y="1" width="3.5" height="12" rx="0.5" />
                            <rect x="7.5" y="1" width="3.5" height="12" rx="0.5" />
                          </svg>
                        ) : (
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                            <path d="M2 1 L11 7 L2 13 Z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextSong(); }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#666',
                          border: 'none',
                          color: '#fff',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#1db954'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#666'; e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        &#9654;
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '0.6rem' }}>
                      {songData.map((_, i) => (
                        <div
                          key={i}
                          onClick={() => setCurrentSongIndex(i)}
                          style={{
                            width: i === currentSongIndex ? '18px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: i === currentSongIndex ? '#1db954' : 'rgba(255,255,255,0.25)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              </div>

              <div style={{ position: 'fixed', left: '0', right: '0', bottom: '4%', zIndex: 20, display: 'flex', justifyContent: 'center', opacity: scrollY < musicTop * 0.7 ? Math.max(0, 1 - scrollY / (musicTop * 0.5)) : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.3rem', fontWeight: 700, color: '#000', letterSpacing: '0.1em', textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff', animation: 'bounce 2s ease-in-out infinite' }}>
                  scroll more &#8595;
                </div>
              </div>

              <span
                onClick={() => { if (p3ExitStep === 0) setP3ExitStep(1); }}
                style={{
                  position: 'fixed',
                  left: '50%',
                  bottom: '10%',
                  transform: 'translateX(-50%)',
                  zIndex: 15,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: songPlaying ? '#fff' : 'var(--rose)',
                  cursor: p3ExitStep === 0 ? 'pointer' : 'default',
                  letterSpacing: '0.05em',
                  opacity: p3ExitStep >= 1 ? 0 : (scrollY > musicTop - vh * 0.5 ? 1 : 0),
                  transition: 'opacity 0.8s ease',
                  pointerEvents: p3ExitStep === 0 && scrollY > musicTop - vh * 0.5 ? 'auto' : 'none',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                click to continue
              </span>
              <button
                onClick={() => { scrollLockRef.current = 0; const a = pasilyoRef.current; if (a) { a.pause(); a.currentTime = 0; } setSongPlaying(false); setShowBgPage(false); setBgPageIndex(0); setP3Step(0); setP3ExitStep(0); setShowPage4(false); setPageFade(1); }}
                style={{
                  position: 'fixed',
                  top: '1.5rem',
                  right: '2rem',
                  zIndex: 10,
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.5rem',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.5,
                  transition: 'opacity 0.3s ease',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
              >
                &#10005;
              </button>

              {/* Box Overlay */}
              {boxOpen && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 500,
                    background: 'rgba(0,0,0,0.92)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    animation: 'fadeIn 0.5s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8923a' }}>
                      &#10038; &nbsp; just in case &nbsp; &#10038;
                    </span>
                    <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem' }}>
                      Just in Case You Forget
                    </h2>
                  </div>

                  <div style={{ maxWidth: '520px', width: '100%', background: 'linear-gradient(160deg, #fdf6ed, #f5ede0)', borderRadius: '16px', padding: '2.5rem 2rem', boxShadow: '0 12px 48px rgba(0,0,0,0.4)', animation: boxShowFinal ? 'none' : 'fadeUp 0.6s ease' }}>
<div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#3a2a24', marginBottom: '1rem', fontWeight: 600, textAlign: 'center' }}>
                  {boxCards[boxCardIndex].title}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: '#5a4a44', lineHeight: 1.85, textAlign: 'center', fontStyle: 'italic' }}>
                  {boxCards[boxCardIndex].text}
                </div>
                  </div>

                  {!boxShowFinal && (
                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
                      {boxCards.map((_, i) => (
                        <div key={i} style={{ width: i === boxCardIndex ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === boxCardIndex ? '#d4a87a' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => setBoxCardIndex(i)} />
                      ))}
                    </div>
                  )}

                  {!boxShowFinal && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem', alignItems: 'center' }}>
                      <button
                        onClick={() => setBoxCardIndex(i => Math.max(0, i - 1))}
                        disabled={boxCardIndex === 0}
                        style={{
                          width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)',
                          background: 'transparent', color: '#fff', cursor: boxCardIndex > 0 ? 'pointer' : 'default',
                          opacity: boxCardIndex > 0 ? 1 : 0.3, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { if (boxCardIndex > 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#d4a87a'; }}}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                      >
                        &#9664;
                      </button>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        {boxCardIndex + 1} / {boxCards.length}
                      </span>
                      <button
                        onClick={() => {
                          if (boxCardIndex < boxCards.length - 1) {
                            setBoxCardIndex(i => i + 1);
                          } else {
                            setBoxShowFinal(true);
                          }
                        }}
                        style={{
                          width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)',
                          background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '1rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#d4a87a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                      >
                        &#9654;
                      </button>
                    </div>
                  )}

                  {boxShowFinal && (
                    <div style={{ textAlign: 'center', marginTop: '1.5rem', animation: 'fadeUp 0.6s ease' }}>
                      <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.8rem' }}>
                        One last thing...
                      </div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', maxWidth: '400px', lineHeight: 1.7, marginBottom: '1.5rem', margin: '0 auto 1.5rem' }}>
                        I hope whenever life gets overwhelming, you'll remember this little box is still here for you.
                      </p>
                      <button
                        onClick={() => { setBoxOpen(false); setBoxCardIndex(0); setBoxShowFinal(false); }}
                        style={{
                          fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontStyle: 'italic',
                          color: '#d4a87a', background: 'transparent', border: '1px solid #d4a87a',
                          padding: '0.7rem 2rem', borderRadius: '8px', cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#d4a87a'; e.currentTarget.style.color = '#1a0a08'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4a87a'; }}
                      >
                        Close the box &#x1F90D;
                      </button>
                    </div>
                  )}

                </div>
              )}
            </>
          )}
          {/* PAGE 4: Main overlay (QA + Letter) */}
          {showPage4 && p4Step < 30 && (
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 50,
                background: '#000', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: p4Step >= 28 ? 0 : 1,
                transition: p4Step >= 28 ? 'opacity 1.5s ease' : 'none',
                pointerEvents: p4Step >= 28 ? 'none' : 'auto',
              }}
            >
              <WebGLBackground />

              {/* "And if you're wondering..." - fades in at step 1, fades out at step 2 */}
              {showPage4 && (
                <div
                  style={{
                    position: 'absolute', top: '72%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center', pointerEvents: 'none',
                    opacity: p4Step === 1 ? 1 : 0,
                    transition: 'opacity 1s ease',
                  }}
                >
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                    And if you're wondering...
                  </div>
                  <img src="/moments/cat11.gif" alt="" style={{ width: 'min(400px, 40vw)', height: 'auto', borderRadius: '12px', display: 'block', margin: '0 auto' }} />
                </div>
              )}

              {/* QA pairs - appear after heading fades out (step 4+), all visible at step 11, fade out at step 12 */}
              {p4Step >= 3 && p4Step < 13 && (
                <div
                  style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center', pointerEvents: 'none',
                    opacity: p4Step >= 4 && p4Step <= 11 ? 1 : 0,
                    transition: 'opacity 1s ease',
                  }}
                >
                  {(() => {
                    const activePair = p4Step < 4 ? -1 : Math.min(3, Math.floor((p4Step - 4) / 2));
                    const showAnswer = p4Step >= 5 && (p4Step - 5) % 2 === 0;
                    return p4QA.map((qa, idx) => (
                      <div key={idx} style={{ opacity: idx <= activePair ? 1 : 0, transform: idx <= activePair ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s ease, transform 0.8s ease', marginBottom: '1.5rem' }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{qa[0]}</div>
                        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 700, color: '#fff', opacity: idx < activePair || (idx === activePair && showAnswer) ? 1 : 0, transition: 'opacity 0.8s ease', marginTop: '0.3rem' }}>{qa[1]}</div>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* Phase B: Photo strip + Letter */}
              {p4Step >= 13 && p4Step <= 20 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p4Step === 20 ? 0 : 1, transition: 'opacity 1.2s ease', pointerEvents: p4Step === 20 ? 'none' : 'auto' }}>
                  <div style={{ position: 'absolute', left: 100, top: 0, width: '300px', height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)', borderRight: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none', animation: p4Step >= 20 ? 'slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'slideDown 1s cubic-bezier(0.22, 1, 0.36, 1) forwards', overflow: 'hidden' }}>
                    <div style={{ animation: 'flowDown 120s linear infinite' }}>
                      {p4StripImages.concat(p4StripImages).map((src, idx) => (
                        <div key={idx} style={{ width: '300px', height: '50.333vh', backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ maxWidth: '700px', padding: '2.5rem', marginLeft: 250, opacity: p4Step >= 20 ? 0 : 1, transition: 'opacity 1.2s ease', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', maskImage: 'radial-gradient(ellipse 60% 50% at center, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at center, black 60%, transparent 100%)', pointerEvents: 'none', borderRadius: '40px' }} />
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', lineHeight: 2, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', textAlign: 'left', position: 'relative', zIndex: 1 }}>
                      {p4NewLetter.split(' ').slice(0, p4LetterWordsVisible).join(' ')}
                    </div>
                    {p4LetterWordsVisible >= p4NewLetter.split(' ').length && (
                      <div style={{ textAlign: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 1 }}>
                        <span
                          onClick={() => setP4Step(20)}
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, fontSize: '1rem', color: songPlaying ? '#fff' : 'rgba(255,255,255,0.7)', cursor: 'pointer', letterSpacing: '0.05em', paddingBottom: '2px', transition: 'color 0.3s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                          onMouseLeave={(e) => e.currentTarget.style.color = ''}
                        >
                          click to continue
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PAGE 4: Sentences overlay (Phase C) */}
          {showPage4 && p4Step >= 21 && p4Step <= 26 && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 51, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 1.2s ease' }}>
              {p4Sentences.map((s, i) => (
                <div key={i} style={{ position: 'absolute', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: 'rgba(255,255,255,0.9)', textAlign: 'center', opacity: p4Step - 21 === i ? 1 : 0, transition: 'opacity 0.8s ease', pointerEvents: 'none' }}>{s}</div>
              ))}
            </div>
          )}

          {/* PAGE 4: Typewriter overlay (Phase D) */}
          {showPage4 && p4Step >= 27 && p4Step <= 28 && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 52, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p4Step === 28 ? 0 : 1, transition: 'opacity 1.5s ease' }}>
              <div style={{ maxWidth: '750px', padding: '2rem', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', lineHeight: 1.9, color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontStyle: 'italic' }}>
                {p4TypewriterText.slice(0, p4TypewriterChars)}
                {p4TypewriterChars < p4TypewriterText.length && <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>}
              </div>
            </div>
          )}

          {/* PAGE 4: Black overlay before main site re-entry */}
          {showPage4 && p4Step >= 29 && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: '#000', animation: 'fadeIn 0.8s ease' }} />
          )}
        </div>
      )}

      {amourRevealed && <div style={{ display: showLockPage || showBgPage ? 'none' : undefined }}><MusicPlayer externalPauseTrigger={bgMusicPauseTrigger} externalResumeTrigger={bgMusicResumeTrigger} /></div>}

      {exitOverlay && <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', animation: 'fadeOut 1.5s ease forwards', pointerEvents: 'none' }} />}
    </>
  );
}
