import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { playPaper, playThud } from '../utils/sounds';
import { startFinaleMusic } from '../utils/music';

const AN = (d) => `itemIn 0.85s cubic-bezier(0.25, 1, 0.4, 1) ${d}s both`;
const rot = (d) => ({ '--rot': `${d}deg` });

let firstIntroDone = false;

const PAPER =
  'linear-gradient(180deg, rgba(58,42,36,0.02), rgba(58,42,36,0.05)), repeating-linear-gradient(0deg, rgba(120,90,50,0.035) 0 1px, transparent 1px 26px), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%), #f9efdc';

function Item({ d = 0, style, children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        animation: AN(d),
        transform: 'rotate(var(--rot, 0deg))',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Tape({ rotDeg = 0, style }) {
  return (
    <div style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }}>
      <div
        className="tape-lift"
        style={{
          width: '78px',
          height: '24px',
          background:
            'linear-gradient(105deg, rgba(226,196,124,0.6) 0%, rgba(238,210,148,0.55) 45%, rgba(205,175,115,0.6) 100%)',
          boxShadow: '0 1px 4px rgba(60,40,20,0.18)',
          borderLeft: '1px dashed rgba(255,255,255,0.55)',
          borderRight: '1px dashed rgba(255,255,255,0.55)',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}

function Note({ children, size = '1.25rem', color = '#5a4030', style }) {
  return (
    <span
      className="scribble"
      style={{ fontFamily: "'Caveat', cursive", fontSize: size, color, lineHeight: 1.25, ...style }}
    >
      {children}
    </span>
  );
}

function CoffeeStain({ rotDeg = 0, size = 110, style }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        transform: `rotate(${rotDeg}deg)`,
        background:
          'radial-gradient(circle, rgba(120,80,40,0.13) 0%, rgba(120,80,40,0.09) 55%, rgba(120,80,40,0) 72%)',
        ...style,
      }}
    />
  );
}

function DateStamp({ text, rotDeg = 0, style }) {
  return (
    <span
      style={{
        position: 'absolute',
        transform: `rotate(${rotDeg}deg)`,
        fontFamily: "'Fredoka', sans-serif",
        fontSize: '0.66rem',
        letterSpacing: '0.14em',
        color: '#7a5a3a',
        border: '1.5px dashed rgba(122,90,58,0.5)',
        borderRadius: '3px',
        padding: '3px 8px',
        textTransform: 'uppercase',
        background: 'rgba(255,255,255,0.3)',
        ...style,
      }}
    >
      {text}
    </span>
  );
}

