import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ALL_PHOTOS from './allPhotos.json';
import { buildJigsawAssets } from '../utils/jigsaw';

// Newly added photos from public/pictures/pics (analyzed & categorized)
const PICS_TOGETHER = [
  '/pictures/pics/19373027-cbcc-4a21-82b5-fb4b2383f52b.jpe',
  '/pictures/pics/1d9875b3-6b6e-4a6d-9bd1-55530ffc0274.jpe',
  '/pictures/pics/1f1d3e58-5ed6-4696-971c-50a4110a92c3.jpe',
  '/pictures/pics/26b210be-269f-42ff-bbb0-e69b8e078c19.jpe',
  '/pictures/pics/41e6d747-04f9-42ee-950e-d26491322b58.jpe',
  '/pictures/pics/44c6eaf8-e8a8-4435-a3ee-ec2b0097c2bd.jpe',
  '/pictures/pics/5782689d-d8da-4bfc-9a36-c38242927f23.jpe',
  '/pictures/pics/5831dbf8-120b-428d-a06a-01d60b60f228.jpe',
  '/pictures/pics/6eab60c0-fb96-4a59-9254-18e4a71a167c.jpe',
  '/pictures/pics/74365ed4-44bd-4bbb-95f5-21cd6cf62858.jpe',
  '/pictures/pics/7609267e-d584-4ee6-8503-1ab8f790598f.jpe',
  '/pictures/pics/8503b4d7-4f62-4ff9-9386-75cde41b98ad.jpe',
  '/pictures/pics/8b4cc2cc-8860-421c-b401-d70106f031c1.jpe',
  '/pictures/pics/8cffe914-e44a-4f62-926e-cbb96f24c514.jpe',
  '/pictures/pics/9b539aa9-3d28-4513-b122-83a6a7dfd9b9.jpe',
  '/pictures/pics/d32130f4-0004-4e79-bb9c-807ad0b9ad04.jpe',
  '/pictures/pics/dd77d153-5de5-4d7b-8db8-5a8cc75a0c19.jpe',
  '/pictures/pics/e2d1d2da-5689-4ac6-815a-04155be01301.jpe',
  '/pictures/pics/eb801033-2a79-4763-ae5b-b0d5520c8aa0.jpe',
];

const PICS_HER = [
  '/pictures/pics/5281543b-b91a-45de-875f-8596ece26247.jpe',
  '/pictures/pics/81051fa9-8e6c-43b3-9ec9-338342c89bad.jpe',
  '/pictures/pics/fca7eec4-dd9f-4c0b-942d-da66d2ae3730.jpe',
];

// Categorize all pictures of her and us together
const TOGETHER_PHOTOS = Array.from(
  new Set([
    ...PICS_TOGETHER,
    ...ALL_PHOTOS.filter(
      (p) =>
        p.startsWith('/pictures/together/') ||
        p.startsWith('/pictures/date/') ||
        p.startsWith('/pictures/fav/') ||
        p === '/moments/together.jpg' ||
        p.startsWith('/photostrip/') ||
        (p.startsWith('/moments/') && !p.includes('her'))
    ),
  ])
);

const HER_PHOTOS = Array.from(
  new Set([
    ...PICS_HER,
    ...ALL_PHOTOS.filter(
      (p) =>
        p.startsWith('/pictures/her/') ||
        p.includes('/moments/her') ||
        p === '/moments/prettygurl.png'
    ),
  ])
);

const ALL_GALLERY = [
  ...TOGETHER_PHOTOS.map((src) => ({ src, category: 'together' })),
  ...HER_PHOTOS.map((src) => ({ src, category: 'her' })),
];

const TABLE_THEMES = {
  blue: {
    label: 'Classic Blue',
    bg: 'radial-gradient(circle at 50% 45%, #2a70a8 0%, #1c5484 65%, #123c60 100%)',
    toolbarBg: 'rgba(13, 38, 62, 0.88)',
    toolbarText: '#ffffff',
    toolbarBorder: 'rgba(255, 255, 255, 0.12)',
    chipBg: 'rgba(255, 255, 255, 0.14)',
    chipActiveBg: '#ffffff',
    chipActiveText: '#123c60',
  },
  slate: {
    label: 'Dark Slate',
    bg: 'radial-gradient(circle at 50% 45%, #263143 0%, #171e2b 75%, #0f141d 100%)',
    toolbarBg: 'rgba(15, 20, 29, 0.9)',
    toolbarText: '#ffffff',
    toolbarBorder: 'rgba(255, 255, 255, 0.1)',
    chipBg: 'rgba(255, 255, 255, 0.1)',
    chipActiveBg: '#ffffff',
    chipActiveText: '#111827',
  },
  light: {
    label: 'Clean White',
    bg: '#f3f4f6',
    toolbarBg: '#ffffff',
    toolbarText: '#111827',
    toolbarBorder: '#e5e7eb',
    chipBg: '#f3f4f6',
    chipActiveBg: '#111827',
    chipActiveText: '#ffffff',
  },
};

const DIFFICULTIES = [
  { size: 3, label: '3×3' },
  { size: 4, label: '4×4' },
  { size: 5, label: '5×5' },
  { size: 6, label: '6×6' },
];

