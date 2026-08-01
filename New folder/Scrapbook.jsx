import React, { useState, useEffect, useId, useCallback } from "react";

/* ---------------------------------------------------------------
   Wanderlust — a realistic, flip-through digital scrapbook.
   Signature element: physical page-turn built from a hinged leaf
   with true front/back faces, a dynamic light-raking shadow, and
   a resting page-block for thickness — plus tape, torn corners,
   and a stitched leather cover to sell the "real object" feeling.
----------------------------------------------------------------- */

const SEED = (s) => `https://picsum.photos/seed/${s}/600/720`;

const TAPE_COLORS = ["#C97B84", "#5F8B7D", "#C9A24B"];

function Tape({ top, left, rotate, color = TAPE_COLORS[0], width = 74 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height: 30,
        background: `linear-gradient(180deg, ${color}cc, ${color}99)`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
        opacity: 0.85,
        mixBlendMode: "multiply",
        pointerEvents: "none",
      }}
    />
  );
}

function Polaroid({ src, alt, caption, rotate = 0, top, left, width = 190, z = 1 }) {
  return (
    <figure
      style={{
        position: "absolute",
        top,
        left,
        width,
        margin: 0,
        background: "#fbfaf6",
        padding: "10px 10px 28px",
        boxShadow: "0 10px 18px rgba(30,20,10,0.28), 0 2px 4px rgba(30,20,10,0.18)",
        transform: `rotate(${rotate}deg)`,
        zIndex: z,
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 4.6",
          overflow: "hidden",
          background: "#ddd",
          filter: "sepia(0.12) contrast(1.03) saturate(1.05)",
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 20,
            color: "#35476B",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function StampMark({ top, left, rotate = -8 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: 66,
        height: 78,
        border: "2px dashed #A67C3D",
        transform: `rotate(${rotate}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Special Elite', monospace",
        fontSize: 9,
        color: "#A67C3D",
        textAlign: "center",
        lineHeight: 1.25,
        background: "rgba(255,255,255,0.35)",
        padding: 4,
      }}
    >
      AIR
      <br />
      MAIL
    </div>
  );
}

function PageChrome({ children, pageNum, side }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#EFE3C6",
        backgroundImage:
          "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(circle at 85% 90%, rgba(0,0,0,0.05), transparent 55%)",
      }}
    >
      <NoiseOverlay />
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow:
            side === "left"
              ? "inset -18px 0 26px -20px rgba(30,20,10,0.45)"
              : "inset 18px 0 26px -20px rgba(30,20,10,0.45)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
      <span
        style={{
          position: "absolute",
          bottom: 10,
          [side === "left" ? "left" : "right"]: 16,
          fontFamily: "'Special Elite', monospace",
          fontSize: 11,
          color: "#8a7350",
        }}
      >
        {pageNum}
      </span>
    </div>
  );
}

function NoiseOverlay() {
  const id = useId();
  const filterId = `grain-${id}`;
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, mixBlendMode: "multiply" }}
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}

/* ----------------------------- Page content ----------------------------- */

const insideCover = (
  <PageChrome pageNum="" side="left">
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10%",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: "'Special Elite', monospace", fontSize: 12, letterSpacing: 3, color: "#8a7350" }}>
        THIS SCRAPBOOK BELONGS TO
      </div>
      <div
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "clamp(28px, 4vw, 40px)",
          color: "#35476B",
          marginTop: 10,
          borderBottom: "1px solid #b9a273",
          paddingBottom: 6,
          width: "70%",
        }}
      >
        a year of small departures
      </div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: "#6b5a3e", marginTop: 26, maxWidth: 240 }}>
        tap a page edge, or the arrows below, to turn the leaves →
      </div>
    </div>
  </PageChrome>
);

const backCover = (
  <PageChrome pageNum="" side="right">
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10%",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(26px, 3.4vw, 34px)", color: "#35476B" }}>
        to be continued...
      </div>
      <div style={{ fontFamily: "'Special Elite', monospace", fontSize: 12, color: "#8a7350", marginTop: 14 }}>
        more pages, more places, more of the year to come.
      </div>
    </div>
  </PageChrome>
);

const cover = (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(155deg, #7a4f2c 0%, #5c3a1e 55%, #4a2e18 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 0 0 10px rgba(0,0,0,0.12), inset 0 0 40px rgba(0,0,0,0.35)",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 14,
        border: "2px solid rgba(212,175,120,0.55)",
        borderRadius: 2,
      }}
    />
    <div style={{ textAlign: "center", padding: 24 }}>
      <div
        style={{
          fontFamily: "'Special Elite', monospace",
          fontSize: 11,
          letterSpacing: 6,
          color: "#d9c39a",
          marginBottom: 14,
        }}
      >
        A TRAVEL JOURNAL
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "clamp(30px, 5vw, 46px)",
          color: "#f1e2bf",
          textShadow: "0 1px 0 rgba(0,0,0,0.4), 0 0 18px rgba(0,0,0,0.25)",
          letterSpacing: 1,
        }}
      >
        Wanderlust
      </div>
      <div
        style={{
          marginTop: 16,
          width: 70,
          height: 2,
          background: "rgba(212,175,120,0.6)",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "#d9c39a", marginTop: 16 }}>
        memories, pressed flat
      </div>
    </div>
    <NoiseOverlay />
  </div>
);

function RightIntroPhotos() {
  return (
    <PageChrome pageNum={2} side="right">
      <div style={{ position: "relative", height: "100%", padding: "6% 6% 4%" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#35476B", marginBottom: 6 }}>
          june — the coast road
        </div>
        <Polaroid src={SEED("coast1")} alt="coastline" caption="first light, first stop" rotate={-4} top="14%" left="6%" width="52%" z={2} />
        <Polaroid src={SEED("coast2")} alt="tidepools" caption="tidepools at low tide" rotate={5} top="42%" left="38%" width="50%" z={3} />
        <Tape top="10%" left="26%" rotate={-6} color={TAPE_COLORS[0]} />
        <Tape top="38%" left="60%" rotate={8} color={TAPE_COLORS[1]} />
      </div>
    </PageChrome>
  );
}

function LeftPostcard() {
  return (
    <PageChrome pageNum={3} side="left">
      <div style={{ position: "relative", height: "100%", padding: "8%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "62%",
            background: "#f7f2e6",
            boxShadow: "0 10px 20px rgba(30,20,10,0.25)",
            transform: "rotate(-2deg)",
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
          }}
        >
          <div style={{ padding: 14, fontFamily: "'Caveat', cursive", fontSize: 19, color: "#35476B", lineHeight: 1.5 }}>
            Salt air, sunburnt shoulders, and the kind of quiet you only
            get at the edge of a map. Wish you were here.
          </div>
          <div style={{ background: "#d8c9a3" }} />
          <div style={{ position: "relative", padding: 14 }}>
            <StampMark top={8} left="62%" />
            <div style={{ fontFamily: "'Special Elite', monospace", fontSize: 11, color: "#6b5a3e", marginTop: 40 }}>
              — postmarked, coast road
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: "#6b5a3e", marginTop: 24, textAlign: "center" }}>
          a postcard I never sent
        </div>
      </div>
    </PageChrome>
  );
}

function RightBeach() {
  return (
    <PageChrome pageNum={4} side="right">
      <div style={{ position: "relative", height: "100%", padding: "6%" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#35476B", marginBottom: 6 }}>
          the long swim
        </div>
        <Polaroid src={SEED("beach1")} alt="beach" caption="in, before the crowd" rotate={4} top="12%" left="8%" width="56%" z={2} />
        <Tape top="8%" left="32%" rotate={4} color={TAPE_COLORS[2]} />
        <div
          style={{
            position: "absolute",
            top: "58%",
            left: "18%",
            fontFamily: "'Caveat', cursive",
            fontSize: 18,
            color: "#6b5a3e",
            transform: "rotate(-3deg)",
            maxWidth: "60%",
          }}
        >
          a pressed sprig of sea lavender, still faintly salty
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "72%",
            left: "20%",
            width: 60,
            height: 60,
            background:
              "radial-gradient(circle at 50% 50%, #93a86b 0%, #7c9257 55%, transparent 75%)",
            opacity: 0.6,
            filter: "blur(0.5px)",
            transform: "rotate(12deg)",
          }}
        />
      </div>
    </PageChrome>
  );
}

function LeftJournal() {
  return (
    <PageChrome pageNum={5} side="left">
      <div style={{ position: "relative", height: "100%", padding: "9% 8%" }}>
        <div style={{ fontFamily: "'Special Elite', monospace", fontSize: 12, color: "#8a7350", letterSpacing: 2 }}>
          JUNE 14
        </div>
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 22,
            color: "#35476B",
            lineHeight: 1.65,
            marginTop: 14,
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent, transparent 33px, rgba(90,90,70,0.18) 34px)",
          }}
        >
          Some days don't need a plan. We walked until the road ran out,
          ate cold noodles on a seawall, and talked about nothing that
          mattered and everything that did. I keep thinking I'll forget
          the small parts — the way the light went orange, the dog that
          followed us for three blocks — so I'm writing them down before
          I do.
        </div>
      </div>
    </PageChrome>
  );
}

function RightMountain() {
  return (
    <PageChrome pageNum={6} side="right">
      <div style={{ position: "relative", height: "100%", padding: "6%" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#35476B", marginBottom: 6 }}>
          up before the fog burned off
        </div>
        <Polaroid src={SEED("mountain1")} alt="mountain trail" caption="halfway, out of breath" rotate={-5} top="12%" left="10%" width="55%" z={2} />
        <Tape top="8%" left="33%" rotate={-5} color={TAPE_COLORS[1]} />
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "8%",
            width: 96,
            height: 62,
            background: "#f2ead4",
            border: "1px dashed #a67c3d",
            transform: "rotate(4deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Special Elite', monospace",
            fontSize: 9,
            color: "#8a7350",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(30,20,10,0.2)",
          }}
        >
          SUMMIT TRAIL
          <br />
          ADMIT ONE
        </div>
      </div>
    </PageChrome>
  );
}

function LeftFriends() {
  return (
    <PageChrome pageNum={7} side="left">
      <div style={{ position: "relative", height: "100%", padding: "6%" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#35476B", marginBottom: 6 }}>
          the whole noisy crew
        </div>
        <Polaroid src={SEED("friends1")} alt="friends" caption="all of us, somehow in focus" rotate={3} top="16%" left="16%" width="60%" z={2} />
        <Tape top="12%" left="42%" rotate={2} color={TAPE_COLORS[0]} />
      </div>
    </PageChrome>
  );
}

function RightMarket() {
  return (
    <PageChrome pageNum={8} side="right">
      <div style={{ position: "relative", height: "100%", padding: "6%" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#35476B", marginBottom: 6 }}>
          the night market, twice
        </div>
        <Polaroid src={SEED("market1")} alt="night market" caption="lanterns and too much food" rotate={-3} top="12%" left="8%" width="52%" z={2} />
        <Polaroid src={SEED("market2")} alt="street food" caption="the good stall, again" rotate={6} top="46%" left="40%" width="48%" z={3} />
        <Tape top="8%" left="28%" rotate={-4} color={TAPE_COLORS[2]} />
      </div>
    </PageChrome>
  );
}

function LeftClosing() {
  return (
    <PageChrome pageNum={9} side="left">
      <div
        style={{
          position: "relative",
          height: "100%",
          padding: "12% 10%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#35476B", lineHeight: 1.6 }}>
          Every trip ends the same way — tired feet, a phone full of
          blurry photos, and a list of places to go back to. This one's
          no different. Onward, eventually.
        </div>
        <div style={{ fontFamily: "'Special Elite', monospace", fontSize: 12, color: "#8a7350", marginTop: 24 }}>
          — end of this chapter —
        </div>
      </div>
    </PageChrome>
  );
}

function LeftIntroWrap() {
  return (
    <PageChrome pageNum={1} side="left">
      <div style={{ position: "relative", height: "100%", padding: "9% 8%" }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 26, color: "#35476B", marginBottom: 10 }}>
          where this one takes us
        </div>
        <div style={{ fontFamily: "'Special Elite', monospace", fontSize: 13, color: "#6b5a3e", lineHeight: 1.9 }}>
          coast road → tidepools → the long swim
          <br />
          summit trail → the noisy crew
          <br />
          night market, twice
        </div>
        <div
          style={{
            marginTop: 26,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px dotted #b9a273",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Caveat', cursive",
            fontSize: 16,
            color: "#8a7350",
            transform: "rotate(-6deg)",
          }}
        >
          six days,
          <br />
          one small bag
        </div>
      </div>
    </PageChrome>
  );
}

/* Five leaves: leaf[i].front is the right page shown before it's
   turned; leaf[i].back is the left page it reveals once turned. */
const leaves = [
  { front: cover, back: <LeftIntroWrap /> },
  { front: <RightIntroPhotos />, back: <LeftPostcard /> },
  { front: <RightBeach />, back: <LeftJournal /> },
  { front: <RightMountain />, back: <LeftFriends /> },
  { front: <RightMarket />, back: <LeftClosing /> },
];

/* --------------------------------- Book --------------------------------- */

export default function Scrapbook() {
  const [flippedCount, setFlippedCount] = useState(0);
  const [flip, setFlip] = useState(null); // { index, dir, phase }
  const total = leaves.length;

  useEffect(() => {
    if (flip && flip.phase === "start") {
      const raf = requestAnimationFrame(() => {
        setFlip((f) => (f ? { ...f, phase: "go" } : f));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [flip]);

  const startFlip = useCallback(
    (dir) => {
      if (flip) return;
      if (dir === "forward") {
        if (flippedCount >= total) return;
        setFlip({ index: flippedCount, dir, phase: "start" });
      } else {
        if (flippedCount <= 0) return;
        setFlip({ index: flippedCount - 1, dir, phase: "start" });
      }
    },
    [flip, flippedCount, total]
  );

  const onTransitionEnd = (e) => {
    if (e.propertyName !== "transform" || !flip) return;
    setFlippedCount((c) => (flip.dir === "forward" ? c + 1 : c - 1));
    setFlip(null);
  };

  let leftIndex, rightIndex;
  if (!flip) {
    leftIndex = flippedCount;
    rightIndex = flippedCount;
  } else if (flip.dir === "forward") {
    leftIndex = flippedCount;
    rightIndex = flippedCount + 1;
  } else {
    leftIndex = flippedCount - 1;
    rightIndex = flippedCount;
  }

  const leftContent = leftIndex === 0 ? insideCover : leaves[leftIndex - 1].back;
  const rightContent = rightIndex >= total ? backCover : leaves[rightIndex].front;

  const restLeftCount = Math.max(0, leftIndex - 1);
  const restRightCount = Math.max(0, total - rightIndex - 1);

  let angle = 0;
  if (flip) {
    if (flip.dir === "forward") angle = flip.phase === "go" ? -180 : 0;
    else angle = flip.phase === "go" ? 0 : -180;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 48px) 12px",
        background:
          "linear-gradient(180deg, #2a2018 0%, #1c1712 100%)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Caveat:wght@500;600;700&family=Special+Elite&display=swap');
        .wl-desk {
          background-image:
            repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 90px),
            radial-gradient(ellipse at 50% 20%, rgba(255,220,170,0.06), transparent 60%);
        }
        .wl-btn {
          font-family: 'Special Elite', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          color: #e8dcc0;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(232,220,192,0.35);
          padding: 8px 16px;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.2s ease, opacity 0.2s ease;
        }
        .wl-btn:hover:not(:disabled) { background: rgba(255,255,255,0.14); }
        .wl-btn:disabled { opacity: 0.3; cursor: default; }
        .wl-btn:focus-visible { outline: 2px solid #d9c39a; outline-offset: 2px; }
        .wl-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 14%;
          cursor: pointer;
          z-index: 40;
          background: linear-gradient(270deg, rgba(0,0,0,0.06), transparent);
        }
        .wl-edge:hover { background: linear-gradient(270deg, rgba(0,0,0,0.12), transparent); }
        .wl-edge.left { left: 0; right: auto; background: linear-gradient(90deg, rgba(0,0,0,0.06), transparent); }
        .wl-edge.left:hover { background: linear-gradient(90deg, rgba(0,0,0,0.12), transparent); }
        .wl-edge.disabled { pointer-events: none; }
        .wl-leaf {
          transition: transform 1.05s cubic-bezier(0.45, 0.05, 0.15, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .wl-leaf { transition: transform 0.28s linear; }
        }
      `}</style>

      <div
        className="wl-desk"
        style={{
          position: "relative",
          width: "min(920px, 94vw)",
          aspectRatio: "4 / 2.62",
          perspective: 2400,
        }}
      >
        {/* Ambient book shadow on the desk */}
        <div
          style={{
            position: "absolute",
            left: "4%",
            right: "4%",
            bottom: "-4%",
            height: "18%",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {/* LEFT HALF */}
          <div style={{ position: "relative", width: "50%", height: "100%" }}>
            {/* resting page-block thickness */}
            {Array.from({ length: Math.min(restLeftCount, 6) }).map((_, i) => (
              <div
                key={`lstack-${i}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  left: -2 - i * 1.4,
                  background: "#e2d3ac",
                  boxShadow: "0 0 0 1px rgba(60,40,10,0.15)",
                }}
              />
            ))}
            <div style={{ position: "absolute", inset: 0, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>{leftContent}</div>
            <div
              className={`wl-edge left${flippedCount <= 0 || flip ? " disabled" : ""}`}
              onClick={() => startFlip("backward")}
              aria-hidden="true"
            />
          </div>

          {/* RIGHT HALF */}
          <div style={{ position: "relative", width: "50%", height: "100%" }}>
            {Array.from({ length: Math.min(restRightCount, 6) }).map((_, i) => (
              <div
                key={`rstack-${i}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  right: -2 - i * 1.4,
                  background: "#e2d3ac",
                  boxShadow: "0 0 0 1px rgba(60,40,10,0.15)",
                }}
              />
            ))}
            <div style={{ position: "absolute", inset: 0, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>{rightContent}</div>
            <div
              className={`wl-edge${flippedCount >= total || flip ? " disabled" : ""}`}
              onClick={() => startFlip("forward")}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* spine */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 14,
            marginLeft: -7,
            background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.35))",
            zIndex: 30,
            pointerEvents: "none",
          }}
        />

        {/* bookmark ribbon */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: 16,
            height: flippedCount === 0 && !flip ? "26%" : "40%",
            marginLeft: -8,
            background: "linear-gradient(180deg, #8a2f3a, #6e2530)",
            clipPath: "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)",
            zIndex: 31,
            pointerEvents: "none",
            transition: "height 0.4s ease",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
          }}
        />

        {/* animating leaf */}
        {flip && (
          <div
            className="wl-leaf"
            onTransitionEnd={onTransitionEnd}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "50%",
              height: "100%",
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              transform: `rotateY(${angle}deg)`,
              zIndex: 50,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
              }}
            >
              {leaves[flip.index].front}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent 40%)",
                  opacity: flip.dir === "forward" && flip.phase === "go" ? 1 : flip.phase === "start" ? 0 : 0.5,
                  transition: "opacity 1.05s linear",
                  pointerEvents: "none",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                boxShadow: "-2px 0 10px rgba(0,0,0,0.3)",
              }}
            >
              {leaves[flip.index].back}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(270deg, rgba(0,0,0,0.35), transparent 40%)",
                  opacity: flip.dir === "backward" && flip.phase === "go" ? 1 : flip.phase === "start" ? 0 : 0.5,
                  transition: "opacity 1.05s linear",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
        <button className="wl-btn" onClick={() => startFlip("backward")} disabled={flippedCount <= 0 || !!flip}>
          ◂ prev
        </button>
        <span style={{ fontFamily: "'Special Elite', monospace", fontSize: 12, color: "#a5906a" }}>
          {flippedCount === 0 ? "cover" : flippedCount === total ? "back cover" : `spread ${flippedCount} of ${total - 1}`}
        </span>
        <button className="wl-btn" onClick={() => startFlip("forward")} disabled={flippedCount >= total || !!flip}>
          next ▸
        </button>
      </div>
    </div>
  );
}
