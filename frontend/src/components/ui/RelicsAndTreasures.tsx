import React, { useEffect, useState } from 'react';
import styles from '@/components/ui/Dashboard.module.css';

import { useMapStore } from '@/store/useMapStore';

import Image from 'next/image';
import { getAuthHeaders } from '@/hooks/useAuthSync';
import { API_BASE_URL } from '@/config/pathtrick';

type Props = {
  hideHeader?: boolean;
  statsLabel?: string;
};

export default function RelicsAndTreasures({ hideHeader = false, statsLabel = 'BADGES UNLOCKED' }: Props = {}) {
  const completedDynamicNodes = useMapStore(state => state.completedDynamicNodes);
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gamification`, {
          headers: { ...getAuthHeaders() }
        });
        if (res.ok) {
          const data = await res.json();
          const keys = data.achievements.map((a: any) => a.key);
          setUnlockedKeys(keys);
        }
      } catch (e) {}
    };
    fetchAchievements();
  }, []);
  
  

  const VAULT_SBTS = [
    { id: 1, name: 'Mission Completer', desc: 'Selesai 1 Misi', earned: unlockedKeys.includes('mission_completer'), icon: '/Mission Completer.png' },
    { id: 2, name: 'Early Bird', desc: 'Login Sebelum Pagi', earned: unlockedKeys.includes('early_bird'), icon: '/Early Bird.png' },
    { id: 3, name: 'Streak Warrior', desc: 'Login 7 Hari', earned: unlockedKeys.includes('streak_warrior'), icon: '/Streak Warrior copy.png' },
    { id: 4, name: 'Quiz Master', desc: 'Kuis Sempurna', earned: unlockedKeys.includes('quiz_master'), icon: '/Quiz Master copy.png' },
    { id: 5, name: 'Quick Learner', desc: 'Tamat Cepat', earned: unlockedKeys.includes('quick_learner'), icon: '/Quick Learner copy.png' },
    { id: 6, name: 'Course Master', desc: 'Tamat 1 Course', earned: unlockedKeys.includes('course_master'), icon: '/course-master.png' },
    { id: 7, name: 'Community Helper', desc: 'Bantu Teman', earned: unlockedKeys.includes('community_helper'), icon: '/Community Helper.png' },
    { id: 8, name: 'First Step', desc: 'Mulai Perjalanan', earned: unlockedKeys.includes('first_step'), icon: '/First Step.png' },
    { id: 9, name: 'Night Owl', desc: 'Belajar Malam', earned: unlockedKeys.includes('night_owl'), icon: '/Night Owl copy.png' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      {/* Header */}
      {!hideHeader && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Press Start 2P"', fontSize: '1.5rem', color: '#fff', textShadow: '2px 2px 0 #3b261b' }}>
            BADGES
          </h2>
          <p style={{ fontFamily: '"Pixelify Sans", sans-serif', fontSize: '1.2rem', color: '#d4d4d8', lineHeight: '1.6', maxWidth: '800px' }}>
            Koleksi Pencapaian kamu. Selesaikan lebih banyak misi untuk membuka semua badge!
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