const WALKTHROUGH_STEPS = [
  {
    id: 'welcome',
    target: null,
    title: "Hi! I'm Alumi! ✨",
    text: "Welcome to the Memory Puzzle! I'm your guide. Let me give you a quick tour on how to turn any photo into a jigsaw puzzle.",
  },
  {
    id: 'tabs',
    target: 'galleryTabs',
    title: 'Filter Your Memories',
    text: 'Use these tabs at the top of the gallery to switch between All photos, photos of Us together, or portraits of Her.',
  },
  {
    id: 'grid',
    target: 'galleryGrid',
    title: 'Pick a Picture',
    text: `Click any photo in this gallery grid to load it onto the board! Scroll down anytime to browse through all ${ALL_GALLERY.length} memories.`,
  },
  {
    id: 'board',
    target: 'board',
    title: 'Drag & Snap Pieces',
    text: 'Your photo splits into jigsaw pieces scattered on both sides! Drag any piece onto the wooden board—when it gets close to its slot, it snaps right into place.',
  },
  {
    id: 'difficulty',
    target: 'difficultyBar',
    title: 'Difficulty & Progress',
    text: 'Switch grid size from 3×3 (easy) up to 6×6 (challenging), and watch your placed pieces counter and timer right here.',
  },
  {
    id: 'tools',
    target: 'toolsBar',
    title: 'Helpful Puzzle Tools',
    text: 'Toggle Guide for a faint background image, click Preview to peek, use Hint to place a piece, Tidy Pieces to organize, or switch your table surface!',
  },
  {
    id: 'ourflix',
    target: 'ourflixBtn',
    title: "You're All Set!",
    text: "Need to go back to the chapter vault? Click the OURFLIX VAULT button at the bottom left. I'll stay in the bottom right—click me anytime if you want this guide again!",
  },
];

// Heartfelt completion letter split evenly between Left & Right empty spaces
const LEFT_PARAGRAPHS = [
  {
    text: 'Hi, lai!',
    isGreeting: true,
    pauseAfter: 0.45,
  },
  {
    text: "If you're reading this, then you finally finished the puzzle, I hope you enjoyed putting it together.",
    pauseAfter: 0.45,
  },
  {
    text: "Happy 2nd monthsary! I wanted to make something a little different for today, and I thought it would be nice to put some of our memories together in a little puzzle. I hope you enjoyed seeing them again as much as I enjoyed putting this together for you. I just want you to know that I appreciate you and all the little moments we've shared.",
    pauseAfter: 0.3,
  },
];

const RIGHT_PARAGRAPHS = [
  {
    text: "From our random conversations, our nightly calls, and even those quiet moments when we're just doing our own things while keeping each other company. I may not always find the right words to express myself, but I hope you know that you really mean a lot to me and I'm genuinely thankful for the memories we've made together. I hope we get to experience more little moments, create new memories, and enjoy each other's company along the way.",
    pauseAfter: 0.35,
  },
  {
    text: 'Thank you for being part of my life.',
    pauseAfter: 0.45,
  },
  {
    text: 'Happy monthsary, lai! 我爱你',
    isClosing: true,
    pauseAfter: 0,
  },
];

const COMPLETION_MESSAGE_SIDES = (() => {
  let cursor = 0.35;
  const wordStep = 0.11;

  const mapSide = (paragraphs) =>
    paragraphs.map((p) => {
      const words = p.text.split(' ').map((word) => {
        const delay = Number(cursor.toFixed(2));
        const extra = /[.!?]$/.test(word) ? 0.18 : /,$/.test(word) ? 0.08 : 0;
        cursor += wordStep + extra;
        return { word, delay };
      });
      cursor += p.pauseAfter || 0;
      return { ...p, words };
    });

  return {
    left: mapSide(LEFT_PARAGRAPHS),
    right: mapSide(RIGHT_PARAGRAPHS),
  };
})();

// Lightweight Web Audio feedback
let puzzleAudioCtx = null;
function getAudioCtx() {
  try {
    if (!puzzleAudioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) puzzleAudioCtx = new AC();
    }
    if (puzzleAudioCtx && puzzleAudioCtx.state === 'suspended') {
      puzzleAudioCtx.resume().catch(() => {});
    }
    return puzzleAudioCtx;
  } catch (e) {
    return null;
  }
}

function playSound(type) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (type === 'pickup') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } else if (type === 'snap') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'win') {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }
}

/**
 * Generates clean, organic scatter coordinates around the left and right sides
 * of the central puzzle board while keeping the bottom-right corner clear for Alumi.
 */
function scatterPiecesAroundBoard(
  pieces,
  areaW,
  areaH,
  boardX,
  boardY,
  boardW,
  boardH,
  spriteW,
  spriteH
) {
  const shuffled = [...pieces].sort(() => Math.random() - 0.5);
  const leftSpace = boardX - 16;
  const rightSpace = areaW - (boardX + boardW) - 16;
  const canUseWings = leftSpace >= spriteW * 0.7 && rightSpace >= spriteW * 0.7;

  const positions = new Map();

  if (canUseWings) {
    const leftCount = Math.ceil(shuffled.length / 2);
    const leftGroup = shuffled.slice(0, leftCount);
    const rightGroup = shuffled.slice(leftCount);

    const placeInWing = (group, minX, maxX, avoidBottomRight) => {
      const w = Math.max(spriteW, maxX - minX);
      const effectiveH = avoidBottomRight
        ? Math.max(spriteH, areaH - 195)
        : Math.max(spriteH, areaH - 24);
      const cols = Math.max(1, Math.floor(w / (spriteW * 0.74)));
      const rows = Math.max(1, Math.ceil(group.length / cols));
      const cellW = w / cols;
      const cellH = effectiveH / rows;

      group.forEach((piece, i) => {
        const gc = i % cols;
        const gr = Math.floor(i / cols);
        const baseX = minX + gc * cellW + (cellW - spriteW) * 0.5;
        const baseY = 12 + gr * cellH + (cellH - spriteH) * 0.5;

        const jx = (Math.random() - 0.5) * Math.min(24, cellW * 0.32);
        const jy = (Math.random() - 0.5) * Math.min(24, cellH * 0.32);

        const clampedX = Math.max(8, Math.min(maxX - spriteW, baseX + jx));
        const maxAllowedY =
          avoidBottomRight && clampedX + spriteW > areaW - 195
            ? Math.max(8, areaH - 195 - spriteH)
            : areaH - spriteH - 8;
        const clampedY = Math.max(8, Math.min(maxAllowedY, baseY + jy));
        positions.set(piece.id, { x: Math.round(clampedX), y: Math.round(clampedY) });
      });
    };

    placeInWing(leftGroup, 10, boardX - 10, false);
    placeInWing(rightGroup, boardX + boardW + 10, areaW - 10, true);
  } else {
    const startY = Math.min(areaH - spriteH - 12, boardY + boardH + 16);
    shuffled.forEach((piece, i) => {
      const cols = Math.max(2, Math.floor((areaW - 20) / (spriteW * 0.85)));
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 10 + col * ((areaW - 20 - spriteW) / Math.max(1, cols - 1));
      const y = startY + (row % 2) * (spriteH * 0.45) + (Math.random() - 0.5) * 16;
      positions.set(piece.id, {
        x: Math.round(Math.max(8, Math.min(areaW - spriteW - 8, x))),
        y: Math.round(Math.max(8, Math.min(areaH - spriteH - 190, y))),
      });
    });
  }

  return positions;
}

