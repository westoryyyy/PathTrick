import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from '@/components/ui/Dashboard.module.css';

const MOCK_SCHOLARSHIPS = [
  {
    id: 'djarum-plus',
    title: 'Djarum Beasiswa Plus',
    provider: 'Djarum Foundation',
    matchScore: 92,
    deadline: '15 Okt 2026',
    coverage: 'Biaya Kuliah + Uang Saku',
    requirements: ['Leadership SBT', 'Min. Rapor 8.0'],
    url: 'https://djarumbeasiswaplus.org/',
  },
  {
    id: 'bpi-kemdikbud',
    title: 'Beasiswa Pendidikan Indonesia',
    provider: 'Kemdikbud Ristek',
    matchScore: 88,
    deadline: '30 Nov 2026',
    coverage: 'Full Funding',
    requirements: ['Prestasi Akademik', 'Esai Kontribusi'],
    url: 'https://beasiswa.kemdikbud.go.id/',
  },
  {
    id: 'lpdp-s1',
    title: 'Beasiswa S1 Prestasi',
    provider: 'LPDP',
    matchScore: 85,
    deadline: 'TBA 2027',
    coverage: 'Full Funding + Akomodasi',
    requirements: ['Medali Olimpiade', 'Bahasa Inggris'],
    url: 'https://lpdp.kemenkeu.go.id/',
  }
];

export default function ScholarshipHub() {
  const [selectedScholarship, setSelectedScholarship] = useState<typeof MOCK_SCHOLARSHIPS[number] | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          SCHOLARSHIP HUB
        </h2>
        <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '900px' }}>
          Berdasarkan profil RIASEC dan misi yang telah kamu selesaikan, AI kami telah menemukan peluang beasiswa terbaik untuk perjalanan kuliahmu.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
        {MOCK_SCHOLARSHIPS.map(scholarship => (
          <div 
            key={scholarship.id} 
            className={styles.retroCard}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%', position: 'relative' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '75%' }}>
                  <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b' }}>
                    {scholarship.title}
                  </h3>
                  <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff', lineHeight: '1.6' }}>
                    {scholarship.provider}
                  </p>
                </div>
                
                {/* Right-aligned Ribbon Flag */}
                <div style={{ position: 'absolute', top: '16px', right: '-12px', zIndex: 10 }}>
                  <div style={{ 
                    background: '#047857', border: '2px solid #064e3b', color: '#fff', 
                    fontSize: '0.65rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', 
                    whiteSpace: 'nowrap', position: 'relative', zIndex: 2 
                  }}>
                    {scholarship.matchScore}% MATCH
                  </div>
                  {/* 3D Fold under the right ribbon */}
                  <div style={{ 
                    position: 'absolute', top: '100%', right: '0', width: 0, height: 0, 
                    borderTop: '12px solid #022c22', borderRight: '12px solid transparent', zIndex: 1 
                  }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💰</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>{scholarship.coverage}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⏳</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>Deadline: {scholarship.deadline}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📋</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>Reqs: {scholarship.requirements.join(', ')}</span>
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
              onClick={() => setSelectedScholarship(scholarship)}
            >
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedScholarship && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedScholarship.title} details`}
            onClick={() => setSelectedScholarship(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(35, 17, 8, 0.82)',
            }}
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              style={{
                width: 'min(620px, 100%)',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '28px',
                background: '#d4a373',
                border: '5px solid #3b261b',
                boxShadow: '8px 8px 0 #1f120a, inset 0 0 0 4px #e8c98a',
                color: '#3b261b',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', borderBottom: '3px dashed #5a3a29', paddingBottom: '18px' }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: '"Press Start 2P"', fontSize: '1rem', lineHeight: 1.6 }}>
                    {selectedScholarship.title}
                  </h2>
                  <p style={{ margin: '8px 0 0', fontFamily: '"Press Start 2P"', fontSize: '0.6rem' }}>
                    {selectedScholarship.provider}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedScholarship(null)}
                  aria-label="Close scholarship details"
                  style={{ background: '#b91c1c', border: '3px solid #450a0a', color: '#fff', padding: '8px 12px', fontFamily: '"Press Start 2P"', cursor: 'pointer', boxShadow: '3px 3px 0 #3b261b' }}
                >
                  X
                </button>
              </div>
              <div style={{ display: 'grid', gap: '14px', marginTop: '22px', fontFamily: '"Press Start 2P"', fontSize: '0.65rem', lineHeight: 1.7 }}>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.22)', border: '2px solid #8c5d41' }}>💰 COVERAGE: {selectedScholarship.coverage}</div>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.22)', border: '2px solid #8c5d41' }}>⏳ DEADLINE: {selectedScholarship.deadline}</div>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.22)', border: '2px solid #8c5d41' }}>📋 REQUIREMENTS: {selectedScholarship.requirements.join(' • ')}</div>
              </div>
              <button
                type="button"
                onClick={() => window.open(selectedScholarship.url, '_blank', 'noopener,noreferrer')}
                style={{ width: '100%', marginTop: '24px', padding: '16px', background: '#fbbf24', border: '3px solid #3b261b', boxShadow: '4px 4px 0 #3b261b', color: '#3b261b', fontFamily: '"Press Start 2P"', fontSize: '0.7rem', cursor: 'pointer' }}
              >
                OPEN OFFICIAL QUEST ↗
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
