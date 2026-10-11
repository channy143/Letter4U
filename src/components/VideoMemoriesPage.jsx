import React, { useState, useEffect, useRef } from 'react';
import FlowersFall from './FlowersFall';

const BACKGROUND_VIDEOS = [
  '/video/New folder/40ae0a35-a50b-4375-b333-94b438305289.mp4',
  '/video/New folder/2ed64372-9f46-4dce-9328-b9b37882372b.mp4',
  '/video/New folder/401bd376-1f49-4f42-9f5d-19c9b6bf7ec0.mp4',
  '/video/New folder/13c50998-ed55-4f80-80d9-4923e0d50c40.mp4',
  '/video/New folder/6d68d332-56e5-4d21-bc80-09a96d97ac90.mp4',
  '/video/New folder/83251256-0533-4c82-a7a8-31bfe721663b.mp4',
  '/video/New folder/908e4a43-8f83-469b-a0a5-40ba4d84509d.mp4',
  '/video/New folder/9db048e0-0ee7-4354-a366-aa92e29ed092.mp4',
  '/video/New folder/a5bd7acf-c1d8-4afa-9de1-2a2ce6fd4a9d.mp4',
  '/video/New folder/d9ef86c1-d0f4-4c2a-9823-22c17bc84a33.mp4',
  '/video/New folder/ee50b80d-3157-4f41-9ed7-a460028d27d1.mp4',
];

const TOGETHER_IMAGES = [
  '/pictures/together/01272fb3-82dc-419b-9c63-a7550e9f3c20.jpg',
  '/pictures/together/019d3024-4de4-40a7-9dc4-b2961b290677.jpg',
  '/pictures/together/039d7a8d-c23f-4be0-a077-05cdbecfdf7e.jpg',
  '/pictures/together/05274c7f-cc54-4b5f-8917-8874f5af5136.jpg',
  '/pictures/together/097df586-b3cc-420c-800c-25129750af25.jpg',
  '/pictures/together/0a2e86cd-3954-4ede-b545-29cf24af4504.jpg',
  '/pictures/together/15f57434-c72a-4b12-baf7-6a2266af5c04.jpg',
  '/pictures/together/27a19a68-71c7-4f74-8d57-f02ef7f7c80f.jpg',
  '/pictures/together/2dadaf29-93bb-41e9-aeea-a318a8465179.jpg',
  '/pictures/together/35ec59c3-55b4-411e-92b4-54b853aaa280.jpg',
  '/pictures/together/48e826e0-2af8-471f-911b-f170be87095c.jpg',
  '/pictures/together/50a1ab59-ad37-46df-8682-564489944c49.jpg',
  '/pictures/together/55e613a7-8aa6-4fd2-a680-fe045b92cc1e.jpg',
  '/pictures/together/58cb8846-d369-49f7-9c24-17994a863d5e.jpg',
  '/pictures/together/5e2823ea-0be5-4deb-ad27-3b8a7a0bbe40.jpg',
  '/pictures/together/6ade6e31-114d-4eec-b70e-7354373a942a.jpg',
  '/pictures/together/706f4d36-844c-43fb-a106-35b84d54fc33.jpg',
  '/pictures/together/77ccd364-6bbd-4b8b-b657-8e599e21ac5d.jpg',
  '/pictures/together/7f7597e4-44c0-4d06-add7-aa1328da62e5.jpg',
  '/pictures/together/895d94ad-b653-496e-b601-044795d8bc7c.jpg',
  '/pictures/together/8abf54f9-819f-43ae-9145-ac771c58faca.jpg',
  '/pictures/together/a0f99ea6-0554-45b0-b68d-784dddb21d9c.jpg',
  '/pictures/together/a2a42202-c13a-4310-94cb-06fbc768fede.jpg',
  '/pictures/together/a7faaf24-7cb5-4179-819b-0bdc1604716c.jpg',
  '/pictures/together/aa72054d-b83c-4af9-8675-e82834f16631.jpg',
  '/pictures/together/b1e6ff4d-4c94-4ea7-a51e-a54b056aa7ac.jpg',
  '/pictures/together/b394079f-8d74-4bf6-b4b8-326a3ebff162.jpg',
  '/pictures/together/b39bfaf3-2e30-4fa1-969e-85fde36c553a.jpg',
  '/pictures/together/d29af61d-c883-48c7-b9c9-e24e4fe2ab69.jpg',
  '/pictures/together/d7dbecf5-ac65-465d-a455-547729978dc1.jpg',
  '/pictures/together/df8f2400-50d8-4b9e-8748-149d8859ebbf.jpg',
  '/pictures/together/e65bd83e-4874-48dd-b1fc-74a301f81a76.jpg',
  '/pictures/together/e93f3071-7ca2-4113-962a-c999c797b789.jpg',
  '/pictures/together/eaab1330-e22e-4199-b602-05a91e2cc904.jpg',
  '/pictures/together/f4f9b37e-3bc7-45b2-82d5-4778bb1a20bd.jpg',
  '/pictures/together/f5b06635-644c-4e8a-946a-a521287257f3.jpg',
  '/pictures/together/f8961480-e970-43d5-a4b6-071c025f5940.jpg',
  '/pictures/together/f8ba29a8-a4d7-43be-b8fb-cc78bba94235.jpg',
  '/pictures/together/fa0ccaaa-8fce-4cc8-80dc-d7cb342dfe62.jpg',
];

