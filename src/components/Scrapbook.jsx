import React, { useEffect, useRef, useState } from 'react';
import { playPaper, playThud, playFlowerFall } from '../utils/sounds';

const AN = (d) => `itemIn 0.85s cubic-bezier(0.25, 1, 0.4, 1) ${d}s both`;
const rot = (d) => ({ '--rot': `${d}deg` });

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
        <Tape rotDeg={-28} style={{ top: 26, left: 30 }} />
        <Tape rotDeg={18} style={{ top: 26, right: 30 }} />
        <div style={{ position: 'absolute', top: '26%', left: 0, right: 0, textAlign: 'center', animation: AN(0.15) }}>
          <h2
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.7rem, 3vw, 2.4rem)',
              color: '#3a2a24',
              lineHeight: 1.3,
              padding: '0 1rem',
            }}
          >
            Our Little
            <br />
            Scrapbook
          </h2>
          <div style={{ width: '3.4rem', height: 1, background: '#b8923a', margin: '1rem auto 0.7rem', opacity: 0.7 }} />
          <Note size="1.3rem" style={{ display: 'block', color: '#7a5a3a' }}>
            a few pages i kept for you
          </Note>
        </div>
        <DateStamp text="2025 — 2026" rotDeg={-4} style={{ bottom: '22%', left: '50%', marginLeft: -70 }} />
        <CoffeeStain size={120} rotDeg={20} style={{ bottom: -16, right: -12 }} />
        <FlowerDoodle size={30} color="#d4847a" style={{ bottom: '26%', right: '16%' }} />
        <FlowerDoodle size={22} color="#b8923a" style={{ bottom: '30%', right: '26%' }} />
        <Sticker kind="star" size={20} style={{ top: '18%', right: '12%' }} />
      </Page>
      <Page side="right" n="2">
        <Polaroid src="/moments/1.jpg" w={225} h={280} tape tapePos={-4} back="July 20, 2026 — One of my happiest afternoons." style={{ top: '9%', left: '7%', transform: 'rotate(var(--rot,0deg))', '--rot': '-4deg' }} />
        <Note size="1.35rem" style={{ position: 'absolute', top: '41%', left: '46%', transform: 'rotate(3deg)' }}>
          The day finally arrived.
        </Note>
        <Polaroid src="/moments/2.jpg" w={140} h={180} style={{ bottom: '8%', right: '6%', transform: 'rotate(var(--rot,0deg))', '--rot': '6deg' }} />
        <TinyArrow rotDeg={18} style={{ bottom: '32%', right: '24%' }} />
        <FilmStrip imgs={['/moments/3.jpg', '/moments/4.jpg', '/moments/5.jpg']} rotDeg={-3} style={{ bottom: '7%', left: '8%' }} />
        <Envelope note="I smiled the whole ride home." rotDeg={-5} style={{ bottom: '26%', right: '8%' }} />
        <Sticker kind="heart" color="#d4847a" size={22} rotDeg={10} style={{ top: '12%', right: '10%' }} />
        <CoffeeStain size={90} style={{ top: -14, left: -10 }} />
      </Page>
    </>
  );
}