function FilmStrip({ imgs, rotDeg = 0, cell = 58, style }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotDeg}deg)`,
        background: '#1e1a17',
        borderRadius: '3px',
        padding: '9px 9px 7px',
        boxShadow: '0 10px 24px rgba(30,20,10,0.35)',
        ...style,
      }}
    >
      <div
        style={{
          height: 5,
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 12px, #1e1a17 12px 17px)',
          marginBottom: 5,
        }}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        {imgs.map((s, i) => (
          <div key={i} style={{ background: '#0f0d0b', padding: 2, borderRadius: 1 }}>
            <img src={s} alt="" style={{ width: cell, height: cell, objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>
      <div
        style={{
          height: 5,
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 12px, #1e1a17 12px 17px)',
          marginTop: 5,
        }}
      />
    </div>
  );
}

function TornPaper({ children, rotDeg = 0, tone = '#f3e8cd', size = '1.1rem', style }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotDeg}deg)`,
        background: tone,
        padding: '10px 14px',
        clipPath:
          'polygon(0 4%, 12% 0, 24% 3%, 38% 0, 52% 4%, 66% 0, 80% 3%, 92% 0, 100% 5%, 100% 94%, 88% 100%, 72% 96%, 56% 100%, 40% 95%, 24% 100%, 10% 96%, 0 100%)',
        boxShadow: '0 6px 16px rgba(58,42,36,0.18)',
        fontFamily: "'Caveat', cursive",
        fontSize: size,
        color: '#4a342a',
        lineHeight: 1.3,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FlowerDoodle({ size = 34, color = '#d4847a', style }) {
  return (
    <div className="flower-hover" style={{ position: 'absolute', width: size, height: size, ...style }}>
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} className="petal" cx="20" cy="12" rx="7.5" ry="11" fill={color} opacity="0.85" transform={`rotate(${a} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="5" fill="#b8923a" />
      </svg>
    </div>
  );
}

function Sticker({ kind = 'star', color = '#b8923a', rotDeg = 0, size = 26, style }) {
  return (
    <div className="sticker-hover" style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }}>
      {kind === 'star' ? (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.2 6.1 20.2l1.3-6.6L2.5 9l6.6-.8z" fill={color} />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 21s-7.5-4.6-9.6-9.2C0.7 8 3 4.5 6.7 4.5c2.2 0 4 1.3 5.3 3 1.3-1.7 3.1-3 5.3-3 3.7 0 6 3.5 4.3 7.3C19.5 16.4 12 21 12 21z" fill={color} />
        </svg>
      )}
    </div>
  );
}

function TinyArrow({ rotDeg = 0, color = '#9b3a4a', style }) {
  return (
    <svg
      style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }}
      width="26"
      height="14"
      viewBox="0 0 26 14"
    >
      <path d="M1 7 H21 M15 1 L23 7 L15 13" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PaperClip({ rotDeg = 0, style }) {
  return (
    <svg style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }} width="26" height="52" viewBox="0 0 26 52">
      <path
        d="M9 52 V16 a7 7 0 0 1 14 0 V40 a4 4 0 0 1 -8 0 V22"
        fill="none"
        stroke="#a9a29a"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonDoodle({ size = 30, style }) {
  return (
    <svg style={{ position: 'absolute', ...style }} width={size} height={size} viewBox="0 0 32 32">
      <path d="M23 5a11 11 0 1 0 0 22 12 12 0 0 1 0-22z" fill="#d9c896" />
      <circle cx="14" cy="11" r="2" fill="#c9b678" opacity="0.7" />
      <circle cx="10" cy="18" r="1.6" fill="#c9b678" opacity="0.6" />
    </svg>
  );
}

function Envelope({ note, rotDeg = 0, style }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, cursor: 'pointer', ...style }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ position: 'relative', width: 148, height: 96, perspective: 500 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#f2e3c4',
            border: '1px solid rgba(120,90,50,0.4)',
            borderRadius: '4px',
            boxShadow: '0 8px 20px rgba(58,42,36,0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            height: '100%',
            clipPath: 'polygon(100% 0, 0 0, 50% 58%)',
            background: 'rgba(120,90,50,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
            clipPath: 'polygon(0 0, 100% 0, 50% 58%)',
            background: 'rgba(120,90,50,0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '58%',
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            background: '#ecdcbb',
            transformOrigin: 'top center',
            transition: 'transform 0.55s cubic-bezier(0.3, 1, 0.4, 1)',
            transform: open ? 'rotateX(165deg) translateY(-14px)' : 'rotateX(0deg)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '44%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Caveat', cursive",
            fontSize: '0.85rem',
            color: '#8a6a48',
            whiteSpace: 'nowrap',
          }}
        >
          open me
        </span>
        {open && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fdfaf2',
              padding: '10px 14px',
              borderRadius: '3px',
              boxShadow: '0 6px 18px rgba(58,42,36,0.25)',
              maxWidth: '150px',
              textAlign: 'center',
              animation: 'fadeUp 0.6s ease 0.15s both',
            }}
          >
            <span className="scribble" style={{ fontSize: '1rem', color: '#4a342a', lineHeight: 1.3 }}>
              {note}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Polaroid({ src, w, h, tape, tapePos, back, style, blank }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={back ? () => setFlipped(!flipped) : undefined}
      style={{
        position: 'absolute',
        cursor: back ? 'pointer' : 'default',
        ...style,
        transformStyle: 'preserve-3d',
        perspective: 900,
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: '#fdfaf4',
            padding: '10px 10px 34px',
            borderRadius: '3px',
            boxShadow: '0 12px 30px rgba(50,32,18,0.3)',
            transform: 'rotate(0.001deg)',
          }}
        >
          {blank ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                border: '1.5px dashed rgba(120,90,50,0.45)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.6rem',
                boxSizing: 'border-box',
              }}
            >
              <span className="scribble" style={{ fontSize: '1.05rem', color: '#8a6a48', textAlign: 'center', lineHeight: 1.3 }}>
                Reserved for our next memory. 🤍
              </span>
            </div>
          ) : (
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.95) contrast(1.03)' }} />
          )}
          {tape && <Tape rotDeg={tapePos || 0} style={{ top: -12, left: '50%', marginLeft: -39 }} />}
        </div>
        {back && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) rotate(0.001deg)',
              background: '#f2e7d0',
              border: '1px solid rgba(120,90,50,0.2)',
              borderRadius: '3px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.9rem',
              boxShadow: '0 12px 30px rgba(50,32,18,0.3)',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            <span className="scribble" style={{ fontSize: '1.05rem', color: '#4a342a', lineHeight: 1.3 }}>
              {back}
            </span>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '0.58rem',
                letterSpacing: '0.16em',
                color: '#8a6a48',
                textTransform: 'uppercase',
              }}
            >
              turn me over
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const PHOTO_DB = 'scrapbook-photos';
const PHOTO_STORE = 'galleries';
const PHOTO_KEY = 'all';
let photoDbPromise = null;
let photoCache = null;

function openPhotoDb() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('no idb'));
  if (!photoDbPromise) {
    photoDbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(PHOTO_DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(PHOTO_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return photoDbPromise;
}

async function loadPhotoStore() {
  if (photoCache) return photoCache;
  try {
    const db = await openPhotoDb();
    photoCache = await new Promise((resolve) => {
      const tx = db.transaction(PHOTO_STORE, 'readonly');
      const get = tx.objectStore(PHOTO_STORE).get(PHOTO_KEY);
      get.onsuccess = () => resolve(get.result || { food: [], favorites: [] });
      get.onerror = () => resolve({ food: [], favorites: [] });
    });
  } catch {
    photoCache = { food: [], favorites: [] };
  }
  return photoCache;
}

async function mutatePhotoStore(fn) {
  const s = await loadPhotoStore();
  fn(s);
  try {
    const db = await openPhotoDb();
    await new Promise((resolve) => {
      const tx = db.transaction(PHOTO_STORE, 'readwrite');
      tx.objectStore(PHOTO_STORE).put(s, PHOTO_KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => resolve();
    });
  } catch {
    return s;
  }
  return s;
}

function readAndShrink(file) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1000;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        try {
          resolve(c.toDataURL('image/webp', 0.85));
        } catch {
          resolve(c.toDataURL('image/jpeg', 0.85));
        }
      };
      img.onerror = () => resolve(fr.result);
      img.src = fr.result;
    };
    fr.onerror = () => resolve(null);
    fr.readAsDataURL(file);
  });
}

function MiniTape({ rotDeg = 0, style }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotDeg}deg)`,
        width: 34,
        height: 13,
        background:
          'linear-gradient(105deg, rgba(226,196,124,0.55) 0%, rgba(238,210,148,0.5) 45%, rgba(205,175,115,0.55) 100%)',
        boxShadow: '0 1px 3px rgba(60,40,20,0.18)',
        borderLeft: '1px dashed rgba(255,255,255,0.5)',
        borderRight: '1px dashed rgba(255,255,255,0.5)',
        ...style,
      }}
    />
  );
}