const RANDOMDAY_IMAGES = [
  '/pictures/randomday/0b93dd29-a119-45c1-a167-c25adfe30b42.jpg',
  '/pictures/randomday/2829462a-4150-4e36-bfa4-322d5d6ef170.jpg',
  '/pictures/randomday/34c6dd79-4ab1-4741-ba93-e8948ddc513c.jpg',
  '/pictures/randomday/44a63a4a-d91a-493e-b69d-ed47617ef175.jpg',
  '/pictures/randomday/5322acdf-3b1f-475d-8884-9839a6f5b31f.jpg',
  '/pictures/randomday/5813034c-7675-409e-bdf0-15b4cbb77f69.jpg',
  '/pictures/randomday/59b0de0e-5717-44fb-8b6f-9ff7a0c589b8.jpg',
  '/pictures/randomday/6b20c2e2-8da0-4a66-981a-e68d3602661e.jpg',
  '/pictures/randomday/77592cbd-7bac-4e61-945f-1961c39ed744.jpg',
  '/pictures/randomday/bd998e22-e9f2-44b0-af05-25de22aea683.jpg',
  '/pictures/randomday/c38f5df8-4121-4247-bfb2-5e3d3dc85a02.jpg',
  '/pictures/randomday/cd31b40d-1d41-4874-9f1f-8ba3b65a522f.jpg',
  '/pictures/randomday/cddc6614-0174-4be0-9c49-9b5ff05d0250.jpg',
  '/pictures/randomday/f6bde734-81ff-459a-bb9a-475650228eb3.jpg',
  '/pictures/randomday/f7e5d684-f294-4747-a384-6a56b46a4912.jpg',
];

const DATE_IMAGES = [
  '/pictures/date/0c931abc-2974-4f43-a868-959ef33531ea.jpg',
  '/pictures/date/1a273e2a-f2ac-40ac-86b7-ccc986484d50.jpg',
  '/pictures/date/389c87ee-c20b-4a0d-9217-01f07f911323.jpg',
  '/pictures/date/3aca090d-6077-41d6-98db-d8b8c4d25963.jpg',
  '/pictures/date/4345e340-bd62-400d-8225-634c3f2369c0.jpg',
  '/pictures/date/48735095-c3ae-4483-a55b-93c2e9e4d9c9.jpg',
  '/pictures/date/5044b01e-f0f0-4d23-bb8d-303caf3617c0.jpg',
  '/pictures/date/5b95ade9-2a9f-42dd-a30e-54dfe0daf80d.jpg',
  '/pictures/date/5bed5a71-fe61-4030-a721-3c6da51f2add.jpg',
  '/pictures/date/5d50c532-2371-40d3-a35b-5cdb3ce55f0d.jpg',
  '/pictures/date/5d76e14f-3c4e-45ee-b350-0ef8b5545c0b.jpg',
  '/pictures/date/69a31a0c-52ea-4fd0-b389-fb561f6512a3.jpg',
  '/pictures/date/6c44938d-13b3-4829-bda6-8a8418f17c6b.jpg',
  '/pictures/date/71dd5eb0-065e-4f73-aa10-59616d3d36c8.jpg',
  '/pictures/date/7e5a9288-4b68-482f-b090-929b87bbce9f.jpg',
  '/pictures/date/8b6845c4-b687-4584-a30a-9d92b2fd6e40.jpg',
  '/pictures/date/8cdebc11-084e-492b-af94-65ed6852898e.jpg',
  '/pictures/date/a270d46d-74b0-4a08-aed6-2ca6718ad793.jpg',
  '/pictures/date/a34824b9-9242-4e59-829e-09c138a9d793.jpg',
  '/pictures/date/a4c1f15f-2044-4609-aee9-5aac87cacafe.jpg',
  '/pictures/date/a4f5bd08-84f0-46ad-8eda-dc8edf919b75.jpg',
  '/pictures/date/a69a38c8-7f7e-42dd-a2f1-0db804c83b37.jpg',
  '/pictures/date/ada91b64-54e2-4b31-a846-14f0a37795e9.jpg',
  '/pictures/date/b9387132-df99-4ded-aeaa-8815b5c83fe1.jpg',
  '/pictures/date/d67c38c6-46eb-49f3-b979-e85f56e4e4b1.jpg',
  '/pictures/date/d954a187-062f-4563-832a-e9ae4e6cbbc5.jpg',
  '/pictures/date/e0bd5394-2d1e-43d6-9b6c-dbf16d6d093f.jpg',
  '/pictures/date/e90e80d2-127c-4316-921f-b326cfddec7a.jpg',
  '/pictures/date/eae3ebe5-a333-4768-a8fe-8a3428dac5d0.jpg',
  '/pictures/date/f68563cd-987c-4d54-a74a-2d55a9c56d7c.jpg',
];

const MYFIRST_IMAGES = [
  '/pictures/myfirst/058df9a5-7052-42a3-ab11-3f84a70165bd.jpg',
  '/pictures/myfirst/a6817fb8-8a60-40ae-8eeb-309059f6a16f.jpg',
  '/pictures/myfirst/c023845c-20a3-4793-bb67-12f0157b19ba.jpg',
  '/pictures/myfirst/ddea3b01-da3a-4ba1-a399-d96e33472d23.jpg',
];