export default function PuzzleGamePage({ onComplete, onBackToVault, musicRef }) {
  // Gallery state
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const scrollContainerRef = useRef(null);

  // Puzzle configuration state
  const [gridSize, setGridSize] = useState(6);
  const [tableTheme, setTableTheme] = useState('blue');
  const [showGhostGuide, setShowGhostGuide] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [muted, setMuted] = useState(false);

  // Sync mute button with background Lego House music
  useEffect(() => {
    if (musicRef?.current) {
      try {
        musicRef.current.muted = muted;
      } catch (e) {}
    }
  }, [muted, musicRef]);

  // Onboarding Walkthrough state with Alumi
  const [guideActive, setGuideActive] = useState(() => {
    try {
      return localStorage.getItem('ourflix_puzzle_guide_seen') !== 'true';
    } catch (e) {
      return true;
    }
  });
  const [guideStep, setGuideStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);
  const [alumiHover, setAlumiHover] = useState(false);

  // Highlightable element refs for the walkthrough
  const galleryTabsRef = useRef(null);
  const galleryGridRef = useRef(null);
  const boardRef = useRef(null);
  const difficultyBarRef = useRef(null);
  const toolsBarRef = useRef(null);

  // Workspace dimensions & board layout
  const workspaceRef = useRef(null);
  const [wsSize, setWsSize] = useState({ width: 0, height: 0 });
  const [loadedPhoto, setLoadedPhoto] = useState(null); // { src, img }

  // Jigsaw puzzle state
  const [puzzleMeta, setPuzzleMeta] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const confettiCanvasRef = useRef(null);
  const dragInfoRef = useRef(null);
  const pieceElsRef = useRef(new Map());
  const topZRef = useRef(50);

  // Gallery filtering & chunked scroll
  const filteredList = useMemo(() => {
    if (activeTab === 'together') return ALL_GALLERY.filter((p) => p.category === 'together');
    if (activeTab === 'her') return ALL_GALLERY.filter((p) => p.category === 'her');
    return ALL_GALLERY;
  }, [activeTab]);

  useEffect(() => {
    setVisibleCount(24);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleGalleryScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200 && visibleCount < filteredList.length) {
      setVisibleCount((prev) => Math.min(prev + 18, filteredList.length));
    }
  };

  const visiblePhotos = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  // Measure workspace dimensions cleanly
  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setWsSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load selected photo image atomically with its src
  useEffect(() => {
    if (!selectedPhoto) {
      setLoadedPhoto(null);
      setPuzzleMeta(null);
      setPieces([]);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!cancelled) {
        setLoadedPhoto({ src: selectedPhoto, img });
      }
    };
    img.src = selectedPhoto;

    return () => {
      cancelled = true;
    };
  }, [selectedPhoto]);

  // Build jigsaw sprites & scatter pieces cleanly
  const initializePuzzle = useCallback(() => {
    const photoImg = loadedPhoto?.img;
    const rect = workspaceRef.current?.getBoundingClientRect();
    const areaW = rect && rect.width > 0 ? Math.round(rect.width) : wsSize.width;
    const areaH = rect && rect.height > 0 ? Math.round(rect.height) : wsSize.height;
    if (!photoImg || areaW <= 0 || areaH <= 0) return;

    const aspect =
      photoImg.naturalWidth && photoImg.naturalHeight
        ? photoImg.naturalWidth / photoImg.naturalHeight
        : 1;

    const isWide = areaW >= 640;
    const maxBoardW = isWide ? Math.min(areaW * 0.45, 450) : Math.min(areaW * 0.68, 330);
    const maxBoardH = isWide ? Math.min(areaH * 0.78, 450) : Math.min(areaH * 0.54, 330);

    let boardW = maxBoardW;
    let boardH = boardW / aspect;
    if (boardH > maxBoardH) {
      boardH = maxBoardH;
      boardW = boardH * aspect;
    }

    boardW = Math.round(boardW);
    boardH = Math.round(boardH);

    const boardX = Math.round((areaW - boardW) / 2);
    const boardY = Math.round(
      isWide ? (areaH - boardH) / 2 : Math.max(16, (areaH - boardH) * 0.28)
    );

    const assets = buildJigsawAssets(photoImg, gridSize, gridSize, boardW, boardH);
    const scatterPos = scatterPiecesAroundBoard(
      assets.pieces,
      areaW,
      areaH,
      boardX,
      boardY,
      boardW,
      boardH,
      assets.spriteW,
      assets.spriteH
    );

    topZRef.current = assets.pieces.length + 10;
    const initializedPieces = assets.pieces.map((p, idx) => {
      const pos = scatterPos.get(p.id) || { x: 20, y: 20 };
      return {
        ...p,
        x: pos.x,
        y: pos.y,
        locked: false,
        zOrder: idx + 1,
      };
    });

    setPuzzleMeta({
      pw: assets.pw,
      ph: assets.ph,
      pad: assets.pad,
      spriteW: assets.spriteW,
      spriteH: assets.spriteH,
      boardW,
      boardH,
      boardX,
      boardY,
      boardOverlayUrl: assets.boardOverlayUrl,
    });
    setPieces(initializedPieces);
    setMoves(0);
    setSeconds(0);
    setIsSolved(false);
  }, [loadedPhoto, gridSize, wsSize.width, wsSize.height]);

  // Rebuild only when loadedPhoto matches selectedPhoto, or when gridSize changes
  const prevInitKeyRef = useRef('');
  useEffect(() => {
    if (!loadedPhoto || loadedPhoto.src !== selectedPhoto || wsSize.width <= 0 || wsSize.height <= 0) {
      return;
    }
    const key = `${loadedPhoto.src}-${gridSize}`;
    if (prevInitKeyRef.current !== key) {
      prevInitKeyRef.current = key;
      initializePuzzle();
    }
  }, [loadedPhoto, selectedPhoto, gridSize, wsSize.width, wsSize.height, initializePuzzle]);

  // Adjust board centering cleanly if window resizes while playing
  useEffect(() => {
    if (!puzzleMeta || wsSize.width <= 0 || wsSize.height <= 0) return;
    const isWide = wsSize.width >= 640;
    const newBoardX = Math.round((wsSize.width - puzzleMeta.boardW) / 2);
    const newBoardY = Math.round(
      isWide
        ? (wsSize.height - puzzleMeta.boardH) / 2
        : Math.max(16, (wsSize.height - puzzleMeta.boardH) * 0.28)
    );
    if (newBoardX !== puzzleMeta.boardX || newBoardY !== puzzleMeta.boardY) {
      setPuzzleMeta((prev) =>
        prev ? { ...prev, boardX: newBoardX, boardY: newBoardY } : prev
      );
    }
  }, [wsSize.width, wsSize.height, puzzleMeta]);

  // Timer tick (paused during onboarding walkthrough)
  useEffect(() => {
    if (!selectedPhoto || isSolved || guideActive) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedPhoto, isSolved, guideActive]);

  // Auto-load a sample photo when walkthrough reaches puzzle board / toolbar steps
  useEffect(() => {
    if (!guideActive) return;
    const step = WALKTHROUGH_STEPS[guideStep];
    if (
      step &&
      (step.target === 'board' ||
        step.target === 'difficultyBar' ||
        step.target === 'toolsBar') &&
      !selectedPhoto
    ) {
      setSelectedPhoto(ALL_GALLERY[0].src);
    }
  }, [guideActive, guideStep, selectedPhoto]);

  // Compute live spotlight highlight rectangle for the active walkthrough step
  useEffect(() => {
    if (!guideActive) {
      setSpotlightRect(null);
      return;
    }

    const updateSpotlight = () => {
      const step = WALKTHROUGH_STEPS[guideStep];
      if (!step || !step.target) {
        setSpotlightRect(null);
        return;
      }

      const refMap = {
        galleryTabs: galleryTabsRef,
        galleryGrid: galleryGridRef,
        board: boardRef,
        difficultyBar: difficultyBarRef,
        toolsBar: toolsBarRef,
      };

      const targetEl =
        step.target === 'ourflixBtn'
          ? document.getElementById('ourflix-vault-return-btn')
          : refMap[step.target]?.current;
      if (!targetEl) {
        setSpotlightRect(null);
        return;
      }

      const rect = targetEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        setSpotlightRect(null);
        return;
      }

      const pad = 6;
      const top = Math.max(4, rect.top - pad);
      const left = Math.max(4, rect.left - pad);
      setSpotlightRect({
        top,
        left,
        width: Math.min(window.innerWidth - left - 4, rect.width + pad * 2),
        height: Math.min(window.innerHeight - top - 4, rect.height + pad * 2),
        borderRadius: step.target === 'ourflixBtn' ? '34px' : '10px',
      });
    };

    const raf = requestAnimationFrame(updateSpotlight);
    window.addEventListener('resize', updateSpotlight);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateSpotlight);
    };
  }, [guideActive, guideStep, puzzleMeta, wsSize, selectedPhoto]);

  const handleCloseGuide = useCallback(() => {
    setGuideActive(false);
    try {
      localStorage.setItem('ourflix_puzzle_guide_seen', 'true');
    } catch (e) {}
  }, []);

  const handleOpenGuide = () => {
    setGuideStep(0);
    setGuideActive(true);
  };

  // Keyboard navigation for walkthrough & preview modal
  useEffect(() => {
    if (!guideActive && !showPreviewModal) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showPreviewModal) setShowPreviewModal(false);
        else if (guideActive) handleCloseGuide();
      } else if (guideActive && e.key === 'ArrowRight') {
        if (guideStep < WALKTHROUGH_STEPS.length - 1) {
          setGuideStep((s) => s + 1);
        } else {
          handleCloseGuide();
        }
      } else if (guideActive && e.key === 'ArrowLeft') {
        setGuideStep((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [guideActive, guideStep, showPreviewModal, handleCloseGuide]);

  // Confetti burst on win
  const triggerConfetti = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const rect = workspaceRef.current?.getBoundingClientRect();
    canvas.width = rect ? rect.width : window.innerWidth;
    canvas.height = rect ? rect.height : window.innerHeight;
    const ctx = canvas.getContext('2d');

    const colors = ['#E50914', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#ffffff'];
    const particles = Array.from({ length: 75 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 + (Math.random() - 0.5) * 140,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 3,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      alpha: 1,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rot += p.vRot;
        p.alpha -= 0.012;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.15);
          ctx.restore();
        }
      });
      if (alive) {
        requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(loop);
  }, []);

  // Pure imperative 60fps pointer dragging
  const handlePiecePointerDown = (e, piece) => {
    if (piece.locked || isSolved || !puzzleMeta || guideActive) return;
    e.preventDefault();
    e.stopPropagation();

    if (!muted) playSound('pickup');

    const el = pieceElsRef.current.get(piece.id);
    if (!el) return;

    topZRef.current += 1;
    const newZ = topZRef.current;

    el.style.transition = 'none';
    el.style.zIndex = String(999);
    el.style.cursor = 'grabbing';
    el.style.filter = 'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.5))';
    el.style.transform = `translate3d(${piece.x}px, ${piece.y}px, 0) scale(1.05)`;

    dragInfoRef.current = {
      id: piece.id,
      row: piece.row,
      col: piece.col,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: piece.x,
      origY: piece.y,
      currentX: piece.x,
      currentY: piece.y,
      newZ,
      el,
    };

    const handleMove = (moveEvent) => {
      const d = dragInfoRef.current;
      if (!d) return;
      const dx = moveEvent.clientX - d.startClientX;
      const dy = moveEvent.clientY - d.startClientY;
      const nx = Math.max(
        2,
        Math.min(wsSize.width - puzzleMeta.spriteW - 2, d.origX + dx)
      );
      const ny = Math.max(
        2,
        Math.min(wsSize.height - puzzleMeta.spriteH - 2, d.origY + dy)
      );
      d.currentX = nx;
      d.currentY = ny;
      d.el.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(1.05)`;
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);

      const d = dragInfoRef.current;
      dragInfoRef.current = null;
      if (!d) return;

      d.el.style.transition = 'transform 0.14s cubic-bezier(0.2, 0.9, 0.3, 1)';
      d.el.style.cursor = 'grab';
      d.el.style.filter = 'drop-shadow(0 4px 7px rgba(0, 0, 0, 0.36))';

      const targetX = puzzleMeta.boardX + d.col * puzzleMeta.pw - puzzleMeta.pad;
      const targetY = puzzleMeta.boardY + d.row * puzzleMeta.ph - puzzleMeta.pad;
      const snapRadius = Math.max(24, Math.min(puzzleMeta.pw, puzzleMeta.ph) * 0.42);
      const dist = Math.hypot(d.currentX - targetX, d.currentY - targetY);

      const snapped = dist <= snapRadius;
      if (snapped && !muted) playSound('snap');

      const finalX = snapped ? targetX : d.currentX;
      const finalY = snapped ? targetY : d.currentY;
      d.el.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;

      setMoves((m) => m + 1);
      setPieces((prev) => {
        const next = prev.map((item) => {
          if (item.id !== d.id) return item;
          if (snapped) {
            return { ...item, x: targetX, y: targetY, locked: true, zOrder: 4 };
          }
          return { ...item, x: finalX, y: finalY, zOrder: d.newZ };
        });

        const allLocked = next.every((item) => item.locked);
        if (allLocked) {
          setIsSolved(true);
          if (!muted) playSound('win');
          setTimeout(() => triggerConfetti(), 80);
        }
        return next;
      });
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  // Re-scatter all unlocked pieces cleanly
  const handleScatterRemaining = () => {
    if (!puzzleMeta || isSolved) return;
    const unlocked = pieces.filter((p) => !p.locked);
    if (unlocked.length === 0) return;

    const newPos = scatterPiecesAroundBoard(
      unlocked,
      wsSize.width,
      wsSize.height,
      puzzleMeta.boardX,
      puzzleMeta.boardY,
      puzzleMeta.boardW,
      puzzleMeta.boardH,
      puzzleMeta.spriteW,
      puzzleMeta.spriteH
    );

    setPieces((prev) =>
      prev.map((item) => {
        if (item.locked) return item;
        const p = newPos.get(item.id);
        return p ? { ...item, x: p.x, y: p.y } : item;
      })
    );
  };

  // Place one random unplaced piece as a helpful hint
  const handleHint = () => {
    if (!puzzleMeta || isSolved) return;
    const unlocked = pieces.filter((p) => !p.locked);
    if (unlocked.length === 0) return;
    const pick = unlocked[Math.floor(Math.random() * unlocked.length)];
    const targetX = puzzleMeta.boardX + pick.col * puzzleMeta.pw - puzzleMeta.pad;
    const targetY = puzzleMeta.boardY + pick.row * puzzleMeta.ph - puzzleMeta.pad;

    if (!muted) playSound('snap');

    setPieces((prev) => {
      const next = prev.map((item) =>
        item.id === pick.id
          ? { ...item, x: targetX, y: targetY, locked: true, zOrder: 4 }
          : item
      );
      if (next.every((item) => item.locked)) {
        setIsSolved(true);
        if (!muted) playSound('win');
        setTimeout(() => triggerConfetti(), 80);
      }
      return next;
    });
  };

  const lockedCount = useMemo(() => pieces.filter((p) => p.locked).length, [pieces]);
  const theme = TABLE_THEMES[tableTheme];
  const currentStepData = WALKTHROUGH_STEPS[guideStep];

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderLetterParagraphs = (paragraphs) =>
    paragraphs.map((para, pIdx) => (
      <p
        key={pIdx}
        style={{
          margin:
            pIdx === paragraphs.length - 1
              ? '0'
              : para.isGreeting
              ? '0 0 10px 0'
              : '0 0 12px 0',
          textAlign: para.isGreeting || para.isClosing ? 'left' : 'justify',
          fontSize: para.isGreeting
            ? 'clamp(19px, 1.85vw, 25px)'
            : para.isClosing
            ? 'clamp(16px, 1.45vw, 21px)'
            : 'clamp(13px, 1.12vw, 15.5px)',
          fontWeight: para.isGreeting || para.isClosing ? 700 : 600,
          lineHeight: para.isGreeting || para.isClosing ? 1.45 : 1.62,
          color: '#ffffff',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
          fontFamily:
            "'Mali', 'Gaegu', 'Patrick Hand', 'ZCOOL KuaiLe', cursive, sans-serif",
        }}
      >
        {para.words.map((w, wIdx) => (
          <React.Fragment key={wIdx}>
            <span
              style={{
                display: 'inline-block',
                opacity: 0,
                animation: `wordFadeIn 0.65s ease-out ${w.delay}s forwards`,
              }}
            >
              {w.word}
            </span>
            {wIdx < para.words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </p>
    ));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100035,
        background: '#ffffff',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ======================================================== */}
      {/* LEFT SIDEBAR: SIMPLE FLAT PHOTO GALLERY                  */}
      {/* ======================================================== */}
      <aside
        style={{
          width: 'clamp(210px, 24vw, 295px)',
          height: '100%',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          userSelect: 'none',
          zIndex: 20,
        }}
      >
        <div
          style={{
            padding: '14px 12px 10px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.2,
                }}
              >
                Gallery
              </h2>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>
                {filteredList.length} photos
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div
            ref={galleryTabsRef}
            style={{
              display: 'flex',
              background: '#f3f4f6',
              padding: '2px',
              borderRadius: '6px',
              gap: '2px',
            }}
          >
            {[
              { id: 'all', label: `All (${ALL_GALLERY.length})` },
              { id: 'together', label: `Us (${TOGETHER_PHOTOS.length})` },
              { id: 'her', label: `Her (${HER_PHOTOS.length})` },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#111827' : '#6b7280',
                    background: active ? '#ffffff' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Square Photo Grid */}
        <div
          ref={(el) => {
            scrollContainerRef.current = el;
            galleryGridRef.current = el;
          }}
          onScroll={handleGalleryScroll}
          className="simple-gallery-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '3px 3px 76px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '3px',
            alignContent: 'start',
            backgroundColor: '#ffffff',
          }}
        >
          {visiblePhotos.map((item) => {
            const isSelected = selectedPhoto === item.src;
            return (
              <div
                key={item.src}
                onClick={() => setSelectedPhoto(item.src)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingBottom: '100%',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  contain: 'strict',
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: '2.5px solid #111827',
                      boxSizing: 'border-box',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* RIGHT WORKSPACE: REAL INTERLOCKING JIGSAW PUZZLE         */}
      {/* ======================================================== */}
      <main
        style={{
          flex: 1,
          height: '100%',
          background: selectedPhoto ? theme.bg : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Top Puzzle Toolbar */}
        {selectedPhoto && (
          <div
            style={{
              height: '54px',
              padding: '0 18px',
              background: theme.toolbarBg,
              borderBottom: `1px solid ${theme.toolbarBorder}`,
              color: theme.toolbarText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexShrink: 0,
              backdropFilter: 'blur(8px)',
              zIndex: 30,
            }}
          >
            {/* Left stats + difficulty */}
            <div
              ref={difficultyBarRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '3px 6px',
                borderRadius: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {DIFFICULTIES.map((d) => {
                  const active = gridSize === d.size;
                  return (
                    <button
                      key={d.size}
                      onClick={() => setGridSize(d.size)}
                      style={{
                        background: active ? theme.chipActiveBg : theme.chipBg,
                        color: active ? theme.chipActiveText : theme.toolbarText,
                        border: 'none',
                        borderRadius: '5px',
                        padding: '4px 9px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <span style={{ fontSize: '12.5px', fontWeight: 600, opacity: 0.9 }}>
                {lockedCount}/{pieces.length} placed
              </span>

              <span style={{ fontSize: '12.5px', fontWeight: 500, opacity: 0.75 }}>
                {formatTime(seconds)}
              </span>
            </div>

            {/* Right helpers & table theme */}
            <div
              ref={toolsBarRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '3px 6px',
                borderRadius: '6px',
              }}
            >
              <button
                onClick={() => setShowGhostGuide((g) => !g)}
                style={{
                  background: showGhostGuide ? theme.chipActiveBg : theme.chipBg,
                  color: showGhostGuide ? theme.chipActiveText : theme.toolbarText,
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Guide
              </button>

              <button
                onClick={() => setShowPreviewModal(true)}
                style={{
                  background: theme.chipBg,
                  color: theme.toolbarText,
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Preview
              </button>

              {!isSolved && (
                <>
                  <button
                    onClick={handleHint}
                    style={{
                      background: theme.chipBg,
                      color: theme.toolbarText,
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Hint
                  </button>

                  <button
                    onClick={handleScatterRemaining}
                    style={{
                      background: theme.chipBg,
                      color: theme.toolbarText,
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Tidy Pieces
                  </button>
                </>
              )}

              <button
                onClick={initializePuzzle}
                style={{
                  background: theme.chipBg,
                  color: theme.toolbarText,
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>

              <button
                onClick={() =>
                  setTableTheme((t) =>
                    t === 'blue' ? 'slate' : t === 'slate' ? 'light' : 'blue'
                  )
                }
                title="Change Table Surface"
                style={{
                  background: theme.chipBg,
                  color: theme.toolbarText,
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 9px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {theme.label}
              </button>

              <button
                onClick={() => setMuted((m) => !m)}
                title={muted ? 'Unmute Sounds' : 'Mute Sounds'}
                style={{
                  background: theme.chipBg,
                  color: theme.toolbarText,
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
        )}

        {/* Always-mounted Play Table Container */}
        <div
          ref={workspaceRef}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          {!selectedPhoto ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px',
              }}
            >
              <div style={{ fontSize: '42px', marginBottom: '10px' }}>🧩</div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Select a Memory to Play
              </div>
              <div style={{ fontSize: '13.5px', color: '#9ca3af', maxWidth: '300px' }}>
                Pick any photo from the gallery on the left to scatter its jigsaw pieces on the board.
              </div>
            </div>
          ) : (
            <>
              {/* Confetti Canvas */}
              <canvas
                ref={confettiCanvasRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 200,
                }}
              />

              {/* Central Framed Puzzle Board */}
              {puzzleMeta && (
                <div
                  ref={boardRef}
                  style={{
                    position: 'absolute',
                    left: `${puzzleMeta.boardX - 10}px`,
                    top: `${puzzleMeta.boardY - 10}px`,
                    width: `${puzzleMeta.boardW + 20}px`,
                    height: `${puzzleMeta.boardH + 20}px`,
                    padding: '10px',
                    borderRadius: '6px',
                    background:
                      'linear-gradient(135deg, #d9b686 0%, #bd935c 50%, #9b703d 100%)',
                    boxShadow:
                      '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.35)',
                    boxSizing: 'border-box',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: `${puzzleMeta.boardW}px`,
                      height: `${puzzleMeta.boardH}px`,
                      position: 'relative',
                      backgroundColor: '#cfd8e3',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {showGhostGuide && !isSolved && (
                      <img
                        src={selectedPhoto}
                        alt=""
                        draggable={false}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.3,
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {!isSolved && (
                      <img
                        src={puzzleMeta.boardOverlayUrl}
                        alt=""
                        draggable={false}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          pointerEvents: 'none',
                          opacity: showGhostGuide ? 0.85 : 1,
                        }}
                      />
                    )}

                    {isSolved && (
                      <img
                        src={selectedPhoto}
                        alt="Solved Puzzle"
                        draggable={false}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Scattered & Locked Jigsaw Pieces */}
              {puzzleMeta &&
                !isSolved &&
                pieces.map((piece) => {
                  const posX = piece.locked
                    ? puzzleMeta.boardX + piece.col * puzzleMeta.pw - puzzleMeta.pad
                    : piece.x;
                  const posY = piece.locked
                    ? puzzleMeta.boardY + piece.row * puzzleMeta.ph - puzzleMeta.pad
                    : piece.y;

                  return (
                    <div
                      key={piece.id}
                      ref={(el) => {
                        if (el) pieceElsRef.current.set(piece.id, el);
                        else pieceElsRef.current.delete(piece.id);
                      }}
                      onPointerDown={(e) => handlePiecePointerDown(e, piece)}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: `${puzzleMeta.spriteW}px`,
                        height: `${puzzleMeta.spriteH}px`,
                        transform: `translate3d(${posX}px, ${posY}px, 0)`,
                        zIndex: piece.locked ? 4 : 10 + piece.zOrder,
                        cursor: piece.locked ? 'default' : 'grab',
                        pointerEvents: piece.locked ? 'none' : 'auto',
                        filter: piece.locked
                          ? 'none'
                          : 'drop-shadow(0 4px 7px rgba(0, 0, 0, 0.36))',
                        transition: 'transform 0.14s cubic-bezier(0.2, 0.9, 0.3, 1)',
                        touchAction: 'none',
                      }}
                    >
                      <img
                        src={piece.spriteUrl}
                        alt=""
                        draggable={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  );
                })}

              {/* Completion Heartfelt Letter (Left & Right Empty Spaces) */}
              {isSolved && puzzleMeta && (
                <>
                  {puzzleMeta.boardX >= 175 ? (
                    <>
                      {/* Left Empty Space Text */}
                      <div
                        className="letter-scroll"
                        style={{
                          position: 'absolute',
                          left: '20px',
                          top: '16px',
                          bottom: '20px',
                          width: `${puzzleMeta.boardX - 40}px`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          overflowY: 'auto',
                          zIndex: 45,
                          padding: tableTheme === 'light' ? '16px 18px' : '8px 6px',
                          background:
                            tableTheme === 'light'
                              ? 'rgba(17, 24, 39, 0.8)'
                              : 'transparent',
                          borderRadius: tableTheme === 'light' ? '14px' : 0,
                          boxSizing: 'border-box',
                        }}
                      >
                        {renderLetterParagraphs(COMPLETION_MESSAGE_SIDES.left)}
                      </div>

                      {/* Right Empty Space Text (stays above Alumi in bottom-right) */}
                      <div
                        className="letter-scroll"
                        style={{
                          position: 'absolute',
                          left: `${puzzleMeta.boardX + puzzleMeta.boardW + 22}px`,
                          right: '20px',
                          top: '16px',
                          bottom: '185px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          overflowY: 'auto',
                          zIndex: 45,
                          padding: tableTheme === 'light' ? '16px 18px' : '8px 6px',
                          background:
                            tableTheme === 'light'
                              ? 'rgba(17, 24, 39, 0.8)'
                              : 'transparent',
                          borderRadius: tableTheme === 'light' ? '14px' : 0,
                          boxSizing: 'border-box',
                        }}
                      >
                        {renderLetterParagraphs(COMPLETION_MESSAGE_SIDES.right)}
                      </div>
                    </>
                  ) : (
                    /* Compact Screen Fallback */
                    <div
                      className="letter-scroll"
                      style={{
                        position: 'absolute',
                        left: '14px',
                        right: '14px',
                        top: `${puzzleMeta.boardY + puzzleMeta.boardH + 14}px`,
                        bottom: '76px',
                        overflowY: 'auto',
                        zIndex: 45,
                        padding: '14px 16px',
                        background: 'rgba(17, 24, 39, 0.82)',
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {renderLetterParagraphs([
                        ...COMPLETION_MESSAGE_SIDES.left,
                        ...COMPLETION_MESSAGE_SIDES.right,
                      ])}
                    </div>
                  )}

                  {/* Completion Toast / Banner */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '16px',
                      transform: 'translateX(-50%)',
                      background: 'rgba(17, 24, 39, 0.92)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: '0 14px 36px rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      zIndex: 180,
                      animation: 'popUpToast 0.35s ease-out',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>
                        Puzzle Completed! 🎉
                      </div>
                      <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                        {pieces.length} pieces in {moves} moves • {formatTime(seconds)}
                      </div>
                    </div>
                    <button
                      onClick={initializePuzzle}
                      style={{
                        background: '#E50914',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '7px 14px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Play Again
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Preview Modal */}
        {showPreviewModal && selectedPhoto && (
          <div
            onClick={() => setShowPreviewModal(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(6px)',
              zIndex: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                padding: '10px',
                borderRadius: '10px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                maxWidth: '460px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <img
                src={selectedPhoto}
                alt="Full Preview"
                style={{
                  width: '100%',
                  maxHeight: 'calc(80vh - 64px)',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  display: 'block',
                }}
              />
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: '#111827',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* ONBOARDING SPOTLIGHT BACKDROP & HIGHLIGHT CUTOUT         */}
      {/* ======================================================== */}
      {guideActive && (
        <>
          {/* When no element is targeted (Welcome step), full subtle backdrop */}
          {!spotlightRect ? (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(10, 15, 28, 0.58)',
                zIndex: 100060,
                transition: 'opacity 0.25s ease',
              }}
            />
          ) : (
            /* Spotlight cutout ring casting soft shadow around mentioned UI element */
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'transparent',
                  zIndex: 100059,
                }}
              />
              <div
                style={{
                  position: 'fixed',
                  top: `${spotlightRect.top}px`,
                  left: `${spotlightRect.left}px`,
                  width: `${spotlightRect.width}px`,
                  height: `${spotlightRect.height}px`,
                  borderRadius: spotlightRect.borderRadius || '10px',
                  border: '2.5px solid #c084fc',
                  boxShadow:
                    '0 0 0 4px rgba(168, 85, 247, 0.32), 0 0 0 9999px rgba(10, 15, 28, 0.62)',
                  zIndex: 100060,
                  pointerEvents: 'none',
                  transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  boxSizing: 'border-box',
                }}
              />
            </>
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* ALUMI MASCOT & GUIDE MODAL (PERSISTENT BOTTOM RIGHT)      */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '18px',
          zIndex: 100070,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '14px',
          pointerEvents: 'none',
        }}
      >
        {/* Guide Modal right beside Alumi when active */}
        {guideActive && currentStepData && (
          <div
            style={{
              pointerEvents: 'auto',
              width: 'min(360px, calc(100vw - 195px))',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e9d5ff',
              boxShadow:
                '0 22px 54px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(168, 85, 247, 0.14)',
              padding: '16px 18px',
              position: 'relative',
              marginBottom: '22px',
              transformOrigin: 'bottom right',
              animation: 'alumiModalIn 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
            }}
          >
            {/* Speech bubble pointer toward Alumi on the right */}
            <div
              style={{
                position: 'absolute',
                right: '-8px',
                bottom: '42px',
                width: '14px',
                height: '14px',
                background: '#ffffff',
                borderRight: '1.5px solid #e9d5ff',
                borderBottom: '1.5px solid #e9d5ff',
                transform: 'rotate(-45deg)',
              }}
            />

            {/* Header: Alumi Badge + Step Counter + Close */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '999px',
                    letterSpacing: '0.02em',
                  }}
                >
                  ✨ Alumi • Guide
                </span>
                <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: 600 }}>
                  {guideStep + 1} / {WALKTHROUGH_STEPS.length}
                </span>
              </div>

              <button
                onClick={handleCloseGuide}
                title="Close Guide"
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  color: '#6b7280',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Step Title & Text */}
            <h3
              style={{
                margin: '0 0 6px 0',
                fontSize: '15.5px',
                fontWeight: 800,
                color: '#111827',
              }}
            >
              {currentStepData.title}
            </h3>
            <p
              style={{
                margin: '0 0 14px 0',
                fontSize: '13px',
                lineHeight: 1.55,
                color: '#4b5563',
              }}
            >
              {currentStepData.text}
            </p>

            {/* Step Dots */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '14px' }}>
              {WALKTHROUGH_STEPS.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setGuideStep(idx)}
                  style={{
                    height: '5px',
                    width: idx === guideStep ? '18px' : '6px',
                    borderRadius: '999px',
                    background: idx === guideStep ? '#9333ea' : '#e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>

            {/* Footer Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <button
                onClick={handleCloseGuide}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9ca3af',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 2px',
                }}
              >
                Skip tour
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {guideStep > 0 && (
                  <button
                    onClick={() => setGuideStep((s) => Math.max(0, s - 1))}
                    style={{
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151',
                      cursor: 'pointer',
                    }}
                  >
                    Back
                  </button>
                )}

                {guideStep < WALKTHROUGH_STEPS.length - 1 ? (
                  <button
                    onClick={() =>
                      setGuideStep((s) => Math.min(WALKTHROUGH_STEPS.length - 1, s + 1))
                    }
                    style={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.35)',
                    }}
                  >
                    Next ❯
                  </button>
                ) : (
                  <button
                    onClick={handleCloseGuide}
                    style={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.35)',
                    }}
                  >
                    Got it! 🧩
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Alumi Mascot Avatar (Always stays in bottom right) */}
        <div
          onClick={() => {
            if (guideActive) handleCloseGuide();
            else handleOpenGuide();
          }}
          onMouseEnter={() => setAlumiHover(true)}
          onMouseLeave={() => setAlumiHover(false)}
          title={guideActive ? 'Hide Alumi Guide' : 'Click Alumi for Walkthrough Guide'}
          style={{
            pointerEvents: 'auto',
            cursor: 'pointer',
            position: 'relative',
            transform: alumiHover ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
        >
          {/* Hover helper tooltip when guide is closed */}
          {!guideActive && alumiHover && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '6px',
                background: '#111827',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 600,
                padding: '5px 10px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                zIndex: 5,
              }}
            >
              Need help? Click me! 💜
            </div>
          )}

          {/* Squishy bouncy pop-up intro wrapper */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transformOrigin: 'bottom center',
              animation: 'alumiPopIn 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <img
              src="/pictures/mascot.png"
              alt="Alumi Guide"
              draggable={false}
              style={{
                width: 'clamp(115px, 13vw, 155px)',
                height: 'clamp(115px, 13vw, 155px)',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 10px 20px rgba(126, 34, 206, 0.38))',
                animation: 'alumiFloat 3s ease-in-out 0.75s infinite',
              }}
            />

            <span
              style={{
                marginTop: '-6px',
                background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 800,
                padding: '3px 13px',
                borderRadius: '999px',
                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.45)',
                border: '2px solid #ffffff',
                letterSpacing: '0.03em',
              }}
            >
              Alumi
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .simple-gallery-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .simple-gallery-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .simple-gallery-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        @keyframes popUpToast {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes alumiPopIn {
          0% {
            opacity: 0;
            transform: translateY(72px) scale(0.3, 0.25);
          }
          48% {
            opacity: 1;
            transform: translateY(-14px) scale(0.95, 1.12);
          }
          72% {
            transform: translateY(4px) scale(1.06, 0.94);
          }
          86% {
            transform: translateY(-2px) scale(0.99, 1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1, 1);
          }
        }
        @keyframes alumiFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes alumiModalIn {
          from { opacity: 0; transform: translate(16px, 14px) scale(0.75); }
          to { opacity: 1; transform: translate(0, 0) scale(1); }
        }
        @keyframes wordFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .letter-scroll {
          scrollbar-width: none;
        }
        .letter-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
