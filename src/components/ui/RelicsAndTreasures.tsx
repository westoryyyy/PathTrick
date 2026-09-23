import React from 'react';
import styles from '@/components/ui/Dashboard.module.css';

import { useMapStore } from '@/store/useMapStore';

import Image from 'next/image';

type Props = {
  hideHeader?: boolean;
  statsLabel?: string;
};

export default function RelicsAndTreasures({ hideHeader = false, statsLabel = 'BADGES UNLOCKED' }: Props = {}) {
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);
  
  const isHtmlEarned = completedDynamicNodes.includes('module-framer-bab-1-level-1') || completedDynamicNodes.includes('module-html-css-level-6');

  const VAULT_SBTS = [
    { id: 1, name: 'Mission Completer', desc: 'Selesai 1 Misi', earned: isHtmlEarned, icon: '/Mission Completer.png' },
    { id: 2, name: 'Early Bird', desc: 'Login Sebelum Pagi', earned: true, icon: '/Early Bird.png' },
    { id: 3, name: 'Streak Warrior', desc: 'Login 7 Hari', earned: false, icon: '/Streak Warrior copy.png' },
    { id: 4, name: 'Quiz Master', desc: 'Kuis Sempurna', earned: false, icon: '/Quiz Master copy.png' },
    { id: 5, name: 'Quick Learner', desc: 'Tamat Cepat', earned: false, icon: '/Quick Learner copy.png' },
    { id: 6, name: 'Course Master', desc: 'Tamat 1 Course', earned: false, icon: '/course-master.png' },
    { id: 7, name: 'Community Helper', desc: 'Bantu Teman', earned: false, icon: '/Community Helper.png' },
    { id: 8, name: 'First Step', desc: 'Mulai Perjalanan', earned: false, icon: '/First Step.png' },
    { id: 9, name: 'Night Owl', desc: 'Belajar Malam', earned: false, icon: '/Night Owl copy.png' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      {!hideHeader && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
            BADGES
          </h2>
          <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: '1.6' }}>
            Your collection of Achievements. Complete more missions to unlock all badges!
          </p>
        </div>
      )}



      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', width: '100%', marginTop: '8px' }}>
        {VAULT_SBTS.map(sbt => (
          <div 
            key={sbt.id} 
            className={styles.retroCard}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '24px',
              gap: '16px',
              opacity: sbt.earned ? 1 : 0.6,
              filter: sbt.earned ? 'none' : 'grayscale(100%)',
              borderStyle: sbt.earned ? 'solid' : 'dashed'
            }}
          >
            <div style={{ 
              width: '64px', height: '64px', 
              background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              position: 'relative'
            }}>
              <Image 
                src={sbt.icon} 
                alt={sbt.name} 
                fill 
                style={{ 
                  objectFit: 'contain', 
                  filter: sbt.earned ? 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.4))' : 'brightness(0) invert(0.3) opacity(0.5)',
                  transition: 'filter 0.3s'
                }} 
              />
            </div>
            
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontFamily: '"Press Start 2P"', fontSize: '0.6rem', color: sbt.earned ? '#fbbf24' : '#a3a3a3', lineHeight: '1.4' }}>
                {sbt.name}
              </h3>
              <p style={{ fontFamily: '"Press Start 2P"', fontSize: '0.45rem', color: '#d4d4d8', lineHeight: '1.4' }}>
                {sbt.desc}
              </p>
            </div>

            <div style={{ 
              marginTop: '8px',
              padding: '4px 8px', 
              background: sbt.earned ? '#047857' : '#525252', 
              border: `2px solid ${sbt.earned ? '#064e3b' : '#404040'}`,
              fontFamily: '"Press Start 2P"', 
              fontSize: '0.45rem', 
              color: sbt.earned ? '#fff' : '#a3a3a3' 
            }}>
              {sbt.earned ? 'CLAIMED' : 'LOCKED'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