// Robust helper component to smoothly crossfade between images
function CrossfadePhotoFrame({ src, alt, style = {}, imgStyle = {} }) {
  // primary = bottom image, secondary = top image that fades in
  const [displayedSrc, setDisplayedSrc] = useState(src);
  const [incomingSrc, setIncomingSrc] = useState(null);
  const [incomingActive, setIncomingActive] = useState(false);
  const animTimeoutRef = useRef(null);

  useEffect(() => {
    // If incoming source changed to a new image
    if (src && src !== displayedSrc && src !== incomingSrc) {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);

      // Preload image before starting crossfade to avoid abrupt pop-in
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIncomingSrc(src);
        setIncomingActive(false);

        // Next animation frame: start smooth opacity fade from 0 -> 1
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIncomingActive(true);
          });
        });

        // Safe transition completion timer (0.8s matches CSS 0.8s ease-in-out)
        animTimeoutRef.current = setTimeout(() => {
          setDisplayedSrc(src);
          setIncomingSrc(null);
          setIncomingActive(false);
        }, 850);
      };
      img.onerror = () => {
        // Fallback in case of broken load
        setDisplayedSrc(src);
        setIncomingSrc(null);
        setIncomingActive(false);
      };
    }
  }, [src, displayedSrc, incomingSrc]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      {/* Current base image */}
      {displayedSrc && (
        <img
          src={displayedSrc}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            ...imgStyle,
          }}
        />
      )}

      {/* Incoming image crossfading smoothly on top */}
      {incomingSrc && (
        <img
          src={incomingSrc}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: incomingActive ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            ...imgStyle,
          }}
        />
      )}
    </div>
  );
}

