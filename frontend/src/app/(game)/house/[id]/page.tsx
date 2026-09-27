'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockBackendData } from '@/data/mockBackendData';
import { motion, AnimatePresence } from 'framer-motion';
import PixelIcon from '@/components/ui/PixelIcon';

export default function HouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  const house = mockBackendData.houses.find(h => h.id === id);

  if (!house) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f4]">
        <div style={{ fontFamily: '"Press Start 2P"', color: '#3b261b' }}>HOUSE NOT FOUND</div>
      </div>
    );
  }

  const modules = house.stages;
  const completedCount = modules.filter(m => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="min-h-screen bg-[#c29a6e] pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ─── Navigation Header ─── */}
      <header className="sticky top-0 z-50 bg-[#3b261b] border-b-4 border-[#291a13] px-6 py-4 flex items-center justify-between shadow-[0_4px_0_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/sma/learning-progress')}
            onMouseEnter={playHoverSound}
            className="px-5 py-3 bg-[#3b261b] hover:bg-[#5a3a29] border-4 border-[#5a3a29] rounded-xl transition-colors text-[#fbbf24] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.5),_4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none"
          >
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem' }}>◀ KEMBALI</span>
          </button>
          <div className="flex items-center gap-3">
            <PixelIcon icon={house.icon} size={32} alt={house.title} />
            <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '2px 2px 0 #000' }}>
              {house.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#fde68a] rounded-full text-[#92400e] text-xs shadow-[2px_2px_0_#b45309] border-2 border-[#b45309]" style={{ fontFamily: '"Press Start 2P"' }}>
            {modules.length} MODUL
          </div>
        </div>
      </header>

      {/* ─── Hero Banner (Journal Style) ─── */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="relative w-full bg-[#3b261b] border-4 border-[#291a13] rounded-[16px] shadow-[8px_8px_0_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Decorative Binder Rings or Tape */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#fbbf24] border-2 border-[#b45309] rounded-b-md shadow-sm"></div>

          <div className="p-12 flex flex-col items-center justify-center text-center gap-6 mt-4">
            
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24', padding: '8px 16px', border: '2px dashed #fbbf24', borderRadius: '8px' }}>
              ✦ HOUSE {house.houseNumber} ✦
            </div>

            <PixelIcon icon={house.icon} size={96} alt={house.title} className="drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
            
            <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #000' }}>
              {house.title.replace('House of ', '').toUpperCase()}
            </h2>
            
            <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4a373', maxWidth: '600px', lineHeight: '1.8' }}>
              {house.description}
            </p>

            <div className="w-full max-w-md mt-6">
               <div className="flex justify-between mb-2" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#a8a29e' }}>
                 <span>EXPLORATION</span>
                 <span className="text-[#fbbf24]">{progressPercent}%</span>
               </div>
               <div className="w-full h-5 bg-[#1a100c] border-2 border-[#291a13] rounded-full overflow-hidden p-[2px]">
                 <div className="h-full bg-[#fbbf24] rounded-full" style={{ width: `${progressPercent}%` }} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Module List (Accordion) ─── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-8">
          <PixelIcon icon="⚔️" size={24} />
          <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.2rem', color: '#5C3A21' }}>PILIH MODUL</h3>
        </div>

        <div className="flex flex-col gap-6">
          {modules.map((mod, index) => (
            <div key={mod.id} className="flex flex-col relative">
              {/* Module Header Button */}
              <button
                onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                onMouseEnter={playHoverSound}
                className={`w-full bg-[#5a3a29] border-4 border-[#3b261b] p-0 text-left transition-all flex items-stretch outline-none overflow-hidden relative ${
                  expandedModule === mod.id 
                    ? 'rounded-t-[16px] z-0' 
                    : 'rounded-[16px] active:translate-y-1 active:shadow-none z-10'
                } shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:brightness-110`}
              >
                <div className="w-20 bg-[#3b261b] border-r-4 border-[#291a13] flex flex-col items-center justify-center gap-2 p-4">
                   <span style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fbbf24', textShadow: '2px 2px 0 #000' }}>{index + 1}</span>
                   <PixelIcon icon="📚" size={30} />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2 flex-wrap">
                        {/* Context-based labels */}
                        {(() => {
                          const isTechHouse = id === 'house-ict' || id === 'house-engineering';
                          const labels = ['MATERIAL', 'QUIZ', 'PROJECT'];
                          if (isTechHouse) labels.push('CODE');
                          return labels.map(label => (
                            <span key={label} className="inline-block px-3 py-1 bg-[#8c5a3d] border-2 border-[#4a2e1d] text-[#fff] rounded-md" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem' }}>
                              {label}
                            </span>
                          ));
                        })()}
                      </div>
                      <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#a87b51' }}>
                        {mod.chapters?.length || 0} BAB
                      </span>
                    </div>
                    
                    <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', marginBottom: '8px', lineHeight: '1.4', textShadow: '1px 1px 0 #000' }}>
                      {mod.name.replace('Modul: ', '')}
                    </h4>
                    
                    <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.1rem', color: '#d4a373', lineHeight: '1.6' }}>
                      {mod.description}
                    </p>
                </div>
                
                <div className="w-16 flex items-center justify-center border-l-4 border-[#3b261b] bg-[#5a3a29]">
                  <div style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fbbf24' }}>
                    <motion.div animate={{ rotate: expandedModule === mod.id ? 180 : 0 }}>▼</motion.div>
                  </div>
                </div>
              </button>

              {/* Chapters Dropdown */}
              <AnimatePresence>
                {expandedModule === mod.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="bg-[#8c5a3d] border-x-4 border-b-4 border-[#3b261b] rounded-b-[16px] p-6 flex flex-col gap-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)] pt-8 -mt-2">
                      <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#fff', marginBottom: '8px' }}>
                        DAFTAR BAB (CHAPTERS):
                      </div>
                      
                      {mod.chapters?.map((chapter, chapIdx) => (
                        <div 
                          key={chapter.id}
                          onClick={() => router.push(`/map?chapter=${chapter.id}`)}
                          onMouseEnter={playHoverSound}
                          className="flex items-center justify-between bg-[#c29a6e] border-2 border-[#5a3a29] rounded-xl p-4 cursor-pointer hover:bg-[#d4a373] transition-colors group shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
                        >
                          <div className="flex items-center gap-4">
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#3b261b' }}>{chapIdx + 1}.</span>
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#1a100c', lineHeight: '1.4' }}>
                              {chapter.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#5a3a29' }}>{chapter.duration}</span>
                            <button className="px-4 py-2 bg-[#fbbf24] border-2 border-[#b45309] text-[#78350f] rounded-lg shadow-[0_4px_0_#78350f] group-hover:translate-y-1 group-hover:shadow-[0_0_0_#78350f] transition-all" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem' }}>
                              PLAY ▶
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!mod.chapters || mod.chapters.length === 0) && (
                        <div className="text-center p-6 bg-[#c29a6e] border-2 border-dashed border-[#5a3a29] rounded-xl">
                          <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#5a3a29' }}>TIDAK ADA BAB</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      
      {/* ─── Floating Dashboard Button ─── */}
      <div className="fixed bottom-6 right-6 z-40">
         <button
            onClick={() => router.push('/sma/dashboard')}
            onMouseEnter={playHoverSound}
            className="px-6 py-4 bg-[#fbbf24] border-4 border-[#b45309] rounded-[16px] text-[#78350f] shadow-[0_6px_0_#78350f] hover:translate-y-1 hover:shadow-[0_2px_0_#78350f] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3"
         >
            <PixelIcon icon="🏠" size={24} />
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem' }}>DASHBOARD</span>
         </button>
      </div>
    </div>
  );
}
