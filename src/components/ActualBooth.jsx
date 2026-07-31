import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import RoomSetup from './ActualBooth/RoomSetup';
import BoothStage from './ActualBooth/BoothStage';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://letter4u-production.up.railway.app';

const initialRoomState = {
  round: 1,
  status: 'active',
  creator: { preview: null, confirmed: false },
  joiner: { preview: null, confirmed: false },
  strip: [],
};

export default function ActualBooth({ onClose }) {
  const [phase, setPhase] = useState('setup');
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('disconnected');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [showRoomCode, setShowRoomCode] = useState(false);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [roomState, setRoomState] = useState(initialRoomState);

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const roomIdRef = useRef(null);

  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch {
      return null;
    }
  }, []);

  function setupSocketHandlers(socket) {
    const handlers = {
      room_created: ({ roomId: rid, participants: parts }) => {
        setRoomId(rid);
        roomIdRef.current = rid;
        setIsCreator(true);
        setParticipants(parts.map((p) => (p.id === socket.id ? { ...p, id: 'me' } : p)));
        setShowRoomCode(true);
        startCamera();
      },

      room_joined: ({ roomId: rid, participants: parts }) => {
        setRoomId(rid);
        roomIdRef.current = rid;
        setIsCreator(false);
        setParticipants(parts.map((p) => (p.id === socket.id ? { ...p, id: 'me' } : p)));
        setShowRoomCode(true);
        startCamera();
      },

      room_state: (state) => {
        setRoomState(state);
      },

      participant_joined: ({ participants: parts }) => {
        setParticipants(parts.map((p) => (p.id === socket.id ? { ...p, id: 'me' } : p)));
        if (parts.length === 2) {
          setPartnerJoined(true);
        }
      },

      signal: ({ from, signal }) => {
        if (!peerRef.current) {
          const p = new Peer({ initiator: false, trickle: false, stream: streamRef.current });
          peerRef.current = p;
          p.on('signal', (sig) => {
            socket.emit('signal', { to: from, signal: sig });
          });
          p.on('stream', (s) => setRemoteStream(s));
          p.on('error', () => {});
        }
        peerRef.current.signal(signal);
      },

      participant_disconnected: () => {
        setError('Your partner has disconnected.');
        setParticipants((prev) => prev.filter((p) => p.id === 'me'));
        if (peerRef.current) {
          peerRef.current.destroy();
          peerRef.current = null;
        }
        setRemoteStream(null);
      },

      room_closed: () => {
        setError('The room has been closed.');
      },

      photos_started: () => {
        setPhase('lobby');
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
  }

  function connectSocket() {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    socket.on('connect', () => setServerStatus('connected'));
    socket.on('disconnect', (reason) => {
      setServerStatus('disconnected');
      if (reason === 'io server disconnect') {
        setError('Disconnected from server. Please try again.');
      } else if (reason === 'transport close' || reason === 'transport error') {
        setError('Cannot reach the photo booth server. Make sure the server is running on port 3001.');
      }
    });
    socket.on('connect_error', () => {
      setServerStatus('disconnected');
      setError('Cannot reach the photo booth server. Run "cd server && npm start" in the terminal.');
    });
    socket.on('error', ({ message }) => setError(message));

    setupSocketHandlers(socket);
    socketRef.current = socket;
  }

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (participants.length === 2 && localStream && !peerRef.current && isCreator) {
      const partner = participants.find((p) => p.id !== 'me');
      if (!partner) return;
      const partnerId = partner.id;

      const p = new Peer({ initiator: true, trickle: false, stream: localStream });
      peerRef.current = p;

      p.on('signal', (signal) => {
        socketRef.current?.emit('signal', { to: partnerId, signal });
      });
      p.on('stream', (s) => setRemoteStream(s));
      p.on('error', () => {});
    }
  }, [participants.length, localStream, isCreator]);

  useEffect(() => {
    if (!localStream || !peerRef.current) return;
    try {
      peerRef.current.addStream(localStream);
    } catch {}
  }, [localStream]);

  function createRoom() {
    setError(null);
    socketRef.current?.emit('create_room');
  }

  function joinRoom(rid) {
    setError(null);
    socketRef.current?.emit('join_room', { roomId: rid });
  }

  function handleClose() {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    onClose?.();
  }

  function handleStartTakingPhotos() {
    if (isCreator && roomIdRef.current) {
      socketRef.current?.emit('start_photos', { roomId: roomIdRef.current });
    }
    setShowRoomCode(false);
    setPhase('lobby');
  }

  function applyMySlot(updater) {
    setRoomState((prev) => {
      if (isCreator) {
        return { ...prev, creator: { ...updater(prev.creator) } };
      }
      return { ...prev, joiner: { ...updater(prev.joiner) } };
    });
  }

  function handleTakePhoto(photoData) {
    if (!roomIdRef.current) return;
    applyMySlot((slot) => ({ ...slot, preview: photoData, confirmed: false }));
    socketRef.current?.emit('set_preview', { roomId: roomIdRef.current, preview: photoData });
  }

  function handleRetakePhoto() {
    if (!roomIdRef.current) return;
    applyMySlot(() => ({ preview: null, confirmed: false }));
    socketRef.current?.emit('retake_photo', { roomId: roomIdRef.current });
  }

  function handleCheckPhoto() {
    if (!roomIdRef.current) return;
    const mySlot = isCreator ? roomState.creator : roomState.joiner;
    if (!mySlot.preview || mySlot.confirmed) return;
    applyMySlot((slot) => ({ ...slot, confirmed: true }));
    socketRef.current?.emit('check_photo', { roomId: roomIdRef.current });
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#fdf6ed',
        overflow: 'auto',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {phase === 'setup' && !showRoomCode && (
        <>
          <button
            onClick={handleClose}
            style={{
              position: 'fixed', top: '1.2rem', right: '1.5rem', zIndex: 10,
              fontFamily: "'Cinzel', serif", fontSize: '1.2rem',
              color: '#7a6a64', background: 'none', border: 'none',
              cursor: 'pointer', opacity: 0.4, transition: 'opacity 0.3s ease', lineHeight: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.color = '#9b3a4a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = '#7a6a64'; }}
          >
            &#10005;
          </button>
          <RoomSetup onCreateRoom={createRoom} onJoinRoom={joinRoom} error={error} serverStatus={serverStatus} />
        </>
      )}

      {phase === 'setup' && showRoomCode && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem', textAlign: 'center' }}>
          <button
            onClick={handleClose}
            style={{
              position: 'fixed', top: '1.2rem', right: '1.5rem', zIndex: 10,
              fontFamily: "'Cinzel', serif", fontSize: '1.2rem',
              color: '#7a6a64', background: 'none', border: 'none',
              cursor: 'pointer', opacity: 0.4, transition: 'opacity 0.3s ease', lineHeight: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.color = '#9b3a4a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = '#7a6a64'; }}
          >
            &#10005;
          </button>

          <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b8923a', marginBottom: '1rem' }}>
            &#10038; &nbsp; a room awaits &nbsp; &#10038;
          </p>

          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: '#1a0a08', marginBottom: '0.5rem' }}>
            {isCreator ? 'Room Created' : 'Connected'}
          </h1>

          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.95rem', color: '#7a6a64', marginBottom: '1.5rem' }}>
            {isCreator ? 'Share this code with your partner.' : 'You have joined the room.'}
          </p>

          <div style={{ display: 'inline-block', padding: '1rem 3rem', background: '#f5ede0', borderRadius: '12px', border: '2px solid var(--rose)', marginBottom: '2rem' }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', letterSpacing: '0.5em', color: 'var(--rose)', fontWeight: 600 }}>
              {roomId}
            </span>
          </div>

          {!partnerJoined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <img src="/moments/cat4.gif" alt="" style={{ width: '160px', height: 'auto', borderRadius: '12px' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#7a6a64', animation: 'flicker 1.5s ease-in-out infinite' }}>
                Waiting for partner to join...
              </p>
            </div>
          )}

          {partnerJoined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <img src="/moments/cat5.gif" alt="" style={{ width: '160px', height: 'auto', borderRadius: '12px' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', color: '#4caf50' }}>
                &#10003; Partner has joined!
              </p>
              <button
                onClick={handleStartTakingPhotos}
                style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: '#fff', background: 'var(--rose)', border: 'none',
                  padding: '0.9rem 2.5rem', cursor: 'pointer', borderRadius: '8px',
                  marginTop: '0.5rem', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(155,58,74,0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#b44a5a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--rose)'; e.currentTarget.style.transform = 'none'; }}
              >
                {isCreator ? 'Start Taking Photos  \u2192' : 'Enter Booth  \u2192'}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'lobby' && (
        <BoothStage
          isCreator={isCreator}
          roomId={roomId}
          localStream={localStream}
          remoteStream={remoteStream}
          roomState={roomState}
          onTakePhoto={handleTakePhoto}
          onRetake={handleRetakePhoto}
          onCheck={handleCheckPhoto}
          onLeave={handleClose}
        />
      )}
    </div>
  );
}
