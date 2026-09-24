'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useBGMStore } from '@/store/useBGMStore';

export default function GlobalAudio() {
  const { isPlaying, setPlaying } = useBGMStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Attempt auto-play on mount if not already handled
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((err) => {
        console.log('Autoplay blocked', err);
        setPlaying(false);
      });
    }
  }, []);

  // Handle play/pause based on store state and route
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;

    // Stop music if going to map (since Map uses Phaser's own audio)
    if (pathname === '/map') {
      audio.pause();
    } else {
      if (isPlaying) {
        audio.play().catch(() => setPlaying(false));
      } else {
        audio.pause();
      }
    }
  }, [pathname, isPlaying, setPlaying]);

  return <audio ref={audioRef} src="/DashboardMusic.ogg" loop />;
}