function PaperNote({ children, size = '1.05rem', rotDeg = 0, color = '#5a4030', style }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotDeg}deg)`,
        background: '#fdf7e8',
        padding: '9px 13px',
        borderRadius: '2px',
        boxShadow: '0 4px 10px rgba(58,42,36,0.2)',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <span className="scribble" style={{ fontSize: size, color, lineHeight: 1.3 }}>
        {children}
      </span>
    </div>
  );
}

function PressedFlower({ size = 40, rotDeg = 0, color = '#d4847a', style }) {
  return (
    <svg style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }} width={size} height={size} viewBox="0 0 40 40">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="20" cy="12" rx="7" ry="10.5" fill={color} opacity="0.75" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#b8923a" />
      <path d="M20 24 C19 29, 15 32, 10 34" stroke="#7d9a6d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function LeafDoodle({ width = 26, rotDeg = 0, color = '#8fa97e', style }) {
  return (
    <svg style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }} width={width} height={Math.round(width * 1.7)} viewBox="0 0 26 44">
      <path d="M13 2 C22 12, 24 26, 13 42 C4 26, 4 12, 13 2 Z" fill={color} opacity="0.55" />
      <path d="M13 4 C13 20, 13 32, 13 40" stroke="#5f7a52" strokeWidth="1.1" fill="none" opacity="0.75" />
    </svg>
  );
}

function StarDoodle({ size = 16, rotDeg = 0, color = '#8a6a48', style }) {
  return (
    <svg style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3 L14.2 9.2 L20.8 9.4 L15.6 13.6 L17.4 20 L12 16.2 L6.6 20 L8.4 13.6 L3.2 9.4 L9.8 9.2 Z" fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function HeartDoodle({ size = 18, rotDeg = 0, color = '#e8829c', style }) {
  return (
    <svg style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 19.5 C11.2 18.8, 3.5 14.4, 3.5 9 C3.5 6.1, 5.8 4.8, 7.9 4.8 C10 4.8, 12 6.5, 12 6.5 C12 6.5, 14 4.8, 16.1 4.8 C18.2 4.8, 20.5 6.1, 20.5 9 C20.5 14.4, 12.8 18.8, 12 19.5 Z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ButterflyDoodle({ size = 26, rotDeg = 0, style }) {
  return (
    <svg style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, ...style }} width={size} height={Math.round(size * 0.85)} viewBox="0 0 30 26">
      <path d="M15 13 C11 5, 3 6, 6 13 C9 20, 13 14, 15 13 Z" fill="#c9a2a8" opacity="0.8" />
      <path d="M15 13 C19 5, 27 6, 24 13 C21 20, 17 14, 15 13 Z" fill="#d8b8bd" opacity="0.8" />
      <path d="M15 13 C13 16, 12 21, 15 24 C18 21, 17 16, 15 13 Z" fill="#b98c93" opacity="0.8" />
      <path d="M15 13 L15 23 M15 13 L11 7 M15 13 L19 7" stroke="#7a5a5f" strokeWidth="0.9" fill="none" opacity="0.7" />
    </svg>
  );
}

function ReceiptFragment({ rotDeg = 0, style }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotDeg}deg)`,
        width: 152,
        background: '#f2efe6',
        clipPath:
          'polygon(0 0, 100% 0, 100% 86%, 92% 100%, 84% 87%, 76% 100%, 68% 87%, 60% 100%, 52% 87%, 44% 100%, 36% 87%, 28% 100%, 20% 87%, 12% 100%, 0 86%)',
        boxShadow: '0 4px 10px rgba(58,42,36,0.18)',
        padding: '10px 13px 12px',
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          color: '#7a6a5a',
          textTransform: 'uppercase',
          marginBottom: 6,
          borderBottom: '1px dashed rgba(122,90,58,0.4)',
          paddingBottom: 4,
        }}
      >
        A LITTLE TEA
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.68rem', color: '#7a6a5a', lineHeight: 1.7 }}>
        cake milk tea ... 1
        <br />
        cake matcha ..... 1
        <br />
        smiles .......... free
      </div>
    </div>
  );
}

function EmptyFrame({ w = 250, h = 190, rotDeg = 0, style }) {
  return (
    <div style={{ position: 'absolute', transform: `rotate(${rotDeg}deg)`, width: w, height: h, ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #8a5a33, #6f4426 60%, #5f3a20)',
          borderRadius: 6,
          boxShadow: '0 14px 34px rgba(58,42,36,0.4)',
          padding: 14,
        }}
      >
        <div style={{ position: 'absolute', inset: 14, background: '#fdfaf2', borderRadius: 2 }} />
        <MiniTape rotDeg={-6} style={{ top: -5, left: '24%' }} />
        <MiniTape rotDeg={5} style={{ bottom: -5, right: '20%' }} />
      </div>
    </div>
  );
}