function Spread1() {
  return (
    <>
      <Page side="left" n="3">
        <CoffeeStain size={150} rotDeg={-10} style={{ top: '16%', left: '12%' }} />
        <Polaroid src="/moments/7.jpg" w={215} h={270} tape tapePos={6} back="Same place, same seats — still my favorite." style={{ top: '10%', left: '9%', transform: 'rotate(var(--rot,0deg))', '--rot': '4deg' }} />
        <Note size="1.3rem" style={{ position: 'absolute', top: '53%', left: '47%', transform: 'rotate(-2deg)' }}>
          This milk tea tasted better because of the company.
        </Note>
        <Polaroid src="/moments/6.png" w={165} h={195} style={{ bottom: '7%', left: '14%', transform: 'rotate(var(--rot,0deg))', '--rot': '-6deg' }} />
        <Sticker kind="heart" color="#b8923a" size={20} rotDeg={-12} style={{ bottom: '16%', right: '12%' }} />
        <Tape rotDeg={10} style={{ bottom: 30, right: 26 }} />
      </Page>
      <Page side="right" n="4">
        <Polaroid src="/moments/9.jpg" w={200} h={250} tape tapePos={-6} back="Dessert first, everything else later." style={{ top: '8%', right: '8%', transform: 'rotate(var(--rot,0deg))', '--rot': '-4deg' }} />
        <Note size="1.3rem" style={{ position: 'absolute', top: '47%', left: '6%', transform: 'rotate(2deg)' }}>
          We definitely needed another dessert.
        </Note>
        <TornPaper rotDeg={-4} tone="#f6ecd4" style={{ top: '60%', left: '8%' }}>
          <span className="scribble" style={{ fontSize: '1.05rem', color: '#6b4f38' }}>
            milk tea x2
            <br />
            fries x1
            <br />
            laughs: unlimited
          </span>
        </TornPaper>
        <Polaroid src="/moments/10.jpg" w={185} h={225} style={{ bottom: '6%', right: '7%', transform: 'rotate(var(--rot,0deg))', '--rot': '7deg' }} />
        <TinyArrow rotDeg={-22} style={{ bottom: '34%', left: '42%' }} />
        <Sticker kind="star" size={18} rotDeg={8} style={{ top: '30%', left: '12%' }} />
      </Page>
    </>
  );
}

function Spread2() {
  return (
    <>
      <Page side="left" n="5">
        <Polaroid src="/moments/her.png" w={245} h={305} tape tapePos={-3} back="Some days I just think about this smile." style={{ top: '8%', left: '8%', transform: 'rotate(var(--rot,0deg))', '--rot': '-3deg' }} />
        <Note size="1.35rem" style={{ position: 'absolute', top: '58%', left: '52%', transform: 'rotate(2deg)' }}>
          I still remember this smile.
        </Note>
        <Polaroid src="/moments/her1.png" w={145} h={185} style={{ bottom: '7%', left: '12%', transform: 'rotate(var(--rot,0deg))', '--rot': '8deg' }} />
        <FlowerDoodle size={26} color="#e0a97c" style={{ top: '24%', right: '14%' }} />
        <FlowerDoodle size={18} color="#c9a45c" style={{ top: '33%', right: '20%' }} />
        <CoffeeStain size={80} style={{ bottom: 4, right: 12 }} />
      </Page>
      <Page side="right" n="6">
        <Polaroid src="/moments/her3.png" w={205} h={255} tape tapePos={5} back="Proof that you glow even without filters." style={{ top: '8%', right: '9%', transform: 'rotate(var(--rot,0deg))', '--rot': '5deg' }} />
        <Note size="1.3rem" style={{ position: 'absolute', top: '52%', left: '6%', transform: 'rotate(-2deg)' }}>
          Still one of my favorite photos.
        </Note>
        <Envelope note="You looked so happy that day." rotDeg={4} style={{ top: '62%', left: '10%' }} />
        <DateStamp text="APR 9" rotDeg={-6} style={{ bottom: '12%', left: '14%' }} />
        <Sticker kind="star" size={20} rotDeg={-8} style={{ top: '12%', left: '10%' }} />
        <Sticker kind="heart" color="#d4847a" size={18} rotDeg={12} style={{ bottom: '22%', right: '12%' }} />
        <FilmStrip imgs={['/moments/11.jpg', '/moments/12.jpg', '/moments/13.jpg']} rotDeg={2} cell={54} style={{ bottom: '8%', right: '8%' }} />
        <MoonDoodle size={26} style={{ top: '18%', right: '12%' }} />
      </Page>
    </>
  );
}

