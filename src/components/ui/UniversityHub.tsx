import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/components/ui/Dashboard.module.css';
import PixelIcon from '@/components/ui/PixelIcon';

const MOCK_UNIVERSITIES = [
  {
    id: 'ui-cs',
    title: 'Universitas Indonesia',
    major: 'Computer Science (Fasilkom)',
    matchScore: 95,
    location: 'Depok, Jawa Barat',
    acceptanceRate: '3.5%',
    requirements: ['SNBT/SIMAK', 'Portofolio IT'],
    coverImage: '/Compass.png',
  },
  {
    id: 'itb-stei',
    title: 'Institut Teknologi Bandung',
    major: 'STEI - Komputasi',
    matchScore: 90,
    location: 'Bandung, Jawa Barat',
    acceptanceRate: '2.8%',
    requirements: ['SNBT', 'Nilai Matematika > 85'],
    coverImage: '/Compass.png',
  },
  {
    id: 'ugm-cs',
    title: 'Universitas Gadjah Mada',
    major: 'Ilmu Komputer',
    matchScore: 88,
    location: 'Yogyakarta',
    acceptanceRate: '4.1%',
    requirements: ['SNBT/UM UGM'],
    coverImage: '/Compass.png',
  }
];

type University = (typeof MOCK_UNIVERSITIES)[number];

export default function UniversityHub() {
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          UNIVERSITY HUB
        </h2>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '900px' }}>
          Berdasarkan profil RIASEC (Investigative/Realistic) dan minat teknologimu, AI kami merekomendasikan program-program universitas terbaik ini.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
        {MOCK_UNIVERSITIES.map(uni => (
          <div 
            key={uni.id} 
            className={styles.retroCard}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%', position: 'relative' }}
          >
            {/* Right-aligned Ribbon Flag */}
            <div style={{ position: 'absolute', top: '-16px', right: '-12px', zIndex: 10 }}>
              <div style={{ 
                background: '#047857', border: '2px solid #064e3b', color: '#fff', 
                fontSize: '0.65rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', 
                whiteSpace: 'nowrap', position: 'relative', zIndex: 2 
              }}>
                {uni.matchScore}% MATCH
              </div>
              {/* 3D Fold under the right ribbon */}
              <div style={{ 
                position: 'absolute', top: '100%', right: '0', width: 0, height: 0, 
                borderTop: '12px solid #022c22', borderRight: '12px solid transparent', zIndex: 1 
              }} />
            </div>

            <div>
              {uni.coverImage && (
                <div style={{ width: '100%', aspectRatio: '16/9', border: '3px solid #5a3a29', background: '#2c1810', marginBottom: '16px', overflow: 'hidden', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.5)' }}>
                  <img src={uni.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: uni.coverImage ? '0' : '16px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b', margin: 0 }}>
                    {uni.major}
                  </h3>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#e4e4e7', lineHeight: '1.6', margin: 0 }}>
                    {uni.title}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src="/Map.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>{uni.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src="/Journall.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>Rate: {uni.acceptanceRate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src="/Scroll.png" alt="" style={{ width: '18px', height: '18px', imageRendering: 'pixelated', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#d4d4d8', lineHeight: '1.6' }}>Reqs: {uni.requirements.join(', ')}</span>
                </div>
              </div>
            </div>

            <button 
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '24px',
                fontFamily: '"Press Start 2P"',
                fontSize: '0.8rem',
                color: '#3b261b',
                background: '#fbbf24',
                border: '2px solid #3b261b',
                boxShadow: '4px 4px 0 #3b261b',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.1s'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0 #3b261b';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '4px 4px 0 #3b261b';
              }}
              onMouseEnter={playHoverSound}
              onClick={() => setSelectedUni(uni)}
              >
                VIEW ROADMAP
              </button>
            </div>
          ))}
        </div>

        {/* Modal Roadmap */}
        <AnimatePresence>
          {selectedUni && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                style={{
                  background: '#d4a373',
                  border: '4px solid #5a3a29',
                  padding: '32px',
                  maxWidth: '600px',
                  width: '90%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  boxShadow: '8px 8px 0 #3b261b'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed #5a3a29', paddingBottom: '16px', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.2rem', color: '#3b261b', marginBottom: '8px', lineHeight: '1.4' }}>
                      ROADMAP: {selectedUni.major}
                    </h2>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: '#5a3a29', fontWeight: 'bold' }}>
                      {selectedUni.title}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedUni(null)}
                    onMouseEnter={playHoverSound}
                    style={{ background: '#ef4444', border: '2px solid #991b1b', color: '#fff', padding: '8px', fontFamily: '"Press Start 2P"', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '2px 2px 0 #7f1d1d' }}
                  >
                    X
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', color: '#3b261b', lineHeight: '1.6' }}>
                    Selesaikan urutan modul berikut untuk menguasai kompetensi yang diuji di seleksi masuk {selectedUni.title}.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { step: 1, title: 'Matematika Dasar & Logika', desc: 'Selesaikan House of Algorithms (3 Modul)', done: true },
                      { step: 2, title: 'Pemrograman Fundamental', desc: 'Selesaikan House of Tech (3 Modul)', done: false },
                      { step: 3, title: 'Portofolio Akhir', desc: 'Kerjakan AI-Graded Project', done: false },
                      { step: 4, title: 'Tryout Mandiri SIMAK/UTUL', desc: 'Simulasi ujian tulis', done: false }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '40px', height: '40px', 
                          background: item.done ? '#047857' : '#fbbf24', 
                          border: '2px solid #3b261b', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: item.done ? '#fff' : '#3b261b',
                          boxShadow: '2px 2px 0 #3b261b'
                        }}>
                          {item.done ? '✓' : item.step}
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.5)', padding: '12px', border: '2px solid #5a3a29' }}>
                          <h4 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#3b261b', marginBottom: '8px' }}>
                            {item.title}
                          </h4>
                          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', color: '#5a3a29', lineHeight: '1.4', margin: 0, marginTop: '4px' }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setSelectedUni(null)}
                    onMouseEnter={playHoverSound}
                    style={{ background: '#10b981', border: '2px solid #064e3b', color: '#fff', padding: '16px', fontFamily: '"Press Start 2P"', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '4px 4px 0 #064e3b', marginTop: '16px' }}
                  >
                    LANJUTKAN BELAJAR
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
