'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useBGMStore } from '@/store/useBGMStore';

if (typeof window !== 'undefined') {
  if (!(window as any).__audioPatched) {
    (window as any).__audioPatched = true;
    const OriginalAudio = window.Audio;
    window.Audio = function(src?: string) {
      const audio = new OriginalAudio(src);
      if (src && src.includes('HoverTombol')) {
        (window as any).__lastHoverAudio = audio;
      }
      return audio;
    } as any;
    window.Audio.prototype = OriginalAudio.prototype;
  }
}

export default function GlobalAudio() {
  const { isPlaying, setPlaying } = useBGMStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathname = usePathname();

  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  // Helper to smoothly transition volume
  const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, onComplete?: () => void) => {
    if (fadeInterval.current) clearInterval(fadeInterval.current);
    
    fadeInterval.current = setInterval(() => {
      const step = 0.02; // Smooth fade speed
      if (Math.abs(audio.volume - targetVolume) <= step) {
        audio.volume = targetVolume;
        if (fadeInterval.current) clearInterval(fadeInterval.current);
        if (onComplete) onComplete();
      } else if (audio.volume < targetVolume) {
        audio.volume = Math.min(1, audio.volume + step);
      } else {
        audio.volume = Math.max(0, audio.volume - step);
      }
    }, 50);
  };

  // Handle play/pause based on store state and route
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check if we are in a screen where Dashboard Music should NOT play
    const isSmaMission = pathname.match(/\/learning-progress\/.+/);
    const shouldMute = pathname === '/map' || pathname.includes('/mission/') || isSmaMission;

    if (shouldMute) {
      // Going to Map or Mission: Fade out then pause
      fadeAudio(audio, 0, () => audio.pause());
    } else {
      if (isPlaying) {
        if (audio.paused) {
          // Coming back from Map or first play: Start at 0 and fade up
          audio.volume = 0;
          audio.play().catch(() => setPlaying(false));
          fadeAudio(audio, 0.3); // 0.3 is the max volume for BGM
        } else {
          // Keep volume steady if already playing
          fadeAudio(audio, 0.3);
        }
      } else {
        if (!audio.paused) {
          // Muting: Fade out then pause
          fadeAudio(audio, 0, () => audio.pause());
        }
      }
    }

    return () => {
      if (fadeInterval.current) clearInterval(fadeInterval.current);
    };
  }, [pathname, isPlaying, setPlaying]);

  // Global click listener for button sound
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button') || target.closest('a') || target.closest('[role="button"]');
      
      if (isClickable) {
        try {
          // Pause any currently playing hover sound so they don't overlap
          if ((window as any).__lastHoverAudio) {
            (window as any).__lastHoverAudio.pause();
            (window as any).__lastHoverAudio.currentTime = 0;
          }
          const clickAudio = new Audio('/ClickTombol.ogg');
          clickAudio.volume = 0.5;
          clickAudio.play().catch(() => {});
        } catch (err) {
          // Ignore autoplay policy errors or missing files
        }
      }
    };

    // Use capture phase so we still get the event even if a component calls stopPropagation()
    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return <audio ref={audioRef} src="/DashboardMusic.ogg" loop />;
}
