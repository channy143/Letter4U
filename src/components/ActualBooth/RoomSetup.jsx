import React, { useState } from 'react';

const btnStyle = {
  fontFamily: "'Cinzel', serif",
  fontSize: '0.65rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#9b3a4a',
  background: 'transparent',
  border: '1px solid #9b3a4a',
  padding: '0.75rem 2rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const inputStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '1.1rem',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(184,146,58,0.4)',
  color: '#1a0a08',
  padding: '0.5rem 0.2rem',
  outline: 'none',
  textAlign: 'center',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  width: '180px',
};

export default function RoomSetup({ onCreateRoom, onJoinRoom, error, serverStatus }) {
  const [mode, setMode] = useState(null);
  const [roomId, setRoomId] = useState('');

  function handleJoin() {
    if (roomId.trim().length < 4) return;
    onJoinRoom(roomId.trim().toUpperCase());
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.6rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#b8923a',
          marginBottom: '1rem',
        }}
      >
        &#10038; &nbsp; online photo booth &nbsp; &#10038;
      </p>

      <h1
        style={{
          fontFamily: "'Libre Baskerville', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 400,
          color: '#1a0a08',
          lineHeight: 1.3,
          marginBottom: '0.8rem',
        }}
      >
        Take Photos<br />Together
      </h1>

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '1rem',
          color: '#7a6a64',
          maxWidth: '380px',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
        }}
      >
        Connect with someone special and capture moments together in real time.
      </p>

      {serverStatus === 'disconnected' && (
        <p style={{ color: '#9b3a4a', fontStyle: 'italic', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Connecting to server...
        </p>
      )}

      {!mode && serverStatus === 'connected' && (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('create')}
            style={btnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#9b3a4a';
              e.currentTarget.style.color = '#f5ede0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#9b3a4a';
            }}
          >
            Create a Room
          </button>
          <button
            onClick={() => setMode('join')}
            style={btnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#9b3a4a';
              e.currentTarget.style.color = '#f5ede0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#9b3a4a';
            }}
          >
            Join a Room
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div
          style={{
            animation: 'fadeUp 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#7a6a64', fontSize: '0.95rem' }}>
            A unique room code will be generated. Share it with your partner.
          </p>
          <button
            onClick={onCreateRoom}
            style={btnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#9b3a4a';
              e.currentTarget.style.color = '#f5ede0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#9b3a4a';
            }}
          >
            Generate Room Code
          </button>
          <button
            onClick={() => setMode(null)}
            style={{
              ...btnStyle,
              borderColor: 'rgba(26,10,8,0.2)',
              color: '#7a6a64',
              fontSize: '0.55rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#9b3a4a';
              e.currentTarget.style.borderColor = '#9b3a4a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#7a6a64';
              e.currentTarget.style.borderColor = 'rgba(26,10,8,0.2)';
            }}
          >
            Back
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div
          style={{
            animation: 'fadeUp 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem',
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#7a6a64', fontSize: '0.95rem' }}>
            Enter the 6-character room code shared with you.
          </p>
          <input
            type="text"
            placeholder="ROOM CODE"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            style={inputStyle}
            maxLength={6}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = '#9b3a4a';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = 'rgba(184,146,58,0.4)';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJoin();
            }}
          />
          <button
            onClick={handleJoin}
            disabled={roomId.trim().length < 4}
            style={{
              ...btnStyle,
              opacity: roomId.trim().length < 4 ? 0.4 : 1,
              pointerEvents: roomId.trim().length < 4 ? 'none' : 'auto',
            }}
            onMouseEnter={(e) => {
              if (roomId.trim().length >= 4) {
                e.currentTarget.style.background = '#9b3a4a';
                e.currentTarget.style.color = '#f5ede0';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#9b3a4a';
            }}
          >
            Join Room
          </button>
          <button
            onClick={() => setMode(null)}
            style={{
              ...btnStyle,
              borderColor: 'rgba(26,10,8,0.2)',
              color: '#7a6a64',
              fontSize: '0.55rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#9b3a4a';
              e.currentTarget.style.borderColor = '#9b3a4a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#7a6a64';
              e.currentTarget.style.borderColor = 'rgba(26,10,8,0.2)';
            }}
          >
            Back
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '1.5rem',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            color: '#9b3a4a',
            fontSize: '0.9rem',
            animation: 'fadeIn 0.3s ease',
            background: 'rgba(155,58,74,0.08)',
            padding: '0.7rem 1.2rem',
            borderRadius: '8px',
            maxWidth: '320px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
