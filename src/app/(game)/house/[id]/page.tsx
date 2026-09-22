'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockBackendData } from '@/data/mockBackendData';
import { motion, AnimatePresence } from 'framer-motion';

export default function HouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

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
            onClick={() => router.push('/sma/dashboard')}
            className="px-5 py-3 bg-[#3b261b] hover:bg-[#5a3a29] border-4 border-[#5a3a29] rounded-2xl transition-colors text-[#fbbf24] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.5),_4px_4px_0_rgba(0,0,0,0.8)]"
          >
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem' }}>◀ KEMBALI</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{house.icon}</span>
            <h1 style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fff', textShadow: '2px 2px 0 #000' }}>
              {house.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#fde68a] border-2 border-[#b45309] text-[#92400e] text-xs shadow-[2px_2px_0_#b45309]" style={{ fontFamily: '"Press Start 2P"' }}>
            {modules.length} MODUL
          </div>
        </div>
      </header>

      {/* ─── Hero Banner ─── */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="relative w-full border-4 border-[#3b261b] bg-[#3b261b] overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
          <div className="p-12 flex flex-col items-center justify-center text-center gap-6">
            
            <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fbbf24', padding: '8px 16px', border: '2px solid #fbbf24' }}>
              ★ HOUSE {house.houseNumber} ★
            </div>

            <div className="text-6xl drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">{house.icon}</div>
            
            <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #000' }}>
              {house.title.replace('House of ', '').toUpperCase()}
            </h2>
            
            <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4a373', maxWidth: '600px', lineHeight: '1.8' }}>
              {house.description}
            </p>

            <div className="w-full max-w-md mt-4">
               <div className="flex justify-between mb-2" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#a8a29e' }}>
                 <span>PROGRESS</span>
                 <span className="text-[#fbbf24]">{progressPercent}%</span>
               </div>
               <div className="w-full h-4 bg-[#1a100c] border-2 border-[#291a13]">
                 <div className="h-full bg-[#fbbf24]" style={{ width: `${progressPercent}%` }} />
               </div>
            </div>
          </div>
        </div>

        {/* ─── Info Section (Skills & Ideal For) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {house.skillsOverview && (
            <div className="bg-[#a87b51] border-4 border-[#3b261b] p-6 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
              <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#3b261b', marginBottom: '16px' }}>
                ⚔️ SKILL YANG DIASAH
              </h3>
              <ul className="space-y-3">
                {house.skillsOverview.map((skill, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#3b261b] mt-1 text-xs">▶</span>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff', lineHeight: '1.6', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {house.idealFor && (
            <div className="bg-[#a87b51] border-4 border-[#3b261b] p-6 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
              <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#3b261b', marginBottom: '16px' }}>
                💡 COCOK UNTUK
              </h3>
              <ul className="space-y-3">
                {house.idealFor.map((ideal, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#3b261b] mt-1 text-xs">▶</span>
                    <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#fff', lineHeight: '1.6', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}>{ideal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ─── Module List (Accordion) ─── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-[#3b261b]">⚔</span>
          <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.2rem', color: '#3b261b' }}>PILIH MODUL</h3>
        </div>

        <div className="flex flex-col gap-6">
          {modules.map((mod, index) => (
            <div key={mod.id} className="flex flex-col">
              {/* Module Header Button */}
              <button
                onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                className="w-full bg-[#5a3a29] border-4 border-[#3b261b] p-0 text-left shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,0.3)] transition-all flex items-stretch outline-none"
              >
                <div className="w-20 bg-[#3b261b] border-r-4 border-[#291a13] flex flex-col items-center justify-center gap-2 p-4">
                   <span style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fbbf24' }}>{index + 1}</span>
                   <span className="text-2xl">📚</span>
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
                            <span key={label} className="inline-block px-3 py-1 bg-[#8c5a3d] border-2 border-[#4a2e1d] text-[#fff]" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem' }}>
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
                    
                    <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: '#d4a373', lineHeight: '1.6' }}>
                      {mod.description}
                    </p>
                </div>
                
                <div className="w-16 flex items-center justify-center border-l-4 border-[#3b261b]">
                  <div style={{ fontFamily: '"Press Start 2P"', fontSize: '1rem', color: '#fbbf24' }}>
                    <motion.div animate={{ rotate: expandedModule === mod.id ? 180 : 0 }}>▼</motion.div>
                  </div>
                </div>
              </button>

              {/* Chapters Dropdown */}
              <AnimatePresence>
                {expandedModule === mod.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#8c5a3d] border-x-4 border-b-4 border-[#3b261b] p-6 flex flex-col gap-4 shadow-[6px_6px_0_rgba(0,0,0,0.3)] mb-2">
                      <div style={{ fontFamily: '"Press Start 2P"', fontSize: '0.65rem', color: '#fff', marginBottom: '8px' }}>
                        DAFTAR BAB (CHAPTERS):
                      </div>
                      
                      {mod.chapters?.map((chapter, chapIdx) => (
                        <div 
                          key={chapter.id}
                          onClick={() => router.push(`/map?chapter=${chapter.id}`)}
                          className="flex items-center justify-between bg-[#c29a6e] border-2 border-[#5a3a29] p-4 cursor-pointer hover:bg-[#d4a373] transition-colors group shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
                        >
                          <div className="flex items-center gap-4">
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#3b261b' }}>{chapIdx + 1}.</span>
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#1a100c', lineHeight: '1.4' }}>
                              {chapter.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.5rem', color: '#5a3a29' }}>{chapter.duration}</span>
                            <button className="px-4 py-2 bg-[#fbbf24] border-2 border-[#b45309] text-[#78350f] shadow-[2px_2px_0_#78350f] group-hover:translate-y-0.5 group-hover:shadow-[0_0_0_#78350f] transition-all" style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem' }}>
                              PLAY ▶
                            </button>
                          </div>
                        </div>
                      ))}

                      {(!mod.chapters || mod.chapters.length === 0) && (
                        <div className="text-center p-4 bg-[#c29a6e] border-2 border-dashed border-[#5a3a29]">
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
            className="px-6 py-4 bg-[#fbbf24] border-4 border-[#b45309] text-[#78350f] shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:translate-y-1 hover:shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-all flex items-center gap-3"
         >
            <span className="text-xl">🏠</span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem' }}>DASHBOARD</span>
         </button>
      </div>
    </div>
  );
}
