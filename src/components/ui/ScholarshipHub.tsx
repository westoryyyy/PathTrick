import React from 'react';
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
  },
  {
    id: 'bpi-kemdikbud',
    title: 'Beasiswa Pendidikan Indonesia',
    provider: 'Kemdikbud Ristek',
    matchScore: 88,
    deadline: '30 Nov 2026',
    coverage: 'Full Funding',
    requirements: ['Prestasi Akademik', 'Esai Kontribusi'],
  },
  {
    id: 'lpdp-s1',
    title: 'Beasiswa S1 Prestasi',
    provider: 'LPDP',
    matchScore: 85,
    deadline: 'TBA 2027',
    coverage: 'Full Funding + Akomodasi',
    requirements: ['Medali Olimpiade', 'Bahasa Inggris'],
  }
];

export default function ScholarshipHub() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          SCHOLARSHIP HUB
        </h2>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Based on your RIASEC profile and completed missions, our AI has found the best scholarship opportunities for your university journey.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
        {MOCK_SCHOLARSHIPS.map(scholarship => (
          <div 
            key={scholarship.id} 
            className={styles.retroCard}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b' }}>
                    {scholarship.title}
                  </h3>
                  <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff', lineHeight: '1.6' }}>
                    {scholarship.provider}
                  </p>
                </div>
                <div style={{ background: '#047857', border: '2px solid #064e3b', color: '#fff', fontSize: '0.7rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  {scholarship.matchScore}% MATCH
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
              onClick={() => alert('Viewing detailed requirements...')}
            >
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
