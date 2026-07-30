import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  COLS,
  ROWS,
  TILE,
  CANVAS_W,
  CANVAS_H,
  MAZES,
  ROUND_TITLES,
  START_POS,
} from './maze';

const TILE_FLOOR = 0;
const TILE_WALL = 1;
const TILE_MUD = 2;
const TILE_MOONBEAM = 3;
const TILE_LANTERN = 4;
const TILE_GATE = 5;
const TILE_THORN = 6;

const PLAYER_SPEED = 4; // pixels per frame lerp
const TOTAL_ROUNDS = 3;

const DPAD_BTN_STYLE = {
  width: '56px',
  height: '56px',
  background: 'rgba(20,8,12,0.55)',
  border: '1px solid rgba(245,237,224,0.25)',
  color: 'rgba(245,237,224,0.85)',
  fontSize: '1.4rem',
  lineHeight: 1,
  fontFamily: 'serif',
  borderRadius: '10px',
  cursor: 'pointer',
  touchAction: 'manipulation',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  transition: 'background 0.1s ease, transform 0.05s ease',
};

export default function GameIntro({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0); // 0..2
  const [roundComplete, setRoundComplete] = useState(false); // overlay between rounds
  const [exiting, setExiting] = useState(false);
  const [exited, setExited] = useState(false);

  const [lanternsLit, setLanternsLit] = useState(0);
  const [steps, setSteps] = useState(0);
  const [timeSec, setTimeSec] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mutable game state
  const mapRef = useRef(null);
  const playerRef = useRef(null);
  const litRef = useRef(new Set());
  const gateUnlockedRef = useRef(false);
  const gameAnimRef = useRef(null);
  const frameRef = useRef(0);
  const lastTimeSecRef = useRef(0);
  const stepsRef = useRef(0);
  const lanternsLitRef = useRef(0);
  const wonRef = useRef(false);
  const roundRef = useRef(0);
  const roundCompleteRef = useRef(false);

  const gameCanvasRef = useRef(null);
  const vfxCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const floatingTextsRef = useRef([]);
  const glowsRef = useRef([]);
  const winWhiteRef = useRef(0);
  const winSparksScheduledRef = useRef(0);
  const bobFramesRef = useRef(0);

  const touchRef = useRef({ x: 0, y: 0 });
  const vignettePulseRef = useRef(0);

  // Load a round's maze
  const loadRound = useCallback((r) => {
    const m = MAZES[r].map((row) => row.slice());
    mapRef.current = m;
    playerRef.current = {
      col: START_POS.col,
      row: START_POS.row,
      px: START_POS.col * TILE + TILE / 2,
      py: START_POS.row * TILE + TILE / 2,
      targetPx: START_POS.col * TILE + TILE / 2,
      targetPy: START_POS.row * TILE + TILE / 2,
      moving: false,
      mudFreezeFrames: 0,
      trail: [],
    };
    litRef.current = new Set();
    gateUnlockedRef.current = false;
    wonRef.current = false;
    roundRef.current = r;
    roundCompleteRef.current = false;
    particlesRef.current = [];
    floatingTextsRef.current = [];
    glowsRef.current = [];
    winWhiteRef.current = 0;
    winSparksScheduledRef.current = 0;
    vignettePulseRef.current = 0;
    frameRef.current = 0;
    lastTimeSecRef.current = 0;
    stepsRef.current = 0;
    lanternsLitRef.current = 0;
    setLanternsLit(0);
    setSteps(0);
    setTimeSec(0);
    setRoundComplete(false);
    setRound(r);
  }, []);

  // Initialize round 0 on mount
  useEffect(() => {
    loadRound(0);
  }, [loadRound]);

  // Detect touch / coarse-pointer devices
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const check = () => setIsMobile(mq.matches);
    check();
    if (mq.addEventListener) mq.addEventListener('change', check);
    else mq.addListener(check);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', check);
      else mq.removeListener(check);
    };
  }, []);

  // Skip or final win → transition out to Amour
  const triggerExit = useCallback(() => {
    if (exiting || exited) return;
    setExiting(true);
    setTimeout(() => {
      setExited(true);
      onComplete?.();
    }, 1400);
  }, [exiting, exited, onComplete]);

  function handleSkip() {
    if (exiting || exited) return;
    triggerExit();
  }

  // ------------- Drawing -------------
  function drawTile(ctx, col, row, tile, frame) {
    const x = col * TILE;
    const y = row * TILE;
    switch (tile) {
      case TILE_FLOOR: {
        ctx.fillStyle = (col + row) % 2 === 0 ? '#1a0c10' : '#1e0f13';
        ctx.fillRect(x, y, TILE, TILE);
        if ((col * 7 + row * 13) % 5 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.02)';
          ctx.fillRect(x + 4, y + 6, 1, 1);
        }
        break;
      }
      case TILE_WALL: {
        ctx.fillStyle = '#2e1640';
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = '#4a2a6a';
        ctx.fillRect(x, y, TILE, 4);
        ctx.fillStyle = '#1a0a1a';
        ctx.fillRect(x, y + TILE / 2 - 1, TILE, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        const off = (row % 2) * (TILE / 2);
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(x + off + i * TILE - 1, y, 1, TILE / 2);
        }
        break;
      }
      case TILE_THORN: {
        ctx.fillStyle = '#1e3a1e';
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = '#2a5a2a';
        ctx.fillRect(x, y, TILE, 4);
        ctx.fillStyle = '#3a8a3a';
        for (let i = 0; i < 4; i++) {
          const sx = x + 4 + i * 6;
          const sy = y + 10;
          ctx.beginPath();
          ctx.moveTo(sx, sy + 8);
          ctx.lineTo(sx + 4, sy);
          ctx.lineTo(sx + 8, sy + 8);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case TILE_MUD: {
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        const ox = (col * 17 + row * 11) % 4;
        ctx.fillRect(x + 4 + ox, y + 8, 6, 1);
        ctx.fillRect(x + 14 + ox, y + 18, 4, 1);
        break;
      }
      case TILE_MOONBEAM: {
        ctx.fillStyle = '#1e2a3a';
        ctx.fillRect(x, y, TILE, TILE);
        const grad = ctx.createLinearGradient(x, y, x, y + TILE);
        grad.addColorStop(0, 'rgba(255,255,255,0.18)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        grad.addColorStop(1, 'rgba(255,255,255,0.12)');
        ctx.fillStyle = grad;
        ctx.fillRect(x + 10, y, 8, TILE);
        if (frame % 90 === (col * 3 + row * 7) % 90) {
          particlesRef.current.push({
            x: x + 14 + Math.random() * 4,
            y: y + 6 + Math.random() * 16,
            vx: 0,
            vy: -0.3,
            life: 1,
            decay: 0.02,
            size: 1 + Math.random(),
            color: '#cce4ff',
            type: 'spark',
            gravity: 0,
          });
        }
        break;
      }
      default:
        ctx.fillStyle = '#1a0c10';
        ctx.fillRect(x, y, TILE, TILE);
    }
  }

  function drawLantern(ctx, col, row, lit) {
    const x = col * TILE;
    const y = row * TILE;
    const cx = x + TILE / 2;
    const cy = y + TILE / 2;
    const bob = Math.sin((bobFramesRef.current + col * 10 + row * 17) / 18) * 1.5;
    if (lit) {
      const grad = ctx.createRadialGradient(cx, cy + 2, 0, cx, cy + 2, TILE * 2.2);
      grad.addColorStop(0, 'rgba(245,192,64,0.22)');
      grad.addColorStop(1, 'rgba(245,192,64,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - TILE * 2, y - TILE * 2, TILE * 5, TILE * 5);
    }
    ctx.save();
    ctx.shadowBlur = lit ? 20 : 6;
    ctx.shadowColor = lit ? '#f5c040' : '#aabbdd';
    ctx.fillStyle = lit ? '#f5c040' : '#6a7a9a';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8 + bob);
    ctx.lineTo(cx - 5, cy - 3 + bob);
    ctx.lineTo(cx + 5, cy - 3 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(cx - 4, cy - 3 + bob, 8, 9);
    ctx.fillRect(cx - 5, cy + 5 + bob, 10, 2);
    ctx.fillStyle = lit ? '#fff7d0' : '#8a9aba';
    ctx.fillRect(cx - 1, cy - 9 + bob, 2, 2);
    ctx.restore();
    if (lit && frameRef.current % 3 === (col + row) % 3) {
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 4,
        y: cy - 4 + bob,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.4 - Math.random() * 0.4,
        life: 1,
        decay: 0.015,
        size: 1 + Math.random() * 1.5,
        color: '#f5c040',
        type: 'spark',
        gravity: -0.005,
      });
    }
  }

  function drawGate(ctx, col, row, unlocked) {
    const x = col * TILE;
    const y = row * TILE;
    const cx = x + TILE / 2;
    const cy = y + TILE / 2;
    ctx.fillStyle = unlocked ? '#b8923a' : '#2a2a4a';
    ctx.fillRect(x + 2, y + 6, TILE - 4, TILE - 6);
    ctx.beginPath();
    ctx.arc(cx, y + 6, (TILE - 4) / 2, Math.PI, 0);
    ctx.fill();
    if (!unlocked) {
      ctx.fillStyle = '#0d0508';
      ctx.fillRect(x + 5, y + 8, TILE - 10, TILE - 10);
    }
    if (!unlocked) {
      ctx.fillStyle = '#aab';
      ctx.fillRect(cx - 4, cy + 2, 8, 6);
      ctx.beginPath();
      ctx.arc(cx, cy, 3, Math.PI, 0);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#aab';
      ctx.stroke();
    } else {
      if (frameRef.current % 4 === 0) {
        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * 8,
          y: y + 4,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -1 - Math.random() * 0.6,
          life: 1,
          decay: 0.018,
          size: 1.2 + Math.random() * 1.5,
          color: '#f5c040',
          type: 'spark',
          gravity: -0.01,
        });
      }
    }
  }

  function drawPlayer(ctx) {
    const p = playerRef.current;
    if (!p) return;
    p.trail.forEach((t, i) => {
      const f = i / p.trail.length;
      const size = 1 + f * 4;
      const alpha = 0.05 + f * 0.45;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#e8f4ff';
      const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, size);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#e8f4ff';
    const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(220,235,255,0.7)');
    grad.addColorStop(1, 'rgba(220,235,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.px, p.py, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (p.moving && frameRef.current % 2 === 0) {
      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: p.px + (Math.random() - 0.5) * 4,
          y: p.py + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          life: 1,
          decay: 0.04,
          size: 0.8 + Math.random() * 1.2,
          color: '#ffffff',
          type: 'spark',
          gravity: 0,
        });
      }
    }
  }

  function drawParticles(vctx) {
    const arr = particlesRef.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      p.life -= p.decay;
      if (p.life <= 0) {
        arr.splice(i, 1);
        continue;
      }
      vctx.globalAlpha = Math.max(0, p.life);
      if (p.type === 'spark') {
        vctx.fillStyle = p.color;
        vctx.beginPath();
        vctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        vctx.fill();
      } else if (p.type === 'heart') {
        vctx.fillStyle = p.color;
        vctx.font = `${10 + p.size}px serif`;
        vctx.fillText('♥', p.x, p.y);
      }
    }
    vctx.globalAlpha = 1;
  }

  function drawFloatingTexts(vctx) {
    const arr = floatingTextsRef.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const t = arr[i];
      t.y += t.vy;
      t.life -= t.decay;
      if (t.life <= 0) {
        arr.splice(i, 1);
        continue;
      }
      vctx.globalAlpha = Math.max(0, Math.min(1, t.life * 1.5));
      vctx.fillStyle = t.color;
      vctx.font = "italic 13px 'Cormorant Garamond', serif";
      vctx.textAlign = 'center';
      vctx.fillText(t.text, t.x, t.y);
    }
    vctx.globalAlpha = 1;
    vctx.textAlign = 'start';
  }

  function drawGlows(vctx) {
    const arr = glowsRef.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const g = arr[i];
      g.life -= 1 / g.duration;
      if (g.life <= 0) {
        arr.splice(i, 1);
        continue;
      }
      vctx.save();
      vctx.globalAlpha = g.life;
      const grad = vctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.radius);
      grad.addColorStop(0, g.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      vctx.fillStyle = grad;
      vctx.beginPath();
      vctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
      vctx.fill();
      vctx.restore();
    }
  }

  function drawVignettePulse(vctx) {
    if (vignettePulseRef.current > 0) {
      vctx.save();
      vctx.globalAlpha = vignettePulseRef.current * 0.3;
      vctx.fillStyle = '#fff';
      vctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      vctx.restore();
      vignettePulseRef.current -= 0.05;
      if (vignettePulseRef.current < 0) vignettePulseRef.current = 0;
    }
  }

  function drawWinWhite(vctx) {
    if (winWhiteRef.current > 0) {
      vctx.save();
      vctx.fillStyle = `rgba(255,255,255,${winWhiteRef.current})`;
      vctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      vctx.restore();
    }
  }

  function spawnBurst(cx, cy, color, count, type = 'spark') {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.5 + Math.random() * 3;
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 1, decay: 0.02 + Math.random() * 0.02,
        size: 1 + Math.random() * 2, color, type, gravity: 0,
      });
    }
  }
  function spawnHearts(cx, cy) {
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1 - Math.random() * 2,
        life: 1, decay: 0.012,
        size: 1 + Math.random() * 2,
        color: '#f5c0c0', type: 'heart', gravity: -0.02,
      });
    }
  }
  function spawnGlow(cx, cy, color, radius, duration) {
    glowsRef.current.push({ x: cx, y: cy, color, radius, life: 1, duration });
  }
  function spawnFloatingText(cx, cy, text, color) {
    floatingTextsRef.current.push({
      x: cx, y: cy, vy: -0.8, life: 1, decay: 0.012, text, color,
    });
  }

  // ------------- D-pad press (mobile) -------------
  const dpadTimerRef = useRef(null);
  function clearDpadRepeat() {
    if (dpadTimerRef.current) {
      clearInterval(dpadTimerRef.current);
      dpadTimerRef.current = null;
    }
  }
  function handleDpadDown(dx, dy) {
    tryMove(dx, dy);
    clearDpadRepeat();
    dpadTimerRef.current = setInterval(() => tryMove(dx, dy), 110);
  }
  function handleDpadUp() {
    clearDpadRepeat();
  }

  function tryMove(dx, dy) {
    if (roundCompleteRef.current) return;
    if (wonRef.current) return;
    const p = playerRef.current;
    if (!p) return;
    if (p.mudFreezeFrames > 0) {
      p.mudFreezeFrames -= 1;
      return;
    }
    if (p.moving) return;
    const nc = p.col + dx;
    const nr = p.row + dy;
    const m = mapRef.current;
    if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) return;
    const tile = m[nr][nc];
    if (tile === TILE_WALL || tile === TILE_THORN) return;

    p.col = nc;
    p.row = nr;
    p.targetPx = nc * TILE + TILE / 2;
    p.targetPy = nr * TILE + TILE / 2;
    p.moving = true;
    stepsRef.current += 1;
    setSteps(stepsRef.current);

    if (tile === TILE_MUD) {
      p.mudFreezeFrames = 60;
      spawnFloatingText(p.targetPx, p.targetPy - 18, '...', '#c8a060');
    } else if (tile === TILE_LANTERN && !litRef.current.has(`${nr},${nc}`)) {
      litRef.current.add(`${nr},${nc}`);
      lanternsLitRef.current += 1;
      setLanternsLit(lanternsLitRef.current);
      spawnBurst(p.targetPx, p.targetPy, '#f5c040', 24, 'spark');
      spawnHearts(p.targetPx, p.targetPy);
      spawnGlow(p.targetPx, p.targetPy, 'rgba(245,192,64,0.6)', 60, 80);
      spawnFloatingText(p.targetPx, p.targetPy - 20, 'Lantern lit', '#b8923a');
      vignettePulseRef.current = 1;
      if (lanternsLitRef.current >= 5) {
        gateUnlockedRef.current = true;
        setTimeout(() => {
          spawnFloatingText(
            20 * TILE + TILE / 2,
            14 * TILE - 10,
            'Find the gate...',
            '#b8923a'
          );
          spawnGlow(
            20 * TILE + TILE / 2,
            14 * TILE + TILE / 2,
            'rgba(245,192,64,0.5)',
            70,
            90
          );
        }, 600);
      }
    } else if (tile === TILE_GATE && gateUnlockedRef.current) {
      winRound();
    }
  }

  function winRound() {
    if (wonRef.current) return;
    wonRef.current = true;
    const gx = 20 * TILE + TILE / 2;
    const gy = 14 * TILE + TILE / 2;
    spawnBurst(gx, gy, '#f5c040', 40, 'spark');
    for (let i = 0; i < 5; i++) {
      const cx = (CANVAS_W / 6) * (i + 1) + (Math.random() - 0.5) * 40;
      const cy = CANVAS_H / 2 + (Math.random() - 0.5) * 80;
      spawnHearts(cx, cy);
    }
    spawnGlow(gx, gy, 'rgba(245,192,64,0.7)', 120, 150);
    spawnFloatingText(gx, gy - 30, 'the way is open', '#b8923a');

    const nextRound = roundRef.current + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      // Final round → exit to Amour
      setRoundComplete(true);
      roundCompleteRef.current = true;
      // Fade round-complete overlay to opaque white
      setTimeout(() => triggerExit(), 1400);
    } else {
      // Show round-complete overlay, then load next round
      setRoundComplete(true);
      roundCompleteRef.current = true;
      setTimeout(() => {
        // Fade in new round
        winWhiteRef.current = 1; // start white
        loadRound(nextRound);
        // Fade white away over ~0.6s
        const fade = setInterval(() => {
          winWhiteRef.current = Math.max(0, winWhiteRef.current - 0.05);
          if (winWhiteRef.current <= 0) clearInterval(fade);
        }, 30);
      }, 1400);
    }
  }

  // ------------- Input -------------
  useEffect(() => {
    function onKey(e) {
      if (!started) return;
      if (roundCompleteRef.current) return;
      if (wonRef.current) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { tryMove(0, -1); e.preventDefault(); }
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { tryMove(0, 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { tryMove(-1, 0); e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { tryMove(1, 0); e.preventDefault(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => {
    function onTouchStart(e) {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY };
    }
    function onTouchEnd(e) {
      if (!started) return;
      if (roundCompleteRef.current) return;
      if (wonRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) < 20) return;
      if (ax > ay) tryMove(dx > 0 ? 1 : -1, 0);
      else tryMove(0, dy > 0 ? 1 : -1);
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // ------------- Main loop -------------
  useEffect(() => {
    if (!started) return;
    const gctx = gameCanvasRef.current?.getContext('2d');
    const vctx = vfxCanvasRef.current?.getContext('2d');
    if (!gctx || !vctx) return;

    function loop() {
      frameRef.current += 1;
      bobFramesRef.current += 1;

      const p = playerRef.current;
      if (p) {
        const dx = p.targetPx - p.px;
        const dy = p.targetPy - p.py;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          p.px = p.targetPx;
          p.py = p.targetPy;
          p.moving = false;
        } else {
          const d = Math.hypot(dx, dy);
          const step = Math.min(PLAYER_SPEED, d);
          p.px += (dx / d) * step;
          p.py += (dy / d) * step;
          p.trail.unshift({ x: p.px, y: p.py });
          if (p.trail.length > 6) p.trail.length = 6;
        }
      }

      if (frameRef.current % 60 === 0) {
        const sec = Math.floor(frameRef.current / 60);
        if (sec !== lastTimeSecRef.current) {
          lastTimeSecRef.current = sec;
          setTimeSec(sec);
        }
      }

      gctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      const m = mapRef.current;
      if (m) {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const t = m[r][c];
            if (t === TILE_LANTERN) {
              drawTile(gctx, c, r, TILE_FLOOR, frameRef.current);
              drawLantern(gctx, c, r, litRef.current.has(`${r},${c}`));
            } else if (t === TILE_GATE) {
              drawTile(gctx, c, r, TILE_FLOOR, frameRef.current);
              drawGate(gctx, c, r, gateUnlockedRef.current);
            } else {
              drawTile(gctx, c, r, t, frameRef.current);
            }
          }
        }
      }
      drawPlayer(gctx);

      vctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawGlows(vctx);
      drawParticles(vctx);
      drawFloatingTexts(vctx);
      drawVignettePulse(vctx);
      drawWinWhite(vctx);

      // Win fade-to-white (only when this is the final round exit)
      if (exiting && winWhiteRef.current < 1) {
        winWhiteRef.current = Math.min(1, winWhiteRef.current + 1 / 72);
      }
      if (exiting) {
        if (
          winSparksScheduledRef.current < 30 &&
          frameRef.current % 2 === 0
        ) {
          particlesRef.current.push({
            x: Math.random() * CANVAS_W,
            y: Math.random() * CANVAS_H,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 1, decay: 0.02,
            size: 1.5 + Math.random() * 2,
            color: '#ffffff', type: 'spark', gravity: 0,
          });
          winSparksScheduledRef.current += 1;
        }
      }

      gameAnimRef.current = requestAnimationFrame(loop);
    }
    gameAnimRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(gameAnimRef.current);
    };
  }, [started, exiting]);

  // Clear d-pad auto-repeat on unmount
  useEffect(() => {
    return () => clearDpadRepeat();
  }, []);

  if (exited) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#0d0508',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: "'Cormorant Garamond', serif",
        padding: '0 max(0.5rem, env(safe-area-inset-left, 0.5rem)) 0 max(0.5rem, env(safe-area-inset-right, 0.5rem))',
        boxSizing: 'border-box',
      }}
    >
      {/* Skip button */}
      {!exiting && (
        <button
          onClick={handleSkip}
          style={{
            position: 'fixed',
            top: '1.2rem',
            left: '1.5rem',
            zIndex: 1100,
            background: 'none',
            border: '1px solid rgba(245,237,224,0.25)',
            color: 'rgba(245,237,224,0.4)',
            fontFamily: "'Cinzel', serif",
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(245,237,224,0.9)';
            e.currentTarget.style.borderColor = 'rgba(245,237,224,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(245,237,224,0.4)';
            e.currentTarget.style.borderColor = 'rgba(245,237,224,0.25)';
          }}
        >
          Skip &rarr;
        </button>
      )}

      {/* Title screen */}
      {!started && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(13,5,8,0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '1.5rem',
            zIndex: 5,
            overflowY: 'auto',
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              color: '#b8923a',
              fontSize: '0.65rem',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              marginBottom: '1.4rem',
            }}
          >
            &#10038; an interactive prelude &#10038;
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: '#f5ede0',
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 400,
              marginBottom: '1rem',
            }}
          >
            The Garden of Lanterns
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: 'rgba(245,237,224,0.6)',
              maxWidth: '380px',
              fontSize: '1rem',
              lineHeight: 1.7,
              marginBottom: '0.4rem',
            }}
          >
            Something waits for you beyond the garden.
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: 'rgba(245,237,224,0.6)',
              maxWidth: '380px',
              fontSize: '1rem',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Three trials await. Light five lanterns in each to find the way.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem 1.5rem',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            {[
              ['#6a7a9a', 'Unlit lantern'],
              ['#f5c040', 'Lit lantern'],
              ['#2e1640', 'Wall'],
              ['#3a2a1a', 'Mud (slows you)'],
            ].map(([c, l]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  color: 'rgba(245,237,224,0.6)',
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    background: c,
                    border: '1px solid rgba(245,237,224,0.2)',
                  }}
                />
                {l}
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(245,237,224,0.45)',
              marginBottom: '2rem',
            }}
          >
            {isMobile
              ? 'Move: tap the d-pad &nbsp; or swipe'
              : 'Move: \u2191 \u2193 \u2190 \u2192  WASD'}
          </p>

          <button
            onClick={() => setStarted(true)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
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
            Enter the Garden
          </button>
        </div>
      )}

      {/* Round-complete overlay */}
      {roundComplete && !exiting && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(13,5,8,0.94)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '1.5rem',
            zIndex: 6,
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              color: '#b8923a',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            ✦ &nbsp; {round + 1} of {TOTAL_ROUNDS} &nbsp; ✦
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: '#f5ede0',
              fontSize: '2rem',
              fontWeight: 400,
              marginBottom: '0.6rem',
            }}
          >
            {ROUND_TITLES[round]} — Cleared
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: 'rgba(245,237,224,0.55)',
              fontSize: '0.95rem',
            }}
          >
            {round + 1 < TOTAL_ROUNDS
              ? 'the next garden awaits…'
              : 'the way is open.'}
          </p>
        </div>
      )}

      {/* HUD */}
      {started && (
        <div
          style={{
            width: 'min(100%, 616px)',
            maxWidth: '616px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.4rem',
            padding: '0.5rem 0.2rem',
            color: '#f5ede0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#b8923a',
            }}
          >
            <span>Round {round + 1}/{TOTAL_ROUNDS}</span>
            <span style={{ color: 'rgba(245,237,224,0.3)' }}>·</span>
            <span>Lanterns</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: i < lanternsLit ? '#f5c040' : '#444',
                    boxShadow: i < lanternsLit ? '0 0 8px #f5c040' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: '0.95rem',
              color: '#f5ede0',
            }}
          >
            Steps: {steps}
          </div>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#b8923a',
            }}
          >
            Time: {Math.floor(timeSec / 60)}:
            {String(timeSec % 60).padStart(2, '0')}
          </div>
        </div>
      )}

      {/* Game canvas container */}
      {started && (
        <div
          style={{
            position: 'relative',
            width: 'min(100%, 616px)',
            maxWidth: '616px',
            aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
            border: '2px solid #3a1a22',
            boxShadow:
              '0 0 24px rgba(155,58,74,0.35), inset 0 0 32px rgba(0,0,0,0.5)',
            flexShrink: 1,
          }}
        >
          <canvas
            ref={gameCanvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              imageRendering: 'pixelated',
            }}
          />
          <canvas
            ref={vfxCanvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Mobile D-pad */}
      {started && isMobile && !roundComplete && !exiting && (
        <div
          aria-label="Directional controls"
          style={{
            position: 'fixed',
            bottom: 'max(1.2rem, env(safe-area-inset-bottom, 1.2rem))',
            right: '1.2rem',
            zIndex: 1100,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 56px)',
            gridTemplateRows: 'repeat(3, 56px)',
            gap: '6px',
            padding: '6px',
            background: 'rgba(13,5,8,0.35)',
            border: '1px solid rgba(245,237,224,0.12)',
            borderRadius: '14px',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div />
          <button
            aria-label="Move up"
            onPointerDown={(e) => {
              e.preventDefault();
              handleDpadDown(0, -1);
            }}
            onPointerUp={handleDpadUp}
            onPointerLeave={handleDpadUp}
            onPointerCancel={handleDpadUp}
            style={DPAD_BTN_STYLE}
          >
            &#9650;
          </button>
          <div />

          <button
            aria-label="Move left"
            onPointerDown={(e) => {
              e.preventDefault();
              handleDpadDown(-1, 0);
            }}
            onPointerUp={handleDpadUp}
            onPointerLeave={handleDpadUp}
            onPointerCancel={handleDpadUp}
            style={DPAD_BTN_STYLE}
          >
            &#9664;
          </button>
          <div />
          <button
            aria-label="Move right"
            onPointerDown={(e) => {
              e.preventDefault();
              handleDpadDown(1, 0);
            }}
            onPointerUp={handleDpadUp}
            onPointerLeave={handleDpadUp}
            onPointerCancel={handleDpadUp}
            style={DPAD_BTN_STYLE}
          >
            &#9654;
          </button>

          <div />
          <button
            aria-label="Move down"
            onPointerDown={(e) => {
              e.preventDefault();
              handleDpadDown(0, 1);
            }}
            onPointerUp={handleDpadUp}
            onPointerLeave={handleDpadUp}
            onPointerCancel={handleDpadUp}
            style={DPAD_BTN_STYLE}
          >
            &#9660;
          </button>
          <div />
        </div>
      )}
    </div>
  );
}