export default function VideoMemoriesPage({ onContinue, onFadeToTheBone }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [phase2, setPhase2] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Story sequence: part 1 = first date letter + left together images
  //                 part 2 = "The Random Date" letter + right randomday images
  //                 part 3 = "You Came to Naga" letter + left date images
  //                 part 4 = "The Maypay Date" letter + right myfirst images
  //                 secret date phase = centered text "And then there was another date..."
  const [storyPart, setStoryPart] = useState(1);
  const [storyPart1Visible, setStoryPart1Visible] = useState(true);
  const [storyPart2Visible, setStoryPart2Visible] = useState(false);
  const [storyPart3Visible, setStoryPart3Visible] = useState(false);
  const [storyPart4Visible, setStoryPart4Visible] = useState(false);
  const [isSecretDatePhase, setIsSecretDatePhase] = useState(false);
  const [secretDateTextVisible, setSecretDateTextVisible] = useState(false);

  // Finale: Flowers falling, pitch-black video, wait 5s, turn white, then proceed
  const [flowerFinaleActive, setFlowerFinaleActive] = useState(false);
  const [pitchBlackActive, setPitchBlackActive] = useState(false);
  const [whiteFadeActive, setWhiteFadeActive] = useState(false);

  // Random 3 images selected from public/pictures/together (Part 1)
  const [activeTogetherPhotos, setActiveTogetherPhotos] = useState([
    TOGETHER_IMAGES[0],
    TOGETHER_IMAGES[1],
    TOGETHER_IMAGES[2],
  ]);

  // Random 3 images selected from public/pictures/randomday (Part 2)
  const [activeRandomdayPhotos, setActiveRandomdayPhotos] = useState([
    RANDOMDAY_IMAGES[0],
    RANDOMDAY_IMAGES[1],
    RANDOMDAY_IMAGES[2],
  ]);

  // Random 3 images selected from public/pictures/date (Part 3)
  const [activeDatePhotos, setActiveDatePhotos] = useState([
    DATE_IMAGES[0],
    DATE_IMAGES[1],
    DATE_IMAGES[2],
  ]);

  // Random 3 images selected from public/pictures/myfirst (Part 4)
  const [activeMyfirstPhotos, setActiveMyfirstPhotos] = useState([
    MYFIRST_IMAGES[0],
    MYFIRST_IMAGES[1],
    MYFIRST_IMAGES[2],
  ]);

  const videoRef = useRef(null);

  // Trigger phase 2 (quote disappears, dark shade & letter appear) after 10s
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase2(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Helper to guarantee that each slot [0], [1], [2] gets a new photo that differs from its current photo
  function getNextThreeDistinct(currentList, fullList) {
    if (!fullList || fullList.length === 0) return currentList;
    const current = currentList || [];

    // For collections with 4 or more images:
    // Slot 0 picks from fullList excluding current[0]
    // Slot 1 picks from fullList excluding current[1] and slot 0
    // Slot 2 picks from fullList excluding current[2], slot 0, and slot 1
    const availableFor0 = fullList.filter((img) => img !== current[0]);
    const pick0 = availableFor0[Math.floor(Math.random() * availableFor0.length)] || fullList[0];

    const availableFor1 = fullList.filter((img) => img !== current[1] && img !== pick0);
    const pick1 = (availableFor1.length > 0 ? availableFor1 : fullList.filter((img) => img !== pick0))[
      Math.floor(Math.random() * (availableFor1.length > 0 ? availableFor1.length : 1))
    ] || fullList[1 % fullList.length];

    const availableFor2 = fullList.filter((img) => img !== current[2] && img !== pick0 && img !== pick1);
    const pool2 = availableFor2.length > 0 ? availableFor2 : fullList.filter((img) => img !== pick0 && img !== pick1);
    const pick2 = pool2[Math.floor(Math.random() * pool2.length)] || fullList[2 % fullList.length];

    return [pick0, pick1, pick2];
  }

  // Switch the 3 images randomly with smooth crossfade every 2.4s for together photos (Part 1)
  useEffect(() => {
    if (!phase2 || storyPart !== 1 || isSecretDatePhase) return;
    const interval = setInterval(() => {
      setActiveTogetherPhotos((prev) => getNextThreeDistinct(prev, TOGETHER_IMAGES));
    }, 2400);
    return () => clearInterval(interval);
  }, [phase2, storyPart, isSecretDatePhase]);

  // Switch the 3 images randomly with smooth crossfade every 2.4s for randomday photos (Part 2)
  useEffect(() => {
    if (storyPart !== 2 || isSecretDatePhase) return;
    const interval = setInterval(() => {
      setActiveRandomdayPhotos((prev) => getNextThreeDistinct(prev, RANDOMDAY_IMAGES));
    }, 2400);
    return () => clearInterval(interval);
  }, [storyPart, isSecretDatePhase]);

  // Switch the 3 images randomly with smooth crossfade every 2.4s for date photos (Part 3)
  useEffect(() => {
    if (storyPart !== 3 || isSecretDatePhase) return;
    const interval = setInterval(() => {
      setActiveDatePhotos((prev) => getNextThreeDistinct(prev, DATE_IMAGES));
    }, 2400);
    return () => clearInterval(interval);
  }, [storyPart, isSecretDatePhase]);

  // Switch the 3 images randomly with smooth crossfade every 2.4s for myfirst photos (Part 4)
  useEffect(() => {
    if (storyPart !== 4 || isSecretDatePhase) return;
    const interval = setInterval(() => {
      setActiveMyfirstPhotos((prev) => getNextThreeDistinct(prev, MYFIRST_IMAGES));
    }, 2400);
    return () => clearInterval(interval);
  }, [storyPart, isSecretDatePhase]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => { });
    }
  }, [videoIndex]);

  function handleVideoEnded() {
    setFade(false);
    setTimeout(() => {
      setVideoIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
      setFade(true);
    }, 600);
  }

  function handleContinueClick() {
    if (storyPart === 1) {
      // 1. Fade out Part 1
      setStoryPart1Visible(false);

      // 2. Wait for fade-out, then switch to Part 2 and trigger sliding intro
      setTimeout(() => {
        setStoryPart(2);
        setTimeout(() => {
          setStoryPart2Visible(true);
        }, 50);
      }, 900);
    } else if (storyPart === 2) {
      // 1. Fade out Part 2
      setStoryPart2Visible(false);

      // 2. Wait for fade-out, then switch to Part 3 and trigger sliding intro
      setTimeout(() => {
        setStoryPart(3);
        setTimeout(() => {
          setStoryPart3Visible(true);
        }, 50);
      }, 900);
    } else if (storyPart === 3) {
      // 1. Fade out Part 3
      setStoryPart3Visible(false);

      // 2. Wait for fade-out, then switch to Part 4 and trigger sliding intro
      setTimeout(() => {
        setStoryPart(4);
        setTimeout(() => {
          setStoryPart4Visible(true);
        }, 50);
      }, 900);
    } else if (storyPart === 4 && !isSecretDatePhase) {
      // 1. Fade out Part 4 (elements fade away except dimmed video)
      setStoryPart4Visible(false);

      // 2. Transition into secret date phase
      setTimeout(() => {
        setIsSecretDatePhase(true);
        setTimeout(() => {
          setSecretDateTextVisible(true);
        }, 80);
      }, 900);
    } else {
      // Secret date phase continue clicked:
      // 1. Flowers fall (same as photobooth), text fades away, dimmed video / content turns pitch black
      setSecretDateTextVisible(false);
      setFlowerFinaleActive(true);
      setPitchBlackActive(true);
      onFadeToTheBone?.();

      // 2. Flowers fall duration (~8s total for flowers to finish falling and clear out).
      // Background remains pure dark/pitch black with zero foreground elements.
      // Then turn background pure white over 2.5s.
      setTimeout(() => {
        // Trigger white background transition
        setWhiteFadeActive(true);

        // When screen is fully white, transition immediately into WhiteMemoriesPage
        setTimeout(() => {
          onContinue?.();
        }, 2600);
      }, 8000);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#070204',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transition: 'opacity 0.8s ease',
        opacity: exiting ? 0 : 1,
      }}
    >
      {/* Background Video with subtle dimming */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
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
            filter: 'brightness(0.62) contrast(1.08) saturate(0.94)',
            transform: 'scale(1.03)',
            transition: 'opacity 0.7s ease-in-out',
            opacity: fade ? 1 : 0,
          }}
        />

        {/* Warm ambient tinted overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(20, 8, 12, 0.28) 0%, rgba(10, 4, 7, 0.68) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Deep dark vignette fade-away shade from each corner */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 130px 50px rgba(7, 2, 4, 0.92), inset 0 0 260px 110px rgba(5, 1, 3, 0.96)',
            pointerEvents: 'none',
          }}
        />

        {/* Pitch black curtain over the dimmed video - turns pitch black while flowers are falling */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            pointerEvents: 'none',
            zIndex: 5,
            transition: 'opacity 2.2s ease-in-out',
            opacity: pitchBlackActive ? 1 : 0,
          }}
        />
      </div>

      {/* Photobooth Falling Flowers - triggers on finale continue click */}
      {flowerFinaleActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <FlowersFall />
        </div>
      )}

      {/* Pure White overlay - turns slowly to white after flowers finish falling */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          pointerEvents: 'none',
          zIndex: 50,
          transition: 'opacity 2.5s ease-in-out',
          opacity: whiteFadeActive ? 1 : 0,
        }}
      />

      {/* Note: Falling leaves / petals effect is managed continuously at the App level across Video, White Memories, and 3D Heart pages */}

      {/* Top Header - Highest zIndex overlay - disappears with the video background at the same time */}
      <div
        style={{
          position: 'absolute',
          top: '2.5rem',
          left: 0,
          right: 0,
          zIndex: 10,
          textAlign: 'center',
          animation: flowerFinaleActive ? 'none' : 'fadeUp 1s ease forwards',
          pointerEvents: 'none',
          transition: 'opacity 2.2s ease-in-out, transform 2.2s ease-in-out',
          opacity: flowerFinaleActive ? 0 : 1,
          transform: flowerFinaleActive ? 'translateY(-20px)' : 'translateY(0)',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.65rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'var(--gold, #b8923a)',
            marginBottom: '0.6rem',
            opacity: 0.9,
          }}
        >
          &#10038; &nbsp; our moments in motion &nbsp; &#10038;
        </p>
        <h2
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
            color: '#f5ede0',
            lineHeight: 1.3,
            fontWeight: 400,
            textShadow: '0 3px 18px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9)',
          }}
        >
          A quiet glimpse of us
        </h2>
      </div>

      {/* Dark fade background gradient:
          - In Part 1 & 3: fades from right side to dark (for right-side letter)
          - In Part 2 & 4: fades from left side to dark (for left-side letter)
          - In secret date phase: fades away completely so only dimmed video remains */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background:
            storyPart === 2 || storyPart === 4
              ? 'linear-gradient(90deg, rgba(7, 2, 4, 0.97) 0%, rgba(7, 2, 4, 0.88) 38%, rgba(7, 2, 4, 0.55) 60%, transparent 100%)'
              : 'linear-gradient(270deg, rgba(7, 2, 4, 0.97) 0%, rgba(7, 2, 4, 0.88) 38%, rgba(7, 2, 4, 0.55) 60%, transparent 100%)',
          pointerEvents: 'none',
          transition: 'background 1s ease, opacity 1.2s ease',
          opacity: phase2 && !isSecretDatePhase ? 1 : 0,
        }}
      />

      {/* ========================================================= */}
      {/* PART 1: Images Left + Letter Right (First Story)          */}
      {/* ========================================================= */}
      {storyPart === 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            transition: 'opacity 0.85s ease-out, transform 0.85s ease-out',
            opacity: phase2 && storyPart1Visible ? 1 : 0,
            transform: storyPart1Visible ? 'scale(1)' : 'scale(0.97)',
          }}
        >
          {/* Three images on the left switching randomly */}
          <div
            style={{
              position: 'absolute',
              left: 'max(1.5rem, 4vw)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            <div style={{ position: 'relative', width: 'clamp(320px, 38vw, 500px)', height: 'clamp(400px, 54vh, 580px)' }}>
              {/* Main Huge Image */}
              <div
                style={{
                  position: 'absolute',
                  top: '0%',
                  right: '2%',
                  width: '92%',
                  height: '86%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(245, 237, 224, 0.16)',
                  background: '#12080c',
                  transform: 'rotate(1.2deg)',
                }}
              >
                <CrossfadePhotoFrame
                  src={activeTogetherPhotos[0]}
                  alt="Together memory 1"
                />
              </div>

              {/* Small Image 1 - Below part of huge image, on the left, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '-18px',
                  width: '46%',
                  height: '40%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(-4deg)',
                  zIndex: 2,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeTogetherPhotos[1]}
                  alt="Together memory 2"
                />
              </div>

              {/* Small Image 2 - Beside the first small image, below huge image, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '36%',
                  width: '44%',
                  height: '38%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(3deg)',
                  zIndex: 3,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeTogetherPhotos[2]}
                  alt="Together memory 3"
                />
              </div>
            </div>
          </div>

          {/* Letter text on the right side */}
          <div
            className="subtle-scroll"
            style={{
              position: 'absolute',
              right: 'max(2rem, 5vw)',
              top: 'calc(clamp(6rem, 13vh, 8.5rem) + 2px)',
              bottom: 'clamp(7.5rem, 16vh, 9.5rem)',
              width: 'min(360px, calc(40vw - 50px))',
              overflowY: 'auto',
              zIndex: 8,
              padding: 'calc(0.4rem - 2px) 0.8rem 0.4rem 0',
              boxSizing: 'border-box',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(0.9rem, 1.25vw, 1.05rem)',
                lineHeight: 1.78,
                color: 'rgba(245, 237, 224, 0.94)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
                  color: 'var(--gold, #d4af37)',
                  fontWeight: 400,
                  marginBottom: '1.2rem',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                The Day I gave you a Gift
              </h3>

              <p style={{ marginBottom: '1.1rem' }}>
                I still remember how hectic this day started.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It was already past 11, and you were still at home when you told me to order na. But ngl, nashy jud ko ato kay it was my first time sa restaurant and I didn't really know what to do. I had very little initiative that time, and mao to, pagabot nimo, gutom na kaayo akong lovelove and medyo gisapot na gamay HAHAHA. I'm really sorry about that, lovelove.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Then our food took a couple of minutes to arrive, so we just sat there across from each other, staring at each other and having those small, awkward conversations while waiting.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Eventually, our food arrived and we started eating. We even noticed the baby behind you and ended up complimenting how cute the baby was. Such a random little moment, but I still remember it.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                After that, we went to Sebucha and spent hours together just talking and enjoying our time together. And that was when I finally gave you the gift I prepared for you.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                You read the letter I wrote, although looking back at it now, nganong gamay kaayo akong pagsuwat ato? HAHAHA. I'm really sorry kaayo about that, lovelove.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Then Steven arrived, and later siyay ni-suggest nga mangadto tag arcade. We had a really good time taking pictures at the arcade, and I'm really thankful to Steven for helping us take them because those pictures became some of my favorite memories.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                The sunset was really good that day too, and honestly, nindot jud kaayo atong mga pictures ato.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                After that, we went to the playground and just played around for a while before eventually heading home.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Looking back, I really love how this day turned out.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It started a little hectic and awkward, but it eventually became one of those days that I wish I could experience again.
              </p>

              <p style={{ marginBottom: '1.2rem', color: '#ffb3c1' }}>
                Especially because I got to spend it with you. ❤️
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PART 2: Letter Left (slides from left) +                  */}
      {/*         Images Right (slides from right) - The Random Date*/}
      {/* ========================================================= */}
      {storyPart === 2 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {/* Letter on the LEFT side - slides in from the left */}
          <div
            className="subtle-scroll"
            style={{
              position: 'absolute',
              left: 'max(2rem, 5vw)',
              top: 'calc(clamp(6rem, 13vh, 8.5rem) + 2px)',
              bottom: 'clamp(7.5rem, 16vh, 9.5rem)',
              width: 'min(360px, calc(40vw - 50px))',
              overflowY: 'auto',
              zIndex: 8,
              padding: 'calc(0.4rem - 2px) 0.8rem 0.4rem 0',
              boxSizing: 'border-box',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              pointerEvents: 'auto',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: storyPart2Visible ? 1 : 0,
              transform: storyPart2Visible ? 'translateX(0)' : 'translateX(-60px)',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(0.9rem, 1.25vw, 1.05rem)',
                lineHeight: 1.78,
                color: 'rgba(245, 237, 224, 0.94)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
                  color: 'var(--gold, #d4af37)',
                  fontWeight: 400,
                  marginBottom: '1.2rem',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                The Random Date
              </h3>

              <p style={{ marginBottom: '1.1rem' }}>
                This one was honestly so random.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I didn't even expect that we'd have a date that day because it was already pretty late. I had been sent out to buy groceries, but even with how late it was, I still wanted to spend some time with you.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And somehow, that random decision became another memory I'll always keep.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                My trip going there was already an adventure. I got off the bus, rode a tricycle, and somehow ended up getting toured around from Sangi all the way to the arcade.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It took forever, but I eventually made it.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We ate together and talked, and there was even that old woman who owned the restaurant. She gave you a banana and you two started talking, which was honestly kinda cute.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                After eating, we walked around and visited a photo booth.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And FINALLY, the photo booth did not disappoint HAHAHA.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                The pictures actually came out really good, and I remember how happy you were when you saw the results. Our pictures even got pinned outside the booth.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And honestly, that made me happier than the pictures themselves.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Seeing you smile because you liked how the pictures turned out was enough for me.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                After that, we went to the arcade. It was already getting late, so I couldn't stay for very long, but we still got to spend some time together outside, enjoying the night breeze and talking about random things.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Even those slightly awkward conversations felt nice.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Because when you're with someone you love, even sitting around with nothing special happening can already feel special.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Eventually, it was time to go home.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I insisted on walking you toward your place, or at least as far as the school area, because you had already spent your time and energy coming all the way to meet me despite being busy and tired that day.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I don't know if I made you feel how much I appreciated that effort back then.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                But I hope you know now that I did.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                You made time for me even when you had a lot going on.
              </p>

              <p style={{ marginBottom: '1.2rem', color: '#ffb3c1' }}>
                And that meant a lot to me.❤️
              </p>
            </div>
          </div>

          {/* Three images on the RIGHT side - slides in from the right */}
          <div
            style={{
              position: 'absolute',
              right: 'max(1.5rem, 4vw)',
              top: '50%',
              transform: storyPart2Visible ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(60px)',
              opacity: storyPart2Visible ? 1 : 0,
              zIndex: 5,
              pointerEvents: 'none',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ position: 'relative', width: 'clamp(320px, 38vw, 500px)', height: 'clamp(400px, 54vh, 580px)' }}>
              {/* Main Huge Image (Part 2 - Randomday) */}
              <div
                style={{
                  position: 'absolute',
                  top: '0%',
                  left: '2%',
                  width: '92%',
                  height: '86%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(245, 237, 224, 0.16)',
                  background: '#12080c',
                  transform: 'rotate(-1.2deg)',
                }}
              >
                <CrossfadePhotoFrame
                  src={activeRandomdayPhotos[0]}
                  alt="Randomday memory 1"
                />
              </div>

              {/* Small Image 1 - Below part of huge image, on the right, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '-18px',
                  width: '46%',
                  height: '40%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(4deg)',
                  zIndex: 2,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeRandomdayPhotos[1]}
                  alt="Randomday memory 2"
                />
              </div>

              {/* Small Image 2 - Beside the first small image, below huge image, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '36%',
                  width: '44%',
                  height: '38%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(-3deg)',
                  zIndex: 3,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeRandomdayPhotos[2]}
                  alt="Randomday memory 3"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PART 3: Images Left (slides from left) +                  */}
      {/*         Letter Right (slides from right) - You Came to Naga*/}
      {/* ========================================================= */}
      {storyPart === 3 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {/* Three images on the LEFT side - slides in from the left */}
          <div
            style={{
              position: 'absolute',
              left: 'max(1.5rem, 4vw)',
              top: '50%',
              transform: storyPart3Visible ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-60px)',
              opacity: storyPart3Visible ? 1 : 0,
              zIndex: 5,
              pointerEvents: 'none',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ position: 'relative', width: 'clamp(320px, 38vw, 500px)', height: 'clamp(400px, 54vh, 580px)' }}>
              {/* Main Huge Image (Part 3 - Date) */}
              <div
                style={{
                  position: 'absolute',
                  top: '0%',
                  right: '2%',
                  width: '92%',
                  height: '86%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(245, 237, 224, 0.16)',
                  background: '#12080c',
                  transform: 'rotate(1.2deg)',
                }}
              >
                <CrossfadePhotoFrame
                  src={activeDatePhotos[0]}
                  alt="Date memory 1"
                />
              </div>

              {/* Small Image 1 - Below part of huge image, on the left, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '-18px',
                  width: '46%',
                  height: '40%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(-4deg)',
                  zIndex: 2,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeDatePhotos[1]}
                  alt="Date memory 2"
                />
              </div>

              {/* Small Image 2 - Beside the first small image, below huge image, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '36%',
                  width: '44%',
                  height: '38%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(3deg)',
                  zIndex: 3,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeDatePhotos[2]}
                  alt="Date memory 3"
                />
              </div>
            </div>
          </div>

          {/* Letter on the RIGHT side - slides in from the right */}
          <div
            className="subtle-scroll"
            style={{
              position: 'absolute',
              right: 'max(2rem, 5vw)',
              top: 'calc(clamp(6rem, 13vh, 8.5rem) + 2px)',
              bottom: 'clamp(7.5rem, 16vh, 9.5rem)',
              width: 'min(360px, calc(40vw - 50px))',
              overflowY: 'auto',
              zIndex: 8,
              padding: 'calc(0.4rem - 2px) 0.8rem 0.4rem 0',
              boxSizing: 'border-box',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              pointerEvents: 'auto',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: storyPart3Visible ? 1 : 0,
              transform: storyPart3Visible ? 'translateX(0)' : 'translateX(60px)',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(0.9rem, 1.25vw, 1.05rem)',
                lineHeight: 1.78,
                color: 'rgba(245, 237, 224, 0.94)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
                  color: 'var(--gold, #d4af37)',
                  fontWeight: 400,
                  marginBottom: '1.2rem',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                You Came to Naga
              </h3>

              <p style={{ marginBottom: '1.1rem' }}>
                Intrams was coming up, and then you told me you were going to come to Naga.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I was genuinely happy when you told me that.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                You were going all the way to Naga just to visit me at school, and of course I wanted to make the most of the time we had together.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We went to Jollibee, visited Caffein8, talked about random things, and took pictures together.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And once again, I realized how ridiculously fast time goes when I'm with you.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Sometimes I wish I could just stop time whenever we're together so we could stay like that for as long as we wanted.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                But obviously, we can't HAHAHA.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We both have our own lives, responsibilities, and things ahead of us. And maybe that's okay.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Because it makes the time we do get together even more valuable.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Later, we went to the boardwalk with Steven and his girlfriend. We had our usual silly conversations and just enjoyed being together.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And that was also the first time I kissed you on the cheek and forehead.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I don't think I'll ever forget how that felt.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                There's something really special about finally being able to show affection to the person you've spent so much time loving and waiting for.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                After that, it was already time for you to go home.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Your bus took forever to arrive, and since it was already getting late and you still had to go home alone, I was honestly getting worried.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                But I was really glad when I knew you made it home safely.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                You came all the way to Naga just to spend some time with me.
              </p>

              <p style={{ marginBottom: '1.2rem', color: '#ffb3c1' }}>
                And I'll always appreciate that. ❤️
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PART 4: Letter Left (slides from left) +                  */}
      {/*         Images Right (slides from right) - The Maypay Date */}
      {/* ========================================================= */}
      {storyPart === 4 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {/* Letter on the LEFT side - slides in from the left */}
          <div
            className="subtle-scroll"
            style={{
              position: 'absolute',
              left: 'max(2rem, 5vw)',
              top: 'calc(clamp(6rem, 13vh, 8.5rem) + 2px)',
              bottom: 'clamp(7.5rem, 16vh, 9.5rem)',
              width: 'min(360px, calc(40vw - 50px))',
              overflowY: 'auto',
              zIndex: 8,
              padding: 'calc(0.4rem - 2px) 0.8rem 0.4rem 0',
              boxSizing: 'border-box',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              pointerEvents: 'auto',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: storyPart4Visible ? 1 : 0,
              transform: storyPart4Visible ? 'translateX(0)' : 'translateX(-60px)',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(0.9rem, 1.25vw, 1.05rem)',
                lineHeight: 1.78,
                color: 'rgba(245, 237, 224, 0.94)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                textAlign: 'left',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
                  color: 'var(--gold, #d4af37)',
                  fontWeight: 400,
                  marginBottom: '1.2rem',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                The Maypay Date
              </h3>

              <p style={{ marginBottom: '1.1rem' }}>
                Then came our Maypay date.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And once again, it started with us wondering if the weather was going to ruin everything.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It was so gloomy, and we were both worried that it was going to rain.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                But somehow, it worked out perfectly.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It stayed cool, there wasn't much heat, and we even got a little bit of drizzle without the rain actually ruining our day.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                So we just spent our time together.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We took videos, ate, talked about our lives, and slowly started revealing more little parts of ourselves that we thought were innocent...
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Only to realize that maybe we weren't as innocent as we though HAHAHA.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And then something unexpected happened.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We kissed.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I remember that I had already mentioned during our late-night video calls that I wanted to kiss you someday.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And then suddenly, there we were.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                You were even worried that it might somehow change the way I saw you afterward.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                But honestly?
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It did the exact opposite.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I fell for you even more.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And then somehow we ended up having our first French kiss too.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                I'll be honest, I had absolutely no idea what I was doing. It was my first time, after all HAHAHA.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                But even with all the awkwardness, I wouldn't trade that moment for anything.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We stayed together for a few more hours afterward, took pictures, finished our food, talked some more, and eventually had to go home.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                It was another ordinary day that somehow became one of my favorite memories.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                And I think that's becoming a pattern with us.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                We don't always need some huge plan.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Sometimes, we just spend a few hours together.
              </p>

              <p style={{ marginBottom: '1.2rem', color: '#ffb3c1' }}>
                and somehow those few hours become memories I don't want to forget. ❤️
              </p>
            </div>
          </div>

          {/* Three images on the RIGHT side - slides in from the right */}
          <div
            style={{
              position: 'absolute',
              right: 'max(1.5rem, 4vw)',
              top: '50%',
              transform: storyPart4Visible ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(60px)',
              opacity: storyPart4Visible ? 1 : 0,
              zIndex: 5,
              pointerEvents: 'none',
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ position: 'relative', width: 'clamp(320px, 38vw, 500px)', height: 'clamp(400px, 54vh, 580px)' }}>
              {/* Main Huge Image (Part 4 - Myfirst) */}
              <div
                style={{
                  position: 'absolute',
                  top: '0%',
                  left: '2%',
                  width: '92%',
                  height: '86%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(245, 237, 224, 0.16)',
                  background: '#12080c',
                  transform: 'rotate(-1.2deg)',
                }}
              >
                <CrossfadePhotoFrame
                  src={activeMyfirstPhotos[0]}
                  alt="Myfirst memory 1"
                />
              </div>

              {/* Small Image 1 - Below part of huge image, on the right, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '-18px',
                  width: '46%',
                  height: '40%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(4deg)',
                  zIndex: 2,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeMyfirstPhotos[1]}
                  alt="Myfirst memory 2"
                />
              </div>

              {/* Small Image 2 - Beside the first small image, below huge image, overlapping */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '36%',
                  width: '44%',
                  height: '38%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 44px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(245, 237, 224, 0.2)',
                  background: '#140a0e',
                  transform: 'rotate(-3deg)',
                  zIndex: 3,
                }}
              >
                <CrossfadePhotoFrame
                  src={activeMyfirstPhotos[2]}
                  alt="Myfirst memory 3"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial Bottom Subtitle Message - Disappears after 10 seconds */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: 0,
          right: 0,
          zIndex: 4,
          textAlign: 'center',
          pointerEvents: 'none',
          transition: 'opacity 1s ease, transform 1s ease',
          opacity: phase2 || isSecretDatePhase ? 0 : 1,
          transform: phase2 || isSecretDatePhase ? 'translateY(12px)' : 'translateY(0)',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.2rem',
            color: 'rgba(245, 237, 224, 0.85)',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.6,
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.7)',
          }}
        >
          Every little frame with you is something I keep close to my heart.
        </p>
      </div>

      {/* Secret Date Centered Text - appears in center when Part 4 fades away */}
      {isSecretDatePhase && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            pointerEvents: 'none',
            transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: secretDateTextVisible ? 1 : 0,
            transform: secretDateTextVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <div
            style={{
              maxWidth: '680px',
              padding: '0 1.5rem',
            }}
          >


            <h2
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                color: '#f5ede0',
                lineHeight: 1.45,
                fontWeight: 400,
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.95)',
                marginBottom: '1rem',
              }}
            >
              And then there was another date...
            </h2>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(1.2rem, 2.1vw, 1.65rem)',
                color: 'rgba(255, 179, 193, 0.95)',
                lineHeight: 1.65,
                textShadow: '0 3px 18px rgba(0, 0, 0, 0.9)',
                marginTop: '0.6rem',
              }}
            >
              Some memories are better left between us. 🤭❤️
            </p>
          </div>
        </div>
      )}

      {/* Bottom Center Continue Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'center',
          transition: 'opacity 1s ease, transform 1s ease',
          opacity: phase2 && !flowerFinaleActive ? 1 : 0,
          transform: phase2 && !flowerFinaleActive ? 'translateY(0)' : 'translateY(16px)',
          pointerEvents: phase2 && !flowerFinaleActive ? 'auto' : 'none',
        }}
      >
        <button
          onClick={handleContinueClick}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'var(--rose, #9b3a4a)',
            border: '1px solid var(--rose, #9b3a4a)',
            padding: '0.9rem 2.8rem',
            cursor: 'pointer',
            transition: 'all 0.35s ease',
            borderRadius: '2px',
            boxShadow: '0 6px 28px rgba(155, 58, 74, 0.45)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#b84758';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 36px rgba(155, 58, 74, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--rose, #9b3a4a)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(155, 58, 74, 0.45)';
          }}
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  );
}
