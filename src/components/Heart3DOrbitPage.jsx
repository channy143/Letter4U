import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import FAV_PHOTOS from './favPhotosData.json';
import ALL_PHOTOS from './allPhotos.json';
import heartData from './heartGeometryData.json';
import marbleData from './marbleGeometryData.json';

export default function Heart3DOrbitPage({ onContinue, onEnteringReflection }) {
  const mountRef = useRef(null);
  const [modelReady, setModelReady] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  // Transition stages: 'heart' -> 'whiteFade' -> 'emptiness' -> 'reflection'
  const [stage, setStage] = useState('heart');

  // Press-and-hold 2s interaction state
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [hasUnlockedLetter, setHasUnlockedLetter] = useState(false);
  const holdStartRef = useRef(null);
  const holdRafRef = useRef(null);

  // Prepare falling photos for reflection phase (strictly left & right columns)
  const fallingPhotos = useMemo(() => {
    const photoPool = ALL_PHOTOS.slice(0, 36).map((src) =>
      src.replace(/^\/public[\\/]/, '/').replace(/\\/g, '/')
    );
    const items = [];

    // Left column items (9 photos)
    for (let i = 0; i < 9; i++) {
      const isFar = i % 2 === 0;
      items.push({
        id: `left_${i}`,
        src: photoPool[i % photoPool.length],
        side: 'left',
        x: 2 + ((i * 2.1) % 15), // 2% to 17% from left edge
        width: isFar ? 105 : 160,
        height: isFar ? 135 : 195,
        isBlurred: isFar,
        blurAmount: isFar ? 3.5 : 0,
        opacity: isFar ? 0.42 : 0.82,
        duration: isFar ? 24 + (i % 3) * 3 : 15 + (i % 3) * 2,
        delay: -(i * 2.8),
        rot: -7 + ((i * 3.5) % 14),
      });
    }

    // Right column items (9 photos)
    for (let i = 0; i < 9; i++) {
      const isFar = i % 2 === 1;
      items.push({
        id: `right_${i}`,
        src: photoPool[(i + 9) % photoPool.length],
        side: 'right',
        x: 2 + ((i * 2.1) % 15), // 2% to 17% from right edge
        width: isFar ? 105 : 160,
        height: isFar ? 135 : 195,
        isBlurred: isFar,
        blurAmount: isFar ? 3.5 : 0,
        opacity: isFar ? 0.42 : 0.82,
        duration: isFar ? 24 + (i % 3) * 3 : 15 + (i % 3) * 2,
        delay: -(i * 3.1),
        rot: 6 - ((i * 3.2) % 13),
      });
    }

    return items;
  }, []);

  const stageTimerRef = useRef([]);

  useEffect(() => {
    return () => {
      stageTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const isTransitioningRef = useRef(false);

  function handleLetterContinue() {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // Start fading to white on top of the modal first (do NOT unmount the modal yet!)
    setStage('whiteFade');
    onEnteringReflection?.();

    // After 1.2s white fade completes, the white overlay is 100% opaque.
    // Now it is completely safe to unmount the letter modal underneath:
    const t1 = setTimeout(() => {
      setShowLetter(false);
      setStage('emptiness');

      // 5 seconds of pure emptiness before reflection text begins
      const t2 = setTimeout(() => {
        setStage('reflection');
      }, 5000);
      stageTimerRef.current.push(t2);
    }, 1200);
    stageTimerRef.current.push(t1);
  }

  function handleHoldStart(e) {
    if (showLetter) return;
    setIsHolding(true);
    holdStartRef.current = performance.now();

    const HOLD_DURATION = 2000; // exactly 2 seconds

    function tick(now) {
      if (!holdStartRef.current) return;
      const elapsed = now - holdStartRef.current;
      const progress = Math.min(1, elapsed / HOLD_DURATION);
      setHoldProgress(progress);

      if (progress >= 1) {
        setIsHolding(false);
        holdStartRef.current = null;
        setHoldProgress(1);
        setHasUnlockedLetter(true);
        setTimeout(() => {
          setShowLetter(true);
          setHoldProgress(0);
        }, 160);
      } else {
        holdRafRef.current = requestAnimationFrame(tick);
      }
    }

    holdRafRef.current = requestAnimationFrame(tick);
  }

  function handleHoldEnd() {
    if (holdProgress >= 1) return;
    setIsHolding(false);
    holdStartRef.current = null;
    if (holdRafRef.current) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
    setHoldProgress(0);
  }

  useEffect(() => {
    if (!isHolding) return;
    function handleGlobalUp() {
      handleHoldEnd();
    }
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isHolding]);

  useEffect(() => {
    if (!showLetter) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setShowLetter(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLetter]);

  useEffect(() => {
    // Staggered fade in animation trigger
    const timer = setTimeout(() => {
      setHasAppeared(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.5);

    // 3. Renderer Setup - alpha: true to show the pastel gradient background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting matching the dreamlike pastel gradient
    const ambientLight = new THREE.AmbientLight(0xfff2f6, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight1.position.set(5.5, 7.5, 6.5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xdbe7ff, 1.6);
    dirLight2.position.set(-6, -4, 5);
    scene.add(dirLight2);

    const heartGlowLight = new THREE.PointLight(0xff1850, 4.2, 20);
    heartGlowLight.position.set(0, 0.2, 4.0);
    scene.add(heartGlowLight);

    // 5. Construct 3D Heart & Glass Bubble with accurate orientation facing the viewer
    const textureLoader = new THREE.TextureLoader();

    const heartAssetGroup = new THREE.Group();

    // A. Inner Heart Mesh
    const heartGeom = new THREE.BufferGeometry();
    heartGeom.setAttribute('position', new THREE.Float32BufferAttribute(heartData.positions, 3));
    heartGeom.setAttribute('normal', new THREE.Float32BufferAttribute(heartData.normals, 3));
    heartGeom.setAttribute('uv', new THREE.Float32BufferAttribute(heartData.uvs, 2));
    heartGeom.setIndex(heartData.indices);

    // Radiant glowing candy ruby-pink physical material matching reference image
    const heartMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ff2460'),       // Vibrant ruby-rose candy pink
      emissive: new THREE.Color('#c20842'),    // Deep warm internal radiance
      emissiveIntensity: 0.38,
      roughness: 0.11,                         // Smooth candy gloss
      metalness: 0.04,                         // Organic jelly/candy appearance
      clearcoat: 1.0,                          // High-gloss protective polish
      clearcoatRoughness: 0.06,                // Sharp specular gleam
      side: THREE.FrontSide,                   // FrontSide avoids internal shadow artifacts
    });
    const heartMesh = new THREE.Mesh(heartGeom, heartMat);
    heartMesh.scale.setScalar(0.88); // Generously fills the soap bubble

    // B. Outer Glass Marble Bubble (crystal clear soap bubble with Fresnel rim sheen)
    const marbleGeom = new THREE.BufferGeometry();
    marbleGeom.setAttribute('position', new THREE.Float32BufferAttribute(marbleData.positions, 3));
    marbleGeom.setAttribute('normal', new THREE.Float32BufferAttribute(marbleData.normals, 3));
    marbleGeom.setAttribute('uv', new THREE.Float32BufferAttribute(marbleData.uvs, 2));
    marbleGeom.setIndex(marbleData.indices);

    const marbleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        bubbleColor: { value: new THREE.Color(0xffffff) },
        rimColor: { value: new THREE.Color(0xffd5e5) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 bubbleColor;
        uniform vec3 rimColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
          float rim = pow(fresnel, 2.4);
          
          vec3 lightDir1 = normalize(vec3(0.55, 0.75, 0.65));
          vec3 halfDir1 = normalize(lightDir1 + viewDir);
          float spec1 = pow(max(0.0, dot(vNormal, halfDir1)), 52.0);
          
          vec3 lightDir2 = normalize(vec3(-0.45, -0.65, 0.45));
          vec3 halfDir2 = normalize(lightDir2 + viewDir);
          float spec2 = pow(max(0.0, dot(vNormal, halfDir2)), 36.0) * 0.45;
          
          vec3 col = mix(bubbleColor, rimColor, rim) + vec3(spec1 * 1.0 + spec2 * 0.6);
          float alpha = clamp(rim * 0.42 + spec1 * 0.9 + spec2 * 0.45, 0.0, 0.85);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const marbleMesh = new THREE.Mesh(marbleGeom, marbleMat);

    // Orientation: Rotates heart upright with cleft at top, point at bottom, front facing the viewer (+Z)
    heartMesh.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
    marbleMesh.rotation.set(Math.PI / 2, -Math.PI / 2, 0);

    heartAssetGroup.add(heartMesh);
    heartAssetGroup.add(marbleMesh);

    // Initial scale - enlarged per user request (baseHeartScale increased to 3.2)
    const baseHeartScale = 3.2;
    heartAssetGroup.scale.setScalar(baseHeartScale);
    heartAssetGroup.position.set(0, 0, 0);

    // Store baseline scale on each element
    heartMesh.userData.scaleBase = heartMesh.scale.clone();
    marbleMesh.userData.scaleBase = marbleMesh.scale.clone();
    heartAssetGroup.userData.scaleBase = heartAssetGroup.scale.clone();

    scene.add(heartAssetGroup);
    setModelReady(true);

    // 6. Create Orbiting Picture Cards from /pictures/fav with pre-loaded base64 textures
    const photoPlanes = [];
    const orbitCount = FAV_PHOTOS.length;
    // Tighter orbit radii bringing images closer to the heart
    const orbitRadiusX = 3.75;
    const orbitRadiusZ = 2.45;

    const baseHeight = 0.85;
    const borderPadding = 0.052;

    FAV_PHOTOS.forEach((photoObj, idx) => {
      const cardHeight = baseHeight;
      const cardWidth = baseHeight * (photoObj.aspect || 1);

      const cardGroup = new THREE.Group();

      // Load base64 DataURL texture instantly: guaranteed 100% loaded immediately
      const photoTexture = textureLoader.load(photoObj.dataUrl);
      photoTexture.colorSpace = THREE.SRGBColorSpace;

      // Front photo material
      const photoMat = new THREE.MeshBasicMaterial({
        map: photoTexture,
        side: THREE.FrontSide,
      });

      // Front photo plane
      const photoGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.position.z = 0.003;
      cardGroup.add(photoMesh);

      // Back photo plane (so flipped cards always display the photo)
      const backPhotoMesh = new THREE.Mesh(photoGeo, photoMat);
      backPhotoMesh.position.z = -0.003;
      backPhotoMesh.rotation.y = Math.PI;
      cardGroup.add(backPhotoMesh);

      // Clean white polaroid border frame
      const frameGeo = new THREE.PlaneGeometry(
        cardWidth + borderPadding * 2,
        cardHeight + borderPadding * 2
      );
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = 0;
      cardGroup.add(frameMesh);

      // Distribute evenly around the orbit
      const baseAngle = (idx / orbitCount) * Math.PI * 2;
      cardGroup.userData = {
        baseAngle,
        floatOffset: idx * 0.7,
      };

      scene.add(cardGroup);
      photoPlanes.push(cardGroup);
    });

    // 7. Cursor Tracking: Heart accurately turns to face the cursor anywhere it moves
    let mouseNDC = new THREE.Vector2(0, 0);
    const targetAimPoint = new THREE.Vector3(0, 0, 3.2);
    const lookDummy = new THREE.Object3D();

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseNDC.x = (e.clientX / innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / innerHeight) * 2 + 1;

      // Unproject cursor into 3D world space at z = 3.2 (in front of the heart)
      const v = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5);
      v.unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const targetDist = (3.2 - camera.position.z) / dir.z;
      targetAimPoint.copy(camera.position).add(dir.multiplyScalar(targetDist));
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Entrance bloom animation during first 1.2s
      const introProgress = Math.min(1, elapsedTime / 1.1);
      const introScale = 0.5 + 0.5 * Math.sin(introProgress * Math.PI * 0.5);

      // Pulse Animation Math using stored scaleBase
      const pulseFactor = 1 + Math.sin(elapsedTime * 2.5) * 0.045;
      if (heartMesh.userData.scaleBase) {
        heartMesh.scale.copy(heartMesh.userData.scaleBase).multiplyScalar(pulseFactor);
      }
      if (heartAssetGroup.userData.scaleBase) {
        heartAssetGroup.scale.copy(heartAssetGroup.userData.scaleBase).multiplyScalar(introScale * (1 + Math.sin(elapsedTime * 1.5) * 0.012));
      }

      // Feature: Heart faces the cursor everywhere the cursor goes
      // We aim the heart towards targetAimPoint with a subtle romantic idle sway
      const idleOffset = new THREE.Vector3(
        Math.sin(elapsedTime * 0.75) * 0.12,
        Math.cos(elapsedTime * 0.65) * 0.09,
        0
      );
      const currentAim = targetAimPoint.clone().add(idleOffset);

      lookDummy.position.copy(heartAssetGroup.position);
      lookDummy.up.set(0, 1, 0); // Preserves upright orientation
      lookDummy.lookAt(currentAim);

      // Silky-smooth quaternion slerp for natural cursor following
      heartAssetGroup.quaternion.slerp(lookDummy.quaternion, 0.075);

      // Orbiting Picture Cards (0.12 speed with smooth intro expansion)
      const cardIntro = Math.min(1, Math.max(0, (elapsedTime - 0.15) / 0.95));
      const orbitSpeed = 0.12;
      photoPlanes.forEach((plane) => {
        const currentAngle = plane.userData.baseAngle + elapsedTime * orbitSpeed;
        const x = Math.cos(currentAngle) * orbitRadiusX;
        const z = Math.sin(currentAngle) * orbitRadiusZ;
        const y = Math.sin(elapsedTime * 0.85 + plane.userData.floatOffset) * 0.16;

        plane.position.set(x, y, z);
        plane.lookAt(camera.position);

        const depthScale = 0.88 + ((z + orbitRadiusZ) / (2 * orbitRadiusZ)) * 0.24;
        plane.scale.setScalar(depthScale * cardIntro);
      });

      // Smooth subtle camera parallax
      camera.position.x += (mouseNDC.x * 0.45 - camera.position.x) * 0.04;
      camera.position.y += (mouseNDC.y * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        // Pastel sunset gradient matching the reference image: soft lavender-blue to warm pastel blush pink
        background: 'linear-gradient(135deg, #c5d6f8 0%, #d8d3f8 35%, #f2d8e8 70%, #fbd5d7 100%)',
        overflow: 'hidden',
        opacity: hasAppeared ? 1 : 0,
        transition: 'opacity 1.2s ease-out',
      }}
    >
      {/* 3D Canvas Container - smooth fade in and subtle scale bloom */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          opacity: hasAppeared ? 1 : 0,
          transform: hasAppeared ? 'scale(1)' : 'scale(0.94)',
          transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Floating Header - staggered poetic slide down and fade in */}
      <div
        style={{
          position: 'absolute',
          top: '3.5rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 20,
          padding: '0 1.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.32em',
            fontSize: '0.82rem',
            color: '#705868',
            textTransform: 'uppercase',
            margin: '0 0 0.5rem',
            opacity: hasAppeared ? 0.9 : 0,
            transform: hasAppeared ? 'translateY(0)' : 'translateY(-14px)',
            transition: 'opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          Our Favorite Memories
        </p>
        <h2
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.4rem, 2.4vw, 1.95rem)',
            fontWeight: 400,
            color: '#1a0a08',
            margin: 0,
            letterSpacing: '0.02em',
            opacity: hasAppeared ? 1 : 0,
            transform: hasAppeared ? 'translateY(0)' : 'translateY(-18px)',
            transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.65s, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.65s',
          }}
        >
          Holding onto every little moment.
        </h2>
      </div>

      {/* Bottom Press-and-Hold UI (Hold for 2 seconds to unlock letter) & Continue Actions */}
      <div
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 30,
          opacity: hasAppeared ? 1 : 0,
          transform: hasAppeared ? 'translateY(0)' : 'translateY(22px)',
          transition: 'opacity 1.3s ease 1.15s, transform 1.3s cubic-bezier(0.16, 1, 0.3, 1) 1.15s',
          pointerEvents: showLetter ? 'none' : 'auto',
        }}
      >
        {!hasUnlockedLetter ? (
          // Press & Hold 2s Trigger
          <div
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            onTouchCancel={handleHoldEnd}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              position: 'relative',
              width: '315px',
              height: '56px',
              borderRadius: '28px',
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(155, 58, 74, 0.45)',
              boxShadow: isHolding
                ? '0 12px 36px rgba(155, 58, 74, 0.45), 0 0 24px rgba(255, 36, 96, 0.35)'
                : '0 8px 28px rgba(155, 58, 74, 0.2)',
              cursor: 'pointer',
              overflow: 'hidden',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'none',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
              transform: isHolding ? 'scale(1.035)' : 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Smooth progress bar fill */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${holdProgress * 100}%`,
                background: 'linear-gradient(90deg, rgba(155, 58, 74, 0.92) 0%, rgba(224, 76, 110, 0.96) 100%)',
                transition: isHolding ? 'none' : 'width 0.25s ease-out',
                pointerEvents: 'none',
              }}
            />

            {/* Inner Content */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                color: holdProgress > 0.45 ? '#ffffff' : '#7a2030',
                transition: 'color 0.2s ease',
                pointerEvents: 'none',
              }}
            >
              {/* Circular progress SVG */}
              <div style={{ position: 'relative', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="30" height="30" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={holdProgress > 0.45 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(155, 58, 74, 0.2)'}
                    strokeWidth="2.8"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={holdProgress > 0.45 ? '#ffffff' : '#9b3a4a'}
                    strokeWidth="2.8"
                    strokeDasharray="94.2"
                    strokeDashoffset={94.2 * (1 - holdProgress)}
                    strokeLinecap="round"
                    style={{ transition: isHolding ? 'none' : 'stroke-dashoffset 0.25s ease-out' }}
                  />
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    fontSize: '0.85rem',
                    animation: isHolding ? 'heartBeat 0.6s infinite' : 'none',
                  }}
                >
                  {isHolding ? '❤️' : '💌'}
                </span>
              </div>

              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isHolding ? 'Holding...' : 'Press & Hold'}
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: '0.82rem',
                    opacity: 0.88,
                  }}
                >
                  {isHolding ? `${Math.round(holdProgress * 100)}%` : 'hold for 2 seconds'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Unlocked state: allows re-reading the letter or continuing forward
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowLetter(true)}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#7a2030',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1.5px solid rgba(155, 58, 74, 0.4)',
                padding: '0.85rem 2rem',
                cursor: 'pointer',
                borderRadius: '24px',
                boxShadow: '0 6px 20px rgba(155, 58, 74, 0.16)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(155, 58, 74, 0.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 58, 74, 0.16)';
              }}
            >
              <span>💌</span> Re-read Letter
            </button>

            {onContinue && (
              <button
                onClick={onContinue}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'var(--rose, #9b3a4a)',
                  border: '1px solid var(--rose, #9b3a4a)',
                  padding: '0.85rem 2.2rem',
                  cursor: 'pointer',
                  borderRadius: '24px',
                  boxShadow: '0 6px 24px rgba(155, 58, 74, 0.32)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#b84758';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(155, 58, 74, 0.48)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--rose, #9b3a4a)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(155, 58, 74, 0.32)';
                }}
              >
                Continue &rarr;
              </button>
            )}
          </div>
        )}
      </div>

      {/* Letter Modal (appears when held for 2 seconds) */}
      {showLetter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100010,
            background: 'rgba(15, 6, 12, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.2rem',
            animation: 'fadeIn 0.35s ease forwards',
          }}
          onClick={(e) => {
            // Modal can only be continued via the Continue button
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(180deg, #fffdfa 0%, #faf5ec 45%, #f5eee2 100%)',
              border: '1px solid #dfcfbe',
              outline: '1px solid rgba(184, 146, 58, 0.35)',
              outlineOffset: '-8px',
              borderRadius: '8px',
              boxShadow: '0 28px 75px rgba(26, 7, 14, 0.45), 0 6px 20px rgba(0, 0, 0, 0.15)',
              padding: '2.5rem 2.4rem 2rem',
              boxSizing: 'border-box',
              animation: 'modalPop 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Letter Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.2rem', position: 'relative' }}>
              {/* Wax Seal */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  margin: '0 auto 0.75rem',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #e04c66 0%, #9b283d 60%, #681524 100%)',
                  boxShadow: '0 6px 18px rgba(104, 21, 36, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
                  ❤️
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.66rem',
                  letterSpacing: '0.36em',
                  textTransform: 'uppercase',
                  color: 'var(--gold, #b8923a)',
                  margin: '0 0 0.5rem',
                  opacity: 0.95,
                }}
              >
                &#10038; &nbsp; a letter for you &nbsp; &#10038;
              </p>

              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.45rem, 2.4vw, 1.85rem)',
                  color: 'var(--rose, #9b3a4a)',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                When You Said Yes
              </h3>
            </div>

            {/* Letter Body */}
            <div
              className="custom-letter-scrollbar"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
                lineHeight: 1.9,
                color: '#2a1a1e',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maxHeight: 'calc(88vh - 300px)',
                paddingRight: '0.75rem',
                margin: '0.4rem 0 1.2rem',
                textAlign: 'left',
              }}
            >
              <p style={{ marginBottom: '1.1rem', fontWeight: 600, fontSize: '1.25rem', color: 'var(--rose, #9b3a4a)' }}>
                Five months.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                That's how long you let me wait before finally giving me the answer I had been hoping for.
              </p>
              <p style={{ marginBottom: '0.6rem' }}>
                And I still remember how you started your message:
              </p>
              <p
                style={{
                  marginBottom: '1.2rem',
                  fontStyle: 'italic',
                  color: 'var(--rose, #9b3a4a)',
                  paddingLeft: '1rem',
                  borderLeft: '2px solid var(--rose, #9b3a4a)',
                  fontSize: '1.15rem',
                }}
              >
                “It’s been five months bebot...”
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                I don't think you knew how many times I reread everything you wrote that day. I was happy, nervous, emotional, and honestly a little overwhelmed because suddenly, after all that waiting, the girl I had been hoping for was finally telling me that she wanted to give us a chance.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                You told me you were still scared. You weren't completely sure what the future would look like. You had your own fears, your own doubts, and things from the past that made it difficult to trust completely.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                But despite all of that, you still chose to say <strong style={{ color: 'var(--rose, #9b3a4a)', fontWeight: 700 }}>yes</strong>.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                Not because you were completely sure about everything.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                You said yes because you wanted to find out what our story could become.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                And I think that's one of the things I'll always be grateful for.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                I told you then that I wouldn't rush you, that we could take things slowly, learn together, and that I would show you every day why you said yes to me.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                Looking back now, I realize how big that promise actually was.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                Because being your boyfriend isn't just about the happy days, the dates, the jokes, or the sweet messages. It's also about learning you—your fears, your boundaries, your moods, the things that hurt you, the things that make you feel safe, and even the little things you don't always say.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                You once told me that one of your fears was getting too attached and then suddenly having the person you trusted change or become distant.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                And you told me you didn't need a long list of boundaries because you trusted me to know what was right and wrong.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                I don't take that trust lightly.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                You gave me a chance even though you were scared of getting hurt again.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                And I gave you my word that I'd take care of that chance.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                We've already had so many little moments since then—some sweet, some stupid, some unexpected, and some that neither of us probably imagined would happen when we first started this.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                But they're ours now.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                And that's what I love about our story.
              </p>
              <p style={{ marginBottom: '1.1rem' }}>
                We didn't know exactly where it would go.
              </p>
              <p style={{ marginBottom: '1.3rem' }}>
                We just decided to go there together.
              </p>

              <div style={{ margin: '1.2rem 0', paddingLeft: '0.5rem' }}>
                <p style={{ marginBottom: '0.45rem' }}>So, thank you, Kikay.</p>
                <p style={{ marginBottom: '0.45rem' }}>Thank you for saying yes.</p>
                <p style={{ marginBottom: '0.45rem' }}>Thank you for trusting me.</p>
                <p style={{ marginBottom: '0.45rem' }}>Thank you for letting me become your boyfriend.</p>
                <p style={{ marginBottom: '0.8rem' }}>And thank you for letting me be part of your life.</p>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  marginBottom: '0.5rem',
                  padding: '1rem 1.2rem',
                  background: 'rgba(155, 58, 74, 0.05)',
                  border: '1px dashed rgba(155, 58, 74, 0.3)',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                    lineHeight: 1.7,
                    color: 'var(--rose, #9b3a4a)',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  I still choose you, lovelove. And I still want to see where our story takes us. ❤️
                </p>
              </div>
            </div>

            {/* Letter Actions Footer - Continue button only */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '0.9rem',
                borderTop: '1px solid rgba(184, 146, 58, 0.22)',
              }}
            >
              <button
                onClick={handleLetterContinue}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'var(--rose, #9b3a4a)',
                  border: '1px solid var(--rose, #9b3a4a)',
                  padding: '0.85rem 2.4rem',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  boxShadow: '0 6px 20px rgba(155, 58, 74, 0.32)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#b84758';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(155, 58, 74, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--rose, #9b3a4a)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 58, 74, 0.32)';
                }}
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seamless White Screen Overlay: stays permanently mounted once transition begins */}
      {stage !== 'heart' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100020,
            background: '#ffffff',
            animation: stage === 'whiteFade' ? 'fadeToWhite 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards' : undefined,
            opacity: stage === 'whiteFade' ? undefined : 1,
            pointerEvents: 'auto',
          }}
        />
      )}

      {/* Stage: Reflection Scene with Falling Photos and Letter */}
      {stage === 'reflection' && (
        <ReflectionScene
          fallingPhotos={fallingPhotos}
          onContinue={onContinue}
        />
      )}

      <style>{`
        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.22); }
        }
        @keyframes fadeToWhite {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fallPhotoDown {
          0% { transform: translateY(-260px); }
          100% { transform: translateY(calc(100vh + 260px)); }
        }
        @keyframes reflectionCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .reflection-cursor {
          display: inline-block;
          margin-left: 2px;
          color: var(--rose, #9b3a4a);
          font-weight: 300;
          animation: reflectionCursorBlink 0.9s infinite;
        }
        .custom-letter-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .custom-letter-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        @media (max-width: 860px) {
          .reflection-center-column {
            padding: 1.5rem 1.2rem 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const REFLECTION_SECTION_ONE = [
  {
    type: 'title',
    text: "But Not Everything Was Flowers and Butterflies...",
  },
  {
    type: 'p',
    text: "As much as I love looking back at all those happy memories, I know that being together hasn't always been sunshine and rainbows.",
  },
  {
    type: 'p',
    text: "We've had our sweet moments, random adventures, and little things that made me happy to be your boyfriend. But there were also times when I fell short, times when I didn't realize that some of my actions—or the things I failed to do—were hurting you.",
  },
  {
    type: 'p',
    text: "I know that loving someone isn't just about enjoying the good days. It's also about recognizing when you've made them feel otherwise, being honest with yourself, and understanding what you could have done better.",
  },
  {
    type: 'p',
    text: "And recently, there was something that made me realize I still have a lot to learn, especially when it comes to being your boyfriend.",
  },
  {
    type: 'p',
    text: "So, lovelove, there's something I want to talk about.",
  },
  {
    type: 'p',
    text: "Not to ruin the happy memories we've just looked back on, but because this is part of our story, too.",
  },
  {
    type: 'p',
    text: "And I don't want to leave it unacknowledged. ❤️",
    isHighlight: true,
  },
];

const REFLECTION_SECTION_TWO = [
  {
    type: 'title',
    text: "Something I Need to Say",
  },
  {
    type: 'p',
    text: "I'm sorry, lovelove.",
    isAccent: true,
  },
  {
    type: 'p',
    text: "I've been thinking about what happened and everything you told me that night, and I understand better now why you felt disappointed in me.",
  },
  {
    type: 'p',
    text: "I got so caught up with school, the things happening with my family, and everything going on in my head that I didn't pay enough attention to what was happening between us.",
  },
  {
    type: 'p',
    text: "I noticed that you had become quieter and that your replies weren't like they usually were. But instead of simply asking you what was wrong, I kept waiting for the right moment because I didn't want to pressure you.",
  },
  {
    type: 'p',
    text: "I thought I was giving you space, but I didn't realize that, from your side, it probably felt like I was just acting as if nothing had happened.",
  },
  {
    type: 'p',
    text: "And I understand why that hurt you.",
  },
  {
    type: 'p',
    text: "You weren't asking me to talk to you every minute or to make you the center of my entire day. You just wanted me to notice, to ask, and to show that I cared enough to do something instead of waiting for you to bring it up yourself.",
  },
  {
    type: 'p',
    text: "I think that's what hit me the most.",
  },
  {
    type: 'p',
    text: "I was so focused on not doing the wrong thing that I ended up not doing anything at all.",
  },
  {
    type: 'p',
    text: "And when you called me a “waiting shed,” I finally understood what you meant. I was waiting for the right moment, waiting for you to open up, and waiting for a signal when I could have simply reached out to you.",
  },
  {
    type: 'p',
    text: "I'm sorry I made you feel that way.",
  },
  {
    type: 'p',
    text: "I also realized that even after all the time we've spent together, I still have a lot to learn about you. I know your favorite things, the things that make you happy, and the little details I've come to love about you. But there's still so much more to understanding you than that.",
  },
  {
    type: 'p',
    text: "Sometimes, it's about noticing when something feels different. Sometimes, it's about asking instead of assuming. And sometimes, it's about realizing that the way I intend something isn't always the way you experience it.",
  },
  {
    type: 'p',
    text: "I'm still learning those things, and I know I won't always get everything right. But I don't want to use that as a reason to stop trying to understand you better.",
  },
  {
    type: 'p',
    text: "I want to be more aware of how I treat you, especially during the times when life gets busy or when I'm dealing with my own problems. I don't want those things to make you feel like you've been pushed aside or that you're the only one trying to keep us connected.",
  },
  {
    type: 'p',
    text: "And lovelove, I hope you know that you don't have to hide how you feel just to avoid upsetting me. I would rather understand what hurt you than have you keep it to yourself. I may not always understand things immediately, but I want to listen and learn instead of becoming defensive or assuming I already know.",
  },
  {
    type: 'p',
    text: "I'm not writing this because I think one letter can make everything okay. I know that what matters more is how I treat you after this, in the little things and in the moments when it's easier to overlook them.",
  },
  {
    type: 'p',
    text: "I just wanted to acknowledge where I fell short, because you matter to me, and so does how you feel in this relationship.",
  },
  {
    type: 'p',
    text: "Thank you for being honest with me, even when you were upset. I know hearing those things wasn't easy for either of us, but it made me reflect on things I hadn't fully understood before.",
  },
  {
    type: 'p',
    text: "I'm sorry, lovelove. Not just because we had an argument, but because my actions made you feel disappointed in someone you trusted to care for you.",
  },
  {
    type: 'p',
    text: "I love you, and I'm glad we're learning about each other—even the parts that aren't always easy. ❤️",
    isHighlight: true,
  },
];

function ReflectionScene({ fallingPhotos, onContinue }) {
  const [sectionIndex, setSectionIndex] = useState(0); // 0 = flowers & butterflies, 1 = something I need to say
  const [itemIndex, setItemIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isFadingTransition, setIsFadingTransition] = useState(false);
  const [isExitingToMonthsary, setIsExitingToMonthsary] = useState(false);
  const letterContainerRef = useRef(null);

  const currentItems = sectionIndex === 0 ? REFLECTION_SECTION_ONE : REFLECTION_SECTION_TWO;

  // Typewriter effect
  useEffect(() => {
    if (isDone || isFadingTransition || isExitingToMonthsary) return;
    const currentItem = currentItems[itemIndex];
    if (!currentItem) {
      setIsDone(true);
      return;
    }

    if (charCount < currentItem.text.length) {
      const timer = setTimeout(() => {
        setCharCount((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timer);
    } else {
      // Completed current line
      if (itemIndex < currentItems.length - 1) {
        const pause = currentItem.type === 'title' ? 600 : 360;
        const timer = setTimeout(() => {
          setItemIndex((prev) => prev + 1);
          setCharCount(0);
        }, pause);
        return () => clearTimeout(timer);
      } else {
        setIsDone(true);
      }
    }
  }, [itemIndex, charCount, isDone, isFadingTransition, isExitingToMonthsary, currentItems]);

  // Auto-scroll as text types
  useEffect(() => {
    if (letterContainerRef.current && !isDone) {
      letterContainerRef.current.scrollTo({
        top: letterContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [itemIndex, charCount, isDone]);

  function handleSkip() {
    if (!isDone) {
      setItemIndex(currentItems.length - 1);
      setCharCount(currentItems[currentItems.length - 1].text.length);
      setIsDone(true);
    }
  }

  function handleSectionContinue() {
    if (sectionIndex === 0) {
      setIsFadingTransition(true);
      setTimeout(() => {
        setSectionIndex(1);
        setItemIndex(0);
        setCharCount(0);
        setIsDone(false);
        if (letterContainerRef.current) {
          letterContainerRef.current.scrollTop = 0;
        }
        setIsFadingTransition(false);
      }, 380);
    } else {
      if (isExitingToMonthsary) return;
      setIsExitingToMonthsary(true);
      setTimeout(() => {
        onContinue?.();
      }, 750);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100020,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: 'fadeIn 0.9s ease forwards',
      }}
    >
      {/* Falling background photos: Strictly left & right flanks */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {fallingPhotos.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              [item.side]: `${item.x}%`,
              top: 0,
              width: `${item.width}px`,
              height: `${item.height}px`,
              zIndex: item.isBlurred ? 1 : 2,
              animation: `fallPhotoDown ${item.duration}s linear infinite`,
              animationDelay: `${item.delay}s`,
              willChange: 'transform',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                padding: item.isBlurred ? '3px 3px 12px' : '5px 5px 18px',
                background: '#ffffff',
                borderRadius: '4px',
                boxShadow: item.isBlurred
                  ? '0 4px 12px rgba(0,0,0,0.04)'
                  : '0 12px 28px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.04)',
                transform: `rotate(${item.rot}deg)`,
                filter: item.isBlurred ? `blur(${item.blurAmount}px)` : 'none',
                opacity: item.opacity,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <img
                src={item.src}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '2px',
                  display: 'block',
                }}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Centered Letter - Protected middle column with subtle white glow */}
      <div
        ref={letterContainerRef}
        onClick={handleSkip}
        className="custom-letter-scrollbar reflection-center-column"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '2.5rem 2.8rem 3rem',
          boxSizing: 'border-box',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 0 60px 40px #ffffff',
          borderRadius: '8px',
          cursor: isDone ? 'default' : 'pointer',
          opacity: isFadingTransition || isExitingToMonthsary ? 0 : 1,
          transition: 'opacity 0.45s ease',
        }}
        title={isDone ? undefined : 'Click to finish typing'}
      >
        {currentItems.map((item, idx) => {
          if (idx > itemIndex) return null;
          const isCurrent = idx === itemIndex && !isDone;
          const textToShow =
            idx < itemIndex || isDone
              ? item.text
              : item.text.slice(0, charCount);

          if (item.type === 'title') {
            return (
              <h2
                key={`${sectionIndex}-title-${idx}`}
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.4rem, 2.6vw, 1.95rem)',
                  fontWeight: 600,
                  color: '#2a141b',
                  margin: '0 0 2rem 0',
                  lineHeight: 1.38,
                  textAlign: 'center',
                  paddingBottom: '1.2rem',
                  borderBottom: '1px solid rgba(155, 58, 74, 0.16)',
                }}
              >
                {textToShow}
                {isCurrent && <span className="reflection-cursor">|</span>}
              </h2>
            );
          }

          return (
            <p
              key={`${sectionIndex}-p-${idx}`}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: item.isAccent ? 'clamp(1.15rem, 2.1vw, 1.35rem)' : 'clamp(1.1rem, 2vw, 1.3rem)',
                lineHeight: 1.88,
                color: item.isHighlight || item.isAccent ? 'var(--rose, #9b3a4a)' : '#2b1c21',
                fontWeight: item.isHighlight || item.isAccent ? 600 : 400,
                fontStyle: item.isHighlight || item.isAccent ? 'italic' : 'normal',
                margin: '0 0 1.25rem 0',
                textAlign: 'left',
              }}
            >
              {textToShow}
              {isCurrent && <span className="reflection-cursor">|</span>}
            </p>
          );
        })}

        {/* Continue Button once typing completes */}
        {isDone && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2.5rem',
              paddingTop: '1rem',
              animation: 'modalPop 0.5s ease forwards',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSectionContinue();
              }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--rose, #9b3a4a)',
                border: '1px solid var(--rose, #9b3a4a)',
                padding: '0.85rem 2.4rem',
                cursor: 'pointer',
                borderRadius: '2px',
                boxShadow: '0 8px 24px rgba(155, 58, 74, 0.35)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b84758';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(155, 58, 74, 0.48)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--rose, #9b3a4a)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(155, 58, 74, 0.35)';
              }}
            >
              Continue &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Seamless crossfade overlay to Monthsary scrapbook theme */}
      {isExitingToMonthsary && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            background: 'radial-gradient(circle at 45% 35%, #2a1620 0%, #170912 60%, #0a0308 100%)',
            animation: 'fadeIn 0.72s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            pointerEvents: 'all',
          }}
        />
      )}
    </div>
  );
}
