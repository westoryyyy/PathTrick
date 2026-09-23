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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] overflow-hidden relative font-sans" suppressHydrationWarning>
      
      {/* Soft Background Decorators */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center w-full max-w-md px-8">
        
        {/* Logo Image */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img 
              src="/PathTrick.png" 
              alt="PathTrick Logo" 
              className="h-14 sm:h-16 object-contain mb-3" 
            />
          </motion.div>

        </div>

        {/* Loading Progress Card */}
        <div className="w-full bg-white border border-slate-200/70 rounded-[2rem] p-7 shadow-xl shadow-slate-200/50 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-sm text-slate-700 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {statusText}
            </span>
            <span className="font-extrabold text-sm text-blue-600">
              {progress}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>
        </div>

        {/* Tip Box Carousel */}
        <div className="mt-8 w-full h-32 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-start gap-4 p-6 bg-blue-50/80 backdrop-blur-md border border-blue-100/80 rounded-[1.5rem]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                <PixelIcon icon={currentTip.icon} size={28} />
              </div>
              <p className="font-semibold text-sm text-blue-900 leading-relaxed pt-1">
                {currentTip.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
