import React from 'react';

export function TopRoller() {
  return (
    <div
      style={{
        width: '100%',
        height: '38px',
        background:
          'linear-gradient(180deg, #8a6a4a 0%, #b08858 20%, #d4a87a 50%, #b08858 80%, #8a6a4a 100%)',
        borderRadius: '19px 19px 4px 4px',
        border: '1px solid #6a4a2a',
        borderBottom: 'none',
        position: 'relative',
        zIndex: 5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-10px',
          top: '50%',
          marginTop: '-13px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d4a87a, #8a6a4a 80%)',
          border: '2px solid #6a4a2a',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '-10px',
          top: '50%',
          marginTop: '-13px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d4a87a, #8a6a4a 80%)',
          border: '2px solid #6a4a2a',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}

export function BottomRoller() {
  return (
    <div
      style={{
        width: '100%',
        height: '38px',
        background:
          'linear-gradient(0deg, #8a6a4a 0%, #b08858 20%, #d4a87a 50%, #b08858 80%, #8a6a4a 100%)',
        borderRadius: '4px 4px 19px 19px',
        border: '1px solid #6a4a2a',
        borderTop: 'none',
        position: 'relative',
        zIndex: 5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-10px',
          top: '50%',
          marginTop: '-13px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d4a87a, #8a6a4a 80%)',
          border: '2px solid #6a4a2a',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '-10px',
          top: '50%',
          marginTop: '-13px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d4a87a, #8a6a4a 80%)',
          border: '2px solid #6a4a2a',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}