function PhotoGallery({ store, start = 0, count = 12, emptyLabel = 'Photo' }) {
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const targetRef = useRef(null);
  const replaceModeRef = useRef(false);

  useEffect(() => {
    let alive = true;
    loadPhotoStore().then((s) => {
      if (alive) setItems([...(s[store] || [])]);
    });
    return () => {
      alive = false;
    };
  }, [store]);

  async function refresh() {
    const s = await loadPhotoStore();
    setItems([...(s[store] || [])]);
  }

  async function onFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    setBusy(true);
    const url = await readAndShrink(f);
    const g = targetRef.current;
    if (url) {
      await mutatePhotoStore((s) => {
        const arr = s[store] || [];
        if (replaceModeRef.current && g != null && g < arr.length) {
          arr.splice(g, 1, url);
        } else {
          const i = g == null || g >= arr.length ? arr.length : g;
          arr.splice(i, 0, url);
        }
        s[store] = arr;
      });
      await refresh();
    }
    setPreview(null);
    setBusy(false);
  }

  async function deletePhoto(g) {
    await mutatePhotoStore((s) => {
      const arr = s[store] || [];
      if (g != null && g >= 0 && g < arr.length) arr.splice(g, 1);
    });
    setPreview(null);
    await refresh();
  }

  const ROT = [0, -2.5, 2, -1.5, 3, -3.5, 1.5, -4, 2.5, -1, 4, -2];
  const rFor = (g) => ROT[Math.abs(g * 7) % ROT.length];
  let filledHere = 0;
  for (let p = 0; p < count; p++) {
    if (items[start + p]) filledHere++;
  }
  const visibleCells = Math.max(1, Math.min(count, filledHere + 1));
  const btn = {
    fontFamily: "'Caveat', cursive",
    fontSize: '1.02rem',
    color: '#5a4030',
    background: 'transparent',
    border: '1px solid rgba(122,90,58,0.6)',
    borderRadius: 999,
    padding: '0.25rem 1.05rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '124px', gap: '0.55rem', maxWidth: 420, margin: '0 auto' }}>
        {Array.from({ length: visibleCells }).map((_, p) => {
          const g = start + p;
          const img = items[g];
          const r = rFor(g);
          if (img) {
            return (
              <div
                key={g}
                className="g-photo"
                onClick={() => setPreview(g)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 5,
                  overflow: 'hidden',
                  transform: `rotate(${r}deg)`,
                  boxShadow: '0 3px 9px rgba(58,42,36,0.3)',
                  cursor: 'zoom-in',
                  background: '#fdfaf2',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <MiniTape style={{ top: -4, left: '62%' }} />
              </div>
            );
          }
          return (
            <div
              key={g}
              className="g-slot"
              onClick={() => {
                replaceModeRef.current = false;
                targetRef.current = g;
                fileRef.current.click();
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 5,
                border: '1.5px dashed rgba(122,90,58,0.45)',
                background: 'rgba(255,250,238,0.45)',
                transform: `rotate(${r}deg)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.12rem',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16">
                <path d="M8 2v12M2 8h12" stroke="#8a6a48" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="scribble" style={{ fontSize: '0.66rem', color: '#8a6a48', textAlign: 'center', lineHeight: 1.15 }}>
                Add {emptyLabel}
              </span>
            </div>
          );
        })}
      </div>
      {busy &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: '50%',
              bottom: '1.6rem',
              transform: 'translateX(-50%)',
              zIndex: 8900,
              fontFamily: "'Caveat', cursive",
            fontSize: '1.05rem',
            color: '#5a4030',
            background: '#fdf7e8',
            padding: '0.4rem 1.1rem',
            borderRadius: 999,
            boxShadow: '0 6px 18px rgba(58,42,36,0.3)',
          }}
        >
          tucking the photo in...
        </div>,
        document.body
      )}
      {preview != null && items[preview] &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 8800,
              background: 'rgba(30,18,8,0.72)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.25s ease',
            }}
            onClick={() => setPreview(null)}
          >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fdfaf2',
              padding: '1.1rem 1.1rem 0.9rem',
              borderRadius: 6,
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              maxWidth: '84vw',
              maxHeight: '84vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              transform: 'rotate(-1deg)',
            }}
          >
            <img
              src={items[preview]}
              alt=""
              style={{
                maxWidth: '76vw',
                maxHeight: '62vh',
                objectFit: 'contain',
                display: 'block',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>
              <button
                style={btn}
                onClick={() => {
                  replaceModeRef.current = true;
                  targetRef.current = preview;
                  fileRef.current.click();
                }}
              >
                replace
              </button>
              <button style={btn} onClick={() => deletePhoto(preview)}>
                delete
              </button>
              <button style={btn} onClick={() => setPreview(null)}>
                close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function Page({ side, n, children }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '50%',
        left: side === 'left' ? 0 : undefined,
        right: side === 'right' ? 0 : undefined,
        background: PAPER,
        overflow: 'hidden',
        borderRadius: side === 'left' ? '10px 0 0 10px' : '0 10px 10px 0',
      }}
    >
      {children}
      <span
        className="scribble"
        style={{ position: 'absolute', bottom: 10, right: 14, fontSize: '0.95rem', color: 'rgba(90,64,48,0.4)' }}
      >
        p. {n}
      </span>
    </div>
  );
}

function Spread0() {
  return (
    <>
      <Page side="left" n="1">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: firstIntroDone ? 'none' : 'introFade 2.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
          }}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) firstIntroDone = true;
          }}
        >
          <div style={{ position: 'absolute', top: 38, left: 52, right: 52 }}>
            <span className="scribble" style={{ fontSize: '1.75rem', color: '#5a4030' }}>Hi, kikay. 💗</span>
            <div style={{ marginTop: '0.85rem', fontFamily: "'Caveat', cursive", fontSize: '1.03rem', lineHeight: 1.42, color: '#5a4030' }}>
              <p style={{ margin: '0 0 0.55rem' }}>If you're reading this... thank you.</p>
              <p style={{ margin: '0 0 0.55rem' }}>Before closing this little website, I wanted to leave one last place where all the little memories we've made could stay together.</p>
              <p style={{ margin: '0 0 0.55rem' }}>Not because I think we'll forget them...</p>
              <p style={{ margin: '0 0 0.55rem' }}>but because I believe the smallest moments often become the most unforgettable ones.</p>
              <p style={{ margin: '0 0 0.55rem' }}>The conversations that made ordinary days brighter.</p>
              <p style={{ margin: '0 0 0.55rem' }}>The random pictures that slowly became some of my favorites.</p>
              <p style={{ margin: '0 0 0.55rem' }}>The meals we shared. The laughs. The little adventures.</p>
              <p style={{ margin: '0 0 0.55rem' }}>Looking back made me realize something...</p>
              <p style={{ margin: '0 0 0.55rem' }}>Happiness doesn't always come from extraordinary moments.</p>
              <p style={{ margin: '0 0 0.55rem' }}>Sometimes it quietly hides inside ordinary days spent with someone special.</p>
              <p style={{ margin: '0 0 0.55rem' }}>So this scrapbook isn't really about photographs.</p>
              <p style={{ margin: '0 0 0.55rem' }}>It's about the memories behind them.</p>
              <p style={{ margin: 0 }}>And I'm really happy that I got to make those memories with you.</p>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 650, right: 34, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="scribble" style={{ fontSize: '1.2rem', color: '#5a4030' }}>Turn the page. :)</span>
            <TinyArrow rotDeg={-35} color="#9b3a4a" style={{ position: 'relative' }} />
          </div>
          <PressedFlower size={46} rotDeg={14} style={{ top: 34, right: 34 }} />
          <StarDoodle size={15} style={{ top: 150, right: 78 }} />
          <StarDoodle size={12} rotDeg={30} style={{ top: 240, left: 130 }} />
          <StarDoodle size={13} rotDeg={-20} style={{ top: 620, left: 64 }} />
          <CoffeeStain size={130} style={{ top: 690, left: -24, opacity: 0.55 }} />
          <PaperClip rotDeg={20} style={{ top: 18, left: '47%' }} />
          <MiniTape rotDeg={8} style={{ top: 470, right: -8, width: 40, height: 15 }} />
        </div>
      </Page>
      <Page side="right" n="2">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: firstIntroDone ? 'none' : 'introFade 2.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both',
          }}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) firstIntroDone = true;
          }}
        >
          <span className="scribble" style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', fontSize: '1.9rem', color: '#5a4030' }}>Our First Date</span>
          <Polaroid src="/moments/1.jpg" w={300} h={305} tape tapePos={-2} style={{ top: 130, left: 56, transform: 'rotate(-3deg)' }} />
          <Note size="1.02rem" style={{ position: 'absolute', top: 452, left: 66, transform: 'rotate(-1deg)' }}>"The day 'soon' finally became today."</Note>
          <TinyArrow rotDeg={-70} color="#9b3a4a" style={{ top: 422, left: 120 }} />
          <Polaroid src="/scrapbook/2.jpg" w={186} h={146} tape tapePos={6} style={{ top: 352, right: 58, transform: 'rotate(3deg)' }} />
          <Note size="1rem" style={{ position: 'absolute', top: 514, right: 44, transform: 'rotate(1.5deg)', maxWidth: 220 }}>"I still think the milk tea tasted better because of the company."</Note>
          <TinyArrow rotDeg={-110} color="#9b3a4a" style={{ top: 486, right: 170 }} />
          <Polaroid src="/moments/7.jpg" w={158} h={158} tape tapePos={-8} style={{ top: 200, right: 96, transform: 'rotate(-2deg)' }} />
          <Note size="0.98rem" style={{ position: 'absolute', top: 148, right: 60, transform: 'rotate(-2deg)' }}>"One of my favorite afternoons."</Note>
          <TinyArrow rotDeg={55} color="#9b3a4a" style={{ top: 182, right: 152 }} />
          <ReceiptFragment rotDeg={-3} style={{ top: 490, left: 215 }} />
          <DateStamp text="OUR FIRST DATE" rotDeg={-5} style={{ top: 612, right: 60 }} />
          <StarDoodle size={14} style={{ top: 96, left: 64 }} />
          <StarDoodle size={11} rotDeg={25} style={{ top: 700, left: 120 }} />
          <FlowerDoodle size={30} style={{ top: 620, right: 320, transform: 'rotate(15deg)' }} />
          <HeartDoodle size={16} rotDeg={-12} style={{ top: 120, left: 250 }} />
          <HeartDoodle size={13} rotDeg={10} style={{ top: 645, left: 70 }} />
          <TinyArrow rotDeg={-25} color="#b8923a" style={{ top: 160, left: 66 }} />
          <TinyArrow rotDeg={-150} color="#b8923a" style={{ top: 600, right: 210 }} />
        </div>
      </Page>
    </>
  );
}

function Spread1() {
  return (
    <>
      <Page side="left" n="3">
        <div style={{ position: 'absolute', inset: 0, padding: '26px 28px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="scribble" style={{ fontSize: '1.7rem', color: '#5a4030' }}>Our Food Memories</span>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: '#8a6a48', marginTop: '0.15rem' }}>Every meal has a story.</div>
          </div>
          <div style={{ marginTop: '0.8rem' }}>
            <PhotoGallery store="food" start={0} emptyLabel="Food Photo" />
          </div>
        </div>
      </Page>
      <Page side="right" n="4">
        <div style={{ position: 'absolute', inset: 0, padding: '26px 28px 0' }}>
          <PhotoGallery store="food" start={12} emptyLabel="Food Photo" />
        </div>
      </Page>
    </>
  );
}

function Spread2() {
  return (
    <>
      <Page side="left" n="5">
        <div style={{ position: 'absolute', inset: 0, padding: '26px 28px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="scribble" style={{ fontSize: '1.7rem', color: '#5a4030' }}>Our Favorite Pictures</span>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: '#8a6a48', marginTop: '0.15rem' }}>The little moments became my favorite ones.</div>
          </div>
          <div style={{ marginTop: '0.8rem' }}>
            <PhotoGallery store="favorites" start={0} emptyLabel="Photo" />
          </div>
        </div>
      </Page>
      <Page side="right" n="6">
        <div style={{ position: 'absolute', inset: 0, padding: '26px 28px 0' }}>
          <PhotoGallery store="favorites" start={12} emptyLabel="Photo" />
        </div>
        <StarDoodle size={14} rotDeg={-15} style={{ top: 12, left: 24 }} />
        <HeartDoodle size={15} rotDeg={12} style={{ top: 18, right: 26 }} />
        <MiniTape rotDeg={-4} style={{ top: 700, left: '42%' }} />
      </Page>
    </>
  );
}

function Spread3() {
  return (
    <>
      <Page side="left" n="7">
        <span className="scribble" style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center', fontSize: '1.75rem', color: '#5a4030', lineHeight: 1.25 }}>
          Little Things I Hope
          <br />
          You Never Forget
        </span>
        <PaperNote rotDeg={-4} style={{ top: 168, left: 70 }}>I'm always rooting for you.</PaperNote>
        <PaperNote rotDeg={3} style={{ top: 190, right: 80 }}>Don't forget to eat.</PaperNote>
        <PaperNote rotDeg={-2} style={{ top: 340, left: 150 }}>I'm proud of how hard you're working.</PaperNote>
        <PaperNote rotDeg={2} style={{ top: 360, right: 140 }}>Take your time.</PaperNote>
        <PaperNote rotDeg={-3} size="1.1rem" style={{ top: 540, left: 90 }}>Rest when you need to.</PaperNote>
        <PaperNote rotDeg={1} style={{ top: 560, right: 90 }}>You deserve good things.</PaperNote>
        <PaperNote rotDeg={-2} size="1.12rem" style={{ top: 630, left: 170 }}>Thank you for being you.</PaperNote>
        <PressedFlower size={44} rotDeg={-12} style={{ top: 96, left: 70 }} />
        <PressedFlower size={36} rotDeg={20} color="#c9a2a8" style={{ top: 600, right: 100 }} />
        <LeafDoodle width={30} rotDeg={35} style={{ top: 300, left: 230 }} />
        <LeafDoodle width={24} rotDeg={-30} style={{ top: 420, right: 210 }} />
        <StarDoodle size={14} style={{ top: 150, left: 300 }} />
        <StarDoodle size={12} rotDeg={18} style={{ top: 610, right: 300 }} />
        <StarDoodle size={11} rotDeg={-12} style={{ top: 480, left: 60 }} />
        <HeartDoodle size={17} rotDeg={-8} style={{ top: 470, right: 60 }} />
        <HeartDoodle size={14} rotDeg={14} style={{ top: 630, left: 60 }} />
        <MiniTape rotDeg={-6} style={{ top: 175, left: '48%' }} />
        <MiniTape rotDeg={5} style={{ top: 420, right: '44%' }} />
        <ButterflyDoodle size={26} rotDeg={-8} style={{ top: 330, right: 110 }} />
      </Page>
      <Page side="right" n="8">
        <span className="scribble" style={{ position: 'absolute', top: 56, left: 0, right: 0, textAlign: 'center', fontSize: '1.8rem', color: '#5a4030' }}>If We Ever Read This Again...</span>
        <div style={{ position: 'absolute', top: 150, left: 80, right: 80, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.08rem', lineHeight: 1.85, color: '#5a4030', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.7rem' }}>I don't know what this scrapbook will look like someday.</p>
          <p style={{ margin: '0 0 0.7rem' }}>Maybe it'll stay exactly like this.</p>
          <p style={{ margin: '0 0 0.7rem' }}>Maybe it'll become twice as full.</p>
          <p style={{ margin: '0 0 0.7rem' }}>Maybe we'll look back at these pages and smile because of how much has changed.</p>
          <p style={{ margin: '0 0 0.7rem' }}>Whatever happens... I'm simply grateful that these memories exist.</p>
          <p style={{ margin: '0 0 0.7rem' }}>Because every page reminds me that some of the happiest moments I've had...</p>
          <p style={{ margin: '0 0 0.7rem' }}>were the ones I got to share with you.</p>
          <p style={{ margin: '0 0 0.7rem' }}>And if life gives us more memories,</p>
          <p style={{ margin: 0 }}>I'd happily keep filling this scrapbook, one page at a time.</p>
        </div>
        <CoffeeStain size={120} style={{ top: 660, right: -20, opacity: 0.5 }} />
        <StarDoodle size={13} rotDeg={20} style={{ top: 150, right: 60 }} />
        <StarDoodle size={12} rotDeg={-15} style={{ top: 420, left: 60 }} />
        <LeafDoodle width={26} rotDeg={-20} style={{ top: 550, left: 70 }} />
        <PressedFlower size={36} rotDeg={10} style={{ top: 570, right: 70 }} />
      </Page>
    </>
  );
}

function Spread4() {
  return (
    <>
      <Page side="left" n="9">
        <div style={{ position: 'absolute', top: 150, left: '50%', marginLeft: -205, width: 410, height: 410, transform: 'rotate(1deg)' }}>
          <img
            src="/scrapbook/3.jpg"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: 2,
              boxShadow: '0 18px 40px rgba(58,42,36,0.35)',
              filter: 'saturate(1.05) contrast(1.02) brightness(1.03)',
            }}
          />
          <Tape rotDeg={-12} style={{ top: -13, left: '14%' }} />
          <Tape rotDeg={10} style={{ bottom: -13, right: '12%' }} />
        </div>
        <div style={{ position: 'absolute', top: 610, left: 0, right: 0, textAlign: 'center' }}>
          <span className="scribble" style={{ fontSize: '1.5rem', color: '#5a4030', lineHeight: 1.3 }}>
            "My favorite page...so far."
          </span>
        </div>
        <TinyArrow rotDeg={0} color="#9b3a4a" style={{ top: 330, right: 30 }} />
        <Note size="1.05rem" style={{ position: 'absolute', top: 352, right: 30, transform: 'rotate(0.5deg)' }}>One last page...</Note>
        <PressedFlower size={42} rotDeg={-8} style={{ top: 580, left: 80 }} />
        <StarDoodle size={13} rotDeg={15} style={{ top: 600, right: 110 }} />
        <CoffeeStain size={100} style={{ top: 60, left: -24, opacity: 0.45 }} />
      </Page>
      <Page side="right" n="10">
        <span className="scribble" style={{ position: 'absolute', top: 46, left: 0, right: 0, textAlign: 'center', fontSize: '1.9rem', color: '#5a4030' }}>To Be Continued...</span>
        <EmptyFrame w={270} h={200} rotDeg={2} style={{ top: 130, left: '50%', marginLeft: -135 }} />
        <Note size="1.2rem" style={{ position: 'absolute', top: 372, left: 0, right: 0, textAlign: 'center' }}>Reserved for our next memory. 💗</Note>
        <div style={{ position: 'absolute', top: 400, left: 70, right: 70, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.55, color: '#5a4030', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.45rem' }}>I hope this won't always be the last page.</p>
          <p style={{ margin: '0 0 0.45rem' }}>Maybe one day we'll look back at this scrapbook and realize that our favorite memories hadn't happened yet.</p>
          <p style={{ margin: '0 0 0.45rem' }}>Until then...</p>
          <p style={{ margin: '0 0 0.45rem' }}>thank you for every laugh, every conversation, every photo, every meal,</p>
          <p style={{ margin: '0 0 0.45rem' }}>and every ordinary day that quietly became unforgettable.</p>
        </div>
        <div style={{ position: 'absolute', top: 618, left: 0, right: 0, textAlign: 'center' }}>
          <span className="scribble" style={{ fontSize: '1.12rem', color: '#5a4030', lineHeight: 1.35 }}>
            "The best stories aren't finished.
            <br />
            They're simply waiting for the next page."
          </span>
        </div>
        <CoffeeStain size={110} style={{ top: 690, left: -20, opacity: 0.5 }} />
        <StarDoodle size={12} style={{ top: 210, left: 60 }} />
        <HeartDoodle size={15} rotDeg={-10} style={{ top: 260, right: 80 }} />
      </Page>
    </>
  );
}

const SPREADS = [Spread0, Spread1, Spread2, Spread3, Spread4];

export default function Scrapbook({ onExit }) {
  const [bookIn, setBookIn] = useState(false);
  const [thudDone, setThudDone] = useState(false);
  const [coverState, setCoverState] = useState('hidden');
  const [itemsReady, setItemsReady] = useState(false);
  const [spread, setSpread] = useState(0);
  const [flip, setFlip] = useState(null);
  const [closing, setClosing] = useState(false);
  const [black, setBlack] = useState(false);
  const [finalText, setFinalText] = useState(false);
  const closedRef = useRef(false);
  const lastFlipRef = useRef(0);
  const rootRef = useRef(null);
  const navRef = useRef({});
  navRef.current = { flip, spread, closing, nextPage, prevPage };
  const flipRef = useRef(null);
  flipRef.current = flip;
  const [hintHidden, setHintHidden] = useState(false);
  const hintHiddenRef = useRef(false);
  const [dust, setDust] = useState([]);

  useEffect(() => {
    startFinaleMusic(0.45);
    const t = [];
    t.push(setTimeout(() => setBookIn(true), 350));
    t.push(
      setTimeout(() => {
        setThudDone(true);
        playThud();
        setDust(
          Array.from({ length: 9 }, (_, i) => ({
            dx: `${(Math.random() - 0.5) * 260}px`,
            dy: `${-60 - Math.random() * 160}px`,
            delay: Math.random() * 0.3,
            size: 5 + Math.random() * 7,
          }))
        );
      }, 2100)
    );
    t.push(
      setTimeout(() => {
        playPaper();
        setCoverState('opening');
      }, 2500)
    );
    t.push(setTimeout(() => setItemsReady(true), 4600));
    return () => {
      t.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (flip && flip.phase === 'start') {
      const raf = requestAnimationFrame(() => {
        setFlip((f) => (f ? { ...f, phase: 'go' } : f));
      });
      return () => cancelAnimationFrame(raf);
    }
    if (flip && flip.phase === 'go') {
      const t = setTimeout(completeFlip, 1300);
      return () => clearTimeout(t);
    }
  }, [flip]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const st = navRef.current;
      if (st.closing || st.flip) return;
      if (Date.now() - lastFlipRef.current < 350) return;
      hintHiddenRef.current = true;
      setHintHidden(true);
      if (e.deltaY > 0) {
        if (st.spread >= SPREADS.length - 1) {
          if (!closedRef.current) {
            closedRef.current = true;
            startClose();
          }
        } else {
          st.nextPage();
        }
      } else if (e.deltaY < 0) {
        st.prevPage();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  function startClose() {
    setClosing(true);
    playPaper();
    setCoverState('closing');
    setTimeout(() => setBlack(true), 3000);
    setTimeout(() => setFinalText(true), 4700);
    setTimeout(() => onExit && onExit(), 11200);
  }

  function nextPage() {
    if (flip || closing) return;
    if (spread >= SPREADS.length - 1) return;
    lastFlipRef.current = Date.now();
    setFlip({ index: spread, dir: 'forward', phase: 'start' });
  }

  function prevPage() {
    if (flip || closing) return;
    if (spread <= 0) return;
    lastFlipRef.current = Date.now();
    setFlip({ index: spread - 1, dir: 'backward', phase: 'start' });
  }

  function completeFlip() {
    const f = flipRef.current;
    if (!f) return;
    setSpread((s) => (f.dir === 'forward' ? s + 1 : s - 1));
    setFlip(null);
  }

  function onFlipEnd(e) {
    if (e.propertyName !== 'transform' || e.target !== e.currentTarget) return;
    completeFlip();
  }

  const Current = SPREADS[spread];
  const Prev = flip && flip.index >= 0 ? SPREADS[flip.index] : null;
  const Next = flip && flip.index + 1 < SPREADS.length ? SPREADS[flip.index + 1] : null;
  let angle = 0;
  if (flip) {
    angle = flip.dir === 'forward'
      ? flip.phase === 'go' ? -180 : 0
      : flip.phase === 'go' ? 0 : -180;
  }

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1600,
        overflow: 'hidden',
        animation: 'fadeIn 0.9s ease',
        background:
          'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 7px), linear-gradient(180deg, #6b4527 0%, #5a3820 38%, #493019 70%, #38220f 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: 'calc((100vh - min(840px, 88vh)) / 2)',
        }}
      >
        <div style={{ perspective: '2800px', animation: closing ? 'bookShrink 2.6s cubic-bezier(0.5, 0, 0.8, 0.4) both' : 'none' }}>
          <div
            style={{
              position: 'relative',
              width: 'min(1500px, 94vw)',
              height: '1140px',
              transformOrigin: 'center bottom',
              transformStyle: 'preserve-3d',
              animation: bookIn ? 'bookRise 1.75s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                borderRadius: '14px',
                boxShadow:
                  '0 60px 90px rgba(20,10,5,0.55), 0 1px 0 #e9ddc2, 0 2px 0 #e2d4b6, 0 3px 0 #dccdab, 0 4px 0 #d6c6a2',
                background: '#f0e6cd',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '4px 6px 5px 6px',
                borderRadius: '10px',
                background: '#f6eed8',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: '34px',
                    marginLeft: -17,
                    background:
                      'linear-gradient(90deg, rgba(58,42,36,0.12), rgba(58,42,36,0.03) 45%, rgba(58,42,36,0.12))',
                    transform: 'translateZ(1px)',
                    pointerEvents: 'none',
                  }}
              />
              {itemsReady && (
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {Array.from({ length: Math.min(spread, 6) }).map((_, i) => (
                    <div
                      key={`lstack-${i}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        left: -2 - i * 1.4,
                        background: '#e2d3ac',
                        boxShadow: '0 0 0 1px rgba(60,40,10,0.15)',
                      }}
                    />
                  ))}
                  {Array.from({ length: Math.min(SPREADS.length - 1 - spread, 6) }).map((_, i) => (
                    <div
                      key={`rstack-${i}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        right: -2 - i * 1.4,
                        background: '#e2d3ac',
                        boxShadow: '0 0 0 1px rgba(60,40,10,0.15)',
                      }}
                    />
                  ))}
                  {!flip && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <Current />
                    </div>
                  )}
                  {flip && (
                    <>
                      <div className="flip-static" style={{ position: 'absolute', inset: 0, clipPath: flip.dir === 'forward' ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)' }}>
                        {flip.dir === 'forward' ? <Current /> : <Prev />}
                      </div>
                      <div className="flip-static" style={{ position: 'absolute', inset: 0, clipPath: flip.dir === 'forward' ? 'inset(0 0 0 50%)' : 'inset(0 50% 0 0)' }}>
                        {flip.dir === 'forward' ? <Next /> : <Current />}
                      </div>
                      <div
                        onTransitionEnd={onFlipEnd}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          transformOrigin: '50% 50%',
                          transformStyle: 'preserve-3d',
                          zIndex: 50,
                          transform: `rotateY(${angle}deg)`,
                          transition: 'transform 1.05s cubic-bezier(0.45, 0.05, 0.15, 1)',
                        }}
                      >
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                          <div className="flip-static" style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 0 0 50%)' }}>
                            {flip.dir === 'forward' ? <Current /> : <Prev />}
                          </div>
                          <div
                            aria-hidden
                            style={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: '50%',
                              right: 0,
                              boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
                              background: 'linear-gradient(90deg, rgba(0,0,0,0.35), transparent 40%)',
                              opacity: flip.phase === 'go' ? 1 : 0,
                              animation: flip.phase === 'go' ? 'flipFrontShadow 1.05s linear both' : 'none',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          <div className="flip-static" style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)' }}>
                            {flip.dir === 'forward' ? <Next /> : <Current />}
                          </div>
                          <div
                            aria-hidden
                            style={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: '50%',
                              boxShadow: '-2px 0 10px rgba(0,0,0,0.3)',
                              background: 'linear-gradient(270deg, rgba(0,0,0,0.35), transparent 40%)',
                              opacity: flip.phase === 'go' ? 0.5 : 0,
                              animation: flip.phase === 'go' ? 'flipBackShadow 1.05s linear both' : 'none',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {coverState !== 'done' && (
              <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    transform: 'translateZ(2px)',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    borderRadius: '14px',
                  background:
                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 3px, transparent 3px 9px), linear-gradient(135deg, #5d3a24 0%, #4a2c18 55%, #3c2210 100%)',
                  boxShadow: '0 40px 80px rgba(15,8,4,0.6)',
                  animation:
                    coverState === 'opening'
                      ? 'coverOpen 1.9s cubic-bezier(0.45, 0, 0.25, 1) both'
                      : coverState === 'closing'
                        ? 'coverClose 1.7s cubic-bezier(0.4, 0, 0.2, 1) both'
                        : 'none',
                  border: '6px solid #2e1c0e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    border: '2px solid rgba(212,180,120,0.7)',
                    borderRadius: '10px',
                    padding: '2.2rem 3.4rem',
                    textAlign: 'center',
                    background: 'rgba(255,235,200,0.05)',
                    transform: 'translateY(-200px)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                      color: '#f2e3c4',
                      letterSpacing: '0.06em',
                      lineHeight: 1.4,
                    }}
                  >
                    Our Little Scrapbook
                  </span>
                  <div
                    style={{
                      width: '3rem',
                      height: 1,
                      background: '#b8923a',
                      margin: '0.9rem auto 0.7rem',
                    }}
                  />
                  <span className="scribble" style={{ fontSize: '1.15rem', color: 'rgba(242,227,196,0.75)' }}>
                    made for you, by heart
                  </span>
                </div>
              </div>
            )}

            {thudDone && !closing && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none' }}>
                {dust.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '8%',
                      width: p.size,
                      height: p.size,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,240,190,0.95), rgba(240,180,60,0) 70%)',
                      animation: `dustPuff 1.3s ${p.delay}s ease-out both`,
                      '--dx': p.dx,
                      '--dy': p.dy,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .g-photo { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .g-photo:hover { transform: scale(1.07) rotate(0deg) !important; box-shadow: 0 12px 26px rgba(58,42,36,0.4); z-index: 2; }
        .g-slot { transition: background 0.2s ease, border-color 0.2s ease, transform 0.25s ease; }
        .g-slot:hover { background: rgba(255,250,238,0.85); border-color: rgba(155,58,74,0.55); transform: scale(1.04) rotate(0deg) !important; }
        .hint-bounce { animation: hintBounce 1.7s ease-in-out infinite; }
        @keyframes hintBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
        .hint-pulse { animation: hintPulse 2s ease-in-out infinite; }
        @keyframes hintPulse { 0%, 100% { opacity: 0.95; } 50% { opacity: 0.5; } }
        @keyframes introFade { 0% { opacity: 0; transform: translateY(18px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      {itemsReady && !closing && !hintHidden && spread < SPREADS.length - 1 && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '1.6rem',
            transform: 'translateX(-50%)',
            zIndex: 8500,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
          }}
        >
          <span
            className="hint-pulse"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(242,227,196,0.9)',
              background: 'rgba(58,42,36,0.72)',
              border: '1px solid rgba(242,227,196,0.35)',
              padding: '0.5rem 1.3rem',
              borderRadius: 999,
              backdropFilter: 'blur(6px)',
            }}
          >
            scroll to turn the page
          </span>
          <svg className="hint-bounce" width="18" height="26" viewBox="0 0 18 26" fill="none">
            <path d="M4 2 L9 7 L14 2" stroke="#f2e3c4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 13 L9 18 L14 13" stroke="#f2e3c4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          </svg>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          background: '#0d0508',
          opacity: black ? 1 : 0,
          transition: 'opacity 1.6s ease',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          textAlign: 'center',
          padding: '2rem',
          opacity: finalText ? 1 : 0,
          transition: 'opacity 1.6s ease',
          pointerEvents: 'none',
        }}
      >
        <span className="scribble" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', color: '#f2e3c4', lineHeight: 1.5 }}>
          Thank you for making these memories with me.
        </span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: 'rgba(242,227,196,0.7)',
          }}
        >
          — Bebot
        </span>
      </div>
    </div>
  );
}