function Spread3() {
  return (
    <>
      <Page side="left" n="7">
        <Polaroid src="/moments/12.jpg" w={225} h={285} tape tapePos={-4} back="Our first photo strip. I wish we took ten more." style={{ top: '8%', left: '8%', transform: 'rotate(var(--rot,0deg))', '--rot': '-6deg' }} />
        <Polaroid src="/moments/13.jpg" w={175} h={215} style={{ top: '46%', left: '40%', transform: 'rotate(var(--rot,0deg))', '--rot': '6deg' }} />
        <Note size="1.3rem" style={{ position: 'absolute', top: '66%', left: '7%', transform: 'rotate(-2deg)' }}>
          This little moment became one of my favorites.
        </Note>
        <FilmStrip imgs={['/moments/14.jpg', '/moments/15.jpg', '/moments/16.jpg']} rotDeg={2} cell={52} style={{ bottom: '7%', left: '8%' }} />
        <PaperClip rotDeg={14} style={{ top: '10%', right: '14%' }} />
      </Page>
      <Page side="right" n="8">
        <Polaroid src="/moments/17.jpg" w={195} h={245} tape tapePos={5} back="Tiring walk, worth every step." style={{ top: '8%', right: '9%', transform: 'rotate(var(--rot,0deg))', '--rot': '-4deg' }} />
        <Note size="1.32rem" style={{ position: 'absolute', top: '47%', left: '6%', transform: 'rotate(2deg)' }}>
          I don't think I'll ever forget this afternoon.
        </Note>
        <TornPaper rotDeg={-5} tone="#f2ead6" style={{ top: '56%', left: '8%' }}>
          <span style={{ fontSize: '0.82rem', letterSpacing: '0.2em', color: '#7a5a3a', display: 'block', marginBottom: 4 }}>CINEMA</span>
          <span className="scribble" style={{ fontSize: '1.02rem', color: '#4a342a' }}>
            2 seats · middle row
            <br />
            keep the ticket — keep the memory
          </span>
        </TornPaper>
        <Polaroid src="/moments/together.jpg" w={160} h={195} style={{ bottom: '7%', right: '8%', transform: 'rotate(var(--rot,0deg))', '--rot': '8deg' }} />
        <MoonDoodle size={22} style={{ top: '14%', left: '12%' }} />
        <Envelope note="I wish we took ten more." rotDeg={-6} style={{ bottom: '24%', left: '10%' }} />
        <Sticker kind="heart" color="#b8923a" size={20} rotDeg={10} style={{ top: '58%', right: '10%' }} />
      </Page>
    </>
  );
}

function Spread4() {
  return (
    <>
      <Page side="left" n="9">
        <FlowerDoodle size={26} color="#d9c0a0" style={{ top: '30%', left: '42%' }} />
        <Sticker kind="star" size={16} color="#c9b678" style={{ top: '26%', left: '40%' }} />
        <Note size="1.05rem" color="rgba(90,64,48,0.45)" style={{ position: 'absolute', top: '70%', left: 0, right: 0, textAlign: 'center' }}>
          ...
        </Note>
      </Page>
      <Page side="right" n="10">
        <Polaroid src="/moments/together.jpg" w={330} h={400} tape tapePos={-2} back="One of the many reasons I keep writing pages." style={{ top: '6%', left: '50%', marginLeft: -165, transform: 'rotate(var(--rot,0deg))', '--rot': '-2deg' }} />
        <Note size="2rem" color="#3a2a24" style={{ position: 'absolute', top: '61%', left: 0, right: 0, textAlign: 'center', fontWeight: 600 }}>
          To be continued...
        </Note>
        <Note size="1.15rem" color="#8a6a48" style={{ position: 'absolute', top: '69%', left: 0, right: 0, textAlign: 'center' }}>
          I hope someday we'll have plenty more pages to fill.
        </Note>
        <Polaroid blank w={170} h={205} tape tapePos={4} style={{ bottom: '5%', left: '8%', transform: 'rotate(var(--rot,0deg))', '--rot': '-3deg' }} />
        <TinyArrow rotDeg={8} style={{ bottom: '24%', left: '36%' }} />
      </Page>
    </>
  );
}

const SPREADS = [Spread0, Spread1, Spread2, Spread3, Spread4];

function FlowerFall() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 30,
        height: 30,
        zIndex: 60,
        '--fall-end-px': 'calc(100vh - 30px)',
        animation: 'flowerFall 2.6s cubic-bezier(0.4, 0, 0.6, 1) both',
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 40 40" width="30" height="30">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="20" cy="12" rx="7.5" ry="11" fill="#e8b9c0" opacity="0.92" transform={`rotate(${a} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="5" fill="#c98d45" />
      </svg>
    </div>
  );
}

