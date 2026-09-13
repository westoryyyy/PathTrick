import React from 'react';
import styles from '@/components/ui/Dashboard.module.css';

const MOCK_UNIVERSITIES = [
  {
    id: 'ui-cs',
    title: 'Universitas Indonesia',
    major: 'Computer Science (Fasilkom)',
    matchScore: 95,
    location: 'Depok, Jawa Barat',
    acceptanceRate: '3.5%',
    requirements: ['SNBT/SIMAK', 'Portofolio IT'],
  },
  {
    id: 'itb-stei',
    title: 'Institut Teknologi Bandung',
    major: 'STEI - Komputasi',
    matchScore: 90,
    location: 'Bandung, Jawa Barat',
    acceptanceRate: '2.8%',
    requirements: ['SNBT', 'Nilai Matematika > 85'],
  },
  {
    id: 'ugm-cs',
    title: 'Universitas Gadjah Mada',
    major: 'Ilmu Komputer',
    matchScore: 88,
    location: 'Yogyakarta',
    acceptanceRate: '4.1%',
    requirements: ['SNBT/UM UGM'],
  }
];

export default function UniversityHub() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
          UNIVERSITY HUB
        </h2>
        <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
          Based on your RIASEC profile (Investigative/Realistic) and tech interests, our AI recommends these top university programs.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
        {MOCK_UNIVERSITIES.map(uni => (
          <div 
            key={uni.id} 
            className={styles.retroCard}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.9rem', color: '#fbbf24', lineHeight: '1.6', textShadow: '1px 1px 0 #3b261b' }}>
                    {uni.major}
                  </h3>
                  <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#fff', lineHeight: '1.6' }}>
                    {uni.title}
                  </p>
                </div>
                <div style={{ background: '#047857', border: '2px solid #064e3b', color: '#fff', fontSize: '0.7rem', fontFamily: '"Press Start 2P"', padding: '8px 12px', textAlign: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  {uni.matchScore}% MATCH
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', border: '2px solid #5a3a29' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📍</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>{uni.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📊</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>Rate: {uni.acceptanceRate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📝</span>
                  <span style={{ fontFamily: '"Press Start 2P"', fontSize: '0.7rem', color: '#d4d4d8', lineHeight: '1.6' }}>Reqs: {uni.requirements.join(', ')}</span>
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
              onClick={() => alert('Viewing program syllabus and roadmap...')}
            >
              VIEW ROADMAP
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
