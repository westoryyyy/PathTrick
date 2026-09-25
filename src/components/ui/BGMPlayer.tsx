'use client';

import { useBGMStore } from '@/store/useBGMStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function BGMPlayer() {
  const { isPlaying, toggle } = useBGMStore();
  const [mounted, setMounted] = useState(false);
  const [iconOn, setIconOn] = useState<string>('/music_on.jpg');
  const [iconOff, setIconOff] = useState<string>('/music_off.jpg');
  const [processed, setProcessed] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (e) { }
  };

  useEffect(() => {
    setMounted(true);

    const removeBg = (src: string, setter: (val: string) => void): Promise<void> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve();
            return;
          }
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imageData, 0, 0);
          setter(canvas.toDataURL('image/png'));
          resolve();
        };
        img.src = src;
      });
    };

    Promise.all([
      removeBg('/music_on.jpg', setIconOn),
      removeBg('/music_off.jpg', setIconOff)
    ]).then(() => {
      setProcessed(true);
    });
  }, []);

  if (!mounted) return (
    <div style={{ width: '48px', height: '48px' }} />
  );

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggle}
        style={{
          background: 'transparent',
          border: 'none',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.1s',
          padding: 0,
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          playHoverSound();
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.85)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          setIsHovered(false);
        }}
      >
        {processed && (
          <Image
            src={isPlaying ? iconOn : iconOff}
            alt={isPlaying ? 'Music On' : 'Music Off'}
            width={48}
            height={48}
            style={{
              objectFit: 'contain',
              imageRendering: 'pixelated'
            }}
            unoptimized // Prevent Next.js from optimizing base64 data URLs
          />
        )}
      </button>

      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '100%',
          marginLeft: '12px',
          background: '#3b261b',
          border: '4px solid #5a3a29',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#fbbf24',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '0.45rem',
          whiteSpace: 'nowrap',
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.8)'
        }}>
          {isPlaying ? 'MUTE MUSIC' : 'PLAY MUSIC'}
        </div>
      )}
    </div>
  );
}
