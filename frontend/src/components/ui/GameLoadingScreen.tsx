'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelIcon from '@/components/ui/PixelIcon';

const LOADING_TIPS = [
  { icon: '💡', text: 'Setiap quest yang kamu selesaikan akan menambah XP dan membuka jalur baru!' },
  { icon: '🏆', text: 'Skill Badge adalah sertifikat on-chain yang tidak bisa dipalsukan oleh siapapun.' },
  { icon: '🤖', text: 'AI kami menganalisis RIASEC-mu untuk memberikan rekomendasi course yang tepat.' },
  { icon: '⚡', text: 'Selesaikan quest berurutan untuk membuka Boss Challenge di setiap course!' },

  { icon: '🔮', text: 'Kamu bisa melihat progres belajarmu secara real-time di Dashboard.' },
];

export default function GameLoadingScreen({
  statusText = 'Memuat Modul AI...',
}: {
  statusText?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const speed = prev < 40 ? 4 : prev < 70 ? 2 : 5;
        return Math.min(prev + speed, 95);
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = LOADING_TIPS[tipIndex];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fdf6e3] overflow-hidden relative font-pixel" suppressHydrationWarning>

      {/* Retro Paper/Parchment Background Effect */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center w-full max-w-lg px-8">

        {/* Logo Image */}
        <div className="flex flex-col items-center mb-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/PathTrick.png"
              alt="PathTrick Logo"
              className="h-16 sm:h-20 object-contain mb-3"
              style={{ imageRendering: 'pixelated', filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))' }}
            />
          </motion.div>
        </div>

        {/* Loading Progress Card (Retro Style) */}
        <div className="w-full bg-[#3b261b] border-4 border-[#1a110c] rounded-none p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)] flex flex-col gap-5 relative">
          {/* Inner border detail */}
          <div className="absolute inset-0 border-2 border-[#8c5d41] m-1 pointer-events-none" />

          <div className="flex items-center justify-between w-full relative z-10">
            <span className="text-[0.6rem] md:text-xs text-[#fae1c5] animate-pulse flex items-center gap-3">
              <span className="w-3 h-3 bg-[#fbbf24] border-2 border-[#92400e] inline-block" />
              {statusText}
            </span>
            <span className="text-[0.6rem] md:text-xs text-[#fbbf24]">
              {progress}%
            </span>
          </div>

          <div className="w-full h-6 bg-[#1a110c] border-2 border-[#5a3a29] relative z-10 p-0.5">
            <motion.div
              className="h-full bg-[#059669] border-t-2 border-l-2 border-[#34d399] border-b-2 border-r-2 border-[#064e3b]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>
        </div>

        {/* Tip Box Carousel (Parchment Style) */}
        <div className="mt-12 w-full h-36 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-start gap-4 p-5 bg-[#fae1c5] border-4 border-[#8c5d41] shadow-[6px_6px_0_rgba(0,0,0,0.4)]"
            >
              {/* Corner screws/pins */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#5a3a29]" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-[#5a3a29]" />
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-[#5a3a29]" />
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-[#5a3a29]" />

              <div className="w-12 h-12 bg-[#fdf6e3] border-2 border-[#d97706] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.1)] flex items-center justify-center shrink-0 mt-1">
                <span className="text-xl drop-shadow-md">
                  <PixelIcon icon={currentTip.icon} size={24} />
                </span>
              </div>
              <div className="flex-1 pt-2">
                <h4 className="text-[0.55rem] text-[#d97706] mb-2 uppercase tracking-widest">TIPS KSATRIA:</h4>
                <p className="text-[0.6rem] md:text-xs text-[#3b261b] leading-relaxed">
                  {currentTip.text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