export default function Scrapbook({ onExit }) {
  const audioRef = useRef(null);
  const [bookIn, setBookIn] = useState(false);
  const [thudDone, setThudDone] = useState(false);
  const [coverState, setCoverState] = useState('hidden');
  const [itemsReady, setItemsReady] = useState(false);
  const [spread, setSpread] = useState(0);
  const [turning, setTurning] = useState(false);
  const [closing, setClosing] = useState(false);
  const [black, setBlack] = useState(false);
  const [finalText, setFinalText] = useState(false);
  const closedRef = useRef(false);
  const [dust, setDust] = useState([]);

  useEffect(() => {
    const a = audioRef.current;
    if (a) {
      a.volume = 0.45;
      a.play().catch(() => {});
    }
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
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (spread !== 4 || !itemsReady || closing) return;
    const t = setTimeout(() => {
      if (!closedRef.current) {
        closedRef.current = true;
        startClose();
      }
    }, 9000);
    return () => clearTimeout(t);
  }, [spread, itemsReady, closing]);

  function startClose() {
    setClosing(true);
    playPaper();
    setCoverState('closing');
    setTimeout(() => {
      playFlowerFall();
    }, 1300);
    setTimeout(() => setBlack(true), 3000);
    setTimeout(() => setFinalText(true), 4700);
    setTimeout(() => onExit && onExit(), 11200);
  }

  function nextPage() {
    if (turning || closing) return;
    if (spread >= SPREADS.length - 1) return;
    setTurning(true);
    playPaper();
    setTimeout(() => {
      setSpread((s) => s + 1);
      setTurning(false);
    }, 680);
  }

  const Current = SPREADS[spread];
  const Next = turning && spread + 1 < SPREADS.length ? SPREADS[spread + 1] : null;

  return (
    <div
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
      <audio ref={audioRef} src="/music/Musika.mp3" loop preload="auto" />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ perspective: '2800px', animation: closing ? 'bookShrink 2.6s cubic-bezier(0.5, 0, 0.8, 0.4) both' : 'none' }}>
          <div
            style={{
              position: 'relative',
              width: 'min(1500px, 94vw)',
              height: 'min(840px, 88vh)',
              transformOrigin: 'center bottom',
              animation: bookIn ? 'bookRise 1.75s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
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
                overflow: 'hidden',
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
                  zIndex: 8,
                  pointerEvents: 'none',
                }}
              />
              {itemsReady && (
                <div style={{ position: 'absolute', inset: 0 }}>
                  {Next && (
                    <div style={{ position: 'absolute', inset: 0, animation: 'sheetIn 0.68s cubic-bezier(0.3, 0.7, 0.3, 1) both', transformOrigin: 'left center' }}>
                      <Next />
                    </div>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      animation: turning ? 'pageFlipAway 0.68s cubic-bezier(0.5, 0, 0.9, 0.4) both' : 'none',
                      zIndex: turning ? 3 : 2,
                    }}
                  >
                    <Current />
                  </div>
                </div>
              )}
            </div>

            {coverState !== 'done' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10,
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
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

      {itemsReady && !closing && (
        <button
          onClick={nextPage}
          disabled={spread >= SPREADS.length - 1}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2.5rem',
            zIndex: 30,
            fontFamily: "'Caveat', cursive",
            fontSize: '1.15rem',
            color: '#f2e3c4',
            background: 'rgba(58,42,36,0.55)',
            border: '1px solid rgba(242,227,196,0.4)',
            padding: '0.5rem 1.4rem',
            borderRadius: '999px',
            cursor: spread >= SPREADS.length - 1 ? 'default' : 'pointer',
            opacity: spread >= SPREADS.length - 1 ? 0.35 : 1,
            transition: 'all 0.3s ease',
          }}
        >
          {spread >= SPREADS.length - 1 ? 'the last page' : 'turn the page →'}
        </button>
      )}

      {closing && <FlowerFall />}

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
          — C
        </span>
      </div>
    </div>
  );
}
