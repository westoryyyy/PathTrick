'use client';

import { useBGMStore } from '@/store/useBGMStore';

export default function BGMPlayer() {
  const { isPlaying, toggle } = useBGMStore();

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={toggle}
        style={{
          background: isPlaying ? '#10b981' : '#b91c1c',
          border: `3px solid ${isPlaying ? '#064e3b' : '#450a0a'}`,
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontFamily: '"Press Start 2P"',
          fontSize: '0.6rem',
          color: '#fff',
          boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), 3px 3px 0 rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.1s'
        }}
        title={isPlaying ? 'Mute Music' : 'Play Music'}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translate(2px, 2px)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'inset -2px -2px 0 rgba(0,0,0,0.3), 3px 3px 0 rgba(0,0,0,0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'inset -2px -2px 0 rgba(0,0,0,0.3), 3px 3px 0 rgba(0,0,0,0.6)';
        }}
      >
        <span>{isPlaying ? '🔊 MUSIC' : '🔇 MUTED'}</span>
      </button>
    </div>
  );
}
